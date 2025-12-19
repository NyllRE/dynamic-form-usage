/** @format */

// Ensure `.env` is loaded before Nuxt evaluates `nuxt.config.*`.
// This is required for `extends: ['github:…', { auth: … }]` where `auth` is read at config-eval time.
import { loadEnv } from 'vite'

import { fileURLToPath } from 'node:url'

// Load .env files before Nuxt config evaluation
const env = loadEnv('', process.cwd(), '')
Object.assign(process.env, env)


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },
	modules: ['@nuxt/eslint'],

	// Layer provides @pinia/nuxt, pinia-plugin-persistedstate, @nuxt/ui, @nuxt/image
	extends: [
		// Use GitHub layer for production builds (hosted deployments)
		process.env.NODE_ENV === 'production'
			? [
					'gh:NyllRE/dynamic-form-engine#master',
					{
						giget: { auth: process.env.GITHUB_TOKEN },
						install: true,
						meta: { name: 'dynamic-form-engine' },
					},
			  ]
			: [
					'../dynamic-form-engine',
					{
						install: true,
						meta: { name: 'dynamic-form-engine' },
					},
			  ],
	],

	// Fix for reka-ui SSR issues
	vite: {
		resolve: {
			dedupe: ['vue', 'reka-ui'],
		},
		optimizeDeps: {
			include: ['vue', 'reka-ui'],
		},
		ssr: {
			noExternal: ['reka-ui'],
		},
	},

	// Build configuration for layer resolution
	build: {
		transpile: ['reka-ui'],
	},

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
		'/': { ssr: false },
		'/alternative': { ssr: false },
	},
})
