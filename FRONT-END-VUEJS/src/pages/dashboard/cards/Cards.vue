<script lang="ts" setup>
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
          </div>

          <!-- Step 2 -->
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
</template>
