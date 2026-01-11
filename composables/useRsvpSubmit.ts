export interface Guest {
  name: string
  email?: string  // Only first guest has email
  dietary: string
}

export interface RsvpFormData {
  numberOfGuests: number
  attending: boolean
  guests: Guest[]
  website?: string // Honeypot field
}

export const useRsvpSubmit = () => {
  const config = useRuntimeConfig()
  const { locale } = useI18n()

  const isSubmitting = ref(false)
  const submitError = ref<string | null>(null)
  const submitSuccess = ref(false)

  const submitRsvp = async (formData: RsvpFormData) => {
    isSubmitting.value = true
    submitError.value = null
    submitSuccess.value = false

    try {
      // Check honeypot
      if (formData.website) {
        throw new Error('Invalid submission')
      }

      // Validate guest count matches array length
      if (formData.guests.length !== formData.numberOfGuests) {
        throw new Error('Guest count mismatch')
      }

      // Validate all guests have names (minimum 2 characters)
      for (let i = 0; i < formData.guests.length; i++) {
        const guest = formData.guests[i]
        if (!guest.name || guest.name.trim().length < 2) {
          throw new Error(`Guest ${i + 1} name is required (minimum 2 characters)`)
        }
      }

      // Validate first guest has valid email (contains '@')
      if (formData.guests.length > 0) {
        const firstGuest = formData.guests[0]
        if (!firstGuest.email || !firstGuest.email.includes('@')) {
          throw new Error('Valid email is required for the first guest')
        }
      }

      // Prepare payload
      const payload = {
        numberOfGuests: formData.numberOfGuests,
        attending: formData.attending,
        guests: formData.guests,
        locale: locale.value
      }

      // Submit to Google Apps Script
      const response = await $fetch(config.public.appsScriptUrl, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const result = response as { success: boolean; error?: string }

      if (result.success) {
        submitSuccess.value = true
      } else {
        submitError.value = result.error || 'Unknown error'
      }
    } catch (err: any) {
      console.error('RSVP submission error:', err)
      submitError.value = err.message || 'Network error'
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    isSubmitting,
    submitError,
    submitSuccess,
    submitRsvp
  }
}
