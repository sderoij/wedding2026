# Google Sheets RSVP Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform RSVP form to support multiple guests per submission with individual names and dietary requirements, storing data in Google Sheets with version history.

**Architecture:** Restructure form to use dynamic guest fields based on numberOfGuests. Frontend sends array of guest objects to Apps Script. Apps Script manages auto-increment RSVP_ID and marks old submissions as "Vervangen" when email exists.

**Tech Stack:** Nuxt 3, Vue 3 Composition API, Tailwind CSS, @nuxtjs/i18n, Google Apps Script, Google Sheets API

---

## Task 1: Add Translation Keys for Guest Fields

**Files:**
- Modify: `i18n/locales/nl.json:20-34`
- Modify: `i18n/locales/en.json:20-34`

**Step 1: Add Dutch translations**

Update `i18n/locales/nl.json` in the `rsvp.form` section:

```json
"form": {
  "name": "Naam",
  "namePlaceholder": "Jouw naam",
  "numberOfGuests": "Aantal personen",
  "email": "Email",
  "emailPlaceholder": "jouw{'@'}email.nl",
  "dietaryRequirements": "Dieetwensen/allergieën",
  "dietaryPlaceholder": "Bijvoorbeeld: vegetarisch, lactose-intolerant...",
  "attending": "Kun je erbij zijn?",
  "attendingYes": "Ja, ik kom!",
  "attendingNo": "Helaas niet",
  "submit": "Verzenden",
  "submitting": "Verzenden...",
  "guestNumber": "Gast {number}",
  "guestNumberYou": "Gast {number} (u)",
  "guestName": "Naam",
  "guestNamePlaceholder": "Naam van gast {number}",
  "guestDietary": "Dieetwensen/allergieën",
  "guestDietaryPlaceholder": "Bijvoorbeeld: vegetarisch, lactose-intolerant..."
}
```

**Step 2: Add English translations**

Update `i18n/locales/en.json` in the `rsvp.form` section:

```json
"form": {
  "name": "Name",
  "namePlaceholder": "Your name",
  "numberOfGuests": "Number of guests",
  "email": "Email",
  "emailPlaceholder": "your{'@'}email.com",
  "dietaryRequirements": "Dietary requirements/allergies",
  "dietaryPlaceholder": "E.g.: vegetarian, lactose intolerant...",
  "attending": "Will you attend?",
  "attendingYes": "Yes, I'll be there!",
  "attendingNo": "Unfortunately not",
  "submit": "Submit",
  "submitting": "Submitting...",
  "guestNumber": "Guest {number}",
  "guestNumberYou": "Guest {number} (you)",
  "guestName": "Name",
  "guestNamePlaceholder": "Name of guest {number}",
  "guestDietary": "Dietary requirements/allergies",
  "guestDietaryPlaceholder": "E.g.: vegetarian, lactose intolerant..."
}
```

**Step 3: Verify translations load**

Run: `npm run dev`

Expected: No errors, dev server starts successfully

**Step 4: Commit translation updates**

```bash
git add i18n/locales/nl.json i18n/locales/en.json
git commit -m "feat: add translations for multi-guest RSVP fields

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Update TypeScript Interface for Guest Data

**Files:**
- Modify: `composables/useRsvpSubmit.ts:1-8`

**Step 1: Add Guest interface**

Add new interface at top of file before `RsvpFormData`:

```typescript
export interface Guest {
  name: string
  email?: string  // Only first guest has email
  dietary: string
}

export interface RsvpFormData {
  numberOfGuests: number
  attending: boolean
  guests: Guest[]
  website?: string // Honeypot field
}
```

**Step 2: Verify TypeScript compiles**

Run: `npm run dev`

Expected: No TypeScript errors, successful compilation

**Step 3: Commit interface update**

```bash
git add composables/useRsvpSubmit.ts
git commit -m "feat: update RsvpFormData interface for multi-guest support

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Update RSVP Form with Dynamic Guest Fields

**Files:**
- Modify: `pages/rsvp.vue:27-136`

**Step 1: Update template with dynamic guest fields**

Replace the form section (lines 27-136) with:

