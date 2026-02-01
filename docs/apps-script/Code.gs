/**
 * Google Apps Script for Wedding RSVP Management
 *
 * This script receives RSVP data from the wedding website frontend,
 * validates it, handles updates by deleting previous responses,
 * and writes data to Google Sheets.
 *
 * Sheet Structure (columns A-I):
 * - Timestamp: Dutch formatted datetime (DD-MM-YYYY HH:MM)
 * - RSVP_ID: Auto-increment ID starting from 1
 * - Email: Guest email address
 * - Aanwezig: "ja" or "nee" (attending status)
 * - Taal: "nl" or "en" (language preference)
 * - Code: Guest invitation code (unique identifier)
 * - GastNummer: Guest number (1, 2, 3, etc.)
 * - Naam: Guest name
 * - Dieetwensen: Dietary requirements
 */

/**
 * Handles GET requests - returns basic info about the API
 * @param {Object} e - Event object
 * @returns {ContentService.TextOutput} JSON response
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    message: 'Wedding RSVP API - use POST to submit RSVPs'
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Main entry point for POST requests from the frontend
 * @param {Object} e - Event object containing the POST request data
 * @returns {ContentService.TextOutput} JSON response
 */
function doPost(e) {
  try {
    // Log raw input for debugging
    Logger.log("Raw postData: " + e.postData.contents);

    // Parse the incoming JSON payload
    const data = JSON.parse(e.postData.contents);

    // Validate the request data
    const validation = validateRequest(data);
    if (!validation.valid) {
      return createResponse(false, validation.error);
    }

    // Get the active spreadsheet and sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Extract data from the request
    const { email, attending, language, guests, code } = data;

    // Delete any existing RSVP with this code
    deleteByCode(sheet, code);

    // Get the next RSVP_ID
    const rsvpId = getNextRsvpId(sheet);

    // Get current timestamp in Dutch format (DD-MM-YYYY HH:MM)
    const timestamp = formatDutchTimestamp(new Date());

    // Prepare rows to append
    const rows = [];
    const attendingValue = attending ? "ja" : "nee";

    guests.forEach((guest, index) => {
      const row = [
        timestamp,              // Timestamp
        rsvpId,                 // RSVP_ID (same for all guests in this submission)
        email,                  // Email
        attendingValue,         // Aanwezig
        language,               // Taal
        code,                   // Code
        index + 1,              // GastNummer
        guest.name,             // Naam
        guest.dietary || ""     // Dieetwensen
      ];
      rows.push(row);
    });

    // Append all rows to the sheet
    if (rows.length > 0) {
      sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, 9).setValues(rows);
      Logger.log("Successfully added " + rows.length + " row(s) for code: " + code);
    }

    // Return success response
    return createResponse(true, null);

  } catch (error) {
    // Log the error for debugging
    Logger.log("Error in doPost: " + error.toString());
    return createResponse(false, "Internal server error: " + error.toString());
  }
}

/**
 * Validates the incoming request data
 * @param {Object} data - The parsed JSON data from the request
 * @returns {Object} Object with 'valid' boolean and optional 'error' message
 */
function validateRequest(data) {
  // Log incoming data for debugging
  Logger.log("Received data: " + JSON.stringify(data));

  // Check required fields
  if (!data.email || typeof data.email !== 'string') {
    return { valid: false, error: "Missing or invalid 'email' field" };
  }

  if (typeof data.attending !== 'boolean') {
    return { valid: false, error: "Missing or invalid 'attending' field" };
  }

  if (!data.language || !['nl', 'en'].includes(data.language)) {
    return { valid: false, error: "Missing or invalid 'language' field (must be 'nl' or 'en')" };
  }

  if (!data.code || typeof data.code !== 'string') {
    return { valid: false, error: "Missing or invalid 'code' field" };
  }

  if (!Array.isArray(data.guests) || data.guests.length === 0) {
    return { valid: false, error: "Missing or invalid 'guests' field (must be non-empty array)" };
  }

  // Validate email format (basic check)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { valid: false, error: "Invalid email format" };
  }

  // Validate each guest object
  for (let i = 0; i < data.guests.length; i++) {
    const guest = data.guests[i];

    if (!guest.name || typeof guest.name !== 'string' || guest.name.trim() === '') {
      return { valid: false, error: `Guest ${i + 1} missing or invalid 'name' field` };
    }

    // dietary is optional, but if present must be a string
    if (guest.dietary !== undefined && typeof guest.dietary !== 'string') {
      return { valid: false, error: `Guest ${i + 1} has invalid 'dietary' field (must be string)` };
    }
  }

  return { valid: true };
}

/**
 * Deletes all rows with the given code
 * @param {Sheet} sheet - The Google Sheet to update
 * @param {string} code - The guest code to delete
 */
function deleteByCode(sheet, code) {
  const data = sheet.getDataRange().getValues();

  // Find rows to delete (from bottom to top to preserve indices)
  const rowsToDelete = [];

  // Skip header row (row 0)
  for (let i = 1; i < data.length; i++) {
    const rowCode = data[i][5]; // Column F (Code)
    if (rowCode === code) {
      rowsToDelete.push(i + 1); // 1-based row number
    }
  }

  // Delete rows from bottom to top
  rowsToDelete.reverse().forEach(rowNum => {
    sheet.deleteRow(rowNum);
  });

  if (rowsToDelete.length > 0) {
    Logger.log("Deleted " + rowsToDelete.length + " existing row(s) for code: " + code);
  }
}

/**
 * Generates the next RSVP_ID by finding the maximum existing ID and adding 1
 * @param {Sheet} sheet - The Google Sheet to analyze
 * @returns {number} The next RSVP_ID to use
 */
function getNextRsvpId(sheet) {
  const data = sheet.getDataRange().getValues();

  // If sheet is empty or only has header row, start at 1
  if (data.length <= 1) {
    return 1;
  }

  let maxId = 0;

  // Skip header row (row 0) and find max RSVP_ID
  for (let i = 1; i < data.length; i++) {
    const rsvpId = data[i][1]; // Column B (RSVP_ID)
    if (typeof rsvpId === 'number' && rsvpId > maxId) {
      maxId = rsvpId;
    }
  }

  return maxId + 1;
}

/**
 * Formats a date in Dutch format (DD-MM-YYYY HH:MM)
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
function formatDutchTimestamp(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

/**
 * Creates a JSON response for the frontend
 * @param {boolean} success - Whether the operation was successful
 * @param {string|null} error - Error message if success is false
 * @returns {ContentService.TextOutput} JSON response
 */
function createResponse(success, error) {
  const response = {
    success: success
  };

  if (!success && error) {
    response.error = error;
  }

  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}
