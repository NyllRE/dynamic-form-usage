<!-- @format -->

<template>
	<DynamicForm :config="formConfig">
		<!-- Timeline component in slot -->
		<FormTimeline
			v-if="isTimelineVisible"
			:items="timelineItems" />
	</DynamicForm>

	<!-- Debug: Timeline Data -->
	<!-- <div
    v-if="isTimelineVisible"
    class="right-4 bottom-4 fixed bg-gray-900 p-4 rounded-lg max-w-sm max-h-96 overflow-auto font-mono text-white text-xs"
  >
    <div class="mb-2 font-bold">Timeline Debug</div>
    <div>Branch: {{ selectedBranchId }}</div>
    <div>Progress: {{ (overallProgress * 100).toFixed(0) }}%</div>
    <div>Step: {{ currentStepIndex + 1 }} / {{ totalSteps }}</div>
    <hr class="my-2 border-gray-700" />
    <div v-for="item in timelineItems" :key="item.id" class="mb-2">
      <div
        :class="{
          'text-green-400': item.status === 'completed',
          'text-yellow-400': item.status === 'active',
          'text-gray-500': item.status === 'pending',
        }"
      >
        {{ item.status === 'completed' ? '✓' : item.status === 'active' ? '●' : '○' }}
        {{ item.label }}
        <span v-if="item.isMultiStep">({{ item.currentSubStep }}/{{ item.totalSubSteps }})</span>
      </div>
    </div>
  </div> -->
</template>

<script setup lang="ts">
import * as z from 'zod'
import finance from '~/assets/svg/finance.svg'
import home from '~/assets/svg/home.svg'
import alternativeConfirmScreen from '~/components/alternativeConfirmScreen.vue'