```vue
<!-- RSVP Form -->
<form v-if="!submitSuccess" @submit.prevent="handleSubmit" class="space-y-6">
  <!-- Number of Guests -->
  <div>
    <label for="guests" class="block text-sm font-medium text-forest-dark mb-1">
      {{ $t('rsvp.form.numberOfGuests') }}*
    </label>
    <select
      id="guests"
      v-model.number="formData.numberOfGuests"
      class="w-full px-4 py-2 border border-forest-sage/30 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white"
      required
    >
      <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
    </select>
  </div>

  <!-- Dynamic Guest Fields -->
  <div v-for="(guest, index) in formData.guests" :key="index" class="border border-forest-sage/20 rounded-lg p-6 bg-white/50">
    <h3 class="text-lg font-semibold text-forest-dark mb-4">
      {{ index === 0 ? $t('rsvp.form.guestNumberYou', { number: index + 1 }) : $t('rsvp.form.guestNumber', { number: index + 1 }) }}
    </h3>

    <!-- Guest Name -->
    <div class="mb-4">
      <label :for="`guest-name-${index}`" class="block text-sm font-medium text-forest-dark mb-1">
        {{ $t('rsvp.form.guestName') }}*
      </label>
      <input
        :id="`guest-name-${index}`"
        v-model="guest.name"
        type="text"
        :placeholder="$t('rsvp.form.guestNamePlaceholder', { number: index + 1 })"
        class="w-full px-4 py-2 border border-forest-sage/30 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white"
        required
        minlength="2"
      />
    </div>

    <!-- Email (only for first guest) -->
    <div v-if="index === 0" class="mb-4">
      <label for="email" class="block text-sm font-medium text-forest-dark mb-1">
        {{ $t('rsvp.form.email') }}*
      </label>
      <input
        id="email"
        v-model="guest.email"
        type="email"
        :placeholder="$t('rsvp.form.emailPlaceholder')"
        class="w-full px-4 py-2 border border-forest-sage/30 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white"
        required
      />
    </div>

    <!-- Dietary Requirements -->
    <div>
      <label :for="`guest-dietary-${index}`" class="block text-sm font-medium text-forest-dark mb-1">
        {{ $t('rsvp.form.guestDietary') }}
      </label>
      <textarea
        :id="`guest-dietary-${index}`"
        v-model="guest.dietary"
        :placeholder="$t('rsvp.form.guestDietaryPlaceholder')"
        rows="2"
        class="w-full px-4 py-2 border border-forest-sage/30 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white"
      ></textarea>
    </div>
  </div>

  <!-- Attending -->
  <div>
    <label class="block text-sm font-medium text-forest-dark mb-2">
      {{ $t('rsvp.form.attending') }}*
    </label>
    <div class="space-y-2">
      <label class="flex items-center text-forest-dark/80">
        <input
          v-model="formData.attending"
          type="radio"
          :value="true"
          class="mr-2 text-gold focus:ring-gold"
          required
        />
        <span>{{ $t('rsvp.form.attendingYes') }}</span>
      </label>
      <label class="flex items-center text-forest-dark/80">
        <input
          v-model="formData.attending"
          type="radio"
          :value="false"
          class="mr-2 text-gold focus:ring-gold"
          required
        />
        <span>{{ $t('rsvp.form.attendingNo') }}</span>
      </label>
    </div>
  </div>

  <!-- Honeypot field (hidden) -->
  <input
    v-model="formData.website"
    type="text"
    name="website"
    style="display: none"
    tabindex="-1"
    autocomplete="off"
  />

  <!-- Submit Button -->
  <button
    type="submit"
    :disabled="isSubmitting"
    class="w-full bg-forest-dark text-warmwhite px-6 py-3 rounded-lg font-semibold hover:bg-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {{ isSubmitting ? $t('rsvp.form.submitting') : $t('rsvp.form.submit') }}
  </button>
</form>
```

**Step 2: Update script section with new formData structure**

Replace the script section (lines 142-162) with:

