/** @format */
// @ts-expect-error: bun issue
import { fileURLToPath } from 'node:url'


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },
	modules: ['@nuxt/eslint'],

	// Layer provides @pinia/nuxt, pinia-plugin-persistedstate, @nuxt/ui, @nuxt/image
	extends: [['../dynamic-form-engine', { install: true }]],

	eslint: {
		config: {
			// Use the generated ESLint config for lint root project as well
			rootDir: fileURLToPath(new URL('../dynamic-form-engine', import.meta.url)),
		},
	},
	runtimeConfig: {
		// Server-only (not exposed to client)
		googleMapsApiKey: '',
		public: {
			// Client-exposed keys go here
		},
	},

	ui: {
		colorMode: false,
	},

	routeRules: {
		'/alternative': { ssr: false },
	},
})
