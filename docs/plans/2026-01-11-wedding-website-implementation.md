# Wedding Website Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a bilingual (NL/EN) wedding website with RSVP tracking, access code protection, and Google Sheets integration.

**Architecture:** Nuxt 3 static site with i18n, protected RSVP page using client-side access code + server-side Apps Script validation, deployed to GitHub Pages via GitHub Actions.

**Tech Stack:** Nuxt 3, @nuxtjs/i18n, @nuxtjs/tailwindcss, Google Apps Script, GitHub Pages, GitHub Actions

---

## Task 1: Initialize Nuxt 3 Project

**Files:**
- Create: entire project structure via `npx nuxi@latest init`

**Step 1: Initialize Nuxt project in worktree**

Run in `/Users/sjoerdderoij/Developer/personal/bruiloft/.worktrees/wedding-website`:
```bash
npx nuxi@latest init .
```

Select options:
- Package manager: npm
- Initialize git repository: No (already in worktree)

**Step 2: Verify project structure**

Run: `ls -la`
Expected: Should see `nuxt.config.ts`, `package.json`, `app.vue`, `tsconfig.json`

**Step 3: Commit**

```bash
git add .
git commit -m "feat: initialize Nuxt 3 project

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Install Required Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install i18n and Tailwind modules**

Run:
```bash
npm install @nuxtjs/i18n @nuxtjs/tailwindcss
```

**Step 2: Verify installation**

Run: `grep -E "(@nuxtjs/i18n|@nuxtjs/tailwindcss)" package.json`
Expected: Both packages listed in dependencies

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add i18n and tailwindcss dependencies

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Configure Nuxt with i18n and Tailwind

**Files:**
- Modify: `nuxt.config.ts`

**Step 1: Replace nuxt.config.ts with full configuration**

```typescript
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  modules: ['@nuxtjs/i18n', '@nuxtjs/tailwindcss'],

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
  },

  app: {
    head: {
      title: 'Wedding - July 10, 2026',
      meta: [
        { name: 'robots', content: 'noindex, nofollow' },
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },

  runtimeConfig: {
    public: {
      appsScriptUrl: process.env.NUXT_PUBLIC_APPS_SCRIPT_URL || ''
    }
  }
})
```

**Step 2: Verify configuration syntax**

Run: `npx nuxi typecheck`
Expected: No errors

**Step 3: Commit**

```bash
git add nuxt.config.ts
git commit -m "feat: configure Nuxt with i18n and Tailwind

- Add i18n with NL/EN locales
- Add robots meta tag for search engine blocking
- Configure runtime config for Apps Script URL

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Create Translation Files

**Files:**
- Create: `locales/nl.json`
- Create: `locales/en.json`

**Step 1: Create locales directory**

Run:
```bash
mkdir -p locales
```

**Step 2: Create Dutch translations**

Create `locales/nl.json`:
```json
{
  "nav": {
    "home": "Home",
    "rsvp": "RSVP",
    "accommodation": "Accommodatie"
  },
  "home": {
    "title": "We gaan trouwen!",
    "subtitle": "10 juli 2026",
    "location": {
      "title": "Locatie",
      "venue": "Te bepalen",
      "address": "Adres volgt"
    },
    "schedule": {
      "title": "Tijden",
      "ceremony": "Ceremonie: 14:00",
      "reception": "Receptie: 15:30",
      "dinner": "Diner: 18:00",
      "party": "Feest: 21:00"
    },
    "rsvpCta": "Laat ons weten of je erbij bent!"
  },
  "rsvp": {
    "title": "RSVP",
    "description": "Vul het formulier in om ons te laten weten of je komt",
    "form": {
      "name": "Naam",
      "namePlaceholder": "Jouw naam",
      "numberOfGuests": "Aantal personen",
      "email": "Email",
      "emailPlaceholder": "jouw@email.nl",
      "dietaryRequirements": "Dieetwensen/allergieën",
      "dietaryPlaceholder": "Bijvoorbeeld: vegetarisch, lactose-intolerant...",
      "attending": "Kun je erbij zijn?",
      "attendingYes": "Ja, ik kom!",
      "attendingNo": "Helaas niet",
      "submit": "Verzenden",
      "submitting": "Verzenden..."
    },
    "success": "Bedankt! Je RSVP is ontvangen.",
    "error": "Er ging iets mis. Probeer het opnieuw.",
    "errorEmailUsed": "Dit emailadres is al gebruikt."
  },
  "accommodation": {
    "title": "Accommodatie",
    "description": "Aanbevolen hotels en verblijven in de buurt"
  },
  "access": {
    "title": "Toegangscode",
    "description": "Voer de toegangscode in die je op de uitnodiging hebt ontvangen",
    "codePlaceholder": "Toegangscode",
    "submit": "Bevestigen",
    "error": "Onjuiste code. Probeer het opnieuw."
  }
}
```

