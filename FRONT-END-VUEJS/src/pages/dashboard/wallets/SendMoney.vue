<script lang="ts" setup>
import Card from "@/components/Card.vue";
import DashboardLayout from "../layout/DashboardLayout.vue";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "@/components/icons";
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "@radix-icons/vue";
import router from "@/router";
import axios from "axios";
import { ref } from "vue";
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import RightModal from "@/components/all-modals/RightModal.vue";
import SendOrConvertForm from "@/components/general/SendOrConvertForm.vue";
import SuccessOrFail from "@/components/general/SuccessOrFail.vue";

const goBack = () => {
  if (sendData.value.step > 1) sendData.value.step -= 1
  else router.go(-1)
}

const sendData = ref({
  step: 1, 
  type: '', 
  recipient: '',
})

const customersList = ref([
  'Olosnsj Asjdj',
  'Banand Loij',
  'Njnsj Asjdj',
  'Sjnsj Asjdj',
])

const newRecipient = ref({
  step: 1,
  currency: '',
  type: '',
  accountName: '',
  accountNumber: '',
  bank: '',
})

const addRecipient = () => {
  const filled = newRecipient.value.type && newRecipient.value.accountName && newRecipient.value.accountNumber && newRecipient.value.bank && newRecipient.value.currency
  if (!filled) return
  newRecipient.value.step += 1
}

const enableNextButton = () => {
  if (sendData.value.step === 1) return !!sendData.value.type
  if (sendData.value.step === 2) return !!sendData.value.recipient
  return true
}

const nextStep = () => {
  if (sendData.value.step < 3) sendData.value.step += 1
}
interface SendMoneyPayload {
  amount: string;
  currency: string;
  receivingCurrency: string;
  description: string;
}

const handleSendMoney = async ({ amount, currency, receivingCurrency, description }: SendMoneyPayload) => {
  try {
    const response = await axios.post("http://localhost:8009/api/wallets/send", {
      amount,
      currency,
      receivingCurrency,
      description,
      accountID: sendData.value.recipient,
      accountType: sendData.value.type,
    }, { withCredentials: true });

    console.log(response.data);
    sendData.value.step = 4;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      alert(`Transfer failed: ${error.response.data.message}`);
    } else {
      console.error("Unexpected error:", error);
    }
  }
}
</script>

<template>
  <DashboardLayout title="Send Money">
    <div class="max-w-[607px]">
      <Card v-if="sendData.step < 4" title="Who are you sending to">
        <div class="flex flex-col gap-10 px-8 pb-12 pt-8">

          <!-- Step 1 -->
          <span v-if="sendData.step === 1" class="flex flex-col gap-10">
            <button @click="sendData.type='bank'" :class="{ 'bg-primary/5': sendData.type === 'bank' }" class="flex items-center gap-x-4 p-6 border rounded-lg">
              <HomeIcon />
              <div>
                <p class="font-semibold">Direct Bank</p>
                <span class="text-xs">Transfer to bank</span>
              </div>
              <ChevronRightIcon class="ml-auto" />
            </button>
            <button @click="sendData.type='mobile'" :class="{ 'bg-primary/5': sendData.type === 'mobile' }" class="flex items-center gap-x-4 p-6 border rounded-lg">
              <HomeIcon />
              <div>
                <p class="font-semibold">Mobile Money</p>
                <span class="text-xs">Transfer to mobile money</span>
              </div>
              <ChevronRightIcon class="ml-auto" />
            </button>
          </span>

          <!-- Step 2 -->
          <div v-if="sendData.step === 2">
            Choose a recipient*
            <Select v-model="sendData.recipient">
              <SelectTrigger><SelectValue placeholder="Select a recipient" /></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>
                    <RightModal title="Customer’s Info" description="Banking Info" :step="newRecipient.step + ''">
                      <template #trigger>
                        <span class="flex gap-2"><PlusIcon class=" bg-primary text-white rounded-full" />Add new recipient</span>
                      </template>
                      <!-- New recipient form omitted for brevity -->
                    </RightModal>
                  </SelectLabel>
                  <SelectItem v-for="customer in customersList" :key="customer" :value="customer">{{ customer }}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <!-- Step 3 -->
          <SendOrConvertForm
            v-if="sendData.step === 3"
            originLabel="You send"
            destinationLabel="Recipient gets"
            buttonLabel="Send Money"
            type="send"
            :nextStep="nextStep"
            @onSendMoney="handleSendMoney"
          />

          <!-- Continue Button -->
          <Button v-if="sendData.step < 3" @click="nextStep" :disabled="!enableNextButton()" class="w-full">
            Continue
            <ArrowRightIcon />
          </Button>
        </div>
      </Card>

      <SuccessOrFail v-if="sendData.step === 4" cardTitle="Transfer Complete" message="Payment Done!" />

      <button @click="goBack" class="flex gap-2 items-center mt-10">
        <ChevronLeftIcon class="size-6" />
        Go back
      </button>
    </div>
  </DashboardLayout>
</template>
