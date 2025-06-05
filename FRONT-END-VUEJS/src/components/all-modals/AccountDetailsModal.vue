<script setup lang="ts">
import { CopyIcon, Cross2Icon } from "@radix-icons/vue";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InvoicesIcon } from "../icons";

export interface AccountDetailsProps {
  [key: string]: {
    label: string
    value: string
  }
}

const props = defineProps<{
  accountDetails: AccountDetailsProps
}>()
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogContent
      class="border border-border/30 bg-white sm:max-w-xl rounded-lg"
    >
      <div class="flex gap-x-8 justify-between rounded-lg bg-primary/5 p-8 m-4">
        <div class="flex flex-col gap-3">
          <div
            v-for="detail in props.accountDetails"
            class="flex items-start gap-1 border-b last-of-type:border-0"
          >
            <div class="flex flex-col">
              <div
                class="font-normal mb-1 text-muted-foreground"
              >
                {{ detail.label }}
              </div>
              <div class="flex font-medium mb-3 text-secondary">
                <span class="max-w-xs">{{ detail.value }}</span> 
                <CopyIcon class=" self-center ml-2" />
              </div>
            </div>
          </div>
        </div>

        
        <DialogClose
          as-child
          class="bg-white text-black h-6 w-6 rounded-full opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 data-[state=open]:text-slate-500 dark:ring-offset-slate-950 dark:focus:ring-slate-300 dark:data-[state=open]:bg-slate-800 dark:data-[state=open]:text-slate-400"
        >
          <Cross2Icon class="size-1 p-1" />
          <span class="sr-only">Close</span>
        </DialogClose>
      </div>
      <DialogFooter class="sm:justify-start mb-4 mx-4 flex">
        <DialogClose as-child class="flex-1">
          <Button type="button">
            <CopyIcon class="h-4 w-4 mr-2 font-semibold" />
            Copy details as text 
          </Button>
        </DialogClose>
        <div></div>
        <DialogClose as-child class="flex-1">
          <Button
            type="button"
            variant="outline"
            class="text-primary border-primary hover:bg-primary/5 font-semibold"
          >
            <InvoicesIcon class="h-4 w-4 mr-2 stroke" />
            Proof of account
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
