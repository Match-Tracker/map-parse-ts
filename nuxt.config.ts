// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
	modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
	runtimeConfig: {
		MONGO_URI: '',
		SESSION_SECRET: '',
		CLIENT_ID: '',
		CLIENT_SECRET: '',
		STRAPI_SECRET: '',
		public: {
			REDIRECT_URI: '',
			OAUTH_URL: '',
			STRAPI_KEY: ''
		}
	},
	css: [
		'@fortawesome/fontawesome-svg-core/styles.css',
		'vue-toastification/dist/index.css'
	],
	build: {
		transpile: [
			"@fortawesome/fontawesome-svg-core",
			"@fortawesome/free-brands-svg-icons",
			"@fortawesome/free-regular-svg-icons",
			"@fortawesome/free-solid-svg-icons",
			"@fortawesome/vue-fontawesome",
			"vue-toastification"
		]
	},
	vite: { ssr: { noExternal: ["moment"], } }
})
