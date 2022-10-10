import Toast from 'vue-toastification/dist/index.mjs'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Toast, {})
});