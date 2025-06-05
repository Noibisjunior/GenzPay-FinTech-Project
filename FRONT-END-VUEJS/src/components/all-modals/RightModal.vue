<script setup lang="ts">
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Badge } from '../ui/badge';
import { LogoWhite } from '../icons';

defineProps<{
  title: string
  description?: string
  step?: string
  mobileNav?: boolean
}>()
</script>

<template>
  <Sheet>
    <SheetTrigger as-child>
      <slot name="trigger" />
    </SheetTrigger>
    <SheetContent 
      class="w-full sm:w-3/4 md:w-1/2 overflow-y-scroll"
      :class="mobileNav ? 'bg-primary border-primary' : 'bg-white'"
    >
      <SheetHeader>
        <SheetTitle class="text-[30px] mt-8 lg:mt-0 text-left">
          <LogoWhite v-if="mobileNav" class="mt-8 mb-10" />
          <div v-else class="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-6">
            {{ title }}
            <Badge v-if="step" variant="primary" class="py-2 px-4 w-[84px]">Step {{ step }}/2</Badge>
          </div>
          
        </SheetTitle>
        <SheetDescription v-if="description" class="text-left">
          {{ description }}
        </SheetDescription>
      </SheetHeader>
      <slot />
      <SheetFooter>
        <SheetClose as-child>
          <slot name="close" />
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>