# Bruiloft Website Design
**Datum:** 11 januari 2026
**Bruiloft datum:** 10 juli 2026
**Doel:** Simpele, moderne website voor uitnodigingen en RSVP tracking

## Requirements

### Functioneel
- Tweetalige website (Nederlands/Engels)
- 3 pagina's: Home, RSVP, Accommodation
- RSVP formulier met data opslag in Google Sheets
- Toegangscode bescherming voor RSVP pagina
- Spam/bot bescherming
- Geen indexering door zoekmachines

### Non-functioneel
- Volledig gratis hosting
- Geen database hosting complexiteit
- Snel te implementeren (bruiloft over 6 maanden)
- Modern en speels design
- Mobile responsive

## Tech Stack

### Core
- **Framework:** Nuxt 3
- **Rendering:** Static Site Generation (`nuxt generate`)
- **Styling:** Tailwind CSS
- **Internationalization:** `@nuxtjs/i18n`
- **Hosting:** GitHub Pages
- **CI/CD:** GitHub Actions
- **Data storage:** Google Sheets via Google Apps Script

### Rationale
- Nuxt 3: Ontwikkelaar kent het, excellent i18n support, file-based routing
- Static generation: Past bij GitHub Pages, geen server kosten
- Google Sheets: Gratis, real-time samenwerking, geen database setup
- GitHub Pages: Volledig gratis, betrouwbaar

## Architecture

### Project Structure
```
bruiloft/
├── pages/
│   ├── index.vue              # Home pagina (openbaar)
│   ├── rsvp.vue               # RSVP formulier (beschermd)
│   ├── accommodation.vue      # Accommodatie lijst (openbaar)
│   └── access.vue             # Code invoer pagina
├── components/
│   ├── LanguageSwitcher.vue   # NL/EN toggle
│   ├── Navigation.vue         # Header navigatie
│   ├── RsvpForm.vue           # RSVP formulier component
│   └── AccessGate.vue         # Code invoer component
├── middleware/
│   └── auth.ts                # RSVP toegangscode check
├── composables/
│   └── useRsvpSubmit.ts       # Google Sheets API integratie
├── locales/
│   ├── nl.json                # Nederlandse vertalingen
│   └── en.json                # Engelse vertalingen
├── public/
│   └── robots.txt             # Zoekmachine blokkering
└── nuxt.config.ts
```

### Page Routing
- `/` of `/nl` - Home (Nederlands, openbaar)
- `/en` - Home (Engels, openbaar)
- `/nl/rsvp` - RSVP (Nederlands, beschermd)
- `/en/rsvp` - RSVP (Engels, beschermd)
- `/nl/accommodation` - Accommodatie (Nederlands, openbaar)
- `/en/accommodation` - Accommodatie (Engels, openbaar)
- `/access` - Code invoer (voor toegang tot RSVP)

## Page Designs

### Home (`pages/index.vue`)
**Content:**
- Hero sectie met namen + "10 juli 2026"
- Locatie informatie
- Tijden (ceremonie, receptie, etc.)
- Call-to-action naar RSVP pagina
- Modern & speels design met animaties (fade-ins)

**Technisch:**
- Geen authenticatie vereist
- i18n voor alle teksten
- Responsive design

### RSVP (`pages/rsvp.vue`)
**Content:**
- Formulier met velden:
  - Naam (text input, verplicht)
  - Aantal personen (number input, min 1, verplicht)
  - Email (email input, verplicht)
  - Dieetwensen/allergieën (textarea, optioneel)
  - Komt wel/niet (radio buttons, verplicht)
- Submit button met loading state
- Success/error messages
- Honeypot field (verborgen, anti-spam)

**Technisch:**
- Middleware: `auth.ts` (check toegangscode)
- Client-side validatie
- POST naar Google Apps Script
- Redirect naar access pagina indien geen code

**RSVP Data flow:**
1. User vult formulier in
2. Client-side validatie
3. POST naar Google Apps Script URL
4. Apps Script valideert (honeypot, rate limit, data types)
5. Apps Script schrijft naar Google Sheet
6. Success/error response
7. Confirmation message in UI

