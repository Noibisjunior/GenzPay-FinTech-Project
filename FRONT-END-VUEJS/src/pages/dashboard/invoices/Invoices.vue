<script lang="ts" setup>
import { Input } from "@/components/ui/input";
import DashboardLayout from "../layout/DashboardLayout.vue";
import { FilterIcon, InvoicesIcon, SearchIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { ArrowRightIcon } from "@radix-icons/vue";

</script>
<template>
  <DashboardLayout
    title="Invoices"
  >
  <div class="flex flex-col gap-10">
    <div class="flex gap-5">
      <div class="relative w-full items-center">
        <Input id="search" type="text" placeholder="Search..." class="pl-12 text-sm py-4 border-border placeholder:text-[#667085B2] placeholder:text-sm" />
        <span class="absolute start-0 inset-y-0 flex items-center justify-center px-4">
          <SearchIcon class="size-6 text-muted-foreground" />
        </span>
      </div>
      <Button variant="outline" class="flex items-center text-muted-foreground/80 hover:bg-muted-background gap-2">
        Filter
        <FilterIcon />

      </Button>
    </div>

    <div class="w-full rounded-lg overflow-hidden bg-white border border-border shadow shadow-shadow">
    <Tabs default-value="all" class="w-full">
      <TabsList class="grid w-full grid-cols-2 sm:grid-cols-6" my-style>
        <TabsTrigger value="all" my-style>
          All invoices
        </TabsTrigger>
        <TabsTrigger value="draft" my-style>
          Draft
        </TabsTrigger>
        <TabsTrigger value="pending" my-style>
          Pending
        </TabsTrigger>
        <TabsTrigger value="processing" my-style>
          Processing
        </TabsTrigger>
        <TabsTrigger value="due" my-style>
          Due
        </TabsTrigger>
        <TabsTrigger value="overdue" my-style>
          Overdue
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <div class="flex flex-col items-center px-6 pb-16 pt-12 max-w-96 mx-auto">
          <InvoicesIcon class="h-8 w-8" />
          <div class="my-2 text-2xl font-semibold">No payments</div>
          <span
            class="mb-10 text-center text-sm text-muted-foreground"
            >Once you have any payment, the information appears here</span
          >
          <RouterLink to="invoices/new" class="w-full">
            <Button class="w-full font-semibold gap-2">
              New invoice
              <ArrowRightIcon class="stroke-white" />
            </Button>
          </RouterLink>
        </div>
      </TabsContent>
      <TabsContent value="draft">
        <div class="p-4">
          draft
        </div>
      </TabsContent>
      <TabsContent value="pending">
        <div class="p-4">
          pending
        </div>
      </TabsContent>
      <TabsContent value="processing">
        <div class="p-4">
          processing
        </div>
      </TabsContent>
      <TabsContent value="due">
        <div class="p-4">
          due
        </div>
      </TabsContent>
      <TabsContent value="overdue">
        <div class="p-4">
          Overdue
        </div>
      </TabsContent>
    </Tabs>
  </div>
  </div>
</DashboardLayout>
</template>


