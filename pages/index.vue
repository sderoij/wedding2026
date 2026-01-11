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
            <PhotoBoothStrip :photos="photosRight" orientation="right" :delay="2000" />
          </div>
        </div>
      </section>

      <!-- More Info Section -->
      <section class="mb-12 text-center">
        <p class="text-xl text-forest-sage italic">
          {{ $t('home.moreInfo') }} 🐧
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

// Left strip photos
const photosLeft = ref([
  '/wedding2026/images/image00001.jpeg',
  '/wedding2026/images/image00002.jpeg',
  '/wedding2026/images/image00003.jpeg',
  '/wedding2026/images/image00004.jpeg',
  '/wedding2026/images/image00005.jpeg',
  '/wedding2026/images/image00006.jpeg',
  '/wedding2026/images/image00007.jpeg',
  '/wedding2026/images/image00008.jpeg',
  '/wedding2026/images/image00009.jpeg',
  '/wedding2026/images/image00010.jpeg',
  '/wedding2026/images/image00011.jpeg',
  '/wedding2026/images/image00012.jpeg',
  '/wedding2026/images/image00013.jpeg'
])

// Right strip photos
const photosRight = ref([
  '/wedding2026/images/image00014.jpeg',
  '/wedding2026/images/image00015.jpeg',
  '/wedding2026/images/image00016.jpeg',
  '/wedding2026/images/image00017.jpeg',
  '/wedding2026/images/image00018.jpeg',
  '/wedding2026/images/image00019.jpeg',
  '/wedding2026/images/image00020.jpeg',
  '/wedding2026/images/image00021.jpeg',
  '/wedding2026/images/image00022.jpeg',
  '/wedding2026/images/image00023.jpeg',
  '/wedding2026/images/image00024.jpeg',
  '/wedding2026/images/image00025.jpeg',
  '/wedding2026/images/IMG_1113.jpg'
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
