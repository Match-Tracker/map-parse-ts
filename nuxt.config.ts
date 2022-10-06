// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
	modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
	runtimeConfig: {
    MONGO_URI: 'mongodb://localhost:27017/match-tracker',
		SESSION_SECRET: 'secret',
		CLIENT_ID: '1027338110654218352',
		CLIENT_SECRET: 'qoW69to_XIu8jLSiYTao5bNo52FdoMLB',
		public: {
			REDIRECT_URI: 'http://localhost:3000/api/auth/callback',
			OAUTH_URL: 'https://discord.com/api/oauth2/authorize?client_id=1027338110654218352&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback&response_type=code&scope=identify%20guilds.join%20email',
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
