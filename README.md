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

Default access code: `wedding2026` (change in `pages/access.vue` line 22)

### Build

Generate static site:

```bash
npm run generate
```

Output will be in `dist/` directory.

### Deployment

This project is configured for GitHub Pages with base URL `/wedding2026/`.

#### GitHub Pages Setup

1. Go to repo Settings > Pages
2. Source: "GitHub Actions"
3. Add secret: `APPS_SCRIPT_URL` (your Apps Script webhook URL)

#### Deploy

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