**Step 3: Create English translations**

Create `locales/en.json`:
```json
{
  "nav": {
    "home": "Home",
    "rsvp": "RSVP",
    "accommodation": "Accommodation"
  },
  "home": {
    "title": "We're getting married!",
    "subtitle": "July 10, 2026",
    "location": {
      "title": "Location",
      "venue": "To be determined",
      "address": "Address to follow"
    },
    "schedule": {
      "title": "Schedule",
      "ceremony": "Ceremony: 2:00 PM",
      "reception": "Reception: 3:30 PM",
      "dinner": "Dinner: 6:00 PM",
      "party": "Party: 9:00 PM"
    },
    "rsvpCta": "Let us know if you'll be there!"
  },
  "rsvp": {
    "title": "RSVP",
    "description": "Fill out the form to let us know if you're coming",
    "form": {
      "name": "Name",
      "namePlaceholder": "Your name",
      "numberOfGuests": "Number of guests",
      "email": "Email",
      "emailPlaceholder": "your@email.com",
      "dietaryRequirements": "Dietary requirements/allergies",
      "dietaryPlaceholder": "E.g.: vegetarian, lactose intolerant...",
      "attending": "Will you attend?",
      "attendingYes": "Yes, I'll be there!",
      "attendingNo": "Unfortunately not",
      "submit": "Submit",
      "submitting": "Submitting..."
    },
    "success": "Thank you! Your RSVP has been received.",
    "error": "Something went wrong. Please try again.",
    "errorEmailUsed": "This email address has already been used."
  },
  "accommodation": {
    "title": "Accommodation",
    "description": "Recommended hotels and stays nearby"
  },
  "access": {
    "title": "Access Code",
    "description": "Enter the access code you received on your invitation",
    "codePlaceholder": "Access code",
    "submit": "Confirm",
    "error": "Incorrect code. Please try again."
  }
}
```

**Step 4: Verify JSON syntax**

Run:
```bash
cat locales/nl.json | jq . > /dev/null && echo "nl.json valid"
cat locales/en.json | jq . > /dev/null && echo "en.json valid"
```
Expected: Both files valid

**Step 5: Commit**

```bash
git add locales/
git commit -m "feat: add Dutch and English translations

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Create robots.txt and Environment Files

**Files:**
- Create: `public/robots.txt`
- Create: `.env.example`
- Modify: `.gitignore`

**Step 1: Create public directory and robots.txt**

```bash
mkdir -p public
cat > public/robots.txt << 'EOF'
User-agent: *
Disallow: /
EOF
```

**Step 2: Create .env.example**

```bash
cat > .env.example << 'EOF'
# Google Apps Script webhook URL
NUXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
EOF
```

**Step 3: Update .gitignore to exclude .env**

Add to `.gitignore`:
```
# Environment files
.env
```

**Step 4: Verify files created**

Run: `ls public/robots.txt .env.example`
Expected: Both files exist

**Step 5: Commit**

```bash
git add public/robots.txt .env.example .gitignore
git commit -m "feat: add robots.txt and environment setup

- Block all search engines via robots.txt
- Add .env.example with Apps Script URL template
- Update .gitignore to exclude .env

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 6: Remove Default app.vue and Setup Pages Directory

**Files:**
- Delete: `app.vue`
- Create: `pages/.gitkeep`

**Step 1: Remove default app.vue**

Run:
```bash
rm app.vue
```

**Step 2: Create pages directory**