### Accommodation (`pages/accommodation.vue`)
**Content:**
- Lijst met hotels/verblijven
- Per item:
  - Naam
  - Afstand tot locatie
  - Prijs indicatie
  - Link naar website
- Simpele lijst layout (geen kaart nodig)

**Technisch:**
- Geen authenticatie vereist
- i18n voor teksten
- Data hardcoded in component (of optioneel in JSON file)

### Access (`pages/access.vue`)
**Content:**
- Code invoer formulier
- Instructie tekst
- Error message bij foutieve code
- Redirect naar RSVP na success

**Technisch:**
- Code check (client-side, hardcoded)
- localStorage set bij success
- Redirect naar oorspronkelijke bestemming

## Security Implementation

### Multi-layer Approach

**Laag 1: UI toegangscode**
- Voorkomt casual bezoekers
- Code hardcoded in `pages/access.vue` (ja, te vinden in client JS, maar praktisch genoeg)
- Code opgeslagen in localStorage na correcte invoer
- Middleware check op RSVP pagina

**Laag 2: Apps Script bescherming**
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

**Laag 3: Monitoring**
- Regelmatig Google Sheet checken
- Verdachte entries handmatig verwijderen
- Voor een bruiloft (beperkt publiek) is dit realistisch

### Search Engine Blocking

**Meta tags in `nuxt.config.ts`:**
```typescript
app: {
  head: {
    meta: [
      { name: 'robots', content: 'noindex, nofollow' }
    ]
  }
}
```

**robots.txt in `public/`:**
```
User-agent: *
Disallow: /
```

**Note:** Custom HTTP headers niet mogelijk op GitHub Pages (zou wel werken op Vercel/Netlify)

## Google Sheets Setup

### Sheet structuur
Kolommen:
1. Timestamp (datetime)
2. Naam (text)
3. Aantal personen (number)
4. Email (text)
5. Dieetwensen/allergieën (text)
6. Komt (text: "Ja" of "Nee")
7. Taal (text: "nl" of "en")

### Apps Script Deployment
1. Google Sheet aanmaken
2. Extensions > Apps Script
3. Code plaatsen (zie Security Implementation)
4. Deploy as Web App:
   - Execute as: Me
   - Who has access: Anyone
5. URL kopieren voor gebruik in Nuxt app

### Environment Variable
- Apps Script URL opslaan als environment variable
- In Nuxt: `useRuntimeConfig().public.appsScriptUrl`
- GitHub Actions: secret voor production URL
- Local dev: `.env` file (niet committen)

## Styling & Design

### Design System
**Theme: Modern & Speels**

**Colors:**
- Te bepalen door ontwikkelaar
- Tailwind custom palette in `tailwind.config.ts`
- Suggestie: Primaire kleur (bruiloft thema), neutrale grijs/wit achtergrond

**Typography:**
- Primary font: Modern sans-serif (bijv. Inter, Manrope)
- Optional accent font: Iets speelser voor headings
- Tailwind font utilities

**Spacing & Layout:**
- Generous whitespace
- Rounded corners (`rounded-lg`, `rounded-xl`)
- Card-based layouts waar passend

### Animations
- Page transitions (Nuxt built-in)
- Fade-in on scroll (Intersection Observer)
- Button hover states
- Form focus states
- Language switch smooth transition
- Optional: Confetti na succesvolle RSVP 🎉

**Implementation:**
- Tailwind transition utilities
- Nuxt `<Transition>` component
- Optional: libraries zoals `canvas-confetti`

### Responsive Design
- Mobile-first approach
- Tailwind breakpoints: `sm:`, `md:`, `lg:`
- Hamburger menu voor mobile navigation
- Forms optimized for mobile (grote tap targets)

## Internationalization (i18n)

