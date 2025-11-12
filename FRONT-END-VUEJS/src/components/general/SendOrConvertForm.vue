<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import axios from 'axios'

const apiBase = import.meta.env.VITE_API_BASE_URL;

const props = defineProps({
  originLabel: String,
  destinationLabel: String,
  buttonLabel: String,
  type: String,
  nextStep: Function
})

const emit = defineEmits(['onSendMoney'])

const amount = ref<number | string | undefined>(undefined)
const currency = ref('USD')
const receivingCurrency = ref('USD')
const convertedAmount = ref(0)
const rates = ref<{ currency: string, buyPrice: number }[]>([])
const loadingRates = ref(false)

// Fetch exchange rates from backend
const fetchRates = async () => {
  try {
    loadingRates.value = true
    const res = await axios.get(`${apiBase}/api/exchange-rates`, { withCredentials: true })
    rates.value = res.data.data.rates
  } catch (err: any) {
    console.error('Error fetching rates:', err.message)
  } finally {
    loadingRates.value = false
  }
}

// Compute converted amount whenever amount or receiving currency changes
const calculateConversion = () => {
  if (!amount.value) {
    convertedAmount.value = 0
    return
  }
  const rate = rates.value.find(r => r.currency === receivingCurrency.value)?.buyPrice || 1
  convertedAmount.value = parseFloat(((Number(amount.value) || 0) * rate).toFixed(2))
}

// Watch for changes
watch([amount, receivingCurrency], calculateConversion)

// Handle form submission
const submit = () => {
  if (!amount.value || !currency.value || !receivingCurrency.value) return
  emit('onSendMoney', {
    amount: amount.value,
    currency: currency.value,
    receivingCurrency: receivingCurrency.value,
    convertedAmount: convertedAmount.value
  })
  props.nextStep && props.nextStep()
}

// Initial fetch
onMounted(fetchRates)
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Amount -->
    <div>
      <Label>{{ originLabel }}</Label>
      <Input v-model.number="amount" placeholder="Enter amount" type="number" />
    </div>

    <!-- From Currency -->
    <div>
      <Label>Currency</Label>
      <Select v-model="currency">
        <SelectTrigger>
          <SelectValue placeholder="Select Currency" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem v-for="rate in rates" :key="rate.currency" :value="rate.currency">
              {{ rate.currency }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>

    <!-- To Currency -->
    <div>
      <Label>{{ destinationLabel }}</Label>
      <Select v-model="receivingCurrency">
        <SelectTrigger>
          <SelectValue placeholder="Select Currency" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem v-for="rate in rates" :key="rate.currency" :value="rate.currency">
              {{ rate.currency }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <div class="mt-2 text-sm text-muted-foreground">
        You will receive: {{ convertedAmount.toLocaleString() }} {{ receivingCurrency }}
      </div>
    </div>

    <Button :disabled="loadingRates || !amount" @click="submit" class="w-full">
      {{ buttonLabel }}
    </Button>
  </div>
</template>
