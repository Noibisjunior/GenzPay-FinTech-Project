<script lang="ts" setup>
import DashboardLayout from "../layout/DashboardLayout.vue";

import Card from "@/components/Card.vue";
import {
  AllAccountsIcon,
  CardIcon,
  CardWhiteIcon,
  ConvertIcon,
  EuroIcon,
  GbpIcon,
  HomeIcon,
  InvoicesIcon,
  InvoicesWhiteIcon,
  NgnIcon,
  SendIcon,
  UsdIcon,
} from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AccountDetailsModal, { AccountDetailsProps } from "@/components/all-modals/AccountDetailsModal.vue";

import { ref, shallowRef } from "vue";

const accounts = shallowRef({
  all: {
    balance: 5000,
    name: "All Accounts",
    icon: AllAccountsIcon,
  },
  usd: {
    balance: 1500,
    name: "USD",
    icon: UsdIcon,
    symbol: "$",
  },
  gbp: {
    balance: 1000,
    name: "GBP",
    icon: GbpIcon,
    symbol: "£",
  },
  eur: {
    balance: 1100,
    name: "EUR",
    icon: EuroIcon,
    symbol: "€",
  },
  ngn: {
    balance: 1400,
    name: "NGN",
    icon: NgnIcon,
    symbol: "₦",
  },
});

const quickActions = {
  send: {
    title: "Send Money",
    icon: SendIcon,
    url: "/dashboard/wallets/send",
    color: "blue",
  },
  convert: {
    title: "Convert",
    icon: ConvertIcon,
    url: "/dashboard/wallets/convert",
    color: "green",
  },
  createInvoice: {
    title: "Create new invoice",
    icon: InvoicesIcon,
    url: "/dashboard/invoices/new",
    color: "yellow",
  },
};

const receivePayments = {
  usd: {
    title: "US Dollar",
    description:
      "Wire routing number, Bank code (SWIFT/BIC), Routing number (ACH or ABA), Account number",
  },
  pounds: {
    title: "British Pounds",
    description: "UK sirt code, Account bumber, IBAN",
  },
  euros: {
    title: "Euros",
    description: "IBAN, Bank code (SWIFT/IBC)",
  },
};

const exchangeRates = shallowRef({
  eur: {
    currency: "EUR",
    buying: 1320,
    selling: 1390,
    icon: EuroIcon,
    symbol: "€",
  },
  gbp: {
    currency: "GBP",
    buying: 1755,
    selling: 1852,
    icon: GbpIcon,
    symbol: "£",
  },
  usd: {
    currency: "USD",
    buying: 1320,
    selling: 1245,
    icon: UsdIcon,
    symbol: "$",
  },
});

const accountDetails = ref<AccountDetailsProps>({
  accountHolder: {
    value: "Nnabuife Elijdh",
    label: "Account Holder",
  },
  bankName: {
    value: "WELLS FARGO BANK, N.A.",
    label: "Bank Name",
  },
  accountNumber: {
    value: "40630101689676683",
    label: "Account Number",
  },
  rountingNumber: {
    value: "110000000",
    label: "Rounting Number",
  },
  accountType: {
    value: "Checking",
    label: "Account Type",
  },
  address: {
    value: "651 North Broad Street, Suite 206, Middletown ,19709 Delaware, USA",
    label: "Address",
  },
})
</script>

<template>
  <DashboardLayout
    title="Welcome Olivia"
    greeting="Good morning, have a great day!"
  >
    <div class="mb-16 flex flex-col gap-y-10">

      <!-- Account Balance -->
      <Card title="Account Balance">
        <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-8 pb-10 pt-8">
          <Card
            v-for="account in accounts"
            :key="account.name"
            title="Tasks"
            :reverseBg="true"
            :heightSmall="true"
          >
            <template #action-button>
              <div class="flex items-center gap-2">
                <component :is="account.icon" />
                <p class="font-bold">{{ account.name }}</p>
              </div>
            </template>
            <div class="px-4 pb-7 pt-11">
              <div class="flex flex-col items-start justify-center gap-1">
                <div class="text-xs font-normal leading-tight text-slate-600">
                  Available Balance
                </div>
                <div class="text-2xl font-semibold leading-9 text-slate-800">
                  ${{ account.balance }}
                </div>
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
            class="rounded-lg border-2 py-6"
            :class="{
              'border-2 border-blue-border bg-blue-foreground text-blue hover:bg-blue-border':
                action.color === 'blue',
              'border-2 border-green-border bg-green-foreground text-green hover:bg-green-border':
                action.color === 'green',
              'border-2 border-yellow-border bg-yellow-foreground text-yellow hover:bg-yellow-border':
                action.color === 'yellow',
            }"
          >
            <div class="flex items-center justify-center gap-2">
              <component :is="action.icon" />
              <span class="font-semibold">{{ action.title }}</span>
            </div>
          </RouterLink>
        </div>
      </Card>

      <!-- Recieve Payments -->
      <div class="grid md:grid-cols-2 gap-10 md:gap-4">
        <Card title="Recieve Payments">
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
                <span class="max-w-80 text-xs text-muted-foreground">{{
                  account.description
                }}</span>
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
            <div class="text-transparent">.</div>

            <RouterLink to="/dashboard/invoices/new" >
              <Button class="flex item-center w-full gap-2 font-semibold">
                <InvoicesWhiteIcon />
                Create new invoice
              </Button>
            </RouterLink>
          </div>
        </Card>
      </div>

      <!-- Exchange Rates -->
      <div class="grid md:grid-cols-3 gap-10 md:gap-4">
        <Card title="Exchange Rates" class="md:col-span-2">
          <div class="px-6">
            <table
              v-for="rate in exchangeRates"
              :key="rate.currency"
              class="my-3 w-full table-fixed px-6 text-center text-xs text-muted-foreground"
            >
              <thead class="border-b">
                <tr>
                  <th class="py-2 text-left font-normal">Currency</th>
                  <th class="font-normal">Buying</th>
                  <th class="font-normal">Selling</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    class="flex items-center gap-x-2 py-2 text-left text-base font-semibold"
                  >
                    <component :is="rate.icon" />
                    {{ rate.currency }} {{ rate.symbol }}
                  </td>
                  <td>₦{{ rate.buying }}</td>
                  <td>₦{{ rate.selling }}</td>
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
              >Once you create a card, the information appears here</span
            >
            <RouterLink class="w-full" to="/dashboard/cards" >
              <Button class="w-full font-semibold gap-2">
                <CardWhiteIcon />
                Create new card
              </Button>
            </RouterLink>
          </div>
        </Card>
      </div>
    </div>
  </DashboardLayout>
</template>

<style></style>
