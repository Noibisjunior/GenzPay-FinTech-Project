<script lang="ts" setup>
import axios from 'axios';
import { ref } from 'vue';
import DashboardLayout from "../layout/DashboardLayout.vue";

const fullName = ref('')
const email = ref('')
const amount = ref<number | null>(null)
const description = ref('')
const currency = ref('')
const isProcessing = ref(false)

const isLoading = ref(false);

const payWithPaystack = async () => {
  if (!email.value || !amount.value || !fullName.value) {
    alert("All details are required");
    return;
  }
isProcessing.value = true
  isLoading.value = true;

  try {
    const response = await axios.post('http://localhost:8009/api/payment/initiate', {
      fullName: fullName.value,
      email: email.value,
      amount: amount.value,
      description: description.value,
      currency: currency.value
  },
    {withCredentials:true});

    const { authorization_url } = response.data.data;
    window.location.href = authorization_url;
  } catch (error) {
    console.error(error);
    alert("Payment could not be initiated.");
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <DashboardLayout title="Send Money">
  <div class="p-4 max-w-md mx-auto">
    <h1 class="text-xl font-bold mb-4">Send Money</h1>
    <form @submit.prevent="payWithPaystack" class="space-y-4">
      <div class="mb-3">
        <label class="block font-medium">Full Name</label>
    <input v-model="fullName" class="border rounded p-2 w-full" required />
</div>
<div class="mb-3">
    <label class="block font-medium">Email</label>
    <input type="email" v-model="email" class="border rounded p-2 w-full" required />
</div> 

<div class="mb-3">
  <label class="block font-medium"> Chose your currency</label>
<select v-model="currency" class="border p-2 w-full" required>
  <option value="NGN">NGN - Naira</option>
  <option value="USD">USD - Dollar</option>
  <option value="GHS">GHS - Cedi</option>
  <option value="ZAR">ZAR - Rand</option>
</select>
    <label class="block font-medium">Amount</label>
    <input type="number" v-model="amount" class="border rounded p-2 w-full" required />
</div>
<div class="mb-3">
    <label class="block font-medium">Purpose</label>
    <input v-model="description" class="border rounded p-2 w-full" placeholder="'Sending money to John'" />
</div>
    <button :disabled="isProcessing" class="bg-purple-700 text-white py-2 px-10 rounded">Send</button>
    </form>
  </div>
  </DashboardLayout>
</template>