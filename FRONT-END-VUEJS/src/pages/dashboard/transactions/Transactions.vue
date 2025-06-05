<script lang="ts" setup>
import { Input } from "@/components/ui/input";
import DashboardLayout from "../layout/DashboardLayout.vue";
import { FilterIcon, SearchIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Card from "@/components/Card.vue";
import { ref } from "vue";
import { Badge } from "@/components/ui/badge";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-icons/vue";

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
</script>
<template>
  <DashboardLayout title="Transactions">
    <div class="flex flex-col gap-y-10">
      <div class="flex gap-5">
        <div class="relative w-full items-center">
          <Input
            id="search"
            type="text"
            placeholder="Search..."
            class="border-border py-4 pl-12 text-sm placeholder:text-sm placeholder:text-[#667085B2]"
          />
          <span
            class="absolute inset-y-0 start-0 flex items-center justify-center px-4"
          >
            <SearchIcon class="size-6 text-muted-foreground" />
          </span>
        </div>
        <Button
          variant="outline"
          class="flex items-center gap-2 text-muted-foreground/80 hover:bg-muted-background"
        >
          Filter
          <FilterIcon />
        </Button>
      </div>

      <Card title="Transactions" class="">
        <div class="px-6">
          <table
            class="w-full my-3 table-fixed text-xs text-muted-foreground"
          >
            <thead class="hidden text-left">
              <tr>
                <th class="py-2 font-normal">Date</th>
                <th class="font-normal">Recipient</th>
                <th class="font-normal">Amount</th>
                <th class="font-normal hidden sm:table-cell">Sender</th>
                <th class="font-normal">Status</th>
                <th class="font-normal hidden sm:table-cell">Type</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="transaction in transactions"
                :key="transaction.name"
                class="border-b last-of-type:border-b-0 w-full"
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
        
        <div class="px-6 w-full flex mt-10">
          <div
            class="ml-auto border-gray-300/opacity-30 inline-flex h-7 w-28 items-center justify-center gap-2 rounded border bg-white p-2"
          >
            <div class="flex items-center justify-start gap-2">
              <div
                class="text-xs font-medium leading-tight text-slate-800"
              >
                1-5 of 5
              </div>
              <div class="flex items-start justify-start">
                <ChevronLeftIcon />
                <ChevronRightIcon />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </DashboardLayout>
</template>
