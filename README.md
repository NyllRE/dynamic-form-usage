# Nuxt Form Engine - Usage Example

This is a Nuxt 4 application demonstrating the usage of the Nuxt Form Engine module.

## Setup

Add the Nuxt Form Engine layer to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  layers: ['../nuxt-form-engine'],
})
```
make sure that the path to the layer is correct. you have to have the `nuxt-form-engine` folder next to this project folder.

```
- /projects
  |-- /nuxt-form-engine
  |-- /your-project
```

or just ensure you're using the correct relative path.


Make sure to install dependencies:

```bash
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
bun run dev
```

## Production

Build the application for production:

```bash
bun run build
```

Locally preview production build:

```bash
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
