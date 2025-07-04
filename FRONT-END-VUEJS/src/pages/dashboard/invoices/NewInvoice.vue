<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-4">Create New Invoice</h2>

    <form @submit.prevent="submitInvoice">
      <div class="mb-3">
        <label class="block font-medium">Customer Name</label>
        <input v-model="form.customer" class="border rounded p-2 w-full" required />
      </div>

      <div class="mb-3">
        <label class="block font-medium">Currency</label>
        <input v-model="form.currency" class="border rounded p-2 w-full" required />
      </div>

      <div class="mb-3">
        <label class="block font-medium">Issue Date</label>
        <input type="date" v-model="form.issueDate" class="border rounded p-2 w-full" required />
      </div>

      <div class="mb-3">
        <label class="block font-medium">Due Date</label>
        <input type="date" v-model="form.dueDate" class="border rounded p-2 w-full" required />
      </div>

      <div class="mb-3">
        <label class="block font-medium">Status</label>
        <select v-model="form.status" class="border p-2 w-full">
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="due">Due</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="block font-medium">Items</label>
        <div v-for="(item, index) in form.items" :key="index" class="flex gap-2 mb-2">
          <input v-model="item.description" placeholder="Description" class="border p-2 flex-1" required />
          <input v-model.number="item.amount" placeholder="Amount" type="number" class="border p-2 w-24" required />
          <button type="button" @click="removeItem(index)" class="text-red-500">x</button>
        </div>
        <button type="button" @click="addItem" class="text-blue-500">+ Add Item</button>
      </div>

      <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded">Create Invoice</button>
    </form>

    <div v-if="successMessage" class="mt-4 text-green-600">
      {{ successMessage }}
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      form: {
        customer: "",
        currency: "",
        issueDate: "",
        dueDate: "",
        status: "draft", 
        items: [{ description: "", amount: 0 }],
      },
      successMessage: "",
    }
  },
  methods: {
    addItem() {
      this.form.items.push({ description: "", amount: 0 })
    },
    removeItem(index) {
      this.form.items.splice(index, 1)
    },
    async submitInvoice() {
      try {
        const response = await axios.post(
          'http://localhost:8009/api/userInvoices',
          this.form,
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        )

        console.log("Invoice created:", response.data)

        this.successMessage = `Invoice created! Shareable Link: ${response.data.data.shareable}`

        // Reset form
        this.form = {
          customer: "",
          currency: "",
          issueDate: "",
          dueDate: "",
          status: "draft",
          items: [{ description: "", amount: 0 }],
        }

        // Redirect to invoices page with status query param
        this.$router.push({ path: '/dashboard/invoices', query: { status: this.form.status } })

      } catch (error) {
        console.error("Error creating invoice:", error)
      }
    },
  },
}
</script>

<style scoped>
input {
  outline: none;
}
</style>


