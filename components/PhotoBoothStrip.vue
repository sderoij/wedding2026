<template>
  <div class="photo-booth-strip" :class="orientation">
    <div class="strip-container">
      <!-- Photo booth header -->
      <div class="strip-header">
        <div class="strip-holes">
          <div v-for="i in 8" :key="i" class="hole"></div>
        </div>
      </div>

      <!-- Photos -->
      <div class="photos">
        <div
          v-for="(photo, index) in currentPhotos"
          :key="index"
          class="photo-frame"
        >
          <img
            :src="photo"
            :alt="`Photo ${index + 1}`"
            class="photo"
          />
        </div>
      </div>

      <!-- Photo booth footer -->
      <div class="strip-footer">
        <div class="strip-holes">
          <div v-for="i in 8" :key="i" class="hole"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  photos: string[]
  orientation?: 'left' | 'right'
  delay?: number  // Delay in milliseconds before starting rotation
}>()

const orientation = computed(() => props.orientation || 'left')

// Divide photos into 3 subsets (one per frame)
const photoSubsets = computed(() => {
  const photos = props.photos
  if (photos.length === 0) return [[], [], []]

  const subset1: string[] = []
  const subset2: string[] = []
  const subset3: string[] = []

  photos.forEach((photo, index) => {
    if (index % 3 === 0) subset1.push(photo)
    else if (index % 3 === 1) subset2.push(photo)
    else subset3.push(photo)
  })

  return [subset1, subset2, subset3]
})

// Separate index for each frame
const frameIndices = ref([0, 0, 0])

const currentPhotos = computed(() => {
  const subsets = photoSubsets.value
  return [
    subsets[0][frameIndices.value[0] % subsets[0].length] || '',
    subsets[1][frameIndices.value[1] % subsets[1].length] || '',
    subsets[2][frameIndices.value[2] % subsets[2].length] || ''
  ]
})

// Intervals for each frame
const intervals: (NodeJS.Timeout | null)[] = [null, null, null]
const timeouts: (NodeJS.Timeout | null)[] = [null, null, null]

onMounted(() => {
  const subsets = photoSubsets.value

  // Start rotation for each frame that has multiple photos
  subsets.forEach((subset, frameIndex) => {
    if (subset.length > 1) {
      const startRotation = () => {
        intervals[frameIndex] = setInterval(() => {
          frameIndices.value[frameIndex] = (frameIndices.value[frameIndex] + 1) % subset.length
        }, 6000) // 6 seconds per photo
      }

      // Stagger each frame within the strip
      const frameDelay = (props.delay || 0) + (frameIndex * 2000) // 0s, 2s, 4s

      if (frameDelay > 0) {
        timeouts[frameIndex] = setTimeout(startRotation, frameDelay)
      } else {
        startRotation()
      }
    }
  })
})

onUnmounted(() => {
  intervals.forEach(interval => {
    if (interval) clearInterval(interval)
  })
  timeouts.forEach(timeout => {
    if (timeout) clearTimeout(timeout)
  })
})
</script>

<style scoped>
.photo-booth-strip {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}

.strip-container {
  background: white;
  padding: 1.5rem 1rem;
  box-shadow: 0 8px 24px rgba(47, 79, 62, 0.15);
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  position: relative;
}

.strip-header,
.strip-footer {
  margin-bottom: 1rem;
}

.strip-footer {
  margin-top: 1rem;
  margin-bottom: 0;
}

.strip-holes {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0 0.5rem;
}

.hole {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2F4F3E;
  opacity: 0.3;
}

.photos {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.photo-frame {
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: #F6F5F1;
  border: 2px solid #2F4F3E;
  border-radius: 2px;
}

.photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.5s ease-in-out;
  filter: grayscale(100%);
}

/* Rotation based on orientation */
.photo-booth-strip.left .strip-container {
  transform: rotate(-3deg);
  transition: transform 0.3s ease;
}

.photo-booth-strip.right .strip-container {
  transform: rotate(3deg);
  transition: transform 0.3s ease;
}

.photo-booth-strip.left .strip-container:hover {
  transform: rotate(-1deg);
}

.photo-booth-strip.right .strip-container:hover {
  transform: rotate(1deg);
}
</style>
