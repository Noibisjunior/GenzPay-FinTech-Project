
<script setup lang="ts">

defineProps<{
  title: string;
  heightSmall?: boolean;
  reverseBg?: boolean;
}>();
</script>
<template>
  <div
    class="rounded-lg shadow border w-full overflow-hidden"
    :class="[reverseBg ? 'bg-secondary-foreground' : 'bg-white']"
  >
    <div 
      class="flex items-center justify-between border-b"
      :class="[
        !reverseBg ? 'bg-secondary-foreground' : 'bg-white',
        heightSmall ? 'py-[5px] px-4' : 'py-4 px-8'
      ]"
    >
      <h3 v-if="!heightSmall" class="font-bold">{{ title }}</h3>
      <slot v-else name="action-button" />
    </div>
    <div class="pt-2 pb-4">
      <slot />
    </div>
  </div>
</template>
