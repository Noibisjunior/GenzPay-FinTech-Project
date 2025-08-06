<script lang="ts" setup>
import DashboardLayout from "../layout/DashboardLayout.vue";
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const loading = ref(true)
const verified = ref(false)
const message = ref('')
const reference = ref<string | null>(null)

const route = useRoute()

onMounted(async () => {
  reference.value = route.query.reference as string

  if (!reference.value) {
    message.value = 'No payment reference found.'
    loading.value = false
    return
  }

  try {
    const res = await fetch(`http://localhost:8009/api/verify-payment?reference=${reference.value}`)
    const data = await res.json()

    if (data.success) {
      verified.value = true
      message.value = "We've confirmed your payment. Your wallet will be credited shortly."
    } else {
      verified.value = false
      message.value = data.message || 'Verification failed.'
    }
  } catch (err) {
    verified.value = false
    message.value = 'Network error. Please try again.'
  } finally {
    loading.value = false
  }
})
</script>


<template>
  <DashboardLayout title="Send Money">
    <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <h1 v-if="loading">Verifying your payment...</h1>
      <div v-else-if="verified" class="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        <h1 class="text-2xl font-semibold text-gray-800 mb-2">Payment Successful!</h1>
        <div class="bg-gray-50 rounded-md p-3 text-sm text-gray-500 mb-4">
          <p class="text-gray-600 mb-4">{{ message }}</p>
          <strong>Reference:</strong> {{ reference }}
        </div>

        <router-link
          to="/dashboard/wallets"
          class="inline-block mt-2 bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition duration-200"
        >
          View Wallet
        </router-link>
      </div>
      <div v-else>
      <h1>Payment Failed</h1>
      <p>{{ message }}</p>
    </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
@keyframes bounce {
  0%, 100% {
    transform: translateY(-10%);
  }
  50% {
    transform: translateY(0);
  }
}
.animate-bounce {
  animation: bounce 1s infinite;
}
</style>