```vue
<script setup lang="ts">
import type { Guest } from '~/composables/useRsvpSubmit'

definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const { isSubmitting, submitError, submitSuccess, submitRsvp } = useRsvpSubmit()

const formData = ref({
  numberOfGuests: 1,
  attending: true,
  guests: [
    { name: '', email: '', dietary: '' }
  ] as Guest[],
  website: '' // Honeypot
})

// Watch numberOfGuests and adjust guests array
watch(() => formData.value.numberOfGuests, (newCount, oldCount) => {
  const currentGuests = formData.value.guests

  if (newCount > oldCount) {
    // Add new guests
    for (let i = oldCount; i < newCount; i++) {
      currentGuests.push({ name: '', dietary: '' })
    }
  } else if (newCount < oldCount) {
    // Remove excess guests
    currentGuests.splice(newCount)
  }
})

const handleSubmit = async () => {
  await submitRsvp(formData.value)
}
</script>
```

**Step 3: Test dynamic guest fields**

Run: `npm run dev`

Open: `http://localhost:3000/nl/rsvp` (after entering access code)

Actions:
1. Change "Aantal personen" from 1 to 3
2. Verify 3 guest cards appear
3. Verify first guest has email field
4. Verify guests 2 and 3 don't have email field
5. Change back to 1
6. Verify only 1 guest card remains

Expected: Guest fields dynamically add/remove based on numberOfGuests

**Step 4: Commit form update**

