<script lang="ts" setup>
import Card from "@/components/Card.vue";
import DashboardLayout from "../layout/DashboardLayout.vue";
import router from "@/router";
import { AvatarIcon, ChevronLeftIcon, CountdownTimerIcon, DownloadIcon, EnvelopeClosedIcon, RocketIcon } from "@radix-icons/vue";
import { InvoicesIcon } from "@/components/icons";

const goBack = () => {
  router && router.go(-1)
}

const identificationData = [
  {
    icon: AvatarIcon,
    label: "ID Verification",
    status: "Approved",
  },
  {
    icon: RocketIcon,
    label: "Sending Money",
    status: "Completed",
  },
  {
    icon: EnvelopeClosedIcon,
    label: "Email Verification",
    status: "Completed",
  },
  {
    icon: CountdownTimerIcon,
    label: "Daily Transaction Limit",
    value: '$500.00',
  },
  {
    icon: InvoicesIcon,
    label: "Compliance Document",
    status: "Approved",
  },
  {
    icon: DownloadIcon,
    label: "Receiving Funds",
    status: "Completed",
  },
]

</script>
<template>
  <DashboardLayout
    title="Identification"
    :is-profile="true"
  >
    <div class="pb-14 flex flex-col gap-12">
      <Card title="Identification">
        
        <div class="flex flex-col gap-8 px-8 pb-10 pt-8 font-medium text-secondary">
          <div>Complete any pending process by clicking on uncompleted stage </div>

          <div class="grid sm:grid-cols-2 gap-x-10 gap-y-4 grid-flow-dense">
            <div 
              class="flex items-center gap-4 p-4 border-b border-border"
              v-for="identity in identificationData"
              :key="identity.label"
            >
              <div class="h-9 w-9 grid place-items-center bg-primary/5 rounded-lg">
                <component :is="identity.icon" class="text-primary size-6" />
              </div>
              <div class="flex flex-col">
                <p class="font-medium">{{ identity.label }}</p>
                <p 
                  class="text-xs font-medium text-green"
                  :class="identity.status ? 'text-green' : 'text-muted-foreground'"
                >
                  {{ identity.status ? identity.status : identity.value }}
                </p>
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