Run:
```bash
mkdir -p pages
touch pages/.gitkeep
```

**Step 3: Commit**

```bash
git add -A
git commit -m "refactor: remove default app.vue and create pages directory

Enable file-based routing by removing app.vue.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 7: Create Navigation Component

**Files:**
- Create: `components/Navigation.vue`

**Step 1: Create components directory**

Run:
```bash
mkdir -p components
```

**Step 2: Create Navigation component**

Create `components/Navigation.vue`:
```vue
<template>
  <nav class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo/Title -->
        <div class="flex-shrink-0">
          <NuxtLink :to="localePath('/')" class="text-xl font-semibold text-gray-900">
            {{ $t('home.title') }}
          </NuxtLink>
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:flex space-x-8">
          <NuxtLink
            :to="localePath('/')"
            class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            {{ $t('nav.home') }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/rsvp')"
            class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            {{ $t('nav.rsvp') }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/accommodation')"
            class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            {{ $t('nav.accommodation') }}
          </NuxtLink>
        </div>

        <!-- Language Switcher -->
        <LanguageSwitcher />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
</script>
```

**Step 3: Verify syntax**

Run: `npx nuxi typecheck`
Expected: No errors (may warn about LanguageSwitcher not existing yet)

**Step 4: Commit**

```bash
git add components/Navigation.vue
git commit -m "feat: create Navigation component

- Responsive navigation with logo
- Links to home, RSVP, accommodation
- Includes LanguageSwitcher placeholder

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 8: Create LanguageSwitcher Component

**Files:**
- Create: `components/LanguageSwitcher.vue`

**Step 1: Create LanguageSwitcher component**

Create `components/LanguageSwitcher.vue`:
```vue
<template>
  <div class="flex space-x-2">
    <button
      v-for="loc in availableLocales"
      :key="loc.code"
      @click="switchLocale(loc.code)"
      :class="[
        'px-3 py-1 rounded-md text-sm font-medium transition-colors',
        locale === loc.code
          ? 'bg-gray-900 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      ]"
    >
      {{ loc.code.toUpperCase() }}
    </button>
  </div>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const availableLocales = computed(() => {
  return (locales.value as any[]).filter(loc => loc.code !== locale.value)
    .concat((locales.value as any[]).filter(loc => loc.code === locale.value))
})

const switchLocale = (newLocale: string) => {
  setLocale(newLocale)
}
</script>
```

**Step 2: Verify syntax**

Run: `npx nuxi typecheck`
Expected: No errors

**Step 3: Commit**

```bash
git add components/LanguageSwitcher.vue
git commit -m "feat: create LanguageSwitcher component

- Toggle between NL and EN
- Highlights active language
- Smooth transitions

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 9: Create Home Page Layout

**Files:**
- Create: `pages/index.vue`

**Step 1: Create home page**

Create `pages/index.vue`:
```vue
<template>
  <div class="min-h-screen bg-gradient-to-b from-pink-50 to-white">
    <Navigation />

    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Hero Section -->
      <section class="text-center mb-16 animate-fade-in">
        <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
          {{ $t('home.title') }}
        </h1>
        <p class="text-2xl md:text-3xl text-gray-600 mb-8">
          {{ $t('home.subtitle') }}
        </p>
      </section>

      <!-- Location Section -->
      <section class="mb-12 bg-white rounded-xl shadow-md p-8">
        <h2 class="text-3xl font-semibold text-gray-900 mb-4">
          {{ $t('home.location.title') }}
        </h2>
        <p class="text-lg text-gray-700">
          <strong>{{ $t('home.location.venue') }}</strong>
        </p>
        <p class="text-gray-600">{{ $t('home.location.address') }}</p>
      </section>

      <!-- Schedule Section -->
      <section class="mb-12 bg-white rounded-xl shadow-md p-8">
        <h2 class="text-3xl font-semibold text-gray-900 mb-4">
          {{ $t('home.schedule.title') }}
        </h2>
        <ul class="space-y-2 text-lg text-gray-700">
          <li>{{ $t('home.schedule.ceremony') }}</li>
          <li>{{ $t('home.schedule.reception') }}</li>
          <li>{{ $t('home.schedule.dinner') }}</li>
          <li>{{ $t('home.schedule.party') }}</li>
        </ul>
      </section>

      <!-- CTA Section -->
      <section class="text-center">
        <p class="text-xl text-gray-700 mb-6">
          {{ $t('home.rsvpCta') }}
        </p>
        <NuxtLink
          :to="localePath('/rsvp')"
          class="inline-block bg-pink-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-pink-700 transition-colors shadow-lg"
        >
          {{ $t('nav.rsvp') }}
        </NuxtLink>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}
</style>
```

**Step 2: Test locally**

Run: `npm run dev`
Expected: Dev server starts successfully

**Step 3: Verify in browser**

Open `http://localhost:3000`
Expected: Home page displays with NL content, language switcher works

**Step 4: Commit**

```bash
git add pages/index.vue
git commit -m "feat: create home page with hero and schedule

- Hero section with wedding date
- Location information
- Schedule with ceremony times
- CTA button to RSVP
- Fade-in animation

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 10: Create Access Code Page

**Files:**
- Create: `pages/access.vue`

**Step 1: Create access page**

Create `pages/access.vue`:
```vue
<template>
  <div class="min-h-screen bg-gradient-to-b from-pink-50 to-white">
    <Navigation />

    <main class="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-white rounded-xl shadow-md p-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          {{ $t('access.title') }}
        </h1>
        <p class="text-gray-600 mb-6">
          {{ $t('access.description') }}
        </p>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <input
              v-model="code"
              type="text"
              :placeholder="$t('access.codePlaceholder')"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          </div>

          <p v-if="error" class="text-red-600 text-sm">
            {{ $t('access.error') }}
          </p>

          <button
            type="submit"
            class="w-full bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
          >
            {{ $t('access.submit') }}
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const code = ref('')
const error = ref(false)

// Hardcoded access code (will be visible in client JS, but that's acceptable)
const ACCESS_CODE = 'wedding2026'

const handleSubmit = () => {
  if (code.value === ACCESS_CODE) {
    // Store in localStorage
    if (process.client) {
      localStorage.setItem('wedding_access', 'granted')
    }

    // Redirect to RSVP or original destination
    const redirect = route.query.redirect as string || '/rsvp'
    router.push(redirect)
  } else {
    error.value = true
    code.value = ''
  }
}
</script>
```

**Step 2: Test access page**

Run dev server (if not running): `npm run dev`
Visit: `http://localhost:3000/nl/access`
Expected: Access code form displays

**Step 3: Test access code logic**

1. Enter wrong code → Should show error
2. Enter "wedding2026" → Should redirect to RSVP

**Step 4: Commit**

```bash
git add pages/access.vue
git commit -m "feat: create access code page

- Form for entering access code
- Hardcoded code validation (wedding2026)
- localStorage storage on success
- Redirect to RSVP after validation

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 11: Create Authentication Middleware

**Files:**
- Create: `middleware/auth.ts`

**Step 1: Create middleware directory**

Run:
```bash
mkdir -p middleware
```

**Step 2: Create auth middleware**

Create `middleware/auth.ts`:
```typescript
export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client side
  if (process.client) {
    const hasAccess = localStorage.getItem('wedding_access')

    if (!hasAccess) {
      // Redirect to access page with return URL
      return navigateTo({
        path: '/access',
        query: { redirect: to.fullPath }
      })
    }
  }
})
```

**Step 3: Verify syntax**

Run: `npx nuxi typecheck`
Expected: No errors

**Step 4: Commit**

```bash
git add middleware/auth.ts
git commit -m "feat: create authentication middleware

