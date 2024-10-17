import { defineStore } from 'pinia'
import axios from 'axios'

export const useSalesInquiriesStore = defineStore('sales_inquiries', {
  state: () => {
    return {}
  },

  actions: {
    async getPriceList() {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_PRICE_LIST_URL

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
