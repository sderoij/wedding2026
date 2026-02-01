import guestsData from '~/data/guests.json'

const STORAGE_KEY = 'wedding_guest_code'

export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client side
  if (!process.client) return

  const guests = guestsData as Record<string, { name: string; maxGuests: number }>

  // Check for code in URL parameter
  const urlCode = to.query.code as string | undefined
  if (urlCode) {
    const normalizedCode = urlCode.toLowerCase().trim()
    if (guests[normalizedCode]) {
      // Valid code - save to localStorage
      localStorage.setItem(STORAGE_KEY, normalizedCode)

      // Remove code from URL (clean redirect)
      const newQuery = { ...to.query }
      delete newQuery.code
      return navigateTo({
        path: to.path,
        query: Object.keys(newQuery).length > 0 ? newQuery : undefined
      })
    }
  }

  // Check localStorage for existing code
  const storedCode = localStorage.getItem(STORAGE_KEY)
  if (storedCode && guests[storedCode]) {
    // Already authenticated
    return
  }

  // No valid code - redirect to access page
  return navigateTo({
    path: '/access',
    query: { redirect: to.fullPath }
  })
})
