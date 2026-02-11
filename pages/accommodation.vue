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
            <p class="price">
              {{ t('accommodation.price') }}: {{ hotel.price }}
              <template v-if="hotel.priceType"> {{ t(`accommodation.${hotel.priceType}`) }}</template>
              <template v-if="hotel.priceNote"> ({{ t(`accommodation.${hotel.priceNote}`) }})</template>
            </p>
            <p v-if="hotel.note" class="note">{{ t(`accommodation.${hotel.note}`) }}</p>
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
    distance: '~1.5 km',
    price: '€65-105',
    image: 'https://www.hoteloudlondon.nl/data/images/1/5/7/0/4/3/homepage-oudlondon1.jpg',
    website: 'https://www.hoteloudlondon.nl/en/'
  },
  {
    id: 2,
    name: 'Hotel Woudschoten',
    distance: '~2 km',
    price: '€120+',
    image: 'https://www.woudschoten.nl/wp-content/uploads/2018/08/Woudschoten-Atriumkamer-.jpg',
    website: 'https://www.woudschoten.nl/en/'
  },
  {
    id: 3,
    name: 'Vakantiepark De Krakeling',
    distance: '~2 km',
    price: '€80-90',
    priceType: 'perCampingPitch',
    priceNote: 'minimum2Nights',
    note: 'bungalowsAvailable',
    image: 'https://www.dekrakeling.nl/assets/photogallery/9485/239022.jpg',
    website: 'https://www.dekrakeling.nl/en'
  },
  {
    id: 4,
    name: 'Kasteel Kerckebosch',
    distance: '~5 km',
    price: '€135+',
    image: 'https://www.kasteelkerckebosch.com/upload/heading/home-1500x1000_38.jpg',
    website: 'https://www.kasteelkerckebosch.com/en/'
  },
  {
    id: 5,
    name: 'RCN het Grote Bos',
    distance: '~6 km',
    price: '~€25+',
    priceType: 'perCampingPitch',
    note: 'bungalowsAvailable',
    image: 'https://d12lbzksufiz5y.cloudfront.net/files/7/1/1/4/2/1/RCN-het-Grote-Bos-vakantiepark-Utrechtse-Heuvelrug-gezin-natuur(3).jpg',
    website: 'https://www.rcn.nl/en/holiday-park/holland/utrecht/rcn-het-grote-bos'
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

.note {
  margin: 0.25rem 0 0;
  color: #8FAE9A;
  font-size: 0.9em;
  font-style: italic;
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
