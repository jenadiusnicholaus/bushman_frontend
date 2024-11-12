// VITE_APP_SALES_CONFIRMATION_CONTRACT_VSET_URL

import { defineStore } from 'pinia'
import axios from 'axios'
// import { format } from 'date-fns'
// import { formatDateTime } from '../services/utils'

export const useCntractsStore = defineStore('sales_contracts', {
  state: () => {
    return {
      contracts: [] as any,
      loadingContracts: false,
    }
  },

  actions: {
    async getContracts() {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SALES_CONFIRMATION_CONTRACT_VSET_URL

      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: url,
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const response = await axios.request(config)
      return response
    },
  },
})