- Check localStorage for access grant
- Redirect to /access if not granted
- Preserve intended destination in query

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 12: Create RSVP Composable

**Files:**
- Create: `composables/useRsvpSubmit.ts`

**Step 1: Create composables directory**

Run:
```bash
mkdir -p composables
```

**Step 2: Create useRsvpSubmit composable**

Create `composables/useRsvpSubmit.ts`:
```typescript
export interface RsvpFormData {
  name: string
  numberOfGuests: number
  email: string
  dietaryRequirements: string
  attending: boolean
  website?: string // Honeypot field
}

export const useRsvpSubmit = () => {
  const config = useRuntimeConfig()
  const { locale } = useI18n()

  const isSubmitting = ref(false)
  const submitError = ref<string | null>(null)
  const submitSuccess = ref(false)

  const submitRsvp = async (formData: RsvpFormData) => {
    isSubmitting.value = true
    submitError.value = null
    submitSuccess.value = false

    try {
      // Check honeypot
      if (formData.website) {
        throw new Error('Invalid submission')
      }

      // Prepare payload
      const payload = {
        name: formData.name,
        numberOfGuests: formData.numberOfGuests,
        email: formData.email,
        dietaryRequirements: formData.dietaryRequirements,
        attending: formData.attending,
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

  return {
    isSubmitting,
    submitError,
    submitSuccess,
    submitRsvp
  }
}
```

