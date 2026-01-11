<template>
  <div class="flex space-x-2">
    <button
      v-for="loc in availableLocales"
      :key="loc.code"
      @click="switchLocale(loc.code)"
      :class="[
        'px-3 py-1 rounded-md text-sm font-medium transition-colors',
        locale === loc.code
          ? 'bg-gray-900 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
