<script lang="ts" setup>
import Card from "@/components/Card.vue";
import DashboardLayout from "../layout/DashboardLayout.vue";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "@/components/icons";
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "@radix-icons/vue";
import router from "@/router";
import { ref } from "vue";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import SendOrConvertForm from "@/components/general/SendOrConvertForm.vue";
import SuccessOrFail from "@/components/general/SuccessOrFail.vue";

const goBack = () => {
  router && router.go(-1)
  if (sendData.value.step > 1)
    sendData.value.step -= 1
}

const sendData = ref({
  step: 2, 
  type: '', 
  recipient: '', 
  amount: '', 
  description: '',
})

const customersList = ref([
  'Olosnsj Asjdj',
  'Banand Loij',
  'Njnsj Asjdj',
  'Sjnsj Asjdj',
])
const newRecipient = ref({
  step: 1,
  currency: '',
  type: '',
  accountName: '',
  accountNumber: '',
  bank: '',
})

const addRecipient = () => {
  let allFilled = !!newRecipient.value.type
    && !!newRecipient.value.accountName
    && !!newRecipient.value.accountNumber
    && !!newRecipient.value.bank
    && !!newRecipient.value.currency
  if(!allFilled) return
  switch (newRecipient.value.step) {
    case 1:
      newRecipient.value.step += 1
      break;
    case 2:
      newRecipient.value.step += 1
      break;
    case 3:
      newRecipient.value.step += 1
      break;
  
    default:
      newRecipient.value.step = 1
      break;
  }
}

const enableNextButton = () => {
  switch (sendData.value.step) {
    case 1:
      return !!sendData.value.type
    case 2:
      return !!sendData.value.recipient
    case 3:
      return !!sendData.value.amount
  
    default:
      break;
  }
}

const nextStep = () => {

  switch (sendData.value.step) {
    case 1:
      sendData.value.step += 1
      router && router.push({ query: { 
        type: sendData.value.type, 
        step: sendData.value.step 
      } })
      break;
    case 2:
      sendData.value.step += 1
      break;
    case 3:
      sendData.value.step += 1
      break;
  
    default:
      sendData.value.step = 1
      break;
  }
}