**Step 3: Verify syntax**

Run: `npx nuxi typecheck`
Expected: No errors

**Step 4: Commit**

```bash
git add composables/useRsvpSubmit.ts
git commit -m "feat: create RSVP submission composable

- Type-safe form data interface
- Honeypot validation
- POST to Google Apps Script
- Error and success state management

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 13: Create RSVP Page

**Files:**
- Create: `pages/rsvp.vue`

**Step 1: Create RSVP page with form**

Create `pages/rsvp.vue`:
```vue
<template>
  <div class="min-h-screen bg-gradient-to-b from-pink-50 to-white">
    <Navigation />

    <main class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-white rounded-xl shadow-md p-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          {{ $t('rsvp.title') }}
        </h1>
        <p class="text-gray-600 mb-8">
          {{ $t('rsvp.description') }}
        </p>

        <!-- Success Message -->
        <div v-if="submitSuccess" class="mb-6 p-4 bg-green-100 border border-green-400 rounded-lg">
          <p class="text-green-800">{{ $t('rsvp.success') }}</p>
        </div>

        <!-- Error Message -->
        <div v-if="submitError" class="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg">
          <p class="text-red-800">
            {{ submitError === 'Email already used' ? $t('rsvp.errorEmailUsed') : $t('rsvp.error') }}
          </p>
        </div>

        <!-- RSVP Form -->
        <form v-if="!submitSuccess" @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('rsvp.form.name') }}*
            </label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              :placeholder="$t('rsvp.form.namePlaceholder')"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
              minlength="2"
            />
          </div>

          <!-- Number of Guests -->
          <div>
            <label for="guests" class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('rsvp.form.numberOfGuests') }}*
            </label>
            <input
              id="guests"
              v-model.number="formData.numberOfGuests"
              type="number"
              min="1"
              max="10"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('rsvp.form.email') }}*
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              :placeholder="$t('rsvp.form.emailPlaceholder')"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          </div>

          <!-- Dietary Requirements -->
          <div>
            <label for="dietary" class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('rsvp.form.dietaryRequirements') }}
            </label>
            <textarea
              id="dietary"
              v-model="formData.dietaryRequirements"
              :placeholder="$t('rsvp.form.dietaryPlaceholder')"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            ></textarea>
          </div>

          <!-- Attending -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('rsvp.form.attending') }}*
            </label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input
                  v-model="formData.attending"
                  type="radio"
                  :value="true"
                  class="mr-2"
                  required
                />
                <span>{{ $t('rsvp.form.attendingYes') }}</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="formData.attending"
                  type="radio"
                  :value="false"
                  class="mr-2"
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
            class="w-full bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? $t('rsvp.form.submitting') : $t('rsvp.form.submit') }}
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const { isSubmitting, submitError, submitSuccess, submitRsvp } = useRsvpSubmit()

const formData = ref({
  name: '',
  numberOfGuests: 1,
  email: '',
  dietaryRequirements: '',
  attending: true,
  website: '' // Honeypot
})

const handleSubmit = async () => {
  await submitRsvp(formData.value)
}
</script>
```

**Step 2: Test RSVP page protection**

1. Clear localStorage
2. Visit `http://localhost:3000/nl/rsvp`
Expected: Redirects to `/nl/access`

3. Enter access code "wedding2026"
Expected: Redirects back to RSVP page

**Step 3: Test form rendering**

