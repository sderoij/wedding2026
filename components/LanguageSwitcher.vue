<template>
  <div class="flex space-x-2">
    <button
      v-for="loc in availableLocales"
      :key="loc.code"
      @click="switchLocale(loc.code)"
      :class="[
        'px-3 py-1 rounded-md text-sm font-medium transition-colors',
        locale === loc.code
          ? 'bg-forest-dark text-warmwhite'
          : 'bg-forest-sage/20 text-forest-dark hover:bg-forest-sage/30'
      ]"
    >
      {{ loc.code.toUpperCase() }}
    </button>
  </div>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const availableLocales = computed(() => {
  return (locales.value as any[]).filter(loc => loc.code !== locale.value)
    .concat((locales.value as any[]).filter(loc => loc.code === locale.value))
})

const switchLocale = (newLocale: string) => {
  setLocale(newLocale as 'nl' | 'en')
}
</script>
