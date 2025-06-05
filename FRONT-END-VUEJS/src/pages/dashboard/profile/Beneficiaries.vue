<script lang="ts" setup>
import Card from "@/components/Card.vue";
import DashboardLayout from "../layout/DashboardLayout.vue";
import router from "@/router";
import { ArrowRightIcon, ChevronLeftIcon, PlusIcon } from "@radix-icons/vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NgnIcon, SearchIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";

const goBack = () => {
  router && router.go(-1)
}

</script>
<template>
  <DashboardLayout
    title="Beneficiaries"
    :is-profile="true"
  >
    <div class="pb-14 flex flex-col gap-12">
      <div class="flex flex-col sm:flex-row gap-5">
        <div class="relative w-full items-center">
          <Input id="search" type="text" placeholder="Search..." class="pl-12 text-sm py-4 border-border placeholder:text-[#667085B2] placeholder:text-sm" />
          <span class="absolute start-0 inset-y-0 flex items-center justify-center px-4">
            <SearchIcon class="size-6 text-muted-foreground" />
          </span>
        </div>
        <Button class="flex items-center text-primary text-base bg-white border border-primary hover:bg-muted-background gap-2">
          <PlusIcon class="size-5 stroke-primary stroke-0.5" />
          Add beneficiary
          <ArrowRightIcon class=" stroke-primary" />

        </Button>
      </div>
        <Card title="Manage Beneficiaries">
        <div class="flex flex-col gap-8 px-8 py-10">

          <!-- Beneficiaries list -->
          <div class="grid sm:grid-cols-2 grid-flow-dense gap-10">
            <div 
              v-for="beneficiary in 5"
              :key="beneficiary"
              class="flex flex-col gap-4 border rounded-lg p-6"
            >
              <div class="flex justify-between items-center">
                <Badge variant="primary" class="px-4 py-1 shadow-white">Default</Badge>
                <span class="text-xs text-muted-foreground">
                  Bank
                </span>
              </div>
              <div
                class="flex items-center gap-x-4"
              >
                <NgnIcon class="size-10" />
                <div class="flex flex-col text-left">
                  <p class="font-semibold">Nnabuife Elijah  </p>
                  <span class="text-xs text-muted-foreground">
                    0427740634
                  </span>
                  <span class="text-xs text-muted-foreground">
                    Guaranty Trust Bank
                  </span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </Card>
      <button @click="goBack" class="flex gap-2 items-center -mt-2">
        <ChevronLeftIcon class="size-6" />
        Go back
      </button>

    </div>
    
  </DashboardLayout>
</template>
