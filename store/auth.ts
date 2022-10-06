import { defineStore } from 'pinia'
import { User } from '~~/types/user';

export const useAuth = defineStore('auth', {
  // arrow function recommended for full type inference
  state: () => {
    return {
      user: {} as User,
      loggedIn: false,
      sessionId: ''
    }
  },
  actions: {
    async fetchUser () {
      const sessionId = useCookie('s_val_anayl').value;
      const data = await $fetch('/api/auth/user', { headers: useRequestHeaders() })
        .catch(() => {
          this.logout();
        })

      this.loggedIn = true
      this.user = data
      this.sessionId = sessionId
    },

    async logout () {
      this.loggedIn = false
      this.user = {}
      this.sessionId = ''

      await $fetch('/api/auth/logout', { headers: useRequestHeaders() })
        .catch(() => {
          console.log('Couldn\'t remove session!');
        })

      // Redirect to Auth
      navigateTo('/')
    }
  },
  persist: {
    enabled: true,
  }
})