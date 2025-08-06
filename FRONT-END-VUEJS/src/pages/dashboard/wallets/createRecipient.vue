<script setup>
import DashboardLayout from "../layout/DashboardLayout.vue";
import Card from "@/components/Card.vue";
import { ref } from "vue";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const recipient = ref({
  currency: "",
  type: "",
  accountName: "",
  accountNumber: "",
  bank: "",
});

const createRecipient = async () => {
  const allFilled = Object.values(recipient.value).every(val => val);
  if (!allFilled) return alert("Please fill out all fields");

  try {
    const response = await axios.post("http://localhost:8009/api/recipients", {
      userId: "user_001",
      ...recipient.value,
    });

    console.log("Recipient created:", response.data);
    alert("Recipient created successfully");
    recipient.value = { currency: "", type: "", accountName: "", accountNumber: "", bank: "" };
  } catch (err) {
    console.error("Create recipient failed", err);
    alert("Failed to create recipient");
  }
};
</script>

<template>
  <DashboardLayout title="Create Recipient">
    <div class="max-w-[600px] mx-auto mt-12">
      <Card title="New Recipient">
        <div class="flex flex-col gap-6 p-8">

          <div class="space-y-4">
            <Label for="currency">Currency*</Label>
            <Input id="currency" v-model="recipient.currency" placeholder="USD / NGN" />
          </div>

          <div class="space-y-4">
            <Label>Type*</Label>
            <Select v-model="recipient.type">
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Individual">Individual</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-4">
            <Label for="accountName">Account Name*</Label>
            <Input id="accountName" v-model="recipient.accountName" placeholder="John Doe" />
          </div>

          <div class="space-y-4">
            <Label for="accountNumber">Account Number*</Label>
            <Input id="accountNumber" v-model="recipient.accountNumber" placeholder="1234567890" />
          </div>

          <div class="space-y-4">
            <Label for="bank">Bank*</Label>
            <Input id="bank" v-model="recipient.bank" placeholder="Access Bank" />
          </div>
<RouterLink to="/dashboard/wallets">
          <Button @click="createRecipient" class="w-full">
            Create Recipient
          </Button>
        </RouterLink>
        </div>
      </Card>
    </div>
  </DashboardLayout>
</template>