Visit RSVP page (after entering access code)
Expected: Form displays with all fields

**Step 4: Commit**

```bash
git add pages/rsvp.vue
git commit -m "feat: create RSVP page with form

- Protected by auth middleware
- Full form with validation
- Honeypot field for spam prevention
- Success/error message display
- Loading state during submission

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 14: Create Accommodation Page

**Files:**
- Create: `pages/accommodation.vue`

**Step 1: Create accommodation page**

Create `pages/accommodation.vue`:
```vue
<template>
  <div class="min-h-screen bg-gradient-to-b from-pink-50 to-white">
    <Navigation />

    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        {{ $t('accommodation.title') }}
      </h1>
      <p class="text-gray-600 mb-8">
        {{ $t('accommodation.description') }}
      </p>

      <div class="space-y-6">
        <div
          v-for="place in accommodations"
          :key="place.name"
          class="bg-white rounded-xl shadow-md p-6"
        >
          <h2 class="text-2xl font-semibold text-gray-900 mb-2">
            {{ place.name }}
          </h2>
          <p class="text-gray-600 mb-2">
            {{ $t('accommodation.distance') }}: {{ place.distance }}
          </p>
          <p class="text-gray-600 mb-4">
            {{ $t('accommodation.price') }}: {{ place.price }}
          </p>
          <a
            :href="place.website"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-block bg-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
          >
            {{ $t('accommodation.visitWebsite') }}
          </a>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

// Sample data - replace with actual accommodations
const accommodations = ref([
  {
    name: 'Hotel Example 1',
    distance: '2 km',
    price: '€100-150',
    website: 'https://example.com'
  },
  {
    name: 'Hotel Example 2',
    distance: '5 km',
    price: '€80-120',
    website: 'https://example.com'
  },
  {
    name: 'B&B Example',
    distance: '3 km',
    price: '€60-90',
    website: 'https://example.com'
  }
])
</script>
```

**Step 2: Add accommodation translations**

Update `locales/nl.json`:
```json
"accommodation": {
  "title": "Accommodatie",
  "description": "Aanbevolen hotels en verblijven in de buurt",
  "distance": "Afstand",
  "price": "Prijsindicatie",
  "visitWebsite": "Bekijk website"
}
```

Update `locales/en.json`:
```json
"accommodation": {
  "title": "Accommodation",
  "description": "Recommended hotels and stays nearby",
  "distance": "Distance",
  "price": "Price range",
  "visitWebsite": "Visit website"
}
```

**Step 3: Test accommodation page**

Visit: `http://localhost:3000/nl/accommodation`
Expected: Page displays with sample hotels

**Step 4: Commit**

```bash
git add pages/accommodation.vue locales/nl.json locales/en.json
git commit -m "feat: create accommodation page

- List of recommended hotels/stays
- Distance and price information
- Links to hotel websites
- Sample data (to be replaced)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 15: Setup Google Sheets and Apps Script

**Files:**
- Create: `docs/google-apps-script.md` (documentation)

**Step 1: Document Apps Script setup**

Create `docs/google-apps-script.md`:
```markdown
# Google Apps Script Setup

## 1. Create Google Sheet

1. Go to https://sheets.google.com
2. Create new spreadsheet named "Wedding RSVP"
3. Add column headers in row 1:
   - A1: Timestamp
   - B1: Naam
   - C1: Aantal personen
   - D1: Email
   - E1: Dieetwensen/allergieën
   - F1: Komt
   - G1: Taal

## 2. Create Apps Script

1. In Google Sheet: Extensions > Apps Script
2. Delete default code
3. Paste the following code:

\`\`\`javascript
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

  // 3. Data validation
  if (!isValidEmail(data.email)) return errorResponse('Invalid email');
  if (!data.name || data.name.length < 2) return errorResponse('Invalid name');
  if (data.numberOfGuests < 1 || data.numberOfGuests > 10) {
    return errorResponse('Invalid guest count');
  }

  // 4. Save to sheet
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
\`\`\`

## 3. Deploy as Web App

1. Click "Deploy" > "New deployment"
2. Type: Web app
3. Description: "Wedding RSVP endpoint"
4. Execute as: Me
5. Who has access: Anyone
6. Click "Deploy"
7. **Copy the Web app URL**

## 4. Configure Environment Variable

1. Create `.env` file in project root (don't commit!)
2. Add: `NUXT_PUBLIC_APPS_SCRIPT_URL=<paste-your-url-here>`

## 5. Add GitHub Secret

For production deployment:
1. Go to GitHub repo > Settings > Secrets and variables > Actions
2. New repository secret
3. Name: `APPS_SCRIPT_URL`
4. Value: <paste-your-url-here>
```

