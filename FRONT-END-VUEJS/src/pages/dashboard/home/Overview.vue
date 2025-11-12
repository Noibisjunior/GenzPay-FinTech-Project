<script lang="ts" setup>
import DashboardLayout from "../layout/DashboardLayout.vue";
import Card from "@/components/Card.vue";
import {
  SendIcon,
  ConvertIcon,
  InvoicesIcon,
  InvoicesWhiteIcon,
  EuroIcon,
  GbpIcon,
  UsdIcon,
  CardIcon,
  CardWhiteIcon,
  HomeIcon
} from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AccountDetailsModal, { AccountDetailsProps } from "@/components/all-modals/AccountDetailsModal.vue";
import axios from "axios";
import { onMounted, ref, shallowRef, computed } from "vue";
import { RouterLink } from "vue-router";

const wallets = ref<Wallet[]>([]);
const username = ref("");
const isLoading = ref(true);
const error = ref<string | null>(null);
const exchangeRates = shallowRef([]);

const apiBase = import.meta.env.VITE_API_BASE_URL;

const fetchDashboardData = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const [walletRes, userRes, ratesRes] = await Promise.all([
      axios.get(`${apiBase}/balance`, { withCredentials: true }),
      axios.get(`${apiBase}/auth/me`, { withCredentials: true }),
      axios.get(`${apiBase}/exchange-rates`, { withCredentials: true })
    ]);

    wallets.value = walletRes.data?.data ? [walletRes.data.data] : [];
    username.value = userRes.data?.user?.username || "User";
    exchangeRates.value = ratesRes.data?.data?.rates || [];
  } catch (err: any) {
    console.error("Dashboard fetch error:", err);
    error.value = err?.response?.data?.message || err.message;
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchDashboardData);

// Quick Actions 
const quickActions = [
  {
    title: "Send Money",
    icon: SendIcon,
    url: "/dashboard/wallets/send",
    color: "blue"
  },
  {
    title: "Convert Funds",
    icon: ConvertIcon,
    url: "/dashboard/wallets/convert",
    color: "green"
  },
  {
    title: "Create Invoice",
    icon: InvoicesIcon,
    url: "/dashboard/invoices/new",
    color: "yellow"
  }
];

// Receive Payments
const receivePayments = [
  {
    title: "US Dollar",
    description:
      "Wire routing number, Bank code (SWIFT/BIC), Routing number (ACH or ABA), Account number"
  },
  {
    title: "British Pounds",
    description: "UK sort code, Account number, IBAN"
  },
  {
    title: "Euros",
    description: "IBAN, Bank code (SWIFT/BIC)"
  }
];

// Account Details 
const accountDetails = ref<AccountDetailsProps>({
  accountHolder: { value: "Abdulsalaam", label: "Account Holder" },
  bankName: { value: "WELLS FARGO BANK, N.A.", label: "Bank Name" },
  accountNumber: { value: "40630101689676683", label: "Account Number" },
  rountingNumber: { value: "110000000", label: "Routing Number" },
  accountType: { value: "Checking", label: "Account Type" },
  address: {
    value: "651 North Broad Street, Suite 206, Middletown, Delaware, USA",
    label: "Address"
  }
});

// Greeting helper function
const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
});
</script>

