import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import VButton from '../VButton.vue'
import VModal from './VModal.vue'

const meta = {
  title: 'Overlay/Modal',
  component: VModal,
  tags: ['autodocs'],
  args: {
    title: 'Invite teammates',
    description: 'They will get an email.',
    size: 'md',
  },
  render: (args) => ({
    components: { VModal, VButton },
    setup: () => ({ args, value: ref(false) }),
    template:
      '<VButton @click="value = true">Open modal</VButton><VModal v-bind="args" v-model="value">Modal body<template #footer="{ close }"><VButton @click="close">Done</VButton></template></VModal>',
  }),
} satisfies Meta<typeof VModal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
