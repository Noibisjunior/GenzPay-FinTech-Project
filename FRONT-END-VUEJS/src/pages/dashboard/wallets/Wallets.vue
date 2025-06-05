<script lang="ts" setup>
import DashboardLayout from "../layout/DashboardLayout.vue";
import { ConvertIcon, EuroIcon, GbpIcon, NgnIcon, SendIcon, UsdIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Card from "@/components/Card.vue";
import { ref } from "vue";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRightIcon,
  CaretSortIcon,
  CopyIcon,
} from "@radix-icons/vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import AccountDetailsModal, { AccountDetailsProps } from "@/components/all-modals/AccountDetailsModal.vue";

const selectedCurrencyIndex = ref(0)

const currencies = [
  {
    name: "NGN",
    fullName: "Nigerian Naira",
    symbol: "₦",
    icon: NgnIcon,
  },
  {
    name: "USD",
    fullName: "US Dollar",
    symbol: "$",
    icon: UsdIcon,
  },
  {
    name: "GBP",
    fullName: "British Pound",
    symbol: "£",
    icon: GbpIcon,
  },
  {
    name: "EUR",
    fullName: "Euro",
    symbol: "€",
    icon: EuroIcon,
  },
]

const transactions = ref([
  {
    date: "Aug 03",
    name: "Nnabuife Elijah",
    amount: "-$1,708",
    sender: "Elijah",
    status: "Sucessful",
    type: "Transfer",
  },
  {
    date: "Aug 03",
    name: "Nnabuife Elijbh",
    amount: "-$1,708",
    sender: "Elijah",
    status: "Refunded",
    type: "Transfer",
  },
  {
    date: "Aug 03",
    name: "Nnabuife Elijch",
    amount: "-$1,708",
    sender: "Elijah",
    status: "Sucessful",
    type: "Fund Wallet",
  },
  {
    date: "Aug 03",
    name: "Nnabuife Elijdh",
    amount: "-$1,708",
    sender: "Elijah",
    status: "Sucessful",
    type: "Transfer",
  },
]);

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
  <DashboardLayout title="Wallets">
    <div class="flex flex-col gap-y-10 pb-12">
      <div class="flex flex-col sm:flex-row gap-6">
        <RouterLink to="wallets/send" class="grid place-items-center sm:place-items-start gap-2 text-primary px-4 py-2.5 border bg-primary/5 rounded-lg hover:bg-primary/10">
          <span class="flex gap-2 items-center">
            <SendIcon />
            <span>Send Money</span>
          </span>
        </RouterLink>
        <RouterLink to="wallets/convert" class="grid place-items-center sm:place-items-start gap-2 text-primary px-4 py-2.5 border bg-primary/5 rounded-lg hover:bg-primary/10">
          <span class="flex gap-2 items-center">
            <ConvertIcon />
            <span>Convert Funds</span>
          </span>
          
        </RouterLink>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          title="Tasks"
          :heightSmall="true"
        >
          <template #action-button>
            <div class="flex items-center justify-between w-full py-0.5 px-2">
              <div class="flex items-center gap-2 mr-auto">
                <component :is="currencies[selectedCurrencyIndex].icon" />
                <p class="font-bold">{{ currencies[selectedCurrencyIndex].name }} ({{ currencies[selectedCurrencyIndex].symbol }})</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="outline" class="flex items-center rounded gap-2 hover:bg-muted-background/5">
                    Switch
                    <CaretSortIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent class="w-48 px-3 py-2">
                  <span
                    v-for="(currency, index) in currencies"
                    :key="currency.name"
                  >
                  <DropdownMenuLabel
                    @click="selectedCurrencyIndex = index"
                    class="cursor-pointer hover:bg-muted-background/15"
                  >
                    <div class="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                      <component :is="currency.icon" />
                      <span>{{ currency.fullName }} ({{ currency.symbol }})</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator v-if="currencies.length - 1 > index" />
                  </span>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </template>
          <div class="px-6 pt-4">
            <div class="text-[32px] font-semibold leading-9 text-slate-800 mb-8">
                $ 5,000
              </div>
            <Button variant="outline" class="flex items-center hover:bg-muted-background/5 text-[8px] font-semibold rounded py-1 px-3 gap-2">
                View details
                <ArrowRightIcon class="size-6 stroke-2" />
              </Button>
              <div class="flex w-full">
                <RouterLink
                  to=""
                  class="ml-auto mt-9 flex items-center gap-x-2 text-xs font-semibold text-primary"
                >
                  Account Statement
                  <ArrowRightIcon class="size-5" />
                </RouterLink>
              </div>
          </div>
          
        </Card>
        <Card title="USD" :height-small="true">
          <template #action-button>
              <div class="flex items-center justify-between w-full py-2 px-2">
                <div class="font-bold">Receiving Account</div>
                <AccountDetailsModal
                  :accountDetails="accountDetails"
                >
                  <Button variant="outline" class="flex items-center hover:bg-muted-background/5 text-[8px] font-semibold rounded py-1 px-3 gap-2">
                    View details
                    <ArrowRightIcon class="size-6 stroke-2" />
                  </Button>
                </AccountDetailsModal>
              </div>
            </template>
          <div class="px-6 pt-2 flex flex-col gap-4 divide-y">
            <div class="flex items-start gap-1">
              <div class="flex flex-col">
                <div class="text-xs font-medium -mb-2 leading-9 text-secondary">
                  Elijah Nnabuife
                </div>
                <div class="font-normal text-xs leading-tight text-muted-foreground">
                  Account Holder
                </div>
              </div>
              <CopyIcon class="mt-3" />
            </div>
            <div class="flex items-start gap-1">
              <div class="flex flex-col">
                <div class="text-xs font-medium -mb-2 leading-9 text-secondary">
                  WELLS FARGO BANK, N.A.
                </div>
                <div class="font-normal text-xs leading-tight text-muted-foreground">
                  Bank Name
                </div>
              </div>
              <CopyIcon class="mt-3" />
            </div>
            <div class="flex items-start gap-1">
              <div class="flex flex-col">
                <div class="text-xs font-medium -mb-2 leading-9 text-secondary">
                  40630101689676683
                </div>
                <div class="font-normal text-xs leading-tight text-muted-foreground">
                  Account Number
                </div>
              </div>
              <CopyIcon class="mt-3" />
            </div>
          </div>
        </Card>
        <Card title="Expenses">
          <div class="px-6">
            <div class="flex items-center justify-between py-2 px-2">
              <div class="flex flex-col">
                <div class="font-semibold -mb-2 leading-9 text-secondary">
                  $0.00
                </div>
                <div class="font-normal leading-tight text-muted-foreground">
                  Income
                </div>
              </div>
              <div class="flex flex-col">
                <div class="font-semibold -mb-2 leading-9 text-secondary">
                  $0.00
                </div>
                <div class="font-normal leading-tight text-muted-foreground">
                  Expenses
                </div>
              </div>
               
            </div>
            <div class="my-8 h-10 rounded bg-muted-background flex-1">
            </div>

            <div class="flex gap-6 mb-1.5">
              <div class="flex items-center gap-2">
                <div class="h-4 w-4 bg-primary rounded-full"></div>
                <div class="text-secondary text-xs font-medium">Income</div>
              </div>
              <div class="flex items-center gap-2">
                <div class="h-4 w-4 bg-primary rounded-full"></div>
                <div class="text-secondary text-xs font-medium">Expenses</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Transactions" class="">
        <div class="px-6">
          <table
            class="px- my-3 w-full table-fixed text-xs text-muted-foreground"
          >
            <thead class="hidden text-left">
              <tr>
                <th class="py-2 font-normal">Currency</th>
                <th class="font-normal">Buying</th>
                <th class="font-normal">Selling</th>
                <th class="font-normal">Buying</th>
                <th class="font-normal">Selling</th>
                <th class="font-normal">Buying</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="transaction in transactions"
                :key="transaction.name"
                class="border-b last-of-type:border-b-0"
              >
                <td class="py-4">{{ transaction.date }}</td>
                <td>{{ transaction.name }}</td>
                <td>{{ transaction.amount }}</td>
                <td class="hidden sm:table-cell">{{ transaction.sender }}</td>
                <td>
                  <Badge
                    :variant="
                      transaction.status === 'Refunded'
                        ? 'secondary'
                        : transaction.status === 'Sucessful'
                          ? 'success'
                          : 'outline'
                    "
                  >
                    {{ transaction.status }}
                  </Badge>
                </td>
                <td class="hidden sm:table-cell">{{ transaction.type }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-10 flex w-full px-6">
          <RouterLink
            to=""
            class="ml-auto flex items-center gap-2 text-xs font-semibold text-primary"
          >
            View all transacton details
            <ArrowRightIcon class="size-5" />
          </RouterLink>
        </div>
      </Card>
    </div>
  </DashboardLayout>
</template>