<!-- <script lang="ts" setup>
import DashboardLayout from "../layout/DashboardLayout.vue";
import { InvoicesWhiteIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Card from "@/components/Card.vue";
import { ArrowRightIcon, PlusIcon } from "@radix-icons/vue";
import router from "@/router";
import { ChevronLeftIcon } from "@radix-icons/vue";
import { ref } from "vue";
import SuccessOrFail from "@/components/general/SuccessOrFail.vue";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import DatePicker from "@/components/general/DatePicker.vue";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import RightModal from "@/components/all-modals/RightModal.vue";

type InvoiceStatus = 'success' | 'error' | 'not-set' | 'customer'

const invoiceStatus = ref<InvoiceStatus>('customer');
const selectedCustomer = ref<string>('');
const customerName = ref('')
const customersList = ref([
  'Olosnsj Asjdj',
  'Banand Loij',
  'Njnsj Asjdj',
  'Sjnsj Asjdj',
])

const addCustomer = () => {
  customersList.value.push(customerName.value)
  customerName.value = ''
}

const goBack = () => {
  invoiceStatus.value = invoiceStatus.value === 'success' ? 'not-set' : 'customer'
  router && router.go(-1)
}

const generateInvoice = () => {
  if(selectedCustomer.value === null) return
  switch (invoiceStatus.value) {
    case 'customer':
      invoiceStatus.value = 'not-set'
      break;
    case 'not-set':
      invoiceStatus.value = 'success'
      break;
  
    default:
      break;
  }
  router.push({query: {status: invoiceStatus.value}})
}

const generateAnotherInvoice = () => {
  invoiceStatus.value = 'not-set'
  router && router.go(-1)
}

</script>
<template>
  <DashboardLayout
    title="New Invoice"
  >
  <div class="flex flex-col gap-10 pb-10">
    <div v-if="invoiceStatus === 'customer'">
      <Card title="Customer’s Information" class="max-w-lg">
        <div class="flex flex-col gap-2 px-8 pt-6 pb-8">
          Customer*
          <Select v-model="selectedCustomer">
            <SelectTrigger class="py-5 border-secondary-foreground/30">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel 
                  class="text-primary cursor-pointer"
                >
                  <RightModal
                    title="Customer’s Information"
                  >
                    <template #trigger>
                      <span class="flex items-center gap-2">
                        <PlusIcon class=" bg-primary text-white rounded-full" />
                        Add new recipient
                      </span>
                    </template>
                    <div class="grid gap-10 mt-10 py-4">
                      <div class="flex flex-col gap-4">
                        <Label for="name">
                          Customer’s Name*
                        </Label>
                        <Input id="name" v-model="customerName" class="col-span-3" />
                      </div>
                      <div class="flex flex-col gap-4">
                        <Label for="email">
                          Customer’s Email Address*
                        </Label>
                        <Input type="email" id="email" class="col-span-3" />
                      </div>
                    </div>
                    <template #close>
                      <Button type="submit" @click="addCustomer" class="w-full flex gap-2 mt-14">
                        Create new customer
                        <ArrowRightIcon class="size-4 stroke-white" />
                      </Button>
                    </template>
                  </RightModal>
                </SelectLabel>
                <SelectItem 
                  v-for="customer in customersList"
                  :key="customer"
                  :value="customer"
                >
                  {{ customer }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </Card>
    </div>
    <div
      v-if="invoiceStatus === 'not-set'" 
      class="grid grid-cols-2 gap-8"
    >
      <div class="flex flex-col gap-10">
        <Card title="Create Invoice">
          <div class="flex flex-col gap-4 px-8 pt-6 pb-8">
            Customer’s Name
            <Separator />
            <div class="flex items-center gap-5">
              <div class="capitalize h-8 w-8 grid place-items-center rounded-full bg-primary text-white">
                {{ selectedCustomer?.split('')[0] }}
              </div>
              <div>{{ selectedCustomer }}</div>
            </div>
            </div>
        </Card>
        <Card title="Invoice Information">
          <div class="flex flex-col gap-6 px-8 pt-6 pb-8">
            Invoice Information
            <Separator />
            <div class="w-full flex flex-col gap-2">
              <Label for="issue-date">Issue Date*</Label>
              <DatePicker id="issue-date" />
            </div>
            <Separator />
            <div class="w-full flex flex-col gap-2">
              <Label for="due-date">Due Date*</Label>
              <DatePicker id="due-date" />
            </div>
            
          </div>
        </Card>

        <div class="flex flex-col gap-4">
          <div class="flex bg-white items-center justify-between p-2">
            <div>Subtotal</div>
            <div>$20</div>
          </div>
          <Separator />
          <div class="flex items-center justify-between">
            <div>Total</div>
            <div>$20</div>
          </div>
        </div>
      </div>
      <div>
        <Card title="Item Description">
          <div class="flex flex-col gap-6 px-8 pt-6 pb-8">
            
            <div class="grid gap-2">
              <Label for="description">Item Description*</Label>
              <Textarea id="description" placeholder="Item Description" />
            </div>
            <Separator />
            <div class="grid gap-2">
              <Label for="quantity">Quantity*</Label>
              <Input id="quantity" type="quantity" placeholder="quantity" />
            </div>
            <Separator />
            <div class="grid gap-2">
              <Label for="perquantity">Amount per Quantity*</Label>
              <Input id="perquantity" type="perquantity" placeholder="perquantity" />
            </div>


          </div>
        </Card>
        <div class="py-10 flex flex-col gap-4">
          <div>VAT Information*</div>
          <Separator />
          <div class="flex items-center space-x-2">
            <Checkbox id="terms" class="border-primary" />
            <label
              for="terms"
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Should VAT be included?
            </label>
          </div>
        </div>
      </div>
      
    </div>

    <Button 
      v-if="invoiceStatus !== 'success'"
      @click="generateInvoice"
      class="w-full font-semibold gap-2 mt-16"
    >
      <InvoicesWhiteIcon />
      Create Invoices
      <ArrowRightIcon class="stroke-white" />
    </Button>

    <SuccessOrFail 
      v-if="invoiceStatus === 'success'"
      cardTitle="Invoice Generated"
      :callbackFn="generateAnotherInvoice" 
      :callbackLabel="'Generate Another Invoice'"
      :copyBtnLabel="'Copy Invoice Link'"
      :copyValue="'https://google.com'"
    />

    <button @click="goBack" class="w-full flex items-center gap-2">
      <ChevronLeftIcon class="size-6" />
      Go back
    </button>
  </div>
</DashboardLayout>
</template> -->



