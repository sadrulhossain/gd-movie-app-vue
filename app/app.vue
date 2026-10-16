<script setup lang="ts">
import logoUrl from '~/assets/img/logo.svg'

// Dark is the default. This tiny inline script adds the `light` class before the first paint when the
// visitor chose light earlier, so the page never flashes the wrong theme.
const themeScript = `try{if(localStorage.getItem('${THEME_STORAGE_KEY}')==='light')document.documentElement.classList.add('light')}catch(e){}`

// Imported (not /public) so the URL respects app.baseURL on GitHub Pages.
useHead({
  htmlAttrs: { lang: 'en' },
  titleTemplate: title => (title ? `${title} · GD Movies` : 'GD Movies'),
  link: [{ rel: 'icon', type: 'image/svg+xml', href: logoUrl }],
  script: [{ innerHTML: themeScript, tagPosition: 'head' }]
})
useSeoMeta({ description: 'Search and browse movies powered by TMDB.' })
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