const formConfig = defineForm({
	id: 'house-example-form',
	mode: 'multi-route',
	settings: {
		saveProgress: true,
		apiEndpoint: '/api/submit',
		resumeExpirationDays: 30,
	},
	startScreen: () => h(alternativeConfirmScreen),
	steps: [
		{
			type: 'branch',
			id: 'branch-step',
			title: 'Get Pre-Approved Today!',
			description: 'Select one of the options to proceed to the corresponding form step.',
			name: 'loanType',
			choices: [
				{
					value: 'buy',
					label: 'I want to Buy a home',
					illustration: home, // or '/images/house.png'
					highlight: { before: 'I want to', word: 'Buy', after: 'a home' },
				},
				{
					value: 'refinance',
					label: 'I want to Refinance my home',
					illustration: finance,
					highlight: { before: 'I want to', word: 'Refinance', after: 'my home' },
				},
			],
			routes: [
				{
					id: 'buy',
					steps: [
						// Details steps (multi-step group with progress)
						{
							type: 'form',
							id: 'intention',
							meta: { timelineTag: 'details', timelineLabel: 'Details' },
							title: 'Where are you at in the homebuying journey?',
							description: 'Select one of the options below to indicate your current intention.',
							schema: z.object({
								intention: z.enum(['0', '1', '2', '3']),
							}),
							fields: [
								{
									type: 'radioGroup',
									name: 'intention',
									props: {
										items: [
											{ label: 'Daydreaming', value: '0' },
											{ label: 'Looking Around', value: '1' },
											{ label: 'Getting Serious', value: '2' },
											{ label: 'Ready to Buy', value: '3' },
										],
										variant: 'card',
									},
									fieldProps: {
										required: true,
									},
								},
							],
						},
						{
							type: 'form',
							id: 'credit-score',
							meta: { timelineTag: 'details', timelineLabel: 'Details' },
							title: 'What is your credit score?',
							schema: z.object({
								creditScore: z.enum(['0', '1', '2', '3', '4', '5']),
							}),
							fields: [
								{
									type: 'radioGroup',
									name: 'creditScore',
									props: {
										items: [
											{ label: 'Excellent (720+)', value: '0' },
											{ label: 'Good (680-719)', value: '1' },
											{ label: 'Fair (660-679)', value: '2' },
											{ label: 'Below Average (620-659)', value: '3' },
											{ label: 'Poor (580-619)', value: '4' },
											{ label: 'Bad (Below 580)', value: '5' },
										],
										indicator: 'hidden',
										variant: 'card',
									},
									fieldProps: {
										required: true,
									},
								},
							],
						},
						{
							type: 'form',
							id: 'area',
							meta: { timelineTag: 'details', timelineLabel: 'Details' },
							title: 'Where are you looking to buy?',
							description: 'Enter the city or zip code of the area where you are home shopping.',
							schema: z.object({
								area: z.string().min(2, 'Please enter an area'),
							}),
							fields: [
								{
									type: 'areaSelect',
									name: 'area',
									areaAnswerKey: 'area',
									areaDetailsKey: 'areaDetails',
									placeholder: 'Enter city or zip code...',
									countryRestrictions: { country: 'us' },
									label: '',
								},
							],
						},
						// Wrap-up steps (contact info)
						{
							type: 'form',
							id: 'email',
							meta: { timelineTag: 'wrap-up', timelineLabel: 'Wrap Up' },
							title: 'What is your email address?',
							description: 'Enter your email address.',
							schema: z.object({
								email: z.email('Please enter a valid email address'),
							}),
							fields: [
								{
									type: 'input',
									name: 'email',
									props: {
										placeholder: 'you@example.com',
										trailingIcon: 'material-symbols:lock',
										ui: {
											trailingIcon: 'text-success-600',
										},
									},
									fieldProps: {
										required: true,
									},
								},
							],
						},
						{
							type: 'form',
							id: 'name',
							meta: { timelineTag: 'wrap-up', timelineLabel: 'Wrap Up' },
							title: 'What is your name?',
							description: 'Enter your full name.',
							schema: z.object({
								firstName: z.string().min(1, 'First name is required'),
								lastName: z.string().min(1, 'Last name is required'),
							}),
							fields: [
								{
									type: 'input',
									name: 'firstName',
									props: {
										placeholder: 'First name',
									},
									fieldProps: {
										label: 'First Name',
										required: true,
									},
								},
								{
									type: 'input',
									name: 'lastName',
									props: {
										placeholder: 'Last name',
									},
									fieldProps: {
										label: 'Last Name',
										required: true,
									},
								},
							],
						},
						{
							type: 'form',
							id: 'phone',
							meta: { timelineTag: 'wrap-up', timelineLabel: 'Wrap Up' },
							title: 'What is your phone number?',
							description: "Enter your phone number and choose how you'd like to verify.",
							schema: z.object({
								phone: z.string().min(10, 'Please enter a valid phone number'),
								verificationMethod: z.enum(['sms', 'call']),
							}),
							fields: [
								{
									type: 'input',
									name: 'phone',
									props: {
										placeholder: '(555) 123-4567',
									},
									fieldProps: {
										label: 'Phone Number',
										required: true,
									},
								},
								{
									type: 'radioGroup',
									name: 'verificationMethod',
									props: {
										items: [
											{ label: 'Send a text message verification code', value: 'sms' },
											{ label: 'Call me with verification code', value: 'call' },
										],
										variant: 'card',
									},
									fieldProps: {
										label: 'How would you like to verify?',
										required: true,
									},
								},
							],
						},
					],
				},
				{
					id: 'refinance',
					steps: [
						// Details steps
						{
							type: 'form',
							id: 'ref-credit-score',
							meta: { timelineTag: 'details', timelineLabel: 'Details' },
							title: 'What is your credit score?',
							schema: z.object({
								creditScore: z.enum(['0', '1', '2', '3', '4', '5']),
							}),
							fields: [
								{
									type: 'radioGroup',
									name: 'creditScore',
									props: {
										items: [
											{ label: 'Excellent (720+)', value: '0' },
											{ label: 'Good (680-719)', value: '1' },
											{ label: 'Fair (660-679)', value: '2' },
											{ label: 'Below Average (620-659)', value: '3' },
											{ label: 'Poor (580-619)', value: '4' },
											{ label: 'Bad (Below 580)', value: '5' },
										],
										variant: 'card',
									},
									fieldProps: {
										required: true,
									},
								},
							],
						},
						{
							type: 'form',
							id: 'ref-credit-interest',
							meta: { timelineTag: 'details', timelineLabel: 'Details' },
							title: 'Are you interested in other credit services?',
							schema: z.object({
								creditInterest: z.enum(['yes', 'no']),
							}),
							fields: [
								{
									type: 'radioGroup',
									name: 'creditInterest',
									props: {
										items: [
											{ label: 'Yes', value: 'yes' },
											{ label: 'No', value: 'no' },
										],
										variant: 'card',
									},
									fieldProps: {
										required: true,
									},
								},
							],
						},
						// Wrap-up steps (contact info)
						{
							type: 'form',
							id: 'ref-email',
							meta: { timelineTag: 'wrap-up', timelineLabel: 'Wrap Up' },
							title: 'What is your email address?',
							description: 'Enter your email address.',
							schema: z.object({
								email: z.email('Please enter a valid email address'),
							}),
							fields: [
								{
									type: 'input',
									name: 'email',
									props: {
										placeholder: 'you@example.com',
									},
									fieldProps: {
										required: true,
									},
								},
							],
						},
						{
							type: 'form',
							id: 'ref-name',
							meta: { timelineTag: 'wrap-up', timelineLabel: 'Wrap Up' },
							title: 'What is your name?',
							description: 'Enter your full name.',
							schema: z.object({
								firstName: z.string().min(1, 'First name is required'),
								lastName: z.string().min(1, 'Last name is required'),
							}),
							fields: [
								{
									type: 'input',
									name: 'firstName',
									props: {
										placeholder: 'First name',
									},
									fieldProps: {
										label: 'First Name',
										required: true,
									},
								},
								{
									type: 'input',
									name: 'lastName',
									props: {
										placeholder: 'Last name',
									},
									fieldProps: {
										label: 'Last Name',
										required: true,
									},
								},
							],
						},
						{
							type: 'form',
							id: 'ref-phone',
							meta: { timelineTag: 'wrap-up', timelineLabel: 'Wrap Up' },
							title: 'What is your phone number?',
							description: "Enter your phone number and choose how you'd like to verify.",
							schema: z.object({
								phone: z.string().min(10, 'Please enter a valid phone number'),
								verificationMethod: z.enum(['sms', 'call']),
							}),
							fields: [
								{
									type: 'input',
									name: 'phone',
									props: {
										placeholder: '(555) 123-4567',
									},
									fieldProps: {
										label: 'Phone Number',
										required: true,
									},
								},
								{
									type: 'radioGroup',
									name: 'verificationMethod',
									props: {
										items: [
											{ label: 'Send a text message verification code', value: 'sms' },
											{ label: 'Call me with verification code', value: 'call' },
										],
										variant: 'card',
									},
									fieldProps: {
										label: 'How would you like to verify?',
										required: true,
									},
								},
							],
						},
					],
				},
			],
		},
	],
	endScreen: h('p', 'Thank you for completing the form! We will be in touch soon.'),
	completeCallBack: () => {
		alert('Form completed! Thank you.')
	},
})

// Use the timeline composable with the form ID
const {
	hasBranchSelected,
	isTimelineVisible,
	selectedBranchId,
	timelineItems,
	currentItem,
	overallProgress,
	currentStepIndex,
	totalSteps,
} = useFormTimeline('house-example-form', {
	showBranchStep: true,
	branchStepLabel: 'Property',
	timelineOrder: ['timeline', 'details', 'wrap-up'],
	getLabel: (tag) => {
		const labels: Record<string, string> = {
			timeline: 'Timeline',
			details: 'Details',
			'wrap-up': 'Wrap Up',
		}
		return labels[tag] ?? tag
	},
})
</script>
