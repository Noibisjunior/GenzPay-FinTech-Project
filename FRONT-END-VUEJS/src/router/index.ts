import { createWebHistory, createRouter } from 'vue-router'

import Login from '@/pages/auth/Login.vue'
import CreateAccount from '@/pages/auth/CreateAccount.vue'

const routes = [
  { path: '/', component: Login },
  { path: '/signup', component: CreateAccount },
  { path: '/forgot-password', component: () => import('@/pages/auth/forgotPassword.vue') },
  { path: '/reset-password', component: () => import('@/pages/auth/resetPassword.vue') },
  { path: '/verify-code', component: () => import('@/pages/auth/VerificationCode.vue') },
  {
    path: '/dashboard',
    children: [
      { 
        path: 'home', 
        component: () => import('@/pages/dashboard/home/Overview.vue'),
        alias: ['/dashboard',]
      },
      { 
        path: 'invoices',
        children: [
          { path: '', component: () => import('@/pages/dashboard/invoices/Invoices.vue') },
          { path: 'new', component: () => import('@/pages/dashboard/invoices/NewInvoice.vue') },
        ]
      },
      { path: 'cards', component: () => import('@/pages/dashboard/cards/Cards.vue') },
      { 
        path: 'wallets', 
        children: [
          { path: '', component: () => import('@/pages/dashboard/wallets/Wallets.vue'), },
          { path: 'send', component: () => import('@/pages/dashboard/wallets/SendMoney.vue'), },
          {path: 'convert', component: () => import('@/pages/dashboard/wallets/ConvertFunds.vue')},
        ]
      },
      { path: 'transactions', component: () => import('@/pages/dashboard/transactions/Transactions.vue') },
      { 
        path: 'profile', 
        children: [
          { 
            path: 'user', 
            component: () => import('@/pages/dashboard/profile/UserProfile.vue'),
            alias: ['/dashboard/profile'] 
          },
          { path: 'beneficiaries', component: () => import('@/pages/dashboard/profile/Beneficiaries.vue') },
          { path: 'Identification', component: () => import('@/pages/dashboard/profile/Identification.vue') },
          { path: 'security', component: () => import('@/pages/dashboard/profile/Security.vue') },
        ]
      },
    ], 
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router