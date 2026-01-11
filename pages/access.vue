<template>
  <div class="min-h-screen textured-bg">
    <Navigation />

    <main class="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-warmwhite rounded-xl shadow-sm p-8 border border-forest-sage/20">
        <h1 class="text-3xl font-bold text-forest-dark mb-4 decorative-line pb-3">
          {{ $t('access.title') }}
        </h1>
        <p class="text-forest-sage mb-6">
          {{ $t('access.description') }}
        </p>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <input
              v-model="code"
              type="text"
              :placeholder="$t('access.codePlaceholder')"
              class="w-full px-4 py-2 border border-forest-sage/30 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white"
              required
            />
          </div>

          <p v-if="error" class="text-red-600 text-sm">
            {{ $t('access.error') }}
          </p>

          <button
            type="submit"
            class="w-full bg-forest-dark text-warmwhite px-6 py-3 rounded-lg font-semibold hover:bg-gold transition-colors"
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
