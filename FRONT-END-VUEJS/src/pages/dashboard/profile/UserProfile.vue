<script lang="ts" setup>
import Card from "@/components/Card.vue";
import DashboardLayout from "../layout/DashboardLayout.vue";
import { h, onMounted, ref } from "vue";
import axios from "axios";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { toast } from "@/components/ui/toast/use-toast";
import router from "@/router";
import { ChevronLeftIcon } from "@radix-icons/vue";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const apiBase = import.meta.env.VITE_API_BASE_URL;


const formSchema = toTypedSchema(
  z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email(),
    phone: z.string().optional(),
    tag: z.string().optional(),
    country: z.string().optional(),
    dob: z.string().optional(),
    occupation: z.string().optional(),
    physicalAddress: z.string().optional(),
  })
);


const { handleSubmit, setValues, isSubmitting } = useForm({
  validationSchema: formSchema,
});


const user = ref<any>(null);
const loading = ref(true);
const error = ref<string | null>(null);


const fetchUser = async () => {
  try {
    loading.value = true;
    const response = await axios.get(`${apiBase}/api/auth/me`, {
      withCredentials: true,
    });
    user.value = response.data.user;


    setValues({
      firstName: user.value.firstName || "",
      lastName: user.value.lastName || "",
      email: user.value.email || "",
      phone: user.value.phone || "",
      tag: user.value.tag || "",
      country: user.value.country || "",
      dob: user.value.dob || "",
      occupation: user.value.occupation || "",
      physicalAddress: user.value.physicalAddress || "",
    });
  } catch (err: any) {
    console.error("Error fetching user:", err);
    error.value =
      err.response?.data?.message || "Unable to load profile information.";
  } finally {
    loading.value = false;
  }
};


const onSubmit = handleSubmit(async (values) => {
  try {
    toast({
      title: "Profile Saved!",
      description: h(
        "pre",
        { class: "mt-2 w-[340px] rounded-md bg-slate-950 p-4" },
        h("code", { class: "text-white" }, JSON.stringify(values, null, 2))
      ),
    });
  } catch (err: any) {
    toast({
      title: "Error updating profile",
      description: err.response?.data?.message || err.message,
    });
  }
});

const goBack = () => {
  router.go(-1);
};

onMounted(fetchUser);
</script>

<template>
  <DashboardLayout title="Profile" :is-profile="true">
    <div class="pb-14">
      <Card title="My Profile">
        <div class="flex flex-col gap-8 px-8 pb-10 pt-8">
          <!-- Loading State -->
          <div v-if="loading" class="text-center py-8 text-muted-foreground">
            Loading your profile...
          </div>

          <!-- Error State -->
          <div
            v-else-if="error"
            class="text-center text-red-500 py-8 font-medium"
          >
            {{ error }}
          </div>

          <!-- Profile Info -->
          <div v-else>
            <div class="flex items-center gap-4 text-[32px]">
              <div
                class="w-[72px] aspect-square grid place-items-center rounded-lg text-primary font-semibold bg-primary/5"
              >
                {{ user?.firstName?.[0] || "U" }}{{ user?.lastName?.[0] || "" }}
              </div>
              <p class="font-medium text-xl">
                {{ user?.firstName }} {{ user?.lastName }}
              </p>
            </div>
            <div class="h-[1px] bg-border text-border my-4" />

            <form
              class="grid sm:grid-cols-2 gap-x-16 gap-y-10"
              @submit.prevent="onSubmit"
            >
              <FormField v-slot="{ componentField }" name="firstName">
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="John" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="lastName">
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Doe" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="email">
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      v-bind="componentField"
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="phone">
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="+234 902 922 0646"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="tag">
                <FormItem>
                  <FormLabel>FinPay Tag</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="m293je90"
                      v-bind="componentField"
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="country">
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Nigeria"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="dob">
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      v-bind="componentField"
                      :value="user?.dob"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="occupation">
                <FormItem>
                  <FormLabel>Occupation</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Tech Expert"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="physicalAddress">
                <FormItem>
                  <FormLabel>Physical Address</FormLabel>
                  <FormControl>
                    <div class="relative w-full items-center">
                      <Input
                        type="text"
                        placeholder="24, Tech Expert Avenue"
                        v-bind="componentField"
                        class="pr-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <div class="col-span-2 flex justify-end">
                <Button type="submit" :disabled="isSubmitting" class="px-10">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Card>

      <button @click="goBack" class="flex gap-2 items-center mt-10">
        <ChevronLeftIcon class="size-6" />
        Go back
      </button>
    </div>
  </DashboardLayout>
</template>
