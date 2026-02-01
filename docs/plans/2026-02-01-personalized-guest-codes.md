# Personalized Guest Codes

## Overview

Replace the generic access code (`wedding2026`) with personalized codes per invited guest. Each code determines the guest's name and how many people they can bring.

## Data Structure

File: `data/guests.json`

```json
{
  "dorien": {
    "name": "Dorien",
    "maxGuests": 2
  },
  "sjoerd": {
    "name": "Sjoerd",
    "maxGuests": 1
  },
  "willemijn": {
    "name": "Willemijn",
    "maxGuests": 5
  }
}
```

- **Code** (key): lowercase, no spaces, printed on invitation
- **name**: Display name for welcome message and pre-fill
- **maxGuests**: Maximum number of guests they can select

## Flow

1. Guest receives invitation with personalized link: `site.nl/?code=dorien`
2. On any page load, check for `?code=xxx` URL parameter
3. If found: validate against `guests.json`, store in localStorage, remove param from URL
4. If no URL param: check localStorage for existing code
5. If no code anywhere: redirect to `/access` for manual entry
6. Once authenticated: show personalized RSVP experience

## Files to Modify

| File | Action |
|------|--------|
| `data/guests.json` | New - guest data |
| `composables/useGuestCode.ts` | New - guest code logic |
| `middleware/auth.ts` | Update - URL param + JSON validation |
| `pages/access.vue` | Update - validate against JSON |
| `pages/rsvp.vue` | Update - welcome, prefill, limit |
| `i18n/locales/nl.json` | Update - welcome text |
| `i18n/locales/en.json` | Update - welcome text |

## RSVP Page Changes

- Welcome message: "Welkom, {name}!"
- Guest 1 name: Pre-filled with name from JSON (editable)
- Number of guests dropdown: Limited to 1..maxGuests (not 1..10)
