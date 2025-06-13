<template>
  <div class="reset-password">
    <h2>Reset Your Password</h2>
    <form @submit.prevent="handleResetPassword">
      <div class="form-group">
        <label for="password">New Password:</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
          placeholder="Enter new password"
        />
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          v-model="confirmPassword"
          required
          placeholder="Confirm new password"
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Resetting...' : 'Reset Password' }}
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
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const password = ref('')
const confirmPassword = ref('')
const message = ref('')
const isSuccess = ref(false)
const loading = ref(false)

const token = route.params.token

const handleResetPassword = async () => {
  if (password.value !== confirmPassword.value) {
    message.value = 'Passwords do not match!'
    isSuccess.value = false
    return
  }

  loading.value = true
  message.value = ''

  try {
    const response = await axios.post(`http://localhost:8009/api/auth/reset-password/${token}`, {
      password: password.value,
      confirmPassword: confirmPassword.value,
    })

    message.value = response.data.message
    isSuccess.value = true

    setTimeout(() => {
      router.push('/')
    }, 2000)
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
.reset-password {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 16px;
}

input[type='password'] {
  width: 100%;
  padding: 10px;
  margin-top: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px 18px;
  background-color: #10b981;
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
