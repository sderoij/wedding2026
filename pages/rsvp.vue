<template>
  <div class="min-h-screen textured-bg">
    <Navigation />

    <main class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-warmwhite rounded-xl shadow-sm p-8 border border-forest-sage/20">
        <h1 class="text-4xl font-bold text-forest-dark mb-4 decorative-line pb-3">
          {{ $t('rsvp.title') }}
        </h1>

        <!-- Welcome Message -->
        <p v-if="currentGuest" class="text-xl text-gold mb-4">
          {{ $t('rsvp.welcome', { name: currentGuest.name }) }}
        </p>

        <!-- Summary View (when has saved response and not editing) -->
        <div v-if="savedResponse && !isEditing" class="space-y-6">
          <!-- Success Message (shown briefly after submit) -->
          <div v-if="submitSuccess" class="p-4 bg-forest-sage/20 border border-forest-sage rounded-lg">
            <p class="text-forest-dark">{{ $t('rsvp.success') }}</p>
          </div>

          <!-- Status Banner -->
          <div
            :class="[
              'p-4 rounded-lg border',
              savedResponse.attending
                ? 'bg-forest-sage/20 border-forest-sage'
                : 'bg-gray-100 border-gray-300'
            ]"
          >
            <p class="text-lg font-semibold text-forest-dark">
              {{ savedResponse.attending ? $t('rsvp.summary.confirmedTitle') : $t('rsvp.summary.declinedTitle') }}
            </p>
          </div>

          <!-- Guest Details (only if attending) -->
          <div v-if="savedResponse.attending" class="space-y-4">
            <h3 class="text-lg font-semibold text-forest-dark">
              {{ $t('rsvp.summary.guests') }}
            </h3>
            <ul class="space-y-2">
              <li
                v-for="(guest, index) in savedResponse.guests"
                :key="index"
                class="flex items-start gap-2 text-forest-dark/80"
              >
                <span class="text-gold">•</span>
                <div>
                  <span class="font-medium">{{ guest.name }}</span>
                  <span v-if="guest.email" class="text-forest-sage ml-2">({{ guest.email }})</span>
                  <span v-if="guest.dietary" class="block text-sm text-forest-sage italic">
                    {{ guest.dietary }}
                  </span>
                </div>
              </li>
            </ul>
          </div>

          <!-- Edit Button -->
          <button
            @click="startEditing"
            class="w-full bg-forest-dark text-warmwhite px-6 py-3 rounded-lg font-semibold hover:bg-gold transition-colors"
          >
            {{ $t('rsvp.summary.edit') }}
          </button>
        </div>

        <!-- Form View (no saved response, or editing) -->
        <template v-else>
          <p class="text-forest-sage mb-8">
            {{ $t('rsvp.description') }}
          </p>

          <!-- Error Message -->
          <div v-if="submitError" class="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg">
            <p class="text-red-800">
              {{ submitError === 'Email already used' ? $t('rsvp.errorEmailUsed') : $t('rsvp.error') }}
            </p>
          </div>

          <!-- RSVP Form -->
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Number of Guests -->
            <div>
              <label for="guests" class="block text-sm font-medium text-forest-dark mb-1">
                {{ $t('rsvp.form.numberOfGuests') }}*
              </label>
              <select
                id="guests"
                v-model.number="formData.numberOfGuests"
                class="w-full px-4 py-2 border border-forest-sage/30 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white"
                required
              >
                <option v-for="n in maxGuests" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>

            <!-- Dynamic Guest Fields -->
            <div v-for="(guest, index) in formData.guests" :key="index" class="border border-forest-sage/20 rounded-lg p-6 bg-white/50">
              <h3 class="text-lg font-semibold text-forest-dark mb-4">
                {{ index === 0 ? $t('rsvp.form.guestNumberYou', { number: index + 1 }) : $t('rsvp.form.guestNumber', { number: index + 1 }) }}
              </h3>

              <!-- Guest Name -->
              <div class="mb-4">
                <label :for="`guest-name-${index}`" class="block text-sm font-medium text-forest-dark mb-1">
                  {{ $t('rsvp.form.guestName') }}*
                </label>
                <input
                  :id="`guest-name-${index}`"
                  v-model="guest.name"
                  type="text"
                  :placeholder="$t('rsvp.form.guestNamePlaceholder', { number: index + 1 })"
                  class="w-full px-4 py-2 border border-forest-sage/30 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white"
                  required
                  minlength="2"
                />
              </div>

              <!-- Email (only for first guest) -->
              <div v-if="index === 0" class="mb-4">
                <label for="email" class="block text-sm font-medium text-forest-dark mb-1">
                  {{ $t('rsvp.form.email') }}*
                </label>
                <input
                  id="email"
                  v-model="guest.email"
                  type="email"
                  :placeholder="$t('rsvp.form.emailPlaceholder')"
                  class="w-full px-4 py-2 border border-forest-sage/30 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white"
                  required
                />
              </div>

              <!-- Dietary Requirements -->
              <div>
                <label :for="`guest-dietary-${index}`" class="block text-sm font-medium text-forest-dark mb-1">
                  {{ $t('rsvp.form.guestDietary') }}
                </label>
                <textarea
                  :id="`guest-dietary-${index}`"
                  v-model="guest.dietary"
                  :placeholder="$t('rsvp.form.guestDietaryPlaceholder')"
                  rows="2"
                  class="w-full px-4 py-2 border border-forest-sage/30 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white"
                ></textarea>
              </div>
            </div>

            <!-- Attending -->
            <div>
              <label class="block text-sm font-medium text-forest-dark mb-2">
                {{ $t('rsvp.form.attending') }}*
              </label>
              <div class="space-y-2">
                <label class="flex items-center text-forest-dark/80">
                  <input
                    v-model="formData.attending"
                    type="radio"
                    :value="true"
                    class="mr-2 text-gold focus:ring-gold"
                    required
                  />
                  <span>{{ $t('rsvp.form.attendingYes') }}</span>
                </label>
                <label class="flex items-center text-forest-dark/80">
                  <input
                    v-model="formData.attending"
                    type="radio"
                    :value="false"
                    class="mr-2 text-gold focus:ring-gold"
                    required
                  />
                  <span>{{ $t('rsvp.form.attendingNo') }}</span>
                </label>
              </div>
            </div>

            <!-- Honeypot field (hidden) -->
            <input
              v-model="formData.website"
              type="text"
              name="website"
              style="display: none"
              tabindex="-1"
              autocomplete="off"
            />

            <!-- Form Buttons -->
            <div class="flex gap-4">
              <!-- Cancel button (only when editing) -->
              <button
                v-if="isEditing"
                type="button"
                @click="cancelEditing"
                class="flex-1 bg-gray-200 text-forest-dark px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                {{ $t('rsvp.form.cancel') }}
              </button>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="isSubmitting"
                :class="[
                  'px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
                  isEditing ? 'flex-1' : 'w-full',
                  'bg-forest-dark text-warmwhite hover:bg-gold'
                ]"
              >
                {{ isSubmitting ? $t('rsvp.form.submitting') : $t('rsvp.form.submit') }}
              </button>
            </div>
          </form>
        </template>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { Guest } from '~/composables/useRsvpSubmit'