<template>
  <DashboardLayout title='Homepage'>
    <div class="mb-16 flex flex-col gap-y-10">
   
      <h1 class="text-2xl font-semibold">
        {{ greeting }}, {{ username }} 
      </h1>

      
      <div v-if="isLoading" class="text-center py-10 text-gray-500">
        Loading your dashboard...
      </div>

    
      <div v-else-if="error" class="text-center text-red-500 py-10">
        {{ error }}
      </div>

      <!-- Main Content -->
      <template v-else>
        <!-- Wallets -->
        <Card title="Wallet Balance">
          <div class="grid sm:grid-cols-1 md:grid-cols-2 gap-2 px-4 pb-5 pt-5">
            <Card
              v-for="wallet in wallets"
              :key="wallet._id"
              :title="`Wallet: ${wallet.currency}`"
            >
              <div class="flex flex-col gap-4 p-6">
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Balance</span>
                  <span class="font-semibold text-lg">
                    {{ wallet.balance }} {{ wallet.currency }}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </Card>

        <!-- Quick Actions -->
        <Card title="Quick Actions">
          <div class="grid md:grid-cols-3 gap-4 px-8 py-8">
            <RouterLink
              v-for="action in quickActions"
              :key="action.title"
              :to="action.url"
              class="rounded-lg border-2 py-6 text-center transition-all duration-200"
              :class="{
                'border-blue-border bg-blue-foreground text-blue hover:bg-blue-border': action.color === 'blue',
                'border-green-border bg-green-foreground text-green hover:bg-green-border': action.color === 'green',
                'border-yellow-border bg-yellow-foreground text-yellow hover:bg-yellow-border': action.color === 'yellow'
              }"
            >
              <div class="flex items-center justify-center gap-2">
                <component :is="action.icon" />
                <span class="font-semibold">{{ action.title }}</span>
              </div>
            </RouterLink>
          </div>
        </Card>

        <!-- Receive Payments & Invoices -->
        <div class="grid md:grid-cols-2 gap-10 md:gap-4">
          <Card title="Receive Payments">
            <div class="flex flex-col">
              <AccountDetailsModal
                v-for="account in receivePayments"
                :key="account.title"
                :accountDetails="accountDetails"
              >
                <button
                  class="flex gap-x-4 px-8 py-7 even:bg-background hover:bg-muted-background"
                >
                  <HomeIcon />
                  <div class="flex flex-col text-left">
                    <p class="font-semibold">{{ account.title }}</p>
                    <span class="max-w-80 text-xs text-muted-foreground">
                      {{ account.description }}
                    </span>
                  </div>
                </button>
              </AccountDetailsModal>
            </div>
          </Card>

          <!-- Invoices -->
          <Card title="Invoices">
            <div class="flex flex-col px-6 pb-8">
              <div class="flex flex-col divide-y">
                <div class="flex justify-between py-5">
                  <span>0 Person</span>
                  <Badge variant="destructive">Due</Badge>
                </div>
                <div class="flex justify-between py-5">
                  <span>0 Person</span>
                  <Badge variant="destructive">Overdue</Badge>
                </div>
                <div class="flex justify-between py-5">
                  <span>0 Person</span>
                  <Badge variant="secondary">Awaiting approval</Badge>
                </div>
              </div>

              <RouterLink to="/dashboard/invoices/new">
                <Button class="flex items-center w-full gap-2 font-semibold mt-6">
                  <InvoicesWhiteIcon />
                  Create new invoice
                </Button>
              </RouterLink>
            </div>
          </Card>
        </div>

        <!-- Exchange Rates & Cards -->
        <div class="grid md:grid-cols-3 gap-10 md:gap-4">
          <Card title="Exchange Rates" class="md:col-span-2">
            <div class="px-6">
              <table
                v-for="rate in exchangeRates"
                :key="rate.currency"
                class="my-3 w-full table-fixed text-center text-xs text-muted-foreground"
              >
                <thead class="border-b">
                  <tr>
                    <th class="py-2 text-left font-normal">Currency</th>
                    <th class="font-normal">Buy</th>
                    <th class="font-normal">Sell</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      class="flex items-center gap-x-2 py-2 text-left text-base font-semibold"
                    >
                      <component :is="rate.icon" />
                      {{ rate.currency }}
                    </td>
                    <td>₦{{ rate.buyPrice }}</td>
                    <td>₦{{ rate.sellPrice }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <!-- Cards -->
          <Card title="Cards">
            <div class="flex flex-col items-center px-6 pb-16 pt-12">
              <CardIcon />
              <div class="my-2 text-2xl font-semibold">No cards yet</div>
              <span
                class="mb-10 max-w-60 text-center text-sm text-muted-foreground"
              >
                Once you create a card, the information appears here
              </span>
              <RouterLink class="w-full" to="/dashboard/cards">
                <Button class="w-full font-semibold gap-2">
                  <CardWhiteIcon />
                  Create new card
                </Button>
              </RouterLink>
            </div>
          </Card>
        </div>
      </template>
    </div>
  </DashboardLayout>
</template>