**Step 2: Verify documentation**

Run: `cat docs/google-apps-script.md`
Expected: Complete setup instructions

**Step 3: Commit**

```bash
git add docs/google-apps-script.md
git commit -m "docs: add Google Apps Script setup guide

Complete step-by-step instructions for:
- Creating Google Sheet with correct columns
- Apps Script code with validation
- Deployment as web app
- Environment variable configuration

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

**Step 4: Follow manual setup**

**MANUAL STEP:** User must:
1. Follow docs/google-apps-script.md
2. Create Google Sheet
3. Deploy Apps Script
4. Create `.env` file with `NUXT_PUBLIC_APPS_SCRIPT_URL`

---

## Task 16: Create GitHub Actions Workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

**Step 1: Create GitHub Actions directory**

Run:
```bash
mkdir -p .github/workflows
```

**Step 2: Create deployment workflow**

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

# Sets permissions for GitHub Pages deployment
permissions:
  contents: read
  pages: write
  id-token: write

# Allow one concurrent deployment
concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Generate static site
        run: npm run generate
        env:
          NUXT_PUBLIC_APPS_SCRIPT_URL: ${{ secrets.APPS_SCRIPT_URL }}

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./.output/public

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Step 3: Verify YAML syntax**

Run:
```bash
cat .github/workflows/deploy.yml | grep -q "name: Deploy to GitHub Pages" && echo "Valid YAML structure"
```
Expected: "Valid YAML structure"

**Step 4: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Actions deployment workflow

- Build on push to main
- Generate static site with Nuxt
- Deploy to GitHub Pages
- Use APPS_SCRIPT_URL secret

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 17: Add Build Script and Test Local Build

**Files:**
- Verify: `package.json` has generate script

**Step 1: Check package.json for generate script**

Run:
```bash
grep "generate" package.json
```
Expected: `"generate": "nuxt generate"`

**Step 2: Test local build**

Run:
```bash
npm run generate
```
Expected: Build completes successfully, output in `.output/public/`

**Step 3: Verify build output**

Run:
```bash
ls -la .output/public/
```
Expected: Contains `nl/`, `en/`, `access/`, `index.html`, etc.

**Step 4: Test production preview**

Run:
```bash
npm run preview
```
Expected: Preview server starts

**Step 5: Test preview in browser**

Visit preview URL (usually http://localhost:3000)
Test:
- Home page (NL/EN)
- Language switcher
- Navigation
- Access code flow
- RSVP page protection

**Note:** RSVP submission will fail without real Apps Script URL in `.env`

---

## Task 18: Create README with Setup Instructions

**Files:**
- Create: `README.md`

**Step 1: Create README**

Create `README.md`:
```markdown
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

\`\`\`bash
npm install
\`\`\`

### 2. Setup Google Sheets

Follow instructions in `docs/google-apps-script.md` to:
1. Create Google Sheet with RSVP columns
2. Deploy Apps Script webhook
3. Get webhook URL

### 3. Configure Environment

Create `.env` file:
\`\`\`
NUXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

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
\`\`\`bash
git push origin main
\`\`\`

GitHub Actions will automatically build and deploy.

## Project Structure

\`\`\`
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
\`\`\`

## Customization

### Update Content

Edit translation files:
- `locales/nl.json` - Dutch content
- `locales/en.json` - English content

### Update Hotels

Edit `pages/accommodation.vue` and replace sample data.

### Change Access Code

Edit `pages/access.vue`, line 22:
\`\`\`typescript
const ACCESS_CODE = 'your-new-code'
\`\`\`

## License

Private project - All rights reserved
\`\`\`

**Step 2: Commit README**

```bash
git add README.md
git commit -m "docs: add README with setup instructions

