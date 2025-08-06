<script setup>
import DashboardLayout from "../layout/DashboardLayout.vue";
import Card from "@/components/Card.vue";
import { ref } from "vue";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const currency = ref("");

const createWallet = async () => {
  if (!currency.value) return alert("Please enter a currency");

  try {
    const response = await axios.post("http://localhost:8009/api/wallets", {
      userId: "user_001",
      currency: currency.value,
      balance: 0,
    });

    console.log("Wallet created:", response.data);
    alert("Wallet created successfully");
    currency.value = "";
  } catch (err) {
    console.error("Create wallet failed", err);
    alert("Failed to create wallet");
  }
};
</script>

<template>
  <DashboardLayout title="Create Wallet">
    <div class="max-w-[500px] mx-auto mt-12">
      <Card title="New Wallet">
        <div class="flex flex-col gap-8 p-8">
          <div class="space-y-4">
            <Label for="currency">Currency*</Label>
            <Input id="currency" v-model="currency" placeholder="e.g. USD, NGN, EUR" />
          </div>
          <RouterLink to="/dashboard/wallets">
            <Button @click="createWallet" class="w-full">
            Create Wallet
          </Button>
          </RouterLink>
          
        </div>
      </Card>
    </div>
  </DashboardLayout>
</template>
