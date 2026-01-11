<template>
  <div class="min-h-screen textured-bg">
    <Navigation />

    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Hero Section -->
      <section class="text-center mb-12 animate-fade-in">
        <h1 class="text-5xl md:text-6xl font-bold text-forest-dark mb-6 decorative-line pb-4">
          {{ $t('home.title') }}
        </h1>
        <p class="text-2xl md:text-3xl text-gold mb-8">
          {{ $t('home.subtitle') }}
        </p>
        <p class="text-lg text-forest-dark/80 max-w-2xl mx-auto leading-relaxed">
          {{ $t('home.intro') }}
        </p>
      </section>

      <!-- Photo Booth Strips -->
      <section class="mb-12">
        <div class="photo-strips-container">
          <div class="strip-wrapper left-strip">
            <PhotoBoothStrip :photos="photosLeft" orientation="left" />
          </div>
          <div class="strip-wrapper right-strip hidden md:block">
            <PhotoBoothStrip :photos="photosRight" orientation="right" />
          </div>
        </div>
      </section>

      <!-- More Info Section -->
      <section class="mb-12 text-center">
        <p class="text-xl text-forest-sage italic">
          {{ $t('home.moreInfo') }}
        </p>
      </section>

      <!-- Location Section (for when confirmed) -->
      <!--
      <section class="mb-12 bg-warmwhite rounded-xl shadow-sm p-8 border border-forest-sage/20 text-center">
        <h2 class="text-3xl font-semibold text-forest-dark mb-4">
          {{ $t('home.location.title') }}
        </h2>
        <p class="text-2xl text-gold mb-2">
          Beauforthuis
        </p>
        <p class="text-lg text-forest-sage">Bergweg 6, 3927 BK Austerlitz</p>
      </section>
      -->

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

// Placeholder photos - replace with actual photos later
// Left strip photos
const photosLeft = ref([
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=300&fit=crop'
])

// Right strip photos
const photosRight = ref([
  'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400&h=300&fit=crop'
])
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

.photo-strips-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0;
  position: relative;
  min-height: 500px;
}

.strip-wrapper {
  position: relative;
  z-index: 1;
}

.left-strip {
  margin-right: -3rem;
  margin-top: 1rem;
}

.right-strip {
  margin-left: -3rem;
  margin-top: -1rem;
  z-index: 2;
}

/* On mobile, center the single strip */
@media (max-width: 768px) {
  .photo-strips-container {
    min-height: 450px;
  }

  .left-strip {
    margin-right: 0;
    margin-top: 0;
  }
}
</style>
