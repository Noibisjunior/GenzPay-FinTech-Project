<script setup lang="ts">
import { Button } from "@/components/ui/button";
import AuthLayout from "@/pages/auth/layout/AuthLayout.vue";
import router from "@/router";
import { ArrowLeftIcon } from '@radix-icons/vue'

const goToDashboard = () => {
  router.push('/dashboard')
}
</script>

<template>
  <AuthLayout
    title="Email verified"
    description="Your password has been successfully reset. Click below to log in magically."
    :widthSmall="true"
    :showLogo="false"
  >
    <template v-slot:image>
      <!-- content for the header slot -->
      <svg class="mx-auto" width="66" height="66" viewBox="0 0 66 66" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="5" y="5" width="56" height="56" rx="28" fill="#D1FADF"/>
<rect x="5" y="5" width="56" height="56" rx="28" stroke="#ECFDF3" stroke-width="10"/>
<path d="M27.7502 32.9999L31.2502 36.4999L38.2502 29.4999M44.6668 32.9999C44.6668 39.4432 39.4435 44.6666 33.0002 44.6666C26.5568 44.6666 21.3335 39.4432 21.3335 32.9999C21.3335 26.5566 26.5568 21.3333 33.0002 21.3333C39.4435 21.3333 44.6668 26.5566 44.6668 32.9999Z" stroke="#039855" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>


    </template>
    <div class="text-center text-sm max-w-[360px] w-full mx-auto">
      <Button
        type="submit" 
        class="w-full mt-2 bg-violet-700 hover:bg-violet-800"
        @click="goToDashboard"
      > 
        Continue 
      </Button>
      <span class="block my-8">Didn't receive the email?
        <RouterLink to="/signup" class="font-semibold">Click to resend</RouterLink>
      </span>
      <RouterLink to="/signup" class="flex items-center justify-center gap-2 font-semibold">
        <ArrowLeftIcon class="h-12 stroke-gray-800" />
        Back to Sign up
      </RouterLink>
    </div>
  </AuthLayout>
</template>
