export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client side
  if (process.client) {
    const hasAccess = localStorage.getItem('wedding_access')

    if (!hasAccess) {
      // Redirect to access page with return URL
      return navigateTo({
        path: '/access',
        query: { redirect: to.fullPath }
      })
    }
  }
})
