<!-- @format -->

<template>
	<UContainer>

		<h1 class="my-6 text-2xl text-center">Welcome to Our Application</h1>
		<p class="text-body1 text-center">
			This is the main landing page. Use the navigation menu to explore different sections of the app.
		</p>


		<div class="flex justify-center gap-5">

			<UButton
			class="my-4"
			to="/house-demo"
			color="primary"
			variant="soft"
			label="House Demo"
			> House Demo </UButton>

			<UButton
			class="my-4"
			to="/showcase"
			color="primary"
			variant="soft"
			label="Showcase"
			> Showcase </UButton>
		</div>

	</UContainer>
</template>
