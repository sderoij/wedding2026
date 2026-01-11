<template>
  <div class="min-h-screen textured-bg">
    <Navigation />

    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Hero Section -->
      <section class="text-center mb-16 animate-fade-in">
        <h1 class="text-5xl md:text-6xl font-bold text-forest-dark mb-6 decorative-line pb-4">
          {{ $t('home.title') }}
        </h1>
        <p class="text-2xl md:text-3xl text-forest-sage mb-8">
          {{ $t('home.subtitle') }}
        </p>
      </section>

      <!-- Location Section -->
      <section class="mb-12 bg-warmwhite rounded-xl shadow-sm p-8 border border-forest-sage/20">
        <h2 class="text-3xl font-semibold text-forest-dark mb-4">
          {{ $t('home.location.title') }}
        </h2>
        <p class="text-lg text-forest-dark/80">
          <strong class="text-gold">{{ $t('home.location.venue') }}</strong>
        </p>
        <p class="text-forest-sage">{{ $t('home.location.address') }}</p>
      </section>

      <!-- Schedule Section -->
      <section class="mb-12 bg-warmwhite rounded-xl shadow-sm p-8 border border-forest-sage/20">
        <h2 class="text-3xl font-semibold text-forest-dark mb-4">
          {{ $t('home.schedule.title') }}
        </h2>
        <ul class="space-y-2 text-lg text-forest-dark/80">
          <li class="flex items-center">
            <span class="text-gold mr-2">•</span>
            {{ $t('home.schedule.ceremony') }}
          </li>
          <li class="flex items-center">
            <span class="text-gold mr-2">•</span>
            {{ $t('home.schedule.reception') }}
          </li>
          <li class="flex items-center">
            <span class="text-gold mr-2">•</span>
            {{ $t('home.schedule.dinner') }}
          </li>
          <li class="flex items-center">
            <span class="text-gold mr-2">•</span>
            {{ $t('home.schedule.party') }}
          </li>
        </ul>
      </section>

      <!-- CTA Section -->
      <section class="text-center">
        <p class="text-xl text-forest-dark/80 mb-6">
          {{ $t('home.rsvpCta') }}
        </p>
        <NuxtLink
          :to="localePath('/rsvp')"
          class="inline-block bg-forest-dark text-warmwhite px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gold transition-colors shadow-md"
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
