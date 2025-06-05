<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { PinInputInput, type PinInputInputProps, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<PinInputInputProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <PinInputInput v-bind="forwardedProps" :class="cn('relative text-center focus:outline-none focus:ring-2 focus:ring-primary focus:relative focus:z-10 flex h-16 md:h-20 aspect-square items-center justify-center border-y-2 border-x-2 border-l-2 border-primary text-4xl md:text-6xl transition-all first:rounded-l-md first:border-l-2 last:rounded-r-md dark:focus:ring-slate-300 dark:border-slate-800', props.class)" />
</template>
