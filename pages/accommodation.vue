<template>
  <div class="accommodation-page">
    <h1>{{ t('accommodation.title') }}</h1>
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
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Sample hotel data - replace with real data
const hotels = [
  {
    id: 1,
    name: 'Hotel Example 1',
    distance: '2 km',
    price: '€100-150',
    image: 'https://via.placeholder.com/400x300',
    website: 'https://example.com'
  },
  {
    id: 2,
    name: 'Hotel Example 2',
    distance: '3 km',
    price: '€80-120',
    image: 'https://via.placeholder.com/400x300',
    website: 'https://example.com'
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
}

.description {
  text-align: center;
  color: #666;
  margin-bottom: 3rem;
}

.hotels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.hotel-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
}

.hotel-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
}

.distance,
.price {
  margin: 0.5rem 0;
  color: #666;
}

.website-link {
  display: inline-block;
  margin-top: 1rem;
  color: #007bff;
  text-decoration: none;
}

.website-link:hover {
  text-decoration: underline;
}
</style>
