<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import DashboardLayout from '../layout/DashboardLayout.vue';
import { FilterIcon, InvoicesIcon, SearchIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRightIcon } from '@radix-icons/vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';

const invoices = ref<any[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

const route = useRoute();
const router = useRouter();

const activeTab = ref<string>(
  Array.isArray(route.query.status)
    ? route.query.status[0] || 'all'
    : route.query.status || 'all'
);


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
    invoices.value = response.data.data.map((inv: any) => ({
  ...inv,
  items: inv.items ?? [],
}));
  } catch (err: any) {
    console.error('Error fetching invoices:', err);
    error.value = 'Failed to fetch invoices';
  } finally {
    isLoading.value = false;
  }
};
 console.log(invoices);
// Fetch when component mounts
onMounted(() => {
  fetchInvoices(activeTab.value as string);
});

// Watch query param changes (when user navigates externally)
watch(
  () => [route.query.status, route.query.refetch],
  () => {
    activeTab.value = Array.isArray(route.query.status)
      ? route.query.status[0] || 'all'
      : route.query.status || 'all'
    fetchInvoices(activeTab.value)
  },
  { immediate: true }
)


// When activeTab changes via UI interaction, update the query param and fetch
watch(activeTab, (newTab) => {
  router.replace({ query: { status: newTab } });
  fetchInvoices(newTab as string);
});

const deleteInvoice = async (id: string) => {
  if (!confirm("Are you sure you want to delete this invoice?")) return;

  try {
    const response = await axios.delete(`http://localhost:8009/api/invoices/${id}`, {
      withCredentials: true
    });

    console.log(response.data.message);
    
    // Remove from local list without refetch
    invoices.value = invoices.value.filter(inv => inv.id !== id);
    
  } catch (error) {
    console.error("Error deleting invoice:", error);
    alert("Failed to delete invoice");
  }
};


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
            <div class="flex flex-col items-center px-6 pb-16 pt-12 max-w-96 mx-auto">
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
      <!-- Invoices Tabs -->
      <div class="w-full rounded-lg overflow-hidden bg-white border border-border shadow shadow-shadow">
        <Tabs v-model="activeTab" class="w-full">
          <TabsList class="grid w-full grid-cols-2 sm:grid-cols-6">
            <TabsTrigger value="all">All invoices</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
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
  class="flex flex-col gap-3 p-5 bg-muted-background rounded-lg border border-border shadow-sm mb-4"
>
  <div class="flex justify-between items-center">
    <div class="font-semibold text-lg">{{ invoice.customer || 'Unnamed Customer' }}</div>
    <Button 
  variant="destructive"
  class="mt-2 w-max text-white bg-blue-600"
  @click="deleteInvoice(invoice.id)"
>
  Delete
</Button>

<RouterLink :to="`invoices/${invoice.id}/edit`">
                <Button class="w-full font-semibold gap-2 bg-blue-600">
                  Edit invoice
                  <ArrowRightIcon class="stroke-white" />
                </Button>
              </RouterLink>

    <span class="text-xs text-muted-foreground">{{ invoice.currency }}</span>
  </div>
  <div class="flex justify-between text-sm mt-2">
    <div>
      <span class="font-medium">issueDate:</span>
      {{ new Date(invoice.issueDate).toLocaleDateString() }}
    </div>
    <div>
      <span class="font-medium">dueDue:</span>
      {{ new Date(invoice.dueDate).toLocaleDateString() }}
    </div>
    <div>
      <span class="font-medium"> Status: </span>
      {{ invoice.Status }}
    </div>
  </div>

  <div class="flex justify-between items-center mt-2">
    <div class="font-bold text-base">
      ₦{{ invoice.items.reduce((total: number, item: any) => total + item.amount, 0).toLocaleString() }}
    </div>
    <a
      :href="invoice.shareable"
      target="_blank"
      class="text-blue-600 text-sm hover:underline"
    >
      View Invoice
    </a>

  </div>
</div>
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
