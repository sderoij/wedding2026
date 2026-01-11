# Wedding Website

A bilingual (Dutch/English) wedding website with RSVP tracking, built with Nuxt 3.

## Features

- 🌍 Bilingual support (NL/EN) with @nuxtjs/i18n
- 📝 RSVP form with Google Sheets integration
- 🔒 Access code protection for RSVP page
- 🎨 Modern, responsive design with Tailwind CSS
- 🚀 Static site generation for GitHub Pages
- 🤖 Anti-spam protection (honeypot + rate limiting)
- 🚫 Search engine blocking

## Tech Stack

- **Framework:** Nuxt 3
- **Styling:** Tailwind CSS
- **i18n:** @nuxtjs/i18n
- **Deployment:** GitHub Pages
- **CI/CD:** GitHub Actions
- **Data Storage:** Google Sheets via Apps Script

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Google Sheets

Follow instructions in `docs/google-apps-script.md` to:
1. Create Google Sheet with RSVP columns
2. Deploy Apps Script webhook
3. Get webhook URL

### 3. Configure Environment

Create `.env` file:
```
NUXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

### 5. Access Code

Default access code: `wedding2026`

Change in `pages/access.vue` line 22.

## Deployment

### GitHub Pages Setup

1. Go to repo Settings > Pages
2. Source: "GitHub Actions"
3. Add secret: `APPS_SCRIPT_URL` (your Apps Script webhook URL)

### Deploy

Push to `main` branch:
```bash
git push origin main
```

GitHub Actions will automatically build and deploy.

## Project Structure

```
├── pages/
│   ├── index.vue           # Home page
│   ├── rsvp.vue            # RSVP form (protected)
│   ├── accommodation.vue   # Hotels list
│   └── access.vue          # Access code entry
├── components/
│   ├── Navigation.vue      # Header navigation
│   └── LanguageSwitcher.vue
├── middleware/
│   └── auth.ts             # Access code validation
├── composables/
│   └── useRsvpSubmit.ts    # RSVP submission logic
├── locales/
│   ├── nl.json             # Dutch translations
│   └── en.json             # English translations
└── nuxt.config.ts
```

## Customization

### Update Content

Edit translation files:
- `locales/nl.json` - Dutch content
- `locales/en.json` - English content

### Update Hotels

Edit `pages/accommodation.vue` and replace sample data.

### Change Access Code

Edit `pages/access.vue`, line 22:
```typescript
const ACCESS_CODE = 'your-new-code'
```

## License

Private project - All rights reserved
