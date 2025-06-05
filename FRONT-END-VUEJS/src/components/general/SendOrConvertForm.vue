<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { ConvertIcon, EuroIcon, GbpIcon, NgnIcon, UsdIcon } from "@/components/icons";
import { ArrowRightIcon, ChevronDownIcon } from "@radix-icons/vue";
import { ref } from "vue";
import { h } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast/use-toast'


const props = defineProps({
  originLabel: String,
  destinationLabel: String,
  buttonLabel: String,
  addDescription: Boolean,
  type: String,
  nextStep: {
    type: Function,
    required: true
  },
})

const sendData = ref({
  step: 1, 
  type: '', 
  convertCurrencyIndex: 0,
  amountToConvert: '', 
  amountToReceive: '',
  receiveCurrencyIndex: 3,
})

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

const formSchema = toTypedSchema(z.object({
  amountToConvert: z.coerce.number({
    required_error: "Field is required",
    invalid_type_error: "Values must be a number",
  }).max(5000, "Insufficient balance"),
}))

const { isFieldDirty, handleSubmit } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit((values) => {
  console.log(JSON.stringify(values, null, 2))
  props.nextStep()
  toast({
    title: 'You submitted the following values:',
    description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(values, null, 2))),
  })
})

const convertValue = (val: string) => {
  console.log(typeof val)
  if(!val) return
  sendData.value.amountToReceive = (parseFloat(val) / 1.5).toFixed(2) + ''
}

</script>

<template>
  <div class="flex flex-col gap-10 pb-12 pt-8"
    :class="{ 'px-8': type === 'convert' }"
  >
        <form class="grid grid-cols-1 gap-y-10" @submit="onSubmit">
              <FormField v-slot="{ componentField }" name="amountToConvert" :validate-on-blur="!isFieldDirty">
                <FormItem>
                  <FormLabel>
                    {{ originLabel }}<span class="text-red">*</span>
                  </FormLabel>
                  <FormControl>
                    <div class="relative w-full items-center">
                      <span class="absolute start-0 inset-y-0 border-l text-primary my-2 flex items-center justify-center px-4 mr-0.5">
                        <div class="text-2xl text-muted-foreground/50">{{ currencies[sendData.convertCurrencyIndex].symbol }}</div>
                      </span>
                      <Input
                        type="text" 
                        placeholder="0.00" 
                        v-bind="componentField" 
                        @update:modelValue="convertValue($event + '')" 
                        class="pr-10 pl-10 sm:pl-20 text-2xl sm:text-[32px] font-medium text-secondary placeholder:text-secondary/50" 
                      />
                      <span class="absolute end-0 inset-y-0 text-primary my-2 flex items-center justify-center pr-2.5">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant="outline" class="flex items-center rounded-full gap-2 px-4 py-2.5 hover:bg-muted-background/5">
                              <component 
                                :is="currencies[sendData.convertCurrencyIndex].icon" 
                                class="hidden sm:flex h-6 w-6"
                              />
                              <span
                                class="text-sm font-semibold text-secondary"
                              >
                                {{ currencies[sendData.convertCurrencyIndex].name }}
                              </span>
                              <span class="hidden sm:flex text-sm font-semibold text-secondary">({{ currencies[sendData.convertCurrencyIndex].symbol }})</span>
                              <ChevronDownIcon />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent class="w-48 px-3 py-2">
                            <span
                              v-for="(currency, index) in currencies"
                              :key="currency.name"
                            >
                            <DropdownMenuLabel
                              @click="sendData.convertCurrencyIndex = index"
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
                      </span>
                    </div>
                  </FormControl>
                  
                  <div class="relative bg-secondary-foreground rounded-lg h-[68px] mt-2">
                    <FormMessage class="px-4 pt-1" />
                    <div class="absolute bottom-6 w-full flex items-center justify-between text-muted-foreground px-4 text-xs">
                      <div>USD Balance</div>
                      <div>$500.00</div>
                    </div>
                  </div>
                
                  
                </FormItem>
              </FormField>
              <div class="flex flex-col gap-2">
                <span>
                  {{ destinationLabel }}<span class="text-red">*</span>
                  </span>
                <div class="relative w-full items-center">
                  <span class="absolute start-0 inset-y-0 border-l text-primary my-2 flex items-center justify-center px-4 mr-0.5">
                    <div class="text-2xl text-muted-foreground/50">{{ currencies[sendData.receiveCurrencyIndex].symbol }}</div>
                  </span>
                  <Input 
                    type="text" 
                    placeholder="0.00" 
                    v-model="sendData.amountToReceive"
                    disabled
                    class="pr-10 pl-10 sm:pl-20 text-2xl sm:text-[32px] font-medium text-secondary placeholder:text-secondary/50" 
                  />
                  <span class="absolute end-0 inset-y-0 text-primary my-2 flex items-center justify-center pr-2.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="outline" class="flex items-center rounded-full gap-2 px-4 py-2.5 hover:bg-muted-background/5">
                          <component 
                            :is="currencies[sendData.receiveCurrencyIndex].icon" 
                            class="hidden sm:flex h-6 w-6"
                          />
                          <span
                            class="text-sm font-semibold text-secondary"
                          >{{ currencies[sendData.receiveCurrencyIndex].name }} </span>
                          <span class="hidden sm:flex text-sm font-semibold text-secondary"> ({{ currencies[sendData.receiveCurrencyIndex].symbol }})</span>
                          <ChevronDownIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent class="w-48 px-3 py-2">
                        <span
                          v-for="(currency, index) in currencies"
                          :key="currency.name"
                        >
                        <DropdownMenuLabel
                          @click="sendData.receiveCurrencyIndex = index"
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

                  </span>
                </div>
                <div class="relative bg-secondary-foreground rounded-lg h-[68px] mt-2">
                    <div class="px-4 pt-1" />
                    <div class="absolute bottom-6 w-full flex items-center justify-between text-muted-foreground px-4 text-xs">
                      <div>GBP Balance</div>
                      <div> £500.00</div>
                    </div>
                  </div>
              </div>
              <Button
                type="submit"
                class="w-full font-semibold gap-2"
              >
                <ConvertIcon v-if="type === 'convert'" />
                {{ buttonLabel }}
                <ArrowRightIcon class="size-4 stroke-white" />
              </Button>
            </form>
      </div>
</template>