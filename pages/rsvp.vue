<template>
  <div class="min-h-screen textured-bg">
    <Navigation />

    <main class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-warmwhite rounded-xl shadow-sm p-8 border border-forest-sage/20">
        <h1 class="text-4xl font-bold text-forest-dark mb-4 decorative-line pb-3">
          {{ $t('rsvp.title') }}
        </h1>
        <p class="text-forest-sage mb-8">
          {{ $t('rsvp.description') }}
        </p>

        <!-- Success Message -->
        <div v-if="submitSuccess" class="mb-6 p-4 bg-forest-sage/20 border border-forest-sage rounded-lg">
          <p class="text-forest-dark">{{ $t('rsvp.success') }}</p>
        </div>

        <!-- Error Message -->
        <div v-if="submitError" class="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg">
          <p class="text-red-800">
            {{ submitError === 'Email already used' ? $t('rsvp.errorEmailUsed') : $t('rsvp.error') }}
          </p>
        </div>

        <!-- RSVP Form -->
        <form v-if="!submitSuccess" @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-forest-dark mb-1">
              {{ $t('rsvp.form.name') }}*
            </label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              :placeholder="$t('rsvp.form.namePlaceholder')"
              class="w-full px-4 py-2 border border-forest-sage/30 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white"
              required
              minlength="2"
            />
          </div>

          <!-- Number of Guests -->
          <div>
            <label for="guests" class="block text-sm font-medium text-forest-dark mb-1">
              {{ $t('rsvp.form.numberOfGuests') }}*
            </label>
            <input
              id="guests"
              v-model.number="formData.numberOfGuests"
              type="number"
              min="1"
              max="10"
              class="w-full px-4 py-2 border border-forest-sage/30 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white"
              required
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-forest-dark mb-1">
              {{ $t('rsvp.form.email') }}*
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              :placeholder="$t('rsvp.form.emailPlaceholder')"
              class="w-full px-4 py-2 border border-forest-sage/30 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white"
              required
            />
          </div>

          <!-- Dietary Requirements -->
          <div>
            <label for="dietary" class="block text-sm font-medium text-forest-dark mb-1">
              {{ $t('rsvp.form.dietaryRequirements') }}
            </label>
            <textarea
              id="dietary"
              v-model="formData.dietaryRequirements"
              :placeholder="$t('rsvp.form.dietaryPlaceholder')"
              rows="3"
              class="w-full px-4 py-2 border border-forest-sage/30 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent bg-white"
            ></textarea>
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

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full bg-forest-dark text-warmwhite px-6 py-3 rounded-lg font-semibold hover:bg-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? $t('rsvp.form.submitting') : $t('rsvp.form.submit') }}
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const { isSubmitting, submitError, submitSuccess, submitRsvp } = useRsvpSubmit()

const formData = ref({
  name: '',
  numberOfGuests: 1,
  email: '',
  dietaryRequirements: '',
  attending: true,
  website: '' // Honeypot
})

const handleSubmit = async () => {
  await submitRsvp(formData.value)
}
</script>
