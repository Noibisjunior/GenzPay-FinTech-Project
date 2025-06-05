<script lang="ts" setup>
import Card from "@/components/Card.vue";
import DashboardLayout from "../layout/DashboardLayout.vue";
import router from "@/router";
import { ChevronLeftIcon } from "@radix-icons/vue";
import { Button } from "@/components/ui/button";

const goBack = () => {
  router && router.go(-1)
}



</script>
<template>
  <DashboardLayout
    title="Security"
    :is-profile="true"
  >
    <div class="pb-14 flex flex-col gap-12">
      <Card title="Manage Security">
        
        <div class="flex flex-col gap-8 px-8 pb-10 pt-8 font-medium text-secondary">
          <div>Password</div>
          <div class="h-[1px] bg-border text-border" />
          <div class="flex flex-col sm:flex-row gap-5 items-center justify-between">
            <span>Set a unique password to protect your account</span>
            <Button variant="outline" class="hover:bg-muted-foreground/10">Change Password</Button>
          </div>
          <div class="h-[1px] bg-border text-border" />
          <div class="flex flex-col sm:flex-row gap-5 items-center justify-between">
            <span>Reset or change authentication method
              <br>
              (eg. Authy or Google Authentication) for this account 
            </span>
            <Button variant="outline" class="hover:bg-muted-foreground/10">Activate 2FA</Button>
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
