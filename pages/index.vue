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
