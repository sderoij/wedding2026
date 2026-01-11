# Google Sheets RSVP Integration Design

## Overview

Integrate the wedding website RSVP form with Google Sheets to store guest responses. Support multiple guests per RSVP with individual names and dietary requirements. Allow guests to update their RSVP while maintaining version history.

## Data Model

### Google Sheet Structure

**Kolommen:**
1. `Timestamp` - Wanneer de RSVP is ingediend (auto-generated)
2. `RSVP_ID` - Auto-increment nummer (1, 2, 3, ...)
3. `Email` - Email van de persoon die het formulier invult
4. `Aanwezig` - "Ja" of "Nee"
5. `Taal` - "nl" of "en"
6. `Status` - "Actief" of "Vervangen"
7. `GastNummer` - 1, 2, 3, etc. (binnen de RSVP groep)
8. `Naam` - Naam van deze specifieke gast
9. `Dieetwensen` - Dieetwensen van deze specifieke gast

### Data Principles

- **Eén rij per gast** - Elke persoon krijgt een eigen rij
- **Groepering via RSVP_ID** - Alle gasten van dezelfde inzending delen hetzelfde RSVP_ID en timestamp
- **Versiegeschiedenis** - Updates overschrijven niet, maar markeren oude rijen als "Vervangen"

### Example Data

```
Timestamp         | RSVP_ID | Email        | Aanwezig | Taal | Status     | GastNr | Naam          | Dieetwensen
2026-01-11 14:30  | 1       | jan@test.nl  | Ja       | nl   | Vervangen  | 1      | Jan de Vries  | vegetarisch
2026-01-11 14:30  | 1       | jan@test.nl  | Ja       | nl   | Vervangen  | 2      | Marie Jansen  | geen
2026-01-11 15:45  | 2       | jan@test.nl  | Nee      | nl   | Actief     | 1      | Jan de Vries  |
```

In dit voorbeeld heeft Jan eerst "Ja" gezegd met Marie, later aangepast naar "Nee" alleen.

## Formulier Design

### Frontend Changes

**Huidige situatie:**
- Enkel formulier met velden: naam, aantal gasten, email, dieetwensen, aanwezig

**Nieuwe situatie:**
- Aantal gasten selectie (1-10)
- Dynamische gastvelden die verschijnen op basis van aantal
- Per gast: naam (verplicht) + dieetwensen (optioneel)
- Email alleen bij eerste gast

### Formulier Layout

```
Aantal personen: [3] ▼

=== Gast 1 (u) ===
Naam: [Jan de Vries]
Email: [jan@test.nl]
Dieetwensen: [vegetarisch]

=== Gast 2 ===
Naam: [Marie Jansen]
Dieetwensen: [geen]

=== Gast 3 ===
Naam: [Piet Bakker]
Dieetwensen: [lactose-intolerant]

Aanwezig: (•) Ja  ( ) Nee

[Verzenden]
```

### Data Structure

**Nieuwe formData structuur:**
```typescript
{
  numberOfGuests: 3,
  attending: true,
  guests: [
    { name: "Jan de Vries", email: "jan@test.nl", dietary: "vegetarisch" },
    { name: "Marie Jansen", dietary: "geen" },
    { name: "Piet Bakker", dietary: "lactose-intolerant" }
  ],
  website: "" // honeypot
}
```

## Apps Script Workflow

### Main Flow

1. **Ontvang POST request** van frontend
2. **Valideer data** (honeypot, email format, aantal gasten)
3. **Check duplicate email** (zoek in Status = "Actief" rijen)
4. **Als email bestaat**: Mark oude rijen als "Vervangen"
5. **Genereer RSVP_ID** (hoogste bestaande ID + 1, of 1 als leeg)
6. **Voeg nieuwe rijen toe** (één per gast met Status = "Actief")
7. **Return success/error** naar frontend

### Duplicate Handling

**Scenario: Nieuwe RSVP**
- Email bestaat niet in "Actief" rijen
- Genereer nieuw RSVP_ID
- Voeg rijen toe met Status = "Actief"

**Scenario: Update bestaand RSVP**
- Email bestaat in "Actief" rijen
- Zoek alle rijen met deze email en Status = "Actief"
- Update hun Status naar "Vervangen"
- Genereer nieuw RSVP_ID
- Voeg nieuwe rijen toe met Status = "Actief"

### RSVP_ID Generation

```javascript
function getNextRsvpId(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return 1; // Only header row

  let maxId = 0;
  for (let i = 1; i < data.length; i++) {
    const id = data[i][1]; // Column B (RSVP_ID)
    if (id > maxId) maxId = id;
  }

  return maxId + 1;
}
```

## Security & Validation

### Frontend Validation

- Naam minimaal 2 karakters
- Email format check (HTML5 validation)
- Aantal gasten 1-10
- Honeypot field moet leeg blijven
- Alle gastnamen verplicht

### Apps Script Validation

- Honeypot check (dubbele beveiliging)
- Email format regex check
- Aantal gasten in array moet matchen numberOfGuests
- Maximum 10 gasten per RSVP

### Error Handling

**Frontend errors:**
- Netwerk fout → "Er ging iets mis. Probeer het opnieuw."
- Validation errors → Inline per veld

**Apps Script errors:**
- Invalid data → `{ success: false, error: "Ongeldige gegevens" }`
- Sheet error → `{ success: false, error: "Technische fout" }`
- Success → `{ success: true }`

### CORS Configuration

Apps Script `doPost()` moet CORS headers instellen voor GitHub Pages domein:
```javascript
function doPost(e) {
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## Visualization

### Conditional Formatting

**Handmatige setup in Google Sheets:**
- Format > Conditional formatting
- Custom formula: `=$F2="Vervangen"` (kolom F = Status)
- Formattering: Lichtgrijs achtergrond + doorgestreepte tekst
- Apply to: Hele sheet (A2:I)

**Result:**
- Actieve RSVPs blijven wit/normaal
- Vervangen RSVPs worden grijs en doorgestreept
- Eenvoudig overzicht van huidige stand

## Implementation Components

### Files to Create/Modify

**Frontend:**
- `pages/rsvp.vue` - Update formulier met dynamische gastvelden
- `composables/useRsvpSubmit.ts` - Update data structure en payload
- `i18n/locales/nl.json` + `en.json` - Nieuwe vertalingen voor gastvelden

**Backend:**
- Google Apps Script - Nieuw bestand (niet in repository)
- `.env` - NUXT_PUBLIC_APPS_SCRIPT_URL invullen

**Documentation:**
- Setup instructies voor Apps Script deployment

## Success Criteria

- [ ] Formulier toont dynamische gastvelden op basis van aantal
- [ ] Meerdere gasten kunnen worden ingevoerd met eigen naam en dieetwensen
- [ ] Data wordt correct opgeslagen in Google Sheet (één rij per gast)
- [ ] RSVP_ID auto-increment werkt correct
- [ ] Email duplicate detection werkt
- [ ] Updates markeren oude rijen als "Vervangen"
- [ ] Conditional formatting toont vervangen rijen grijs
- [ ] Error handling werkt voor alle scenarios
- [ ] Honeypot voorkomt spam
