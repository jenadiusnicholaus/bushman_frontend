import { defineStore } from 'pinia'
import axios from 'axios'

export const useRegulatoryPackageStore = defineStore('regulatory-package-store', {
  state: () => {
    return {}
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

    async createNewRegulatoryPackage(payload: any) {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_REGULATORY_HUNTING_PACKAGES_URL
      const data = JSON.stringify({
        name: payload.name,
        duration: payload.duration,
        species_object_list: payload.speciesObjectList,
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

    async getRegulatoryPackages() {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_REGULATORY_HUNTING_PACKAGES_URL

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