- Features overview
- Setup guide
- Deployment instructions
- Project structure
- Customization tips

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 19: Final Testing Checklist

**Manual Testing Steps:**

**Step 1: Test Language Switching**
- [ ] Visit `/nl` - Dutch content displays
- [ ] Click EN button - switches to `/en` with English content
- [ ] Click NL button - switches back to `/nl`
- [ ] Language preference persisted via cookie

**Step 2: Test Navigation**
- [ ] All nav links work (Home, RSVP, Accommodation)
- [ ] Navigation visible on all pages
- [ ] Responsive on mobile (hamburger menu if implemented)

**Step 3: Test Access Code Flow**
- [ ] Clear localStorage
- [ ] Visit `/nl/rsvp` - redirects to `/nl/access`
- [ ] Enter wrong code - shows error
- [ ] Enter correct code (`wedding2026`) - redirects to `/nl/rsvp`
- [ ] Refresh RSVP page - stays on RSVP (access persisted)

**Step 4: Test RSVP Form (if Apps Script configured)**
- [ ] Fill form with valid data
- [ ] Submit - success message shows
- [ ] Check Google Sheet - entry appears
- [ ] Try same email again - error: "Email already used"

**Step 5: Test RSVP Form Validation**
- [ ] Submit empty form - HTML5 validation prevents
- [ ] Name < 2 chars - validation error
- [ ] Invalid email - validation error
- [ ] Number of guests < 1 or > 10 - validation error

**Step 6: Test Accommodation Page**
- [ ] Page displays hotel list
- [ ] Links open in new tab
- [ ] Responsive layout

**Step 7: Test Build and Preview**
- [ ] `npm run generate` succeeds
- [ ] `npm run preview` works
- [ ] All routes accessible in preview

**Step 8: Verify Search Engine Blocking**
- [ ] Check `<meta name="robots">` in page source
- [ ] `public/robots.txt` exists and blocks all

---

## Task 20: Merge to Main and Deploy

**Files:**
- Merge: `feature/wedding-website` → `main`

**Step 1: Push feature branch to remote**

Run:
```bash
git push -u origin feature/wedding-website
```

**Step 2: Return to main worktree**

Run:
```bash
cd /Users/sjoerdderoij/Developer/personal/bruiloft
```

**Step 3: Merge feature branch**

Run:
```bash
git merge feature/wedding-website
```

**Step 4: Push to main**

Run:
```bash
git push origin main
```

**Step 5: Monitor GitHub Actions**

1. Go to GitHub repo
2. Actions tab
3. Watch deployment workflow
4. Verify success

**Step 6: Configure GitHub Pages**

1. Go to repo Settings > Pages
2. Source: "GitHub Actions"
3. Wait for deployment to complete

**Step 7: Add APPS_SCRIPT_URL secret**

**MANUAL STEP:** User must:
1. Go to repo Settings > Secrets and variables > Actions
2. New repository secret
3. Name: `APPS_SCRIPT_URL`
4. Value: (Apps Script webhook URL from Task 15)

**Step 8: Trigger redeployment**

If needed, push a small change to trigger new deployment with secret.

**Step 9: Test live site**

Visit: `https://<username>.github.io/<repo-name>/`
Test all features on live site.

---

## Success Criteria

- ✅ Website live on GitHub Pages
- ✅ Bilingual (NL/EN) working
- ✅ RSVP form submits to Google Sheets
- ✅ Access code protection working
- ✅ Mobile responsive
- ✅ No search engine indexing
- ✅ Modern design with animations
- ✅ Deployment < 5 minutes after push

## Post-Deployment Tasks

**Optional enhancements:**
1. Update hotel data in `pages/accommodation.vue`
2. Customize colors in `tailwind.config.ts`
3. Add custom domain (DNS CNAME)
4. Add confetti animation on successful RSVP
5. Customize wedding details in translation files

## Notes

- Access code visible in client JS is acceptable for this use case
- Multi-layer security (UI code + Apps Script validation) provides sufficient protection
- Google Sheet can be monitored manually for spam entries
- GitHub Pages deployment typically takes 2-3 minutes
