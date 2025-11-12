/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Wallet interface based on backend model
interface Wallet {
  _id: string;
  userId: string;
  currency: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
