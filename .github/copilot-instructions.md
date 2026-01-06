<!-- @format -->

# Copilot Instructions for Dynamic Form Usage

## Project Overview

This is a **Nuxt 4 application** that demonstrates usage of the `dynamic-form-engine` layer—a custom Nuxt layer for building multi-step, branching forms with validation. The layer provides `DynamicForm`, `FormPage`, `FormTimeline` components and composables like `defineForm`, `useFormTimeline`, and `useFormStore`.

## Architecture

### Layer System

- **Development**: Uses local layer at `../dynamic-form-engine`
- **Production**: Pulls from `gh:NyllRE/dynamic-form-engine#master` (requires `GITHUB_TOKEN` env var)
- Layer provides: `@pinia/nuxt`, `pinia-plugin-persistedstate`, `@nuxt/ui`, `@nuxt/image`, `reka-ui` and additional devtools dependencies.

### Key Components from Layer

- `DynamicForm` - Main form container, accepts `config` from `defineForm()`
- `FormPage` - Wrapper with `#header`, `#footer` slots for custom start screens
- `FormTimeline` - Visual progress indicator for multi-step forms
- `useFormStore()` - Pinia store at `#layers/dynamic-form-engine/app/stores/form`

## Form Configuration Pattern

Forms are defined using `defineForm()` with TSX support (`<script setup lang="tsx">`):

```typescript
const formConfig = defineForm({
  id: 'unique-form-id',
  mode: 'multi-route',
  settings: { saveProgress: true, apiEndpoint: '/api/submit' },
  startScreen: h(CustomComponent),
  steps: [
    {
      type: 'branch',  // or 'form'
      id: 'step-id',
      meta: { timelineTag: 'details', timelineLabel: 'Details' },
      schema: z.object({ fieldName: z.string() }),  // Zod v4 validation
      fields: [{ type: 'input', name: 'fieldName', props: {...} }]
    }
  ],
  endScreen: <p>Thank you!</p>,
  completeCallBack: () => {}
});
```

### Field Types

- `input`, `radioGroup`, `areaSelect` (Google Places autocomplete)
- RadioGroup variants: `card` with `indicator: 'hidden'`

### Timeline Integration

```typescript
const { isTimelineVisible, timelineItems } = useFormTimeline('form-id', {
	showBranchStep: true,
	timelineOrder: ['timeline', 'details', 'wrap-up'],
	getLabel: (tag) => labels[tag],
})
```

## Development Commands

```bash
ni          # Install dependencies
nr dev      # Development server at localhost:3000
nr build    # Production build
nr preview  # Preview production build locally
```

## Important Build Configuration

The layer uses `reka-ui` which has ESM/CJS compatibility issues. Current `nuxt.config.ts` includes workarounds:

- `vite.resolve.dedupe` for Vue packages and reka-ui
- `vite.ssr.noExternal` for reka-ui packages
- `build.transpile` includes reka-ui
- `ssr: false` is set globally due to ongoing SSR compatibility issues

## Server API

Server routes in `server/api/` handle Google Places API proxying:

- `GET /api/places/autocomplete` - Place suggestions
- `GET /api/places/details` - Place details
- Requires `googleMapsApiKey` in `runtimeConfig`

## UI Customization

- Uses `@nuxt/ui` with Tailwind
- Default UI config in `app/app.config.ts` (e.g., radioGroup defaults)
- Color mode disabled (`ui.colorMode: false`)

## File Conventions

- Pages in `app/pages/` (Nuxt 4 app directory structure)
- Custom start screens as Vue components in `app/components/`
- SVG assets in `app/assets/svg/` imported directly into form configs