</script>
<template>
  <DashboardLayout
    title="Send Money"
  >
  <div class="max-w-[607px]">
    <Card v-if="sendData.step < 4" title="Who are you sending to">
      <div class="flex flex-col gap-10 px-8 pb-12 pt-8">

        <!-- Choose transaction type -->
        <span v-if="sendData.step === 1" class="flex flex-col gap-10">
          <button
            @click="sendData.type='bank'"
            class="flex items-center gap-x-4 p-6 border rounded-lg shadow shadow-shadow hover:bg-primary/5"
            :class="{ 'bg-primary/5': sendData.type === 'bank' }"
          >
            <HomeIcon />
            <div class="flex flex-col text-left">
              <p class="font-semibold">Direct Bank</p>
              <span class="max-w-80 text-xs text-muted-foreground">
                Direct transfer to bank
              </span>
            </div>
            <ChevronRightIcon class="size-6 ml-auto" />
          </button>
          <button
            @click="sendData.type='mobile'"
            class="flex items-center gap-x-4 p-6 border rounded-lg shadow shadow-shadow hover:bg-primary/5 -mt-[18px]"
            :class="{ 'bg-primary/5': sendData.type === 'mobile' }"
          >
            <HomeIcon />
            <div class="flex flex-col text-left">
              <p class="font-semibold">Mobile Money</p>
              <span class="max-w-80 text-xs text-muted-foreground">
                Transfer to mobile money
              </span>
            </div>
            <ChevronRightIcon class="size-6 ml-auto" />
          </button>
        </span>

        <!-- Choose a recipient -->
        <div v-if="sendData.step === 2" class="flex flex-col gap-2 pt-6 pb-8">
          Choose a recipient*
          <Select v-model="sendData.recipient">
            <SelectTrigger class="py-5 border-secondary-foreground/30">
              <SelectValue placeholder="Select a recipient" />
            </SelectTrigger>
            <SelectContent class=" mb-24">
              <SelectGroup>
                <SelectLabel 
                  class="text-primary cursor-pointer"
                >
                  <RightModal
                    title="Customer’s Information"
                    description="Banking Information"
                    :step="newRecipient.step + ''"
                  >
                    <template #trigger>
                      <span class="flex items-center gap-2">
                        <PlusIcon class=" bg-primary text-white rounded-full" />
                        Add new recipient
                      </span>
                    </template>

                    <!-- Step 1 form -->
                    <div v-if="newRecipient.step === 1" class="grid gap-10 mt-10 py-4">
                      <fieldset class="flex flex-col gap-4">
                        <Label for="currency">
                          Currency*
                        </Label>
                        <Select id="currency" v-model="newRecipient.currency">
                          <SelectTrigger class="py-5 border-secondary-foreground/30">
                            <SelectValue placeholder="Choose Currency*" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Choose Currency</SelectLabel>
                              <SelectItem value="USD">
                                USD
                              </SelectItem>
                              <SelectItem value="NGN">
                                NGN
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </fieldset>
                      <fieldset class="flex flex-col gap-4">
                        <Label for="recipient">
                          Recipient Type*
                        </Label>
                        <Select id="recipient" v-model="newRecipient.type">
                          <SelectTrigger class="py-5 border-secondary-foreground/30">
                            <SelectValue placeholder="Choose Recipient Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Recipient Type</SelectLabel>
                              <SelectItem value="Individual">
                                Individual
                              </SelectItem>
                              <SelectItem value="Business">
                                Business
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </fieldset>
                      <fieldset class="flex flex-col gap-4">
                        <Label for="bankd">
                          Bank Name*
                        </Label>
                        <Select id="bankd" v-model="newRecipient.bank">
                          <SelectTrigger class="py-5 border-secondary-foreground/30">
                            <SelectValue placeholder="Choose Bank" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Bank Name</SelectLabel>
                              <SelectItem value="Access Bank">
                                Access Bank
                              </SelectItem>
                              <SelectItem value="Palm pay">
                                Palm pay
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </fieldset>
                      <fieldset class="flex flex-col gap-4">
                        <Label for="acc-number">
                          Account Number*
                        </Label>
                        <Input id="acc-number" v-model="newRecipient.accountNumber" class="" />
                      </fieldset>
                      <fieldset class="flex flex-col gap-4">
                        <Label for="acc-name">
                          Account Name*
                        </Label>
                        <Input id="acc-name" v-model="newRecipient.accountName" class="" />
                      </fieldset>
                      <Button v-if="newRecipient.step === 1" @click="addRecipient" class="w-full flex gap-2 mt-10">
                        Continue
                        <ArrowRightIcon class="size-4 stroke-white" />
                      </Button>
                    </div>

                    <!-- Step 2 form -->
                    <div v-if="newRecipient.step === 2" class="grid gap-10 mt-10 py-4">
                      <fieldset class="flex flex-col gap-4">
                        <Label for="country">
                          Country*
                        </Label>
                        <Select id="country">
                          <SelectTrigger class="py-5 border-secondary-foreground/30">
                            <SelectValue placeholder="Select Country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Choose Currency</SelectLabel>
                              <SelectItem value="England">
                                England
                              </SelectItem>
                              <SelectItem value="Spain">
                                Spain
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </fieldset>
                      <fieldset class="flex flex-col gap-4">
                        <Label for="street">
                          Street Address*
                        </Label>
                        <Input id="street" class="" />
                      </fieldset>
                      <fieldset class="flex flex-col gap-4">
                        <Label for="state">
                          State*
                        </Label>
                        <Select id="state">
                          <SelectTrigger class="py-5 border-secondary-foreground/30">
                            <SelectValue placeholder="Choose State" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Recipient Type</SelectLabel>
                              <SelectItem value="Abia">
                                Abia
                              </SelectItem>
                              <SelectItem value="Adamawa">
                                Adamawa
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </fieldset>
                      <fieldset class="flex flex-col gap-4">
                        <Label for="city">
                          City*
                        </Label>
                        <Select id="city">
                          <SelectTrigger class="py-5 border-secondary-foreground/30">
                            <SelectValue placeholder="Choose City" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>City Name</SelectLabel>
                              <SelectItem value="Yola">
                                Yola
                              </SelectItem>
                              <SelectItem value="Jalingo">
                                Jalingo
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </fieldset>
                      <fieldset class="flex flex-col gap-4">
                        <Label for="post-code">
                          Postal Code*
                        </Label>
                        <Input id="post-code" class="" />
                      </fieldset>
                      
                    </div>

                    <template #close>
                      <Button v-if="newRecipient.step === 2" type="submit" @click="addRecipient" class="w-full flex gap-2 mt-14">
                        <PlusIcon class="size-5 stroke-white" />
                        Save
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

        <!-- Amount to send -->
         <SendOrConvertForm 
          v-if="sendData.step === 3"
          originLabel="You send"
          destinationLabel="Recipient get"
          buttonLabel="Continue"
          type="send"
          :nextStep="nextStep"
         />

         


        <Button
          v-if="sendData.step < 3"
          class="w-full font-semibold gap-2"
          @click="nextStep"
          :disabled="!enableNextButton()"
        >
          Continue
          <ArrowRightIcon class="size-4 stroke-white" />
        </Button>
      </div>
    </Card>

    <SuccessOrFail 
      v-if="sendData.step === 4"
      cardTitle="Fund Converted"
      :callbackLabel="'Download reciept'"
      :copyBtnLabel="'Copy Invoice Link'"
      :copyValue="'https://google.com'"
      message="Payment Complete!"
    />

    <button @click="goBack" class="flex gap-2 items-center mt-10">
      <ChevronLeftIcon class="size-6" />
      Go back
    </button>
  </div>
</DashboardLayout>
</template>