### Setup
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],
  i18n: {
    locales: [
      { code: 'nl', iso: 'nl-NL', file: 'nl.json', name: 'Nederlands' },
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' }
    ],
    defaultLocale: 'nl',
    strategy: 'prefix',
    langDir: 'locales/',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  }
})
```

### Translation Files

**locales/nl.json:**
```json
{
  "nav": {
    "home": "Home",
    "rsvp": "RSVP",
    "accommodation": "Accommodatie"
  },
  "home": {
    "title": "We gaan trouwen!",
    "date": "10 juli 2026",
    ...
  },
  "rsvp": {
    "title": "RSVP",
    "form": {
      "name": "Naam",
      "numberOfGuests": "Aantal personen",
      ...
    }
  }
}
```

**locales/en.json:**
```json
{
  "nav": {
    "home": "Home",
    "rsvp": "RSVP",
    "accommodation": "Accommodation"
  },
  "home": {
    "title": "We're getting married!",
    "date": "July 10, 2026",
    ...
  }
}
```

### Language Switcher Component
```vue
<!-- components/LanguageSwitcher.vue -->
<template>
  <div>
    <button @click="switchLocale('nl')">NL</button>
    <button @click="switchLocale('en')">EN</button>
  </div>
</template>

<script setup>
const { locale, setLocale } = useI18n()

const switchLocale = (newLocale) => {
  setLocale(newLocale)
}
</script>
```

## Deployment

### GitHub Repository
- Public of private repository
- Branch: `main` voor development
- Branch: `gh-pages` voor deployment (automatisch aangemaakt)

### GitHub Actions Workflow

**`.github/workflows/deploy.yml`:**
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Generate static site
        run: npm run generate
        env:
          NUXT_PUBLIC_APPS_SCRIPT_URL: ${{ secrets.APPS_SCRIPT_URL }}

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./.output/public
```

### GitHub Pages Setup
1. Repository > Settings > Pages
2. Source: Deploy from a branch
3. Branch: `gh-pages`, folder: `/ (root)`
4. Save

### Custom Domain (Optional)
- DNS: CNAME record naar `<username>.github.io`
- GitHub Pages: Custom domain instellen
- HTTPS automatisch via Let's Encrypt

### Environment Variables
- **Local:** `.env` file (niet committen)
  ```
  NUXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/...
  ```
- **GitHub Actions:** Secret: `APPS_SCRIPT_URL`
- **Access in Nuxt:**
  ```typescript
  const config = useRuntimeConfig()
  const url = config.public.appsScriptUrl
  ```

## Development Workflow

### Initial Setup
```bash
npx nuxi@latest init bruiloft
cd bruiloft
npm install @nuxtjs/i18n @nuxtjs/tailwindcss
```

### Local Development
```bash
npm run dev
# Open http://localhost:3000
```

### Building
```bash
npm run generate
# Output in .output/public/
```

### Preview Production Build
```bash
npm run preview
```

### Deployment
```bash
git push origin main
# GitHub Actions automatically deploys
```

## Future Enhancements (Optional)

Niet voor MVP, maar mogelijk later:
- Photo gallery pagina
- Gift registry links
- Guest message board
- Countdown timer
- Email notifications bij nieuwe RSVP (via Apps Script + Gmail)
- Admin dashboard voor RSVP overzicht
- QR code op fysieke uitnodiging (direct naar RSVP)

## Success Criteria

- ✅ Website live op GitHub Pages
- ✅ Tweetalig werkend (NL/EN)
- ✅ RSVP formulier schrijft naar Google Sheets
- ✅ Toegangscode bescherming werkend
- ✅ Mobile responsive
- ✅ Geen zoekmachine indexering
- ✅ Modern & speels design
- ✅ Deployment < 5 minuten na push

## Timeline Estimate

**Setup & Core (1-2 dagen):**
- Project setup, Nuxt config, i18n, Tailwind
- Basic routing en navigatie
- Google Sheets + Apps Script setup

**Pages (1-2 dagen):**
- Home page design + content
- RSVP form + validatie + integration
- Accommodation page

**Security & Polish (0.5-1 dag):**
- Access gate + middleware
- Styling verfijnen
- Testing op verschillende devices

**Deployment (0.5 dag):**
- GitHub Actions setup
- GitHub Pages configuratie
- DNS (indien custom domain)

**Totaal: 3-5 dagen development**

Voor jullie deadline (uitnodigingen snel versturen) is dit ruim op tijd haalbaar.
