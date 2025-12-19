<!-- @format -->

<template>
  <DynamicForm :config="formConfig" />
</template>

<script setup lang="tsx">
import * as z from 'zod';
import finance from '~/assets/svg/finance.svg';
import home from '~/assets/svg/home.svg';

const formConfig = defineForm({
  id: 'house-example-form',
  mode: 'multi-route',
  settings: {
    saveProgress: true,
    apiEndpoint: '/api/submit',
    resumeExpirationDays: 30,
  },
  startScreen: <alternativeConfirmScreen />,
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
            {
              type: 'form',
              id: 'intention',
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
              id: 'area',
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
									label: ''
								}
							]
            },
            {
              type: 'form',
              id: 'email',
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
          ],
        },
        {
          id: 'refinance',
          steps: [
            {
              type: 'form',
              id: 'ref-credit-score',
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
            {
              type: 'form',
              id: 'ref-email',
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
          ],
        },
      ],
    },
  ],
  endScreen: (
    <p class="p-6 text-center">Thank you for completing the form! We will be in touch soon.</p>
  ),
  completeCallBack: () => {
    alert('Form completed! Thank you.');
  },
});
</script>
