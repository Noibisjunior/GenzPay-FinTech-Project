<script setup>
import { ref } from 'vue'
import axios from 'axios'
import router from '@/router'

const email = ref('') // prefill with registered email if you can
const otp = ref('')
const message = ref('')

const verifyCode = async () => {
  try {
    const response = await axios.get(`http://localhost:8009/api/verify-otp`, {
      params: { email: email.value, otp: otp.value }
    })

    message.value = response.data.message
    router.push('/dashboard') 
  } catch (error) {
    message.value = error.response.data || 'Something went wrong'
  }
}
</script>

<template>
  <div class="max-w-md mx-auto">
    <h2 class="text-xl font-bold mb-4">Enter your OTP</h2>
    <input v-model="email" type="email" placeholder="Your email" class="border p-2 mb-4 w-full" />
    <input v-model="otp" type="text" placeholder="Enter OTP" class="border p-2 mb-4 w-full" />
    <button @click="verifyCode" class="bg-purple-600 text-white px-4 py-2">Verify</button>
    <p class="mt-2 text-red-500">{{ message }}</p>
  </div>
</template>






<!-- <script setup lang="ts">
import { Button } from "@/components/ui/button";
import AuthLayout from "@/pages/auth/layout/AuthLayout.vue";
import { ArrowLeftIcon } from '@radix-icons/vue'
import { ref } from 'vue'
import {
  PinInput,
  PinInputGroup,
  PinInputInput,
} from '@/components/ui/pin-input'
import router from "@/router";

const code = ref<string[]>([])
const handleComplete = (e: string[]) => console.log(e.join(''))

const verifyCode = () => {
  if(code.value.length === 4) router.push('/verified')
}
</script>

<template>
  <AuthLayout
    title="Check your email"
    description="We sent a verification link to olivia@untitledui.com"
    :widthSmall="true"
    :showLogo="false"
  >
    <template v-slot:image>
      content for the header slot 
      <svg class="mx-auto" width="66" height="66" viewBox="0 0 66 66" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="5" y="5" width="56" height="56" rx="28" fill="#D1FADF"/>
<rect x="5" y="5" width="56" height="56" rx="28" stroke="#ECFDF3" stroke-width="10"/>
<path d="M27.7502 32.9999L31.2502 36.4999L38.2502 29.4999M44.6668 32.9999C44.6668 39.4432 39.4435 44.6666 33.0002 44.6666C26.5568 44.6666 21.3335 39.4432 21.3335 32.9999C21.3335 26.5566 26.5568 21.3333 33.0002 21.3333C39.4435 21.3333 44.6668 26.5566 44.6668 32.9999Z" stroke="#039855" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>


    </template>
    <div class="mx-auto my-1">
      <PinInput
        id="pin-input"
        v-model="code"
        placeholder="○"
        @complete="handleComplete"
      >
        <PinInputGroup class="gap-1">
          <template v-for="(id, index) in 4" :key="id">
            <PinInputInput
              class="rounded-md border placeholder:text-muted-foreground/5"
              :index="index"
            />
            <template v-if="id !== 3">
              &nbsp;
            </template>
          </template>
        </PinInputGroup>
      </PinInput>
    </div>
    <div class="text-center text-sm max-w-80 md:max-w-[360px] w-full mx-auto">
      <Button
        type="submit"
        class="w-full mt-2 bg-violet-700 hover:bg-violet-800"
        @click="verifyCode"
        :disabled="code.length !== 4"
      > 
        Continue 
      </Button>
      <span class="block my-8">Didn't receive the email?
        <RouterLink to="/signup" class="font-semibold">Click to resend</RouterLink>
      </span>
      <RouterLink to="/signup" class="flex items-center justify-center gap-2 mt-8 font-semibold">
        <ArrowLeftIcon class="h-12 stroke-gray-800" />
        Back to Sign up
      </RouterLink>
    </div>
  </AuthLayout>
</template> -->
