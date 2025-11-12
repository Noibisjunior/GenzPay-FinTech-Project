<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import { Input } from "@/components/ui/input";
import DashboardLayout from "../layout/DashboardLayout.vue";
import { FilterIcon, SearchIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Card from "@/components/Card.vue";
import { Badge } from "@/components/ui/badge";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-icons/vue";

const apiBase = import.meta.env.VITE_API_BASE_URL;

// States
const transactions = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const search = ref("");
const currentPage = ref(0);
const pageSize = ref(10);
const filterVisible = ref(false);
const selectedStatus = ref("");

// Fetch transactions
const fetchTransactions = async () => {
  try {
    loading.value = true;
    error.value = null;

    const params = new URLSearchParams({
      page: currentPage.value.toString(),
      size: pageSize.value.toString(),
      search: search.value,
      status: selectedStatus.value,
    });

    const res = await fetch(`${apiBase}/api/transactions?${params}`, {
      method: "GET",
      credentials: "include", 
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (res.status === 401) throw new Error("Token is required or expired. Please log in again.");
    if (!res.ok) throw new Error(data.message || "Failed to fetch transactions");

    transactions.value = data.data || [];
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};


watch([search, currentPage, selectedStatus], fetchTransactions);


onMounted(fetchTransactions);

// date helper function

const formatDate = (dateValue: any) => {
  if (!dateValue) return "—";
  const date = new Date(dateValue);

  if (isNaN(date.getTime())) {
    // Try to handle timestamp numbers 
    if (!isNaN(Number(dateValue))) {
      const fromTimestamp = new Date(Number(dateValue));
      return fromTimestamp.toLocaleString();
    }
    return "Invalid Date";
  }

  
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<template>
  <DashboardLayout title="Transactions">
    <div class="flex flex-col gap-y-10">
      <!-- Search & Filter Controls -->
      <div class="flex flex-wrap gap-4 items-center">
        <!-- Search -->
        <div class="relative flex-grow">
          <Input
            v-model="search"
            type="text"
            placeholder="Search transactions..."
            class="border-border py-4 pl-12 text-sm placeholder:text-[#667085B2]"
          />
          <span class="absolute inset-y-0 left-0 flex items-center justify-center px-4">
            <SearchIcon class="size-5 text-muted-foreground" />
          </span>
        </div>

        <!-- Filter Toggle -->
        <Button
          variant="outline"
          class="flex items-center gap-2 text-muted-foreground/80 hover:bg-muted-background"
          @click="filterVisible = !filterVisible"
        >
          Filter
          <FilterIcon />
        </Button>
      </div>

      <!-- Filter Dropdown -->
      <div v-if="filterVisible" class="bg-gray-50 border rounded-lg p-4 mt-2 flex gap-4 items-center">
        <label class="text-sm font-medium text-gray-600">Status:</label>
        <select
          v-model="selectedStatus"
          class="border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All</option>
          <option value="Success">Success</option>
          <option value="Pending">Pending</option>
          <option value="failed">failed</option>
        </select>
      </div>

      <!-- Transactions Table -->
      <Card title="Transactions">
        <div class="px-6">
       
          <div v-if="loading" class="animate-pulse space-y-3">
            <div class="h-5 bg-gray-200 rounded"></div>
            <div class="h-5 bg-gray-200 rounded w-4/5"></div>
            <div class="h-5 bg-gray-200 rounded w-3/4"></div>
          </div>

          
          <div v-else-if="error" class="text-red-500 text-sm font-medium">
            {{ error }}
          </div>

          
          <div v-else-if="!transactions.length" class="text-center text-gray-500 text-sm py-6">
            No transactions found.
          </div>

        
          <table v-else class="w-full my-3 table-fixed text-xs text-muted-foreground">
            <thead>
              <tr class="text-left border-b">
                <th class="py-2 font-medium">Date</th>
                <th class="font-medium">Amount</th>
                <th class="font-medium">Status</th>
                <th class="font-medium hidden sm:table-cell">Type</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="transaction in transactions"
                :key="transaction.id"
                class="border-b last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                <td class="py-4">{{ formatDate(transaction.transactionDate || transaction.createdAt || transaction.date) }}</td>
                <td>₦{{ transaction.amount?.toLocaleString() }}</td>
                <td>
                  <Badge
                    :variant="
                      transaction.status === 'Refunded'
                        ? 'secondary'
                        : transaction.status === 'Successful'
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

        <!-- Pagination -->
        <div class="px-6 w-full flex mt-10">
          <div
            class="ml-auto border-gray-300 inline-flex h-7 w-32 items-center justify-center gap-2 rounded border bg-white p-2"
          >
            <div class="flex items-center justify-start gap-2">
              <div class="text-xs font-medium leading-tight text-slate-800">
                Page {{ currentPage + 1 }}
              </div>
              <div class="flex items-center gap-1">
                <ChevronLeftIcon
                  @click="currentPage = Math.max(0, currentPage - 1)"
                  class="cursor-pointer hover:text-indigo-600"
                />
                <ChevronRightIcon
                  @click="currentPage++"
                  class="cursor-pointer hover:text-indigo-600"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </DashboardLayout>
</template>
