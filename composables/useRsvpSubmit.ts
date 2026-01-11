export interface RsvpFormData {
  name: string
  numberOfGuests: number
  email: string
  dietaryRequirements: string
  attending: boolean
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

      // Prepare payload
      const payload = {
        name: formData.name,
        numberOfGuests: formData.numberOfGuests,
        email: formData.email,
        dietaryRequirements: formData.dietaryRequirements,
        attending: formData.attending,
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
