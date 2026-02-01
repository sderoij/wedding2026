import guestsData from '~/data/guests.json'

export interface GuestData {
  name: string
  maxGuests: number
}

type GuestsMap = Record<string, GuestData>

const STORAGE_KEY = 'wedding_guest_code'

export const useGuestCode = () => {
  const guests = guestsData as GuestsMap
  const currentCode = ref<string | null>(null)
  const currentGuest = ref<GuestData | null>(null)

  // Load from localStorage on client
  const loadFromStorage = () => {
    if (process.client) {
      const storedCode = localStorage.getItem(STORAGE_KEY)
      if (storedCode && guests[storedCode]) {
        currentCode.value = storedCode
        currentGuest.value = guests[storedCode]
      }
    }
  }

  // Validate a code against the guest list
  const validateCode = (code: string): GuestData | null => {
    const normalizedCode = code.toLowerCase().trim()
    return guests[normalizedCode] || null
  }

  // Save a valid code to localStorage
  const saveCode = (code: string): boolean => {
    const normalizedCode = code.toLowerCase().trim()
    const guest = guests[normalizedCode]

    if (guest && process.client) {
      localStorage.setItem(STORAGE_KEY, normalizedCode)
      currentCode.value = normalizedCode
      currentGuest.value = guest
      return true
    }
    return false
  }

  // Clear the stored code (logout)
  const clearCode = () => {
    if (process.client) {
      localStorage.removeItem(STORAGE_KEY)
      // Also remove legacy key
      localStorage.removeItem('wedding_access')
    }
    currentCode.value = null
    currentGuest.value = null
  }

  // Check if authenticated
  const isAuthenticated = computed(() => currentCode.value !== null)

  // Initialize on creation
  loadFromStorage()

  return {
    guests,
    currentCode: readonly(currentCode),
    currentGuest: readonly(currentGuest),
    isAuthenticated,
    validateCode,
    saveCode,
    clearCode,
    loadFromStorage
  }
}
