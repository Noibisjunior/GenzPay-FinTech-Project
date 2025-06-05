<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { Button} from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/pages/auth/layout/AuthLayout.vue";
import router from "@/router";

// Track input values
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const phoneNumber = ref("");
const password = ref("");
const confirmPassword = ref("");

const createAccount = async () => {
  try {
    const res = await axios.post(
      "http://localhost:8009/api/auth/register",
      {
        username: `${firstName.value} ${lastName.value}`,
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
        accountType: "savings",
        phone: phoneNumber.value,
      },
      {
        withCredentials: true, // important for sending cookies!
      }
    );

    if (res.status === 200) {
      // show a toast notification here
      router.push("/verify-link");
    }
  } catch (error: any) {
    console.error("Registration error:", error.response?.data || error.message);
  }
};
</script>


<template>
  <AuthLayout
    title="Create a Secure Account"
    description="Welcome to the future of Savings & Investments"
    :showLogo="true"
  >
    <div class="grid md:grid-cols-2 gap-y-8 gap-x-6 mt-5">
      <div class="grid gap-2">
        <Label for="first-name">First Name*</Label>
        <Input id="first-name" v-model="firstName" type="text" placeholder="Enter your first name" required />
      </div>
      <div class="grid gap-2">
        <Label for="last-name">Last Name*</Label>
        <Input id="last-name"  v-model="firstName" type="text" placeholder="Enter your last name" required />
      </div>
      <div class="grid gap-2">
        <Label for="email">Email*</Label>
        <Input id="email" v-model="email" type="email" placeholder="Enter your email dddress" required />
      </div>
      <div class="grid gap-2">
        <Label for="password">Password*</Label>
        <Input id="password"  v-model="password" type="password" placeholder="Create a password" required />
      </div>
      <div class="grid gap-2">
        <Label for="password-2">Re-enter Password*</Label>
        <Input id="password-2"  v-model="confirmPassword" type="password" placeholder="Re-enter password" required />
      </div>
    </div>
    <span class="inline-block text-sm mb-5">
      *Must be at least 8 characters
    </span>
    <div class="text-center text-sm mb-14 md:mb-0">
      <Button 
        @click="createAccount" 
        type="submit" 
        class="w-full"
      > 
        Create account 
      </Button>
    </div>
  </AuthLayout>
</template>
