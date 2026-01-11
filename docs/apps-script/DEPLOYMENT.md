# Google Apps Script Deployment Guide

This guide provides step-by-step instructions for deploying the Google Apps Script code that powers the wedding RSVP integration with Google Sheets.

## Prerequisites

Before you begin, ensure you have:

1. A Google account with access to Google Sheets
2. A Google Sheet created for storing RSVP data
3. The `Code.gs` file from this repository

## Step 1: Open Your Google Sheet

1. Open your Google Sheet in a web browser
2. The sheet should have columns A-I with the following headers (optional but recommended):
   - A: Timestamp
   - B: RSVP_ID
   - C: Email
   - D: Aanwezig
   - E: Taal
   - F: Status
   - G: GastNummer
   - H: Naam
   - I: Dieetwensen

## Step 2: Open the Apps Script Editor

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. A new tab will open with the Apps Script editor
3. You should see a default `Code.gs` file with a `myFunction()` placeholder

## Step 3: Add the Script Code

1. Delete all the placeholder code in the editor
2. Copy the entire contents of `docs/apps-script/Code.gs` from this repository
3. Paste the code into the Apps Script editor
4. Click the **Save** icon (💾) or press `Cmd+S` (Mac) / `Ctrl+S` (Windows)
5. Give your project a name (e.g., "Wedding RSVP Handler") when prompted

## Step 4: Deploy as Web App

1. In the Apps Script editor, click **Deploy** → **New deployment**
2. Click the gear icon (⚙️) next to "Select type"
3. Select **Web app**
4. Configure the deployment settings:
   - **Description**: "Wedding RSVP Handler v1" (or any description)
   - **Execute as**: "Me (your@email.com)"
   - **Who has access**: "Anyone"
5. Click **Deploy**
6. You may be asked to authorize the script:
   - Click **Authorize access**
   - Choose your Google account
   - Click **Advanced** if you see a warning
   - Click **Go to [Project Name] (unsafe)**
   - Click **Allow**
7. Copy the **Web app URL** - this is your Apps Script endpoint
   - It should look like: `https://script.google.com/macros/s/AKfycbz.../exec`
   - **Important**: Save this URL - you'll need it for the frontend configuration

## Step 5: Configure the Frontend

1. Open your wedding website project
2. Create or edit the `.env.local` file in the root directory
3. Add the following environment variable:
   ```
   NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```
4. Replace `YOUR_SCRIPT_ID` with the actual URL you copied in Step 4
5. Restart your Next.js development server for the changes to take effect

## Step 6: Set Up Conditional Formatting (Optional)

To make it easier to distinguish between active and replaced RSVPs:

1. Go back to your Google Sheet
2. Select the entire **Status** column (column F)
3. Click **Format** → **Conditional formatting**
4. Set up two rules:
   - **Rule 1**: Text is exactly "Actief" → Format with green background
   - **Rule 2**: Text is exactly "Vervangen" → Format with gray background or strikethrough
5. Click **Done**

## Testing the Integration

### Test Scenario 1: New RSVP

1. Go to your wedding website RSVP page
2. Fill out the form with a test email (e.g., `test@example.com`)
3. Submit the form
4. Check your Google Sheet:
   - A new row should appear with Timestamp, RSVP_ID = 1, Email, etc.
   - Status should be "Actief"
   - If multiple guests, each should have the same RSVP_ID but different GastNummer

### Test Scenario 2: Update Existing RSVP

1. Submit another RSVP using the same email address
2. Check your Google Sheet:
   - The old row(s) should now have Status = "Vervangen"
   - New row(s) should appear with Status = "Actief"
   - The new RSVP_ID should be incremented (e.g., 2)

### Test Scenario 3: Multiple Different RSVPs

1. Submit RSVPs with different email addresses
2. Check your Google Sheet:
   - Each RSVP should have a unique RSVP_ID
   - All should have Status = "Actief"
   - RSVP_IDs should auto-increment properly

## Troubleshooting

### Error: "Authorization Required"

**Solution**: You need to authorize the script to access your Google Sheet. Follow the authorization steps in Step 4.

### Error: "Script function not found: doPost"

**Solution**: Make sure you've copied the entire `Code.gs` file correctly and saved it in the Apps Script editor.

### Error: "The script completed but did not return anything"

**Solution**: Check that your deployment is configured as a "Web app" (not as an API executable).

### Frontend shows "Failed to submit RSVP"

**Possible causes**:
1. The `NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL` is not set correctly in `.env.local`
2. The Apps Script URL is incorrect
3. The script encountered an error - check the Apps Script logs:
   - Go to Apps Script editor
   - Click **Executions** (clock icon on the left)
   - Look for failed executions and error messages

### Data not appearing in the sheet

**Possible causes**:
1. The script is writing to the wrong sheet (if your spreadsheet has multiple sheets)
2. Permission issues - ensure "Execute as: Me" and "Who has access: Anyone"
3. Check the Apps Script logs for errors

### RSVP_ID not incrementing correctly

**Solution**: Check that column B contains only numbers. If there are text values or formulas, the auto-increment logic may fail.

## Updating the Script

When you need to update the Apps Script code:

1. Open the Apps Script editor from your Google Sheet
2. Make your changes to the code
3. Click **Save** (💾)
4. Click **Deploy** → **Manage deployments**
5. Click the edit icon (✏️) next to your active deployment
6. Update the version description (e.g., "Wedding RSVP Handler v2")
7. Click **Deploy**
8. **Important**: The Web app URL remains the same, so you don't need to update the frontend

## Security Considerations

- The Apps Script is deployed as "Anyone can access" because it needs to receive POST requests from your public website
- Email validation is performed in the script to prevent invalid data
- Consider adding additional security measures like:
  - Rate limiting (Apps Script has built-in quotas)
  - CAPTCHA verification on the frontend
  - Checking the `Referer` header in the script (though this can be spoofed)

## Support

If you encounter issues not covered in this guide:

1. Check the Apps Script execution logs for detailed error messages
2. Verify that all environment variables are set correctly
3. Test the script manually using Apps Script's "Test as add-on" feature
4. Review the `Code.gs` code for any customizations that may need adjustment
