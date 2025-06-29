<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'

const props = defineProps({
  originLabel: String,
  destinationLabel: String,
  buttonLabel: String,
  type: String,
  nextStep: Function
})

const emit = defineEmits(['onSendMoney'])

const amount = ref('')
const currency = ref('USD')
const receivingCurrency = ref('USD')
const description = ref('')

const submit = () => {
  emit('onSendMoney', {
    amount: amount.value,
    currency: currency.value,
    receivingCurrency: receivingCurrency.value,
    description: description.value
  })
  props.nextStep && props.nextStep()
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div>
      <Label>{{ originLabel }}</Label>
      <Input v-model="amount" placeholder="Enter amount" type="number" />
    </div>

    <div>
      <Label>Currency</Label>
      <Select v-model="currency">
        <SelectTrigger>
          <SelectValue placeholder="Select Currency" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="USD">USD</SelectItem>
            <SelectItem value="NGN">NGN</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>

    <div>
      <Label>{{ destinationLabel }}</Label>
      <Select v-model="receivingCurrency">
        <SelectTrigger>
          <SelectValue placeholder="Select Currency" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="USD">USD</SelectItem>
            <SelectItem value="NGN">NGN</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>

    <div>
      <Label>Description</Label>
      <Input v-model="description" placeholder="Optional note" />
    </div>

    <Button @click="submit" class="w-full">
      {{ buttonLabel }}
    </Button>
  </div>
</template>
