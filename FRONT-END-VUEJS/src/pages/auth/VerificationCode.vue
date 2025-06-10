<script setup>
import { ref } from 'vue'
import axios from 'axios'
import router from '@/router'

const email = ref('')
const otp = ref('')
const message = ref('')
const resendMessage = ref('')
const isResending = ref(false)

const verifyCode = async () => {
  try {
    const response = await axios.get(`http://localhost:8009/api/verify-otp`, {
      params: { email: email.value, otp: otp.value }
    })
    message.value = response.data.message
    router.push('/dashboard')
  } catch (error) {
    message.value = error.response.data.message || 'Something went wrong'
  }
}

const resendOtp = async () => {
  if (!email.value) {
    resendMessage.value = 'Please enter your email first'
    return
  }

  isResending.value = true
  resendMessage.value = ''

  try {
    const response = await axios.post(`http://localhost:8009/api/resend-otp`, {
      email: email.value
    })
    resendMessage.value = response.data.message || 'OTP resent successfully'
  } catch (error) {
    resendMessage.value = error.response.data.message || 'Failed to resend OTP'
  } finally {
    isResending.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto">
    <h2 class="text-xl font-bold mb-4">Enter your OTP</h2>
    <input v-model="email" type="email" placeholder="Your email" class="border p-2 mb-4 w-full" />
    <input v-model="otp" type="text" placeholder="Enter OTP" class="border p-2 mb-4 w-full" />

    <button @click="verifyCode" class="bg-purple-600 text-white px-4 py-2 w-full">Verify</button>
    <p class="mt-2 text-red-500">{{ message }}</p>

    <div class="mt-6 text-center">
      <button 
        @click="resendOtp" 
        class="text-violet-700 font-semibold"
        :disabled="isResending"
      >
        {{ isResending ? 'Resending...' : "Didn't get the OTP? Resend" }}
      </button>
      <p class="mt-2 text-green-600">{{ resendMessage }}</p>
    </div>
  </div>
</template>
