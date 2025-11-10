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
const beneficiaryName = ref<string>('')
const narration = ref<string>('')
const debitCurrency = ref<string>('NGN')
const destinationBranchCode = ref<string>('GH280103')
const callbackUrl = ref<string>('https://webhook.site/your-sandbox-webhook-url')

const isLoading = ref<boolean>(false)
const error = ref<string>('')
const success = ref<string>('')

// Fetch list of banks (via backend proxy endpoint)
const fetchBanks = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/payment/banks`)
    banks.value = response.data.data
  } catch (err) {
    console.error('Failed to fetch banks:', err)
    error.value = 'Unable to load banks. Please refresh or try again later.'
  }
}

onMounted(fetchBanks)

// Reset all fields
const resetForm = () => {
  selectedBankCode.value = ''
  accountNumber.value = ''
  amount.value = null
  beneficiaryName.value = ''
  narration.value = ''
}

// Handle transfer submission
const handleSubmit = async () => {
  if (!selectedBankCode.value || !accountNumber.value || !amount.value || !beneficiaryName.value) {
    error.value = 'Please fill in all required fields.'
    return
  }

  isLoading.value = true
  error.value = ''
  success.value = ''

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/payment/withdraw`,
      {
        bank_code: selectedBankCode.value,
        account_number: accountNumber.value,
        amount: amount.value,
        beneficiary_name: beneficiaryName.value,
        narration: narration.value,
        debit_currency: debitCurrency.value,
        destination_branch_code: destinationBranchCode.value,
        callback_url: callbackUrl.value,
      },
      { withCredentials: true }
    )

    if (response.status === 200) {
      success.value = '✅ Transfer simulated successfully (Sandbox Mode).'
      resetForm()
    } else {
      throw new Error('Unexpected server response')
    }
  } catch (err: any) {
    console.error(err)
    error.value =
      err.response?.data?.error ||
      err.response?.data?.details?.message ||
      'Transfer failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div
    class="max-w-md mx-auto mt-10 p-6 rounded-2xl shadow-xl border border-gray-200 bg-white"
  >
    <h2 class="text-2xl font-bold mb-2 text-gray-800 text-center">Send to Bank Account</h2>
    <p class="text-sm text-gray-500 mb-6 text-center">
      This is a <strong>Flutterwave Sandbox</strong> simulation — no real transfers occur.
    </p>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Bank -->
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

      <!-- Account Number -->
      <div>
        <label for="accountNumber" class="block font-medium text-gray-700">Account Number</label>
        <input
          v-model="accountNumber"
          type="text"
          id="accountNumber"
          maxlength="10"
          pattern="\d{10}"
          placeholder="10-digit account number"
          class="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
          required
        />
      </div>

      <!-- Beneficiary Name -->
      <div>
        <label for="beneficiaryName" class="block font-medium text-gray-700">Beneficiary Name</label>
        <input
          v-model="beneficiaryName"
          type="text"
          id="beneficiaryName"
          placeholder="Enter beneficiary's name"
          class="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
          required
        />
      </div>

      <!-- Amount -->
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

      <!-- Narration -->
      <div>
        <label for="narration" class="block font-medium text-gray-700">Narration (optional)</label>
        <textarea
          v-model="narration"
          id="narration"
          rows="3"
          placeholder="e.g. Payment for goods"
          class="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-300"
        ></textarea>
      </div>

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {{ isLoading ? 'Processing...' : 'Send Money' }}
      </button>
    </form>

    <!-- Feedback -->
    <p v-if="error" class="mt-4 text-red-600 text-sm text-center">{{ error }}</p>
    <p v-if="success" class="mt-4 text-green-600 text-sm text-center">{{ success }}</p>
  </div>
</template>
