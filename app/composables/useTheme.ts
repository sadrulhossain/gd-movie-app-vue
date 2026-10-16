export type Theme = 'dark' | 'light'

// Also read by the inline script in app.vue, which applies the saved theme before first paint.
export const THEME_STORAGE_KEY = 'movie-app:theme'

/** Dark is the default; light is the `light` class on <html>. Browser-only functions run after mount. */
export function useTheme() {
  const theme = useState<Theme>('theme', () => 'dark')

  // The inline script may already have switched <html>, so read it back after mount.
  function sync() {
    theme.value = document.documentElement.classList.contains('light') ? 'light' : 'dark'
  }

  function toggle() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.toggle('light', theme.value === 'light')
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme.value)
    } catch {
      // Storage blocked (private mode): the choice lasts until reload
    }
  }

  return { theme, sync, toggle }
}
