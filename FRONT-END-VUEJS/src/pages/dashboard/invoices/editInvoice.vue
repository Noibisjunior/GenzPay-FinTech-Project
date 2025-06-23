<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-4">Edit Invoice</h2>

    <form v-if="invoice" @submit.prevent="updateInvoice">
      <div class="mb-3">
        <label class="block font-medium">Customer Name</label>
        <input v-model="invoice.customerName" class="border rounded p-2 w-full" required />
      </div>

      <div class="mb-3">
        <label class="block font-medium">Currency</label>
        <input v-model="invoice.currency" class="border rounded p-2 w-full" required />
      </div>

      <div class="mb-3">
        <label class="block font-medium">Issue Date</label>
        <input type="date" v-model="invoice.issueDate" class="border rounded p-2 w-full" required />
      </div>

      <div class="mb-3">
        <label class="block font-medium">Due Date</label>
        <input type="date" v-model="invoice.dueDate" class="border rounded p-2 w-full" required />
      </div>
      
      <div class="mb-3">
        <label class="block font-medium">Status</label>
        <select v-model="invoice.status" class="border p-2 w-full">
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="due">Due</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="block font-medium">Items</label>
        <div v-for="(item, index) in invoice.items" :key="index" class="flex gap-2 mb-2">
          <input v-model="item.description" placeholder="Description" class="border p-2 flex-1" required />
          <input v-model.number="item.amount" type="number" placeholder="Amount" class="border p-2 w-24" required />
          <button type="button" @click="removeItem(index)" class="text-red-500">x</button>
        </div>
        <button type="button" @click="addItem" class="text-blue-500">+ Add Item</button>
      </div>

      <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded">Update Invoice</button>
    </form>

    <div v-else class="text-center">Loading invoice details...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const invoice = ref<any>(null)

const fetchInvoice = async () => {
  try {
    const id = route.params.id
    const response = await axios.get(`http://localhost:8009/api/invoices/${id}`, { withCredentials: true })
    invoice.value = response.data.data
  } catch (error) {
    console.error('Error fetching invoice:', error)
  }
}

onMounted(() => {
  fetchInvoice()
})

const addItem = () => {
  invoice.value.items.push({ description: '', amount: 0 })
}

const removeItem = (index: number) => {
  invoice.value.items.splice(index, 1)
}


// after update, redirect and force-refresh invoices list by adding a refetch param
router.push({ path: '/dashboard/invoices', query: { status: 'all', refetch: Date.now() } })

const updateInvoice = async () => {
  try {
    const id = route.params.id
    await axios.put(`http://localhost:8009/api/invoices/${id}`, invoice.value, {
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})
    router.push({ path: '/dashboard/invoices', query: { status: 'all',refetch: Date.now() } })
  } catch (error) {
    console.error('Error updating invoice:', error)
  }
}
</script>

<style scoped>
input {
  outline: none;
}
</style>

