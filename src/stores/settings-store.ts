// VITE_APP_HUNTING_TYPES_URL

import { defineStore } from 'pinia'
import axios from 'axios'

export const useSettingsStore = defineStore('settings-store', {
  state: () => {
    return {
      itemsByHuntingType: [] as any,
      logo: '',
    }
  },

  actions: {
    async getHuntingsTypes() {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_HUNTING_TYPES_URL

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

    // VITE_APP_CURRENCIES_URL
    async getCurrencies() {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_CURRENCIES_URL

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
    // VITE_APP_SEASONS_URL
    async getSeasons() {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SEASONS_URL

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

    loadLogo() {
      // Fetch the logo image and convert to base64
      const img = new Image()
      img.src = '/logo.png' // Your logo image path
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx: any = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        const dataURL = canvas.toDataURL('image/png') // Convert to base64
        this.logo = dataURL // Assign the base64 string to logo
      }
    },
  },
})
