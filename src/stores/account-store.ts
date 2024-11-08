import { defineStore } from 'pinia'
import axios from 'axios'

export const useAccountsStore = defineStore('accounts-store', {
  state: () => {
    return {}
  },

  actions: {
    async createCRDRTransaction(payload: any) {
      const data = JSON.stringify({
        currency_id: payload.currency_id,
        date: payload.date,
        account_type: payload.account_type,
        reference_number: payload.reference_number,
        transaction_type: payload.transaction_type,
        transaction_id: payload.transaction_id,
        amount: payload.amount,
        narration: payload.narration,
        accountable_id: payload.accountable_id,
        accountable_type_id: payload.accountable_type_id,
        sales_confirmation_id: payload.sales_confirmation_id,
      })

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: import.meta.env.VITE_APP_ACCOUNT_BASE_URL + import.meta.env.VITE_APP_ACCOUNTS_VSET_URL,
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      }

      const response = await axios.request(config)
      return response
    },
    // VITE_APP_ACCOUNT_DR_CR_URL
    async createDRCRTransaction(payload: any) {
      const data = JSON.stringify({
        currency_id: payload.currency_id,
        date: payload.date,
        account_type: payload.account_type,
        reference_number: payload.reference_number,
        transaction_type: payload.transaction_type,
        transaction_id: payload.transaction_id,
        amount: payload.amount,
        narration: payload.narration,
        accountable_id: payload.accountable_id,
        accountable_type_id: payload.accountable_type_id,
        sales_confirmation_id: payload.sales_confirmation_id,
      })

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: import.meta.env.VITE_APP_ACCOUNT_BASE_URL + import.meta.env.VITE_APP_ACCOUNT_DR_CR_URL,
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      }

      const response = await axios.request(config)
      return response
    },
  },
})
