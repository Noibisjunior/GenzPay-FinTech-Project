<script lang="ts" setup>
import Card from "@/components/Card.vue";
import DashboardLayout from "../layout/DashboardLayout.vue";
import { h } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast/use-toast'
import router from "@/router";
import { ChevronLeftIcon } from "@radix-icons/vue";

const formSchema = toTypedSchema(z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email().max(50),
  phone: z.string().max(50),
  tag: z.string().max(50),
  country: z.string().max(50),
  dob: z.string().max(50),
  occupation: z.string().max(50),
  physicalAddress: z.string().max(50),
}))

const { isFieldDirty, handleSubmit } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit((values) => {
  toast({
    title: 'You submitted the following values:',
    description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(values, null, 2))),
  })
})

const goBack = () => {
  router && router.go(-1)
}



</script>
<template>
  <DashboardLayout
    title="Profile"
    :is-profile="true"
  >
    <div class="pb-14">
      <Card title="My Profile">
        <div class="flex flex-col gap-8 px-8 pb-10 pt-8">
          <div class="flex items-center gap-4 text-[32px]">
            <div class="w-[72px] aspect-square grid place-items-center rounded-lg text-primary font-semibold bg-primary/5">
              OR
            </div>
            <p class="font-medium">Olivia Rhye</p>
          </div>
          <div class="h-[1px] bg-border text-border" />
          <form class="grid drid sm:grid-cols-2 grid-flow-row-dense gap-x-16 gap-y-10" @submit="onSubmit">
              <FormField v-slot="{ componentField }" name="firstName" :validate-on-blur="!isFieldDirty">
                <FormItem>
                  <FormLabel>First Name*</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="shadcn" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="lastName" :validate-on-blur="!isFieldDirty">
                <FormItem>
                  <FormLabel>Last Name*</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="shadcn" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="email" :validate-on-blur="!isFieldDirty">
                <FormItem>
                  <FormLabel>Email*</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="me@shadcn.vue" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="phone" :validate-on-blur="!isFieldDirty">
                <FormItem>
                  <FormLabel>Phone*</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="+234 902 922 0646" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="tag" :validate-on-blur="!isFieldDirty">
                <FormItem>
                  <FormLabel>FinPay Tag*</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="m293je90" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="country" :validate-on-blur="!isFieldDirty">
                <FormItem>
                  <FormLabel>Country*</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Nigeria" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="dob" :validate-on-blur="!isFieldDirty">
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="1999-03-12" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="occupation" :validate-on-blur="!isFieldDirty">
                <FormItem>
                  <FormLabel>Occupation*</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Tech Expert" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="physicalAddress" :validate-on-blur="!isFieldDirty">
                <FormItem>
                  <FormLabel>Physical Address*</FormLabel>
                  <!-- <FormControl>
                    <Input type="text" placeholder="24, Tech Expert" v-bind="componentField" />
                  </FormControl> -->
                  <FormControl>
                    <div class="relative w-full items-center">
                    <Input type="text" placeholder="24, Tech Expert" v-bind="componentField" class="pr-10" />
                    <span class="absolute end-0 inset-y-0 border-l text-primary my-2 flex items-center justify-center px-4 mr-0.5">
                      <div>Edit</div>
                    </span></div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <!-- <span>
              <Button type="submit" class="w-full mt-8">
                Submit
              </Button></span> -->
            </form>
        </div>
      </Card>
      <button @click="goBack" class="flex gap-2 items-center mt-10">
        <ChevronLeftIcon class="size-6" />
        Go back
      </button>

    </div>
    
  </DashboardLayout>
</template>
