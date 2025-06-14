<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/pages/auth/layout/AuthLayout.vue";
import router from "@/router";
import { ArrowRightIcon } from "@radix-icons/vue";
import { ref } from "vue";
import axios from "axios";

const loginData = ref({
  email: "",
  password: "",
});

const loading = ref(false);
const errorMessage = ref("");

const onLogin = async () => {
  errorMessage.value = "";
  loading.value = true;

  try {
    await axios.post(
      "http://localhost:8009/api/auth/login",
      {
        email: loginData.value.email,
        password: loginData.value.password,
      },
      {
        withCredentials: true, 
      }
    );

    router.push("/dashboard");
  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.error || "Login failed. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <AuthLayout
    title="Login to your account"
    description="Securely login to your FinPay account"
    showLogo
  >
    <div class="grid mt-10">
      <div class="grid gap-2 mb-8">
        <Label for="email">Email Address<sup>*</sup></Label>
        <Input
          v-model="loginData.email"
          id="email"
          type="email"
          placeholder="m@example.com"
          required
        />
      </div>

      <div class="grid gap-2 mb-6">
        <div class="flex items-center">
          <Label for="password">Password</Label>
          <a
            href="/forgot-password"
            class="ml-auto inline-block text-sm underline"
          >
            Forgot your password?
          </a>
        </div>
        <Input
          v-model="loginData.password"
          id="password"
          type="password"
          required
        />
      </div>

      <div v-if="errorMessage" class="text-red-600 text-sm mb-4">
        {{ errorMessage }}
      </div>

      <Button
        @click="onLogin"
        type="button"
        class="w-full mb-10"
        :disabled="!loginData.email || !loginData.password || loading"
      >
        {{ loading ? "Logging in..." : "Login" }}
      </Button>

      <RouterLink
        to="/signup"
        class="flex items-center justify-center gap-2 font-semibold"
      >
        Don't have an account? Please Sign up
        <ArrowRightIcon class="h-5 stroke-gray-800" />
      </RouterLink>
    </div>
  </AuthLayout>
</template>
