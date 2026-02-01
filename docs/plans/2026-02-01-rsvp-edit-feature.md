# RSVP Edit Feature

## Overview

Allow guests to view and edit their existing RSVP response. Uses localStorage for storing responses (no cross-device support, but keeps guest data private).

## localStorage Structure

Key: `wedding_rsvp_response`

```json
{
  "code": "dorien",
  "attending": true,
  "guests": [
    { "name": "Dorien", "email": "dorien@email.nl", "dietary": "" },
    { "name": "Partner", "dietary": "vegetarisch" }
  ],
  "submittedAt": "2026-02-01T21:00:00Z"
}
```

## RSVP Page States

1. **No response** → Show empty form (current behavior)
2. **Has response** → Show summary with all details + "Edit" button
3. **Edit mode** → Show form pre-filled with existing data

## UI: Summary View

When attending:
- Title: "Je hebt je aangemeld!"
- Show: Attending status, all guest names with email/dietary info
- Button: "Wijzigen"

When not attending:
- Title: "Je hebt aangegeven niet te komen"
- Button: "Wijzigen"

## Backend Changes (Apps Script)

**New sheet structure (columns A-I):**
```
Timestamp | RSVP_ID | Email | Aanwezig | Taal | Code | GastNummer | Naam | Dieetwensen
```

- Column F becomes `Code` instead of `Status`
- On new submit: delete all rows with same `code` first, then add new rows
- No more "Actief/Vervangen" status tracking

## Frontend Changes

1. **useRsvpSubmit.ts** - Add `code` to payload, save to localStorage after submit
2. **useRsvpStorage.ts** (new) - getSavedResponse, saveResponse, clearResponse
3. **pages/rsvp.vue** - Add summary view, edit mode toggle, pre-fill form
4. **i18n** - Add summary translations