```bash
git add pages/rsvp.vue
git commit -m "feat: implement dynamic guest fields in RSVP form

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Update Composable to Send Guest Array

**Files:**
- Modify: `composables/useRsvpSubmit.ts:18-61`

**Step 1: Update submitRsvp function payload**

Replace the `submitRsvp` function (lines 18-61) with:

```typescript
const submitRsvp = async (formData: RsvpFormData) => {
  isSubmitting.value = true
  submitError.value = null
  submitSuccess.value = false

  try {
    // Check honeypot
    if (formData.website) {
      throw new Error('Invalid submission')
    }

    // Validate guest count matches array length
    if (formData.guests.length !== formData.numberOfGuests) {
      throw new Error('Guest count mismatch')
    }

    // Validate all guests have names
    const invalidGuest = formData.guests.find(g => !g.name || g.name.trim().length < 2)
    if (invalidGuest) {
      throw new Error('All guest names are required')
    }

    // Validate first guest has email
    if (!formData.guests[0].email || !formData.guests[0].email.includes('@')) {
      throw new Error('Valid email is required')
    }

    // Prepare payload
    const payload = {
      numberOfGuests: formData.numberOfGuests,
      attending: formData.attending,
      guests: formData.guests,
      locale: locale.value
    }

    // Submit to Google Apps Script
    const response = await $fetch(config.public.appsScriptUrl, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const result = response as { success: boolean; error?: string }

    if (result.success) {
      submitSuccess.value = true
    } else {
      submitError.value = result.error || 'Unknown error'
    }
  } catch (err: any) {
    console.error('RSVP submission error:', err)
    submitError.value = err.message || 'Network error'
  } finally {
    isSubmitting.value = false
  }
}
```

**Step 2: Test form validation**

Run: `npm run dev`

Test scenarios:
1. Try submitting with empty name → Should fail (HTML5 validation)
2. Try submitting with empty email → Should fail (HTML5 validation)
3. Fill valid data for 1 guest → Should succeed (will error at Apps Script, that's ok)

Expected: Client-side validation works, error messages appear

**Step 3: Commit composable update**

```bash
git add composables/useRsvpSubmit.ts
git commit -m "feat: update composable to send guest array payload

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Create Google Apps Script Code

**Files:**
- Create: `docs/apps-script/Code.gs` (for documentation, not deployed)

**Step 1: Create Apps Script documentation file**

Create new file `docs/apps-script/Code.gs`:

```javascript
/**
 * Google Apps Script for Wedding RSVP
 *
 * Deployment Instructions:
 * 1. Open Google Sheets with your RSVP data
 * 2. Extensions > Apps Script
 * 3. Delete default code, paste this entire file
 * 4. Update SHEET_NAME constant to match your sheet name
 * 5. Deploy > New deployment > Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy deployment URL to .env as NUXT_PUBLIC_APPS_SCRIPT_URL
 *
 * Sheet Structure (columns A-I):
 * A: Timestamp
 * B: RSVP_ID
 * C: Email
 * D: Aanwezig
 * E: Taal
 * F: Status
 * G: GastNummer
 * H: Naam
 * I: Dieetwensen
 */

const SHEET_NAME = 'RSVPs'; // Change this to your sheet name

/**
 * Handle POST requests from the RSVP form
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Validate request
    if (!validateRequest(data)) {
      return createResponse(false, 'Ongeldige gegevens');
    }

    // Get the spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      return createResponse(false, 'Technische fout');
    }

    // Initialize sheet if empty (add headers)
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'RSVP_ID', 'Email', 'Aanwezig', 'Taal', 'Status', 'GastNummer', 'Naam', 'Dieetwensen']);
    }

    const email = data.guests[0].email;

    // Check for existing RSVP with this email
    const existingRsvpId = findActiveRsvpByEmail(sheet, email);

    if (existingRsvpId !== null) {
      // Mark old RSVP as "Vervangen"
      markAsReplaced(sheet, email);
    }

    // Generate new RSVP_ID
    const rsvpId = getNextRsvpId(sheet);

    // Add new rows (one per guest)
    const timestamp = new Date();
    const attending = data.attending ? 'Ja' : 'Nee';

    data.guests.forEach((guest, index) => {
      const row = [
        timestamp,
        rsvpId,
        email,
        attending,
        data.locale,
        'Actief',
        index + 1,
        guest.name,
        guest.dietary || ''
      ];
      sheet.appendRow(row);
    });

    return createResponse(true);

  } catch (error) {
    console.error('Error processing RSVP:', error);
    return createResponse(false, 'Technische fout');
  }
}

/**
 * Validate incoming request data
 */
function validateRequest(data) {
  // Check required fields
  if (!data.numberOfGuests || !data.guests || !Array.isArray(data.guests)) {
    return false;
  }

  // Check guest count matches
  if (data.guests.length !== data.numberOfGuests) {
    return false;
  }

  // Check max guests
  if (data.numberOfGuests > 10) {
    return false;
  }

  // Check all guests have names
  for (let guest of data.guests) {
    if (!guest.name || guest.name.trim().length < 2) {
      return false;
    }
  }

  // Check first guest has valid email
  const email = data.guests[0].email;
  if (!email || !email.includes('@')) {
    return false;
  }

  // Check honeypot (if present and filled, reject)
  if (data.website && data.website.length > 0) {
    return false;
  }

  return true;
}

/**
 * Find active RSVP by email
 * Returns RSVP_ID if found, null otherwise
 */
function findActiveRsvpByEmail(sheet, email) {
  const data = sheet.getDataRange().getValues();

  // Skip header row
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const rowEmail = row[2]; // Column C
    const status = row[5];   // Column F

    if (rowEmail === email && status === 'Actief') {
      return row[1]; // Return RSVP_ID from column B
    }
  }

  return null;
}

/**
 * Mark all rows with given email as "Vervangen"
 */
function markAsReplaced(sheet, email) {
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const rowEmail = row[2]; // Column C
    const status = row[5];   // Column F

    if (rowEmail === email && status === 'Actief') {
      // Update status to "Vervangen" (column F = row 6)
      sheet.getRange(i + 1, 6).setValue('Vervangen');
    }
  }
}

/**
 * Get next RSVP_ID (max + 1)
 */
function getNextRsvpId(sheet) {
  const data = sheet.getDataRange().getValues();

  // If only header row, start at 1
  if (data.length <= 1) {
    return 1;
  }

  let maxId = 0;
  for (let i = 1; i < data.length; i++) {
    const id = data[i][1]; // Column B (RSVP_ID)
    if (typeof id === 'number' && id > maxId) {
      maxId = id;
    }
  }

  return maxId + 1;
}

/**
 * Create JSON response
 */
function createResponse(success, error = null) {
  const response = { success: success };
  if (error) {
    response.error = error;
  }

  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}
```

**Step 2: Create deployment documentation**

Create new file `docs/apps-script/DEPLOYMENT.md`:

```markdown
# Google Apps Script Deployment Guide

## Prerequisites

1. Google Sheet created with name "RSVPs" (or update `SHEET_NAME` in script)
2. Google account with access to the sheet

## Deployment Steps

### 1. Open Apps Script Editor

1. Open your Google Sheet
2. Click **Extensions** > **Apps Script**
3. Delete any default code in the editor

### 2. Add the Script

1. Copy entire contents of `docs/apps-script/Code.gs`
2. Paste into Apps Script editor
3. Update `SHEET_NAME` constant if your sheet has different name
4. Click **Save** (💾 icon)

### 3. Deploy as Web App

1. Click **Deploy** > **New deployment**
2. Click **⚙️ Settings** icon next to "Select type"
3. Select **Web app**
4. Fill in:
   - **Description**: "Wedding RSVP Handler"
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
5. Click **Deploy**
6. Click **Authorize access**
7. Select your Google account
8. Click **Advanced** > **Go to [Project Name] (unsafe)**
9. Click **Allow**
10. Copy the **Web app URL** (looks like: `https://script.google.com/macros/s/.../exec`)

### 4. Configure Frontend

1. Create `.env` file in project root (if not exists)
2. Add: `NUXT_PUBLIC_APPS_SCRIPT_URL=<your-web-app-url>`
3. Restart dev server: `npm run dev`

### 5. Setup Conditional Formatting (Optional)

Make "Vervangen" rows visually distinct:

1. Open Google Sheet
2. Select all cells (click top-left corner)
3. **Format** > **Conditional formatting**
4. **Format rules**:
   - Format cells if: **Custom formula is**
   - Formula: `=$F2="Vervangen"`
5. **Formatting style**:
   - Background: Light gray (#f3f3f3)
   - Text: Strikethrough
6. Click **Done**

## Testing

### Test 1: New RSVP

1. Fill form with 2 guests
2. Submit
3. Check sheet: 2 rows added with same RSVP_ID, Status = "Actief"

### Test 2: Update RSVP

1. Use same email as Test 1
2. Change to 1 guest
3. Submit
4. Check sheet:
   - Old 2 rows now have Status = "Vervangen"
   - New 1 row with incremented RSVP_ID, Status = "Actief"

### Test 3: Multiple RSVPs

1. Use different email
2. Submit
3. Check sheet: New RSVP_ID assigned, Status = "Actief"

## Troubleshooting

### Error: "Technische fout"

- Check Apps Script logs: **Executions** in Apps Script editor
- Verify sheet name matches `SHEET_NAME` constant
- Verify sheet has headers in row 1

### Error: "Ongeldige gegevens"

- Check validation logic in `validateRequest()`
- Verify payload structure matches expected format

### CORS Issues

- Apps Script automatically handles CORS
- Verify deployment is set to "Anyone" access
- Check browser console for specific errors

## Updating the Script

1. Edit code in Apps Script editor
2. Click **Save**
3. Click **Deploy** > **Manage deployments**
4. Click **✏️ Edit** (pencil icon)
5. Update **Version**: New version
6. Click **Deploy**
7. URL remains the same, no frontend changes needed
```

**Step 3: Commit Apps Script documentation**

```bash
git add docs/apps-script/
git commit -m "docs: add Google Apps Script code and deployment guide

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 6: Create .env.example with Apps Script URL

**Files:**
- Modify: `.env.example:1-3`

**Step 1: Update .env.example**

The file should already have the Apps Script URL placeholder. Verify it contains:

```
# Google Apps Script webhook URL
NUXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

If it doesn't, update it.

**Step 2: Verify no .env file is committed**

Run: `git status`

Expected: `.env` should NOT appear (should be in .gitignore)

**Step 3: Commit .env.example if changed**

```bash
git add .env.example
git commit -m "docs: ensure .env.example has Apps Script URL placeholder

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 7: Update README with Setup Instructions

**Files:**
- Modify: `README.md` (add setup section)

**Step 1: Check if README exists**

Run: `ls -la README.md`

If doesn't exist, create it. If exists, read it first.

**Step 2: Add or update setup section**

Add this section to README.md:

```markdown
## Setup

### Prerequisites

- Node.js 18+ and npm
- Google account with access to Google Sheets

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env`: `cp .env.example .env`

### Google Apps Script Setup

The RSVP form submits data to Google Sheets via Apps Script. Follow these steps:

1. Create a Google Sheet named "RSVPs" (or your preferred name)
2. Follow the deployment guide: [docs/apps-script/DEPLOYMENT.md](docs/apps-script/DEPLOYMENT.md)
3. Copy the deployed Web App URL
4. Update `.env` with your URL:
   ```
   NUXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ID/exec
   ```

### Development

Run the dev server:

```bash
npm run dev
```

Visit: `http://localhost:3000`

### Build

Generate static site:

```bash
npm run generate
```

Output will be in `dist/` directory.

### Deployment

This project is configured for GitHub Pages with base URL `/wedding2026/`.

To deploy:
1. Run `npm run generate`
2. Push `dist/` to GitHub Pages (or use GitHub Actions)
```

**Step 3: Commit README update**

```bash
git add README.md
git commit -m "docs: add setup and deployment instructions

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Manual Testing Checklist

After all tasks complete, test the complete flow:

### Test 1: Single Guest RSVP

1. Run `npm run dev`
2. Navigate to `/nl/rsvp`
3. Fill form:
   - Aantal personen: 1
   - Naam: "Test Gebruiker"
   - Email: "test@example.com"
   - Dieetwensen: "vegetarisch"
   - Aanwezig: Ja
4. Submit
5. Check Google Sheet:
   - 1 row added
   - RSVP_ID = 1
   - Status = "Actief"
   - All data correct

### Test 2: Multiple Guests RSVP

1. Use different email: "multi@example.com"
2. Fill form:
   - Aantal personen: 3
   - Gast 1: "Alice", "alice@example.com", "geen"
   - Gast 2: "Bob", "lactose-intolerant"
   - Gast 3: "Charlie", "glutenvrij"
   - Aanwezig: Ja
3. Submit
4. Check Google Sheet:
   - 3 rows added
   - All same RSVP_ID (2)
   - All Status = "Actief"
   - GastNummer 1, 2, 3
   - All data correct

### Test 3: Update Existing RSVP

1. Use same email as Test 2: "multi@example.com"
2. Fill form:
   - Aantal personen: 2
   - Gast 1: "Alice Updated", "alice@example.com", "veganistisch"
   - Gast 2: "David", "noten allergie"
   - Aanwezig: Nee
3. Submit
4. Check Google Sheet:
   - Old 3 rows (RSVP_ID 2) now Status = "Vervangen"
   - New 2 rows added with RSVP_ID 3, Status = "Actief"
   - Attending changed to "Nee"

### Test 4: Language Switching

1. Switch to English: `/en/rsvp`
2. Verify all labels in English
3. Submit form
4. Check Sheet: Taal = "en"

### Test 5: Error Handling

1. Try submitting with empty name → HTML5 validation prevents submit
2. Try submitting with invalid email → HTML5 validation prevents submit
3. Fill honeypot field (via browser console): `document.querySelector('input[name="website"]').value = "spam"`
4. Submit → Should get "Invalid submission" error

### Test 6: Conditional Formatting (Manual Sheet Setup)

1. Follow steps in `docs/apps-script/DEPLOYMENT.md` section 5
2. Verify rows with Status = "Vervangen" appear gray and strikethrough

---

## Success Criteria

- [x] Dynamic guest fields appear/disappear based on numberOfGuests
- [x] First guest has email field, others don't
- [x] All guests have name and dietary fields
- [x] Form submits array of guests to Apps Script
- [x] Apps Script creates RSVP_ID via auto-increment
- [x] Apps Script marks old rows as "Vervangen" when email exists
- [x] Google Sheet has correct structure (9 columns)
- [x] Translations work in both Dutch and English
- [x] Error handling catches validation issues
- [x] Documentation complete for deployment

---

## Notes

- This is a personal wedding website, no automated tests needed
- Manual testing is sufficient for this use case
- Apps Script code is documented but not version controlled (lives in Google)
- .env file contains sensitive URL, never commit it
- Conditional formatting is manual one-time setup in Google Sheets
