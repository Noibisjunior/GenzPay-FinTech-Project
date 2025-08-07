<script lang="ts" setup>
import DashboardLayout from "../layout/DashboardLayout.vue";
import {
  ConvertIcon, EuroIcon, GbpIcon, NgnIcon, SendIcon,
  WalletsWhiteIcon, UsdIcon
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import Card from "@/components/Card.vue";
import { ref, onMounted} from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

const route = useRoute();

interface Wallet {
  _id: string;
  userId: string;
  currency: string;
  balance: number;
  createdAt?: string;
  updatedAt?: string;
}

const wallets = ref<Wallet[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

// Utility to return the correct icon
const getCurrencyIcon = (currency: string) => {
  switch (currency) {
    case "NGN": return NgnIcon;
    case "USD": return UsdIcon;
    case "EUR": return EuroIcon;
    case "GBP": return GbpIcon;
    default: return WalletsWhiteIcon;
  }
};

const fetchWallets = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await axios.get('http://localhost:8009/api/balance',{ withCredentials: true });
    wallets.value = [response.data.data];
  } catch (err: any) {
    console.error("Error fetching wallets:", err);
    error.value = err?.response?.data?.message || err.message;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchWallets();
});
</script>

<template>
  <DashboardLayout title="Wallets">
    <div class="flex flex-col sm:flex-row gap-6">
      <RouterLink to="wallets/send" class="grid place-items-center gap-2 text-primary px-4 py-2.5 border bg-primary/5 rounded-lg hover:bg-primary/10">
        <span class="flex gap-2 items-center"><SendIcon /><span>fund your wallet</span></span>
      </RouterLink>

      <RouterLink to="wallets/convert" class="grid place-items-center gap-2 text-primary px-4 py-2.5 border bg-primary/5 rounded-lg hover:bg-primary/10">
        <span class="flex gap-2 items-center"><ConvertIcon /><span>Convert Funds</span></span>
      </RouterLink>

      <RouterLink to="wallets/withdraw" class="grid place-items-center gap-2 text-primary px-4 py-2.5 border bg-primary/5 rounded-lg hover:bg-primary/10">
        <span class="flex gap-2 items-center"><WalletsWhiteIcon /><span>withdraw funds</span></span>
      </RouterLink>
      </div>

    <div class="max-w-[800px] mx-auto mt-12 flex flex-col gap-6">
      <h2 class="text-2xl font-semibold mb-2">Wallets Overview</h2>

      <div v-if="isLoading" class="text-center py-10 text-muted-foreground">Loading wallets...</div>

      <div v-else-if="error" class="text-center text-red-500 py-10">
        {{ error }}
      </div>

      <div v-else-if="wallets.length === 0" class="text-center text-muted-foreground py-12">
        No wallets found. Create one to get started.
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          v-for="wallet in wallets"
          :key="wallet._id"
          :title="`Wallet: ${wallet.currency}`"
        >
          <div class="flex flex-col gap-4 p-6">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Balance</span>
              <span class="font-semibold text-lg">{{ wallet.balance}} {{ wallet.currency }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Currency</span>
              <span>{{ wallet.currency }}</span>
            </div>
            <div class="flex justify-center">
              <component :is="getCurrencyIcon(wallet.currency)" class="w-6 h-6" />
            </div>
            <Button variant="outline" class="w-full mt-4">View Details</Button>
          </div>
        </Card>
      </div>
    </div>
  </DashboardLayout>
</template>