import type { SavedRsvpResponse } from '~/composables/useRsvpStorage'

definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const { isSubmitting, submitError, submitSuccess, submitRsvp, resetState } = useRsvpSubmit()
const { currentGuest, currentCode, loadFromStorage } = useGuestCode()
const { getSavedResponse } = useRsvpStorage()

// State
const isEditing = ref(false)
const savedResponse = ref<SavedRsvpResponse | null>(null)

// Ensure guest data is loaded
onMounted(() => {
  loadFromStorage()
  // Load saved response after code is loaded
  nextTick(() => {
    if (currentCode.value) {
      savedResponse.value = getSavedResponse(currentCode.value)
    }
  })
})

// Get max guests from current guest data (fallback to 1)
const maxGuests = computed(() => currentGuest.value?.maxGuests ?? 1)

const formData = ref({
  numberOfGuests: 1,
  attending: true,
  guests: [
    { name: '', email: '', dietary: '' }
  ] as Guest[],
  website: '' // Honeypot
})

// Pre-fill first guest name when currentGuest is loaded (only if no saved response)
watch(currentGuest, (guest) => {
  if (guest && formData.value.guests[0] && !formData.value.guests[0].name && !savedResponse.value) {
    formData.value.guests[0].name = guest.name
  }
}, { immediate: true })

// Watch numberOfGuests and adjust guests array
watch(() => formData.value.numberOfGuests, (newCount, oldCount) => {
  const currentGuests = formData.value.guests

  if (newCount > oldCount) {
    // Add new guests
    for (let i = oldCount; i < newCount; i++) {
      currentGuests.push({ name: '', dietary: '' })
    }
  } else if (newCount < oldCount) {
    // Remove excess guests
    currentGuests.splice(newCount)
  }
})

const startEditing = () => {
  if (savedResponse.value) {
    // Pre-fill form with saved data
    formData.value.attending = savedResponse.value.attending
    formData.value.numberOfGuests = savedResponse.value.guests.length
    formData.value.guests = savedResponse.value.guests.map(g => ({
      name: g.name,
      email: g.email || '',
      dietary: g.dietary
    }))
  }
  isEditing.value = true
  resetState()
}

const cancelEditing = () => {
  isEditing.value = false
  resetState()
}

const handleSubmit = async () => {
  if (!currentCode.value) return
  await submitRsvp(formData.value, currentCode.value)

  // If successful, update savedResponse and show summary
  if (submitSuccess.value && currentCode.value) {
    savedResponse.value = getSavedResponse(currentCode.value)
    isEditing.value = false
  }
}
</script>
