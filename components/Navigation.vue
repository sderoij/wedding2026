<template>
  <nav class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo/Title -->
        <div class="flex-shrink-0">
          <NuxtLink :to="localePath('/')" class="text-xl font-semibold text-gray-900">
            {{ $t('home.title') }}
          </NuxtLink>
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:flex space-x-8">
          <NuxtLink
            :to="localePath('/')"
            class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            {{ $t('nav.home') }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/rsvp')"
            class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            {{ $t('nav.rsvp') }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/accommodation')"
            class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            {{ $t('nav.accommodation') }}
          </NuxtLink>
        </div>

        <!-- Language Switcher -->
        <LanguageSwitcher />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
</script>
