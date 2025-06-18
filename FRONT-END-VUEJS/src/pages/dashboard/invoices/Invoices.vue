<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import DashboardLayout from '../layout/DashboardLayout.vue';
import { FilterIcon, InvoicesIcon, SearchIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRightIcon } from '@radix-icons/vue';
import { RouterLink } from 'vue-router';

const invoices = ref<any[]>([]);
const activeTab = ref('all');
const isLoading = ref(false);
const error = ref<string | null>(null);

const fetchInvoices = async (type: string) => {
  try {
    isLoading.value = true;
    error.value = null;
    let url = '';

    switch (type) {
      case 'draft':
        url = 'http://localhost:8009/api/viewDraftInvoices';
        break;
      case 'pending':
        url = 'http://localhost:8009/api/pendingInvoices';
        break;
      case 'due':
        url = 'http://localhost:8009/api/dueInvoices';
        break;
      case 'overdue':
        url = 'http://localhost:8009/api/overdueInvoices';
        break;
      default:
        url = 'http://localhost:8009/api/getAllInvoices';
    }

    const response = await axios.get(url, { withCredentials: true });
    invoices.value = response.data.data;
  } catch (err: any) {
    console.error('Error fetching invoices:', err);
    error.value = 'Failed to fetch invoices';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchInvoices(activeTab.value);
});

watch(activeTab, (newTab) => {
  fetchInvoices(newTab);
});
</script>

<template>
  <DashboardLayout title="Invoices">
    <div class="flex flex-col gap-10">
      <!-- Search and Filter Row -->
      <div class="flex gap-5">
        <div class="relative w-full items-center">
          <Input
            id="search"
            type="text"
            placeholder="Search..."
            class="pl-12 text-sm py-4 border-border placeholder:text-[#667085B2] placeholder:text-sm"
          />
          <span class="absolute start-0 inset-y-0 flex items-center justify-center px-4">
            <SearchIcon class="size-6 text-muted-foreground" />
          </span>
        </div>
        <Button
          variant="outline"
          class="flex items-center text-muted-foreground/80 hover:bg-muted-background gap-2"
        >
          Filter
          <FilterIcon />
        </Button>
      </div>

      <!-- Invoices Tabs -->
      <div class="w-full rounded-lg overflow-hidden bg-white border border-border shadow shadow-shadow">
        <Tabs v-model="activeTab" class="w-full">
          <TabsList class="grid w-full grid-cols-2 sm:grid-cols-6">
            <TabsTrigger value="all">All invoices</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="due">Due</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
          </TabsList>

          <!-- Tab Content -->
          <TabsContent :value="activeTab">
            <div v-if="isLoading" class="p-6 text-center">Loading invoices...</div>
            <div v-else-if="error" class="p-6 text-red-600 text-center">{{ error }}</div>
            <div v-else-if="invoices.length > 0" class="divide-y">
              <div
                v-for="invoice in invoices"
                :key="invoice._id"
                class="flex flex-col p-4 border-b"
              >
                <div class="font-medium text-lg">Customer: {{ invoice.customer }}</div>
                <div class="text-sm text-muted-foreground">Currency: {{ invoice.currency }}</div>
                <div class="text-sm">Issue Date: {{ invoice.issueDate }}</div>
                <div class="text-sm">Due Date: {{ invoice.dueDate }}</div>
                <div class="text-sm font-semibold mt-2">
                  Total: ₦{{
                    invoice.items.reduce((total: number, item: any) => total + item.amount, 0)
                  }}
                </div>
                <a
                  :href="invoice.shareable"
                  target="_blank"
                  class="text-blue-600 text-sm mt-1 hover:underline"
                >
                  View Invoice
                </a>
              </div>
            </div>
            <div v-else class="flex flex-col items-center px-6 pb-16 pt-12 max-w-96 mx-auto">
              <InvoicesIcon class="h-8 w-8" />
              <div class="my-2 text-2xl font-semibold">No invoices found</div>
              <span class="mb-10 text-center text-sm text-muted-foreground"
                >Once you create an invoice, it will appear here.</span
              >
              <RouterLink to="invoices/new" class="w-full">
                <Button class="w-full font-semibold gap-2">
                  New invoice
                  <ArrowRightIcon class="stroke-white" />
                </Button>
              </RouterLink>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  </DashboardLayout>
</template>






















<!-- <script lang="ts" setup>
import { Input } from "@/components/ui/input";
import DashboardLayout from "../layout/DashboardLayout.vue";
import { FilterIcon, InvoicesIcon, SearchIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { ArrowRightIcon } from "@radix-icons/vue";

</script>
<template>
  <DashboardLayout
    title="Invoices"
  >
  <div class="flex flex-col gap-10">
    <div class="flex gap-5">
      <div class="relative w-full items-center">
        <Input id="search" type="text" placeholder="Search..." class="pl-12 text-sm py-4 border-border placeholder:text-[#667085B2] placeholder:text-sm" />
        <span class="absolute start-0 inset-y-0 flex items-center justify-center px-4">
          <SearchIcon class="size-6 text-muted-foreground" />
        </span>
      </div>
      <Button variant="outline" class="flex items-center text-muted-foreground/80 hover:bg-muted-background gap-2">
        Filter
        <FilterIcon />

      </Button>
    </div>

    <div class="w-full rounded-lg overflow-hidden bg-white border border-border shadow shadow-shadow">
    <Tabs default-value="all" class="w-full">
      <TabsList class="grid w-full grid-cols-2 sm:grid-cols-6" my-style>
        <TabsTrigger value="all" my-style>
          All invoices
        </TabsTrigger>
        <TabsTrigger value="draft" my-style>
          Draft
        </TabsTrigger>
        <TabsTrigger value="pending" my-style>
          Pending
        </TabsTrigger>
        <TabsTrigger value="processing" my-style>
          Processing
        </TabsTrigger>
        <TabsTrigger value="due" my-style>
          Due
        </TabsTrigger>
        <TabsTrigger value="overdue" my-style>
          Overdue
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <div class="flex flex-col items-center px-6 pb-16 pt-12 max-w-96 mx-auto">
          <InvoicesIcon class="h-8 w-8" />
          <div class="my-2 text-2xl font-semibold">No payments</div>
          <span
            class="mb-10 text-center text-sm text-muted-foreground"
            >Once you have any payment, the information appears here</span
          >
          <RouterLink to="invoices/new" class="w-full">
            <Button class="w-full font-semibold gap-2">
              New invoice
              <ArrowRightIcon class="stroke-white" />
            </Button>
          </RouterLink>
        </div>
      </TabsContent>
      <TabsContent value="draft">
        <div class="p-4">
          draft
        </div>
      </TabsContent>
      <TabsContent value="pending">
        <div class="p-4">
          pending
        </div>
      </TabsContent>
      <TabsContent value="processing">
        <div class="p-4">
          processing
        </div>
      </TabsContent>
      <TabsContent value="due">
        <div class="p-4">
          due
        </div>
      </TabsContent>
      <TabsContent value="overdue">
        <div class="p-4">
          Overdue
        </div>
      </TabsContent>
    </Tabs>
  </div>
  </div>
</DashboardLayout>
</template>

 -->
