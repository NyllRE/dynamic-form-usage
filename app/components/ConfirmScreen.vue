<!-- eslint-disable vue/html-self-closing -->
<template>
  <FormPage>
    <template #header>
      <h2 class="mb-2 font-bold text-2xl text-center">Welcome to the Example Form</h2>
      <p class="text-muted text-center">
        This form will guide you through several steps to collect your information.
      </p>
    </template>

    <div class="flex flex-col justify-center items-center gap-5 w-full grow">
      <img
        src="https://picsum.photos/seed/picsum/900/600"
        alt="Confirmation Illustration"
        class="shadow-lg rounded-lg w-full"
      />
      <p>This form will demonstrate different input types and validation rules such as:</p>
      <ul class="list-disc">
        <li>Text Input with minimum length validation</li>
        <li>Email Input with proper email format validation</li>
        <li>Select Dropdown for choosing options</li>
      </ul>
    </div>

    <template #footer="{ start }">
      <UButton variant="soft" @click="start">Custom Start</UButton>
    </template>
  </FormPage>
</template>
