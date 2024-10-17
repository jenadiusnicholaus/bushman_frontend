import { defineStore } from 'pinia'
import axios from 'axios'

export const useSalesInquiriesStore = defineStore('sales_inquiries', {
  state: () => {
    return {
      salesInquiries: [] as any,
    }
  },

  actions: {
    async getSalesInquiries() {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SALES_INQUIRIES_URL

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

    async createSalesInquiry(payload: any) {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SALES_INQUIRIES_URL

      const data = JSON.stringify({
        categories: ['Hunter'],
        full_name: payload?.fullName,
        contacts: payload?.contacts,
        nationality: payload?.nationality,
        country: payload?.country,
        no_of_hunters: payload?.noOfHunters,
        no_of_days: payload?.noOfDays,
        no_of_companions: payload?.noOfCompanions,
        no_of_observers: payload?.noOfObservers,
        preferred_species: payload?.species,
        area_id: payload?.areaId,
      })

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: url,
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
