// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
	modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
	runtimeConfig: {
    MONGO_URI: 'mongodb://localhost:27017/entity-bot',
		SESSION_SECRET: 'secret',
		CLIENT_ID: '1027338110654218352',
		CLIENT_SECRET: 'qoW69to_XIu8jLSiYTao5bNo52FdoMLB',
		public: {
			REDIRECT_URI: 'http://localhost:3000/api/auth/callback',
			MANAGE_REDIRECT_URI: 'http://localhost:3000/manage',
			OAUTH_URL: 'https://discord.com/api/oauth2/authorize?client_id=1025527637709426708&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback&response_type=code&scope=identify%20email%20guilds',
			// REDIRECT_URI: 'https://8b59-149-22-8-199.eu.ngrok.io/api/auth/callback',
			// OAUTH_URL: 'https://discord.com/api/oauth2/authorize?client_id=1025527637709426708&redirect_uri=https%3A%2F%2F8b59-149-22-8-199.eu.ngrok.io%2Fapi%2Fauth%2Fcallback&response_type=code&scope=identify%20email%20guilds',
		}
	},
	css: [
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],
	build: {
		transpile: [
				'@fortawesome/fontawesome-svg-core',
				'@fortawesome/pro-solid-svg-icons',
				'@fortawesome/pro-regular-svg-icons',
				'@fortawesome/free-brands-svg-icons'
		]
	},
	vite: { ssr: { noExternal: ["moment"], } }
})
