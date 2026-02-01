<template>
  <div class="min-h-screen textured-bg">
    <Navigation />
    <div class="accommodation-page">
      <h1 class="decorative-line pb-4">{{ t('accommodation.title') }}</h1>
      <p class="description">{{ t('accommodation.description') }}</p>

      <div class="hotels-grid">
        <div v-for="hotel in hotels" :key="hotel.id" class="hotel-card">
          <img :src="hotel.image" :alt="hotel.name" class="hotel-image" />
          <div class="hotel-info">
            <h3>{{ hotel.name }}</h3>
            <p class="distance">{{ t('accommodation.distance') }}: {{ hotel.distance }}</p>
            <p class="price">{{ t('accommodation.price') }}: {{ hotel.price }}</p>
            <a :href="hotel.website" target="_blank" rel="noopener" class="website-link">
              {{ t('accommodation.visitWebsite') }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()

const hotels = [
  {
    id: 1,
    name: 'Fletcher Hotel-Restaurant Oud London',
    distance: '~6 km',
    price: '€65-105',
    image: 'https://picsum.photos/seed/oudlondon/400/300',
    website: 'https://www.hoteloudlondon.nl/en/'
  },
  {
    id: 2,
    name: 'Hotel Woudschoten',
    distance: '~8 km',
    price: '€98+',
    image: 'https://picsum.photos/seed/woudschoten/400/300',
    website: 'https://www.woudschoten.nl/en/'
  },
  {
    id: 3,
    name: 'Kasteel Kerckebosch',
    distance: '~7 km',
    price: '€150+',
    image: 'https://picsum.photos/seed/kerckebosch/400/300',
    website: 'https://www.hotelkerckebosch.nl/'
  },
  {
    id: 4,
    name: 'Logies op Dreef',
    distance: '~10 km',
    price: '€86+',
    image: 'https://picsum.photos/seed/dreef/400/300',
    website: 'https://logiesopdreef.nl/en/'
  },
  {
    id: 5,
    name: 'Vakantiepark De Krakeling',
    distance: '~5 km',
    price: 'Variabel',
    image: 'https://picsum.photos/seed/krakeling/400/300',
    website: 'https://www.dekrakeling.nl/'
  }
]
</script>

<style scoped>
.accommodation-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  margin-bottom: 1rem;
  color: #2F4F3E;
}

.description {
  text-align: center;
  color: #8FAE9A;
  margin-bottom: 3rem;
}

.hotels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.hotel-card {
  border: 1px solid rgba(143, 174, 154, 0.2);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  background-color: #F6F5F1;
}

.hotel-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(47, 79, 62, 0.15);
}

.hotel-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.hotel-info {
  padding: 1.5rem;
}

.hotel-info h3 {
  margin: 0 0 1rem 0;
  color: #2F4F3E;
}

.distance,
.price {
  margin: 0.5rem 0;
  color: #8FAE9A;
}

.website-link {
  display: inline-block;
  margin-top: 1rem;
  color: #B08A57;
  text-decoration: none;
  font-weight: 500;
}

.website-link:hover {
  text-decoration: underline;
}
</style>
