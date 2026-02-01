export interface SavedGuest {
  name: string
  email?: string
  dietary: string
}

export interface SavedRsvpResponse {
  code: string
  attending: boolean
  guests: SavedGuest[]
  submittedAt: string
}

const STORAGE_KEY = 'wedding_rsvp_response'

export const useRsvpStorage = () => {
  /**
   * Get saved RSVP response for a specific code
   */
  const getSavedResponse = (code: string): SavedRsvpResponse | null => {
    if (!process.client) return null

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return null

      const response = JSON.parse(stored) as SavedRsvpResponse

      // Only return if the code matches
      if (response.code === code) {
        return response
      }

      return null
    } catch {
      return null
    }
  }

  /**
   * Save RSVP response to localStorage
   */
  const saveResponse = (code: string, attending: boolean, guests: SavedGuest[]): void => {
    if (!process.client) return

    const response: SavedRsvpResponse = {
      code,
      attending,
      guests,
      submittedAt: new Date().toISOString()
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(response))
  }

  /**
   * Clear saved RSVP response
   */
  const clearResponse = (): void => {
    if (!process.client) return
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    getSavedResponse,
    saveResponse,
    clearResponse
  }
}
