import { defineStore } from 'pinia'

export const useAuth = defineStore('auth', {
  // arrow function recommended for full type inference
  state: () => {
    return {
      user: {},
      loggedIn: false,
      sessionId: ''
    }
  },
  actions: {
    async fetchUser () {
      const sessionId = useCookie('s_val_anayl').value;
      const data = await $fetch('/api/auth/user', { headers: useRequestHeaders() })

      this.loggedIn = true
      this.user = data
      this.sessionId = sessionId
    },

    async logout () {
      this.loggedIn = false
      this.user = {}
      this.sessionId = ''

      await $fetch('/api/auth/logout', { headers: useRequestHeaders() })

      // Redirect to Auth
      navigateTo('/')
    }
  },
  persist: {
    enabled: true,
  }
})