<script lang="ts" setup>
import Card from "@/components/Card.vue";
import DashboardLayout from "../layout/DashboardLayout.vue";
import router from "@/router";
import { ref } from "vue";
import SuccessOrFail from "@/components/general/SuccessOrFail.vue";
import SendOrConvertForm from "@/components/general/SendOrConvertForm.vue";
import { ChevronLeftIcon } from "@radix-icons/vue";

const sendData = ref({
  step: 1, 
  type: '', 
  convertCurrencyIndex: 0,
  amountToConvert: '', 
  amountToReceive: '',
  receiveCurrencyIndex: 3,
})

const goBack = () => {
  if (sendData.value.step === 2)
    sendData.value.step -= 1
  router && router.go(-1)
}

const nextStep = () => {

  switch (sendData.value.step) {
    case 1:
      sendData.value.step += 1
      router && router.push({ query: { 
        type: sendData.value.type, 
        step: sendData.value.step 
      } })
      break;
    case 2:
      sendData.value.step += 1
      break;
  
    default:
      sendData.value.step = 1
      break;
  }
}

</script>
<template>
  <DashboardLayout
    title="Convert Funds"
  >
  <div class="max-w-[607px] pb-12">
    <Card v-if="sendData.step === 1" title="Convert Funds">
      <SendOrConvertForm
        originLabel="Amount to Convert"
        destinationLabel="You’ll recieve"
        buttonLabel="Convert Funds"
        type="convert"
        :nextStep="nextStep"
      />
    </Card>

    <SuccessOrFail 
      v-if="sendData.step === 2"
      cardTitle="Fund Converted"
      :callbackLabel="'Download reciept'"
      :copyBtnLabel="'Copy Invoice Link'"
      :copyValue="'https://google.com'"
      message="Transaction Complete!"
    />

    <button @click="goBack" class="flex gap-2 items-center mt-10">
      <ChevronLeftIcon class="size-6" />
      Go back
    </button>
  </div>
</DashboardLayout>
</template>
