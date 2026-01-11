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
