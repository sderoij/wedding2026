# Google Apps Script Setup

This document describes how to set up Google Sheets + Apps Script for handling RSVP submissions.

## 1. Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Wedding RSVPs" (or any name you prefer)
4. Set up columns with headers:
   - A: Timestamp
   - B: Naam
   - C: Aantal personen
   - D: Email
   - E: Dieetwensen/allergieën
   - F: Komt
   - G: Taal

## 2. Add Apps Script Code

1. In your Google Sheet, click **Extensions > Apps Script**
2. Delete any existing code
3. Paste the following code:

```javascript
function doPost(e) {
  const data = JSON.parse(e.postData.contents);

  // 1. Honeypot check
  if (data.website) return errorResponse('Invalid submission');

  // 2. Rate limiting (max 1 RSVP per email)
  const sheet = SpreadsheetApp.getActiveSheet();
  const existingEmails = sheet.getRange('D:D').getValues();
  if (existingEmails.flat().includes(data.email)) {
    return errorResponse('Email already used');
  }

  // 3. Data validatie
  if (!isValidEmail(data.email)) return errorResponse('Invalid email');
  if (!data.name || data.name.length < 2) return errorResponse('Invalid name');
  if (data.numberOfGuests < 1 || data.numberOfGuests > 10) {
    return errorResponse('Invalid guest count');
  }

  // 4. Timestamp check (submissions < 2 sec na page load = bot)
  // Optioneel: client stuurt timestamp mee

  // 5. Opslaan
  sheet.appendRow([
    new Date(),
    data.name,
    data.numberOfGuests,
    data.email,
    data.dietaryRequirements || '',
    data.attending ? 'Ja' : 'Nee',
    data.locale
  ]);

  return ContentService.createTextOutput(
    JSON.stringify({ success: true })
  ).setMimeType(ContentService.MimeType.JSON);
}

function errorResponse(message) {
  return ContentService.createTextOutput(
    JSON.stringify({ success: false, error: message })
  ).setMimeType(ContentService.MimeType.JSON);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

4. Click the disk icon to save (or press Cmd/Ctrl+S)
5. Name your project (e.g., "Wedding RSVP Handler")

## 3. Deploy as Web App

1. Click **Deploy > New deployment**
2. Click the gear icon next to "Select type" and choose **Web app**
3. Fill in the settings:
   - **Description**: "RSVP submission endpoint" (or any description)
   - **Execute as**: Me (your Google account)
   - **Who has access**: Anyone
4. Click **Deploy**
5. You may need to authorize the script:
   - Click **Authorize access**
   - Select your Google account
   - Click **Advanced** (if you see a warning)
   - Click **Go to [Project Name] (unsafe)**
   - Click **Allow**
6. Copy the **Web app URL** - you'll need this!

## 4. Configure Environment Variable

The web app URL needs to be added to your Nuxt application:

### For local development:
1. Create a `.env` file in the root of your project (if it doesn't exist)
2. Add: `NUXT_PUBLIC_APPS_SCRIPT_URL=your-web-app-url-here`
3. **Important**: Never commit the `.env` file to git! (should be in `.gitignore`)

### For production (GitHub Pages):
1. The URL should be configured in your deployment settings
2. For GitHub Actions: Add as a repository secret
3. Reference in workflow: `NUXT_PUBLIC_APPS_SCRIPT_URL: ${{ secrets.APPS_SCRIPT_URL }}`

### Usage in Nuxt:
```typescript
const config = useRuntimeConfig()
const appsScriptUrl = config.public.appsScriptUrl
```

## Security Notes

The Apps Script includes several security measures:
- **Honeypot field**: Catches automated bots
- **Rate limiting**: Prevents multiple submissions from the same email
- **Data validation**: Checks email format, name length, guest count
- **Error handling**: Returns meaningful error messages

## Testing

To test your setup:
1. Make sure the web app URL is configured in your `.env` file
2. Run your Nuxt app locally: `npm run dev`
3. Navigate to the RSVP page
4. Submit a test RSVP
5. Check your Google Sheet - a new row should appear with the submitted data

## Troubleshooting

**"Email already used" error:**
- Check your Google Sheet column D for duplicate emails
- Delete test entries before testing again

**Submissions not appearing in sheet:**
- Check that the Apps Script deployment is active
- Verify the web app URL is correct in your `.env` file
- Check the Apps Script execution logs: Apps Script Editor > Executions

**Authorization errors:**
- Re-deploy the web app
- Make sure "Execute as: Me" and "Who has access: Anyone" are set correctly
