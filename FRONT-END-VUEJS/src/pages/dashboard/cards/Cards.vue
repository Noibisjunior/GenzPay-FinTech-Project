<script lang="ts" setup>
import DashboardLayout from "../layout/DashboardLayout.vue";
import { Button } from "@/components/ui/button";
import { CardWhiteIcon, EmptyCardsList } from "@/components/icons";
import { ref, onMounted } from "vue";
import RightModal from "@/components/all-modals/RightModal.vue";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowRightIcon } from "@radix-icons/vue";

interface Card {
  reference: string
  type: string
  currency: string
  holderName: string
  brand: string
  expiry_month: string
  expiry_year: string
  status: string
  _id: string
}
const isCardModalOpen = ref(false);
const currentStep = ref(1)
const cardBrands = ref(['Visa', 'Mastercard', 'American Express'])

const cardDetails = ref({
  name: '',
  type: '',
  brand: '',
  wallet: ''
})

const cardsList = ref<Card[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

// Fetch all cards on mount
const fetchCards = async () => {
  try {
    isLoading.value = true
    const response = await axios.get('http://localhost:8009/api/getAllCards', { withCredentials: true })
    cardsList.value = response.data.data
    console.log(cardsList.value)

  } catch (err: any) {
    error.value = 'Failed to load cards'
  } finally {
    isLoading.value = false
  }
}

const createCard = async () => {
  try {
    isLoading.value = true
    await axios.post(
      'http://localhost:8009/api/createCard',
      {
        name: cardDetails.value.name,
        type: cardDetails.value.type,
        brand: cardDetails.value.brand,
        walletId: cardDetails.value.wallet
      },
      { withCredentials: true }
    )
    await fetchCards()
    currentStep.value = 1
    cardDetails.value = { name: '', type: '', brand: '', wallet: '' }
    isCardModalOpen.value = false;
  } catch (err: any) {
    error.value = 'Failed to create card'
  } finally {
    isLoading.value = false
  }
}
const deleteCard = async (cardId: string) => {
  if (confirm('Are you sure you want to delete this card?')) {
    try {
      await axios.delete(`http://localhost:8009/api/card/${cardId}`, { withCredentials: true });
          cardsList.value = cardsList.value.filter(card => card._id !== cardId);
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  }
}
onMounted(() => fetchCards())
</script>


<template>
  <DashboardLayout title="Cards">
    <div class="max-w-5xl mx-auto">
      <div class="flex flex-col items-center gap-8 px-6 pb-12 pt-8">
        <RightModal
        v-model:open="isCardModalOpen"
        title="New Card"
        :step="currentStep + ''"
        description="Please note that the funds in this card cannot be withdrawn"
        >

          <template #trigger>
            <Button class="w-full font-semibold gap-2">
              <CardWhiteIcon />
              Create new card
            </Button>
          </template>

          <div v-if="currentStep === 1" class="grid gap-6 mt-6">
            <div class="flex flex-col gap-2">
              <Label for="name">Card Name*</Label>
              <Input id="name" v-model="cardDetails.name" />
            </div>

            <div class="flex flex-col gap-2">
              <Label>Card Type*</Label>
              <Select v-model="cardDetails.type">
                <SelectTrigger class="py-5 border-secondary-foreground/30">
                  <SelectValue placeholder="Choose Card Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Credit">Credit</SelectItem>
                    <SelectItem value="Debit">Debit</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div class="flex flex-col gap-2">
              <Label>Card Brand*</Label>
              <Select v-model="cardDetails.brand">
                <SelectTrigger class="py-5 border-secondary-foreground/30">
                  <SelectValue placeholder="Choose Card Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem v-for="brand in cardBrands" :key="brand" :value="brand">{{ brand }}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Button @click="currentStep = 2" class="w-full mt-6 flex gap-2">
              Continue <ArrowRightIcon class="size-4 stroke-white" />
            </Button>
          </div>

          <div v-else-if="currentStep === 2" class="grid gap-6 mt-6">
            <div class="flex flex-col gap-2">
              <Label>Select Wallet</Label>
              <Select v-model="cardDetails.wallet">
                <SelectTrigger class="py-5 border-secondary-foreground/30">
                  <SelectValue placeholder="Select wallet currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="NGN">NGN</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Button @click="createCard" class="w-full mt-6 flex gap-2">
              Submit <ArrowRightIcon class="size-4 stroke-white" />
            </Button>
          </div>
        </RightModal>

        <div v-if="isLoading" class="text-muted-foreground">Loading cards...</div>
        <div v-else-if="error" class="text-red-500">{{ error }}</div>

        <div v-else-if="cardsList.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          <div
            v-for="card in cardsList"
            :key="card.reference"
            class="border rounded-xl p-5 flex flex-col gap-2 shadow"
          >
            <div class="font-semibold text-lg">{{ card.holderName }}</div>
            <div class="text-sm text-muted-foreground">{{ card.brand }} • {{ card.type }}</div>
            <div class="text-sm text-muted-foreground">Expiry: {{ card.expiry_month }}/{{ card.expiry_year }}</div>
            <div class="text-sm">Status: <span class="font-medium">{{ card.status }}</span></div>
            <Button variant="destructive" class="mt-2 w-max text-white bg-blue-600" @click="deleteCard(card._id)">Delete</Button>
          </div>
          
        </div>

        <div v-else>
          <EmptyCardsList class="w-full h-auto" />
          <p class="text-muted-foreground mt-4">No cards found.</p>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
































































































<!-- <script lang="ts" setup>
import Card from "@/components/Card.vue";
import DashboardLayout from "../layout/DashboardLayout.vue";
import { Button } from "@/components/ui/button";
import { CardWhiteIcon, EmptyCardsList } from "@/components/icons";
import { ref } from "vue";
import RightModal from "@/components/all-modals/RightModal.vue";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowRightIcon } from "@radix-icons/vue";

interface Card {
  name: string
  type: string
  brand: string
  wallet: string
}


const cardDetails = ref<Card>({
  name: '',
  type: '',
  brand: '',
  wallet: ''
});
const currentStep = ref(1)
const cardsList = ref<Card[]>([])

const cardBrands = ref([
  'Visa',
  'Mastercard',
  'Lupay',
])

const addCard = () => {
  if(
    cardDetails.value.name === ''
    && cardDetails.value.type === ''
    && cardDetails.value.brand === ''
  ) return
  
  switch (currentStep.value) {
    case 1:
      
      
      currentStep.value += 1
      break;
    case 2:
      cardsList.value.push(cardDetails.value)
      cardDetails.value = {
        name: '',
        type: '',
        brand: '',
        wallet: ''
      }
      currentStep.value = 1
      break;
  
    default:
      break;
  }
}


</script>
<template>
  <DashboardLayout
    title="Cards"
  >
  <div class="max-w-2xl">
    <Card title="Cards">
      <div class="flex flex-col items-center gap-11 px-10 pb-12 pt-10">
        <EmptyCardsList class="w-full h-auto" />

        <RightModal
          title="New Card"
          :step="currentStep + ''"
          description="Please note that the funds in this card cannot be withdrawn"
        >
          <template #trigger>
            <Button class="w-full font-semibold gap-2">
              <CardWhiteIcon />
              Create new card
            </Button>
          </template>
          <div v-if="currentStep === 1" class="grid gap-10 mt-10 py-4">
            <div class="flex flex-col gap-4">
              <Label for="name">
                Card Name*
              </Label>
              <Input id="name" v-model="cardDetails.name" class="col-span-3" />
            </div>
            <form-group class="flex flex-col gap-4">
              <Label for="card-type">
                Card Type*
              </Label>
              <Select id="card-type" v-model="cardDetails.type">
                <SelectTrigger class="py-5 border-secondary-foreground/30">
                  <SelectValue placeholder="Choose Card Type*" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Choose Card Type</SelectLabel>
                    <SelectItem value="credit">
                      Credit
                    </SelectItem>
                    <SelectItem value="debit">
                      Debit
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </form-group>
            <form-group class="flex flex-col gap-4">
              <Label for="card-brand">
                Card Brand*
              </Label>
              <Select id="card-brand" v-model="cardDetails.brand">
                <SelectTrigger class="py-5 border-secondary-foreground/30">
                  <SelectValue placeholder="Choose Card brand*" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Choose Card brand</SelectLabel>
                    <SelectItem 
                      v-for="brand in cardBrands"
                      :key="brand"
                      :value="brand"
                    >
                      {{ brand }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </form-group>
            <Button v-if="currentStep === 1" @click="addCard" class="w-full flex gap-2 mt-10">
              Continue
              <ArrowRightIcon class="size-4 stroke-white" />
            </Button>
          </div> -->

          <!-- Step 2 -->
           <!--
          <div v-if="currentStep === 2" class="grid gap-10 mt-10 py-4">
            Step 2
            <div class="grid grid-cols-5 p-6 border border-border bg-primary/5 rounded-lg">
              <span class="text-primary col-span-2">Your Card Fee</span>
              <span class="cols-span-3">$3.00</span>
            </div>
            <div class="grid grid-cols-5 p-6 border border-border bg-primary/5 rounded-lg">
              <span class="text-primary col-span-2">To be debited from</span>
              <Select id="card-type" v-model="cardDetails.wallet">
                <SelectTrigger class="py-5 col-span-3 border-transparent">
                  <SelectValue placeholder="Choose Card Type*" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Choose Card Type</SelectLabel>
                    <SelectItem value="USD">
                      USD
                    </SelectItem>
                    <SelectItem value="NGN">
                      NGN
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div class="grid grid-cols-5 p-6 border border-border bg-primary/5 rounded-lg">
              <span class="text-primary col-span-2">Total amount</span>
              <span class="cols-span-3">$3.00</span>
            </div>
          </div>
          <template #close>
            <Button v-if="currentStep === 2" type="submit" @click="addCard" class="w-full flex gap-2 mt-14">
              Submit
              <ArrowRightIcon class="size-4 stroke-white" />
            </Button>
          </template>
        </RightModal>
      </div>
    </Card>
  </div>
</DashboardLayout>
</template> -->
