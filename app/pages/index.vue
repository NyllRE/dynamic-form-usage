<!-- @format -->

<template>
	<UContainer class="max-w-3xl">

		<h1 class="my-6 text-2xl text-center">Dynamic Form Engine Demo</h1>
		<img
			class="mx-auto mb-6 rounded-xl w-xl"
			src="/dynamic-form-engine-banner.svg"
			alt="App Logo"
		/>
		<p class="text-body1 text-center">
			This is a demo application for the
			<strong>Dynamic Form Engine</strong> Nuxt layer. You can explore different
			demos showcasing the capabilities of the form engine by clicking the buttons
			below.
		</p>


		<div class="flex flex-col justify-center gap-5 mx-auto my-4 w-auto md:w-lg">

			<UButton
			class="flex justify-center items-center"
			to="/house-demo"
			color="info"
			size="xl"
			variant="soft"
			label="House Demo"
			> House purchase demo </UButton>

			<UButton
			class="flex justify-center items-center"
			size="xl"
			to="/showcase"
			color="primary"
			variant="soft"
			label="Showcase"
			> Multiple screen types demo </UButton>


			<UButton
			class="flex justify-center items-center"
			color="neutral"
			size="xl"
			variant="soft"
			label="About"
			@click="store.resetAll();"
			> Reset Forms </UButton>
		</div>

	</UContainer>
</template>

<script setup lang="ts">
import { useFormStore } from '#layers/dynamic-form-engine/app/stores/form';

const store = useFormStore();

</script>