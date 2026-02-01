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

      // Prepare payload with email and language at root level (as Apps Script expects)
      const payload = {
        email: formData.guests[0].email,
        language: locale.value,
        attending: formData.attending,
        guests: formData.guests
      }

      // Submit to Google Apps Script using no-cors mode
      // Google Apps Script web apps have CORS issues, but the request still goes through
      // With no-cors we can't read the response, but we assume success if no network error
      await fetch(config.public.appsScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'text/plain'
        }
      })

      // If we reach here without throwing, assume success
      // (we can't read the response with no-cors mode)
      submitSuccess.value = true
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
