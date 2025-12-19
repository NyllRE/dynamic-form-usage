<!-- @format -->

<template>
	<DynamicForm :config="formConfig" />
</template>

<script setup lang="tsx">
import * as z from 'zod'
import ConfirmScreen from '~/components/ConfirmScreen.vue';

const formConfig = defineForm({
	id: 'example-form',
	mode: 'multi-route',
	settings: {
		saveProgress: true,
		apiEndpoint: '/api/submit',
		resumeExpirationDays: 30,
	},
	startScreen: <ConfirmScreen />,
	steps: [
		{
			type: 'form',
			id: 'personal-info',
			title: 'Personal Information',
			description: 'Please provide your personal details below.',
			schema: z.object({
				name: z.string().min(5, 'Name should be at least 5 characters'),
				email: z.email('Please enter a valid email address'),
				newsletter: z.enum(['Yes', 'No'], 'Please select an option'),
			}),
			fields: [
				{
					type: 'input',
					name: 'name',
					label: 'Full Name',
					props: {
						type: 'text',
						autofocus: true,
					},
					fieldProps: {
						required: true,
					},
				},
				{
					type: 'input',
					name: 'email',
					label: 'Email Address',
					props: {
						type: 'email',
					},
					fieldProps: {
						required: true,
					},
				},
				{
					type: 'select',
					name: 'newsletter',
					label: 'Subscribe to newsletter?',
					props: {
						items: ['Yes', 'No'],
					},
				},
			],
		},
		{
			type: 'form',
			id: 'preferences',
			title: 'Preferences',
			schema: z.object({
				newsletter: z.enum(['Yes', 'No'], 'Please select an option'),
			}),
			fields: [
				{
					type: 'select',
					name: 'newsletter',
					label: 'Subscribe to newsletter?',
					props: {
						items: ['Yes', 'No'],
					},
				},
			],
		},
		{
			type: 'custom',
			id: 'video-step',
			title: 'Video Example',
			component: <VideoPlayer videoSrc='https://www.pexels.com/download/video/28541328/' />,
		},
		{
			type: 'form',
			id: 'favorite-seasons',
			title: 'Favorite Seasons',
			description: 'Select all seasons you like the most.',
			schema: z.object({
				seasons: z
					.array(z.enum(['Spring', 'Summer', 'Fall', 'Winter']))
					.nonempty('Please select at least one season'),
			}),
			fields: [
				{
					type: 'checkboxGroup',
					name: 'seasons',
					props: {
						items: ['Spring', 'Summer', 'Fall', 'Winter'],
						variant: 'card',
						required: true,
					},
				},
			],
		},
		{
			type: 'form',
			id: 'preferred-subscription',
			title: 'Preferred Subscription',
			description: 'Select your preferred subscription option.',
			schema: z.object({
				subscription: z.enum(['Basic', 'Premium', 'VIP']),
			}),
			fields: [
				{
					type: 'radioGroup',
					name: 'subscription',
					props: {
						items: [
							{
								label: 'Basic',
								value: 'Basic',
								description: 'Basic subscription with limited features',
							},
							{
								label: 'Premium',
								value: 'Premium',
								description: 'Premium subscription with additional features',
							},
							{ label: 'VIP', value: 'VIP', description: 'VIP subscription with all features' },
						],
						variant: 'card',
					},
				},
			],
		},
	],
})
</script>
