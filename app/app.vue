<script setup lang="ts">
import logoUrl from '~/assets/img/logo.svg'

// Imported (not /public) so the URL respects app.baseURL on GitHub Pages.
useHead({
  htmlAttrs: { lang: 'en' },
  titleTemplate: title => (title ? `${title} · Movie App` : 'Movie App'),
  link: [{ rel: 'icon', type: 'image/svg+xml', href: logoUrl }]
})
useSeoMeta({ description: 'Search and browse movies powered by TMDB.' })
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
