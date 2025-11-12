<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import Card from "@/components/Card.vue";
import DashboardLayout from "../layout/DashboardLayout.vue";
import SendOrConvertForm from "@/components/general/SendOrConvertForm.vue";
import SuccessOrFail from "@/components/general/SuccessOrFail.vue";
import { ChevronLeftIcon } from "@radix-icons/vue";
import axios from "axios";

const apiBase = import.meta.env.VITE_API_BASE_URL;

const step = ref(1);
const amountToConvert = ref<number | null>(null);
const selectedCurrency = ref("USD");
const receiveCurrency = ref("EUR");
const convertedAmount = ref(0);
const exchangeRates = ref<{ currency: string; buyPrice: number; sellPrice: number }[]>([]);
const loadingRates = ref(false);

// Fetch exchange rates
const fetchRates = async () => {
  try {
    loadingRates.value = true;
    const res = await axios.get(`${apiBase}/api/exchange-rates`, { withCredentials: true });
    exchangeRates.value = res.data.data.rates;
  } catch (err: any) {
    console.error("Error fetching exchange rates:", err.message);
  } finally {
    loadingRates.value = false;
  }
};

// Calculate converted amount
const calculateConversion = () => {
  if (!amountToConvert.value) return 0;
  const rate = exchangeRates.value.find(r => r.currency === receiveCurrency.value)?.buyPrice || 1;
  convertedAmount.value = parseFloat((amountToConvert.value * rate).toFixed(2));
};


const nextStep = () => step.value++ ;
const goBack = () => step.value = Math.max(1, step.value - 1);

// Auto calculate conversion whenever input changes
onMounted(fetchRates);
</script>

<template>
  <DashboardLayout title="Convert Funds">
    <div class="max-w-md pb-12">
      <Card v-if="step === 1" title="Convert Funds">
        <SendOrConvertForm
          originLabel="Amount to Convert"
          destinationLabel="You’ll Receive"
          buttonLabel="Convert Funds"
          type="convert"
          :nextStep="nextStep"
          v-model:amount="amountToConvert"
          v-model:destinationCurrency="receiveCurrency"
          :convertedAmount="convertedAmount"
          :rates="exchangeRates"
          @input="calculateConversion"
        />
      </Card>

      <SuccessOrFail 
        v-if="step === 2"
        cardTitle="Funds Converted"
        message="Funds Converted Succesfully!"
      />

      <button @click="goBack" class="flex gap-2 items-center mt-10">
        <ChevronLeftIcon class="size-6" />
        Go back
      </button>
    </div>
  </DashboardLayout>
</template>
