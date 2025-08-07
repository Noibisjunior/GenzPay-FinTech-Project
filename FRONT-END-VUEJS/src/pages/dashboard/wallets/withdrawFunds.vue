<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface Bank {
  name: string
  code: string
}

const banks = ref<Bank[]>([])
const selectedBankCode = ref<string>('')
const accountNumber = ref<string>('')
const amount = ref<number | null>(null)
const description = ref<string>('')

const isLoading = ref<boolean>(false)
const error = ref<string>('')
const success = ref<boolean>(false)

const fetchBanks = async () => {
  try {
    const response = await axios.get('https://api.paystack.co/bank?currency=NGN')
    banks.value = response.data.data
  } catch (err) {
    console.error('Failed to fetch banks:', err)
    error.value = 'Unable to load banks. Please refresh or try again later.'
  }
}

onMounted(fetchBanks)

const resetForm = () => {
  selectedBankCode.value = ''
  accountNumber.value = ''
  amount.value = null
  description.value = ''
}

const handleSubmit = async () => {
  if (!selectedBankCode.value || !accountNumber.value || !amount.value) {
    error.value = 'Please fill in all required fields.'
    return
  }

  isLoading.value = true
  error.value = ''
  success.value = false

  try {
    const response = await axios.post(
      'http://localhost:8009/api/payment/withdraw',
      {
        bank_code: selectedBankCode.value,
        account_number: accountNumber.value,
        amount: amount.value,
        description: description.value,
      },
      { withCredentials: true }
    )

    if (response.status === 200) {
      success.value = true
      resetForm()
    } else {
      throw new Error('Unexpected server response')
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || 'Transfer failed.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto mt-10 p-6 rounded-xl shadow-lg border bg-white">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">Send Money to Bank Account</h2>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="bank" class="block font-medium text-gray-700">Select Bank</label>
        <select
          v-model="selectedBankCode"
          id="bank"
          class="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
          required
        >
          <option value="" disabled>Select your bank</option>
          <option v-for="bank in banks" :key="bank.code" :value="bank.code">
            {{ bank.name }}
          </option>
        </select>
      </div>

      <div>
        <label for="accountNumber" class="block font-medium text-gray-700">Account Number</label>
        <input
          v-model="accountNumber"
          type="number"
          id="accountNumber"
          maxlength="10"
          pattern="\\d{10}"
          placeholder="10-digit account number"
          class="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
          required
        />
      </div>

      <div>
        <label for="amount" class="block font-medium text-gray-700">Amount (₦)</label>
        <input
          v-model.number="amount"
          type="number"
          id="amount"
          min="100"
          placeholder="Minimum ₦100"
          class="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
          required
        />
      </div>

      <div>
        <label for="description" class="block font-medium text-gray-700">Description (optional)</label>
        <textarea
          v-model="description"
          id="description"
          rows="3"
          class="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
        />
      </div>

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        {{ isLoading ? 'Sending...' : 'Send Money' }}
      </button>
    </form>

    <p v-if="error" class="mt-4 text-red-600 text-sm">{{ error }}</p>
    <p v-if="success" class="mt-4 text-green-600 text-sm">Transfer successful!</p>
  </div>
</template>
