<template>
  <div class="forgot-password">
    <h2>Forgot Password</h2>
    <form @submit.prevent="handleForgotPassword">
      <div class="form-group">
        <label for="email">Enter your email address:</label>
        <input
          type="email"
          id="email"
          v-model="email"
          required
          placeholder="you@example.com"
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Sending...' : 'Send Reset Link' }}
      </button>
    </form>

    <p v-if="message" :class="{'success': isSuccess, 'error': !isSuccess}">
      {{ message }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const email = ref('')
const message = ref('')
const isSuccess = ref(false)
const loading = ref(false)

const handleForgotPassword = async () => {
  loading.value = true
  message.value = ''

  try {
    const response = await axios.post('/api/auth/forgot-password', { email: email.value })
    message.value = response.data.message
    isSuccess.value = true
  } catch (error) {
    message.value =
      error.response?.data?.message || 'An error occurred. Please try again.'
    isSuccess.value = false
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.forgot-password {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 16px;
}

input[type='email'] {
  width: 100%;
  padding: 10px;
  margin-top: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px 18px;
  background-color: #6366f1;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[disabled] {
  background-color: #ccc;
}

.success {
  color: green;
  margin-top: 12px;
}

.error {
  color: red;
  margin-top: 12px;
}
</style>
