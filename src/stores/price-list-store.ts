import { defineStore } from 'pinia'
import axios from 'axios'

export const usePriceListStore = defineStore('price-list', {
  state: () => {
    return {
      itemsByHuntingType: [] as any,
    }
  },

  actions: {
    async getPriceList(hunting_type_id: any = '', area_id: any = '', quota_id: any = '') {
      const url =
        import.meta.env.VITE_APP_BASE_URL +
        import.meta.env.VITE_APP_PRICE_LIST +
        '?hunting_type_id=' +
        hunting_type_id +
        '&area_id=' +
        area_id +
        '&quota_id=' +
        quota_id

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
    async getPriceListByHuntingType(hunting_type_id: any = '', area_id: any = '', quota_id: any = '') {
      const url =
        import.meta.env.VITE_APP_BASE_URL +
        import.meta.env.VITE_APP_PRICE_LIST +
        '?hunting_type_id=' +
        hunting_type_id +
        '&area_id=' +
        area_id +
        '&quota_id=' +
        quota_id

      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: url,
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const response = await axios.request(config)
      this.itemsByHuntingType = response.data
      return response
    },

    async CreatePriceList(payload: any) {
      const data = JSON.stringify({
        area: payload.area,
        hunting_type_id: payload.huntingTypeId,
        name: payload.name,
        description: payload.description,
        sales_quota_id: payload.salesQuotaId,
        amount: payload.amount,
        currency: payload.currency,
        duration: payload.duration,
        companion_days: payload.companionDays,
        companion_amount: payload.companionAmount,
        start_date:
          payload.startDate instanceof Date && !isNaN(payload.startDate.getTime())
            ? payload.startDate.toISOString().split('T')[0]
            : null, // or handle the error as appropriate
        end_date:
          payload.endDate instanceof Date && !isNaN(payload.endDate.getTime())
            ? payload.endDate.toISOString().split('T')[0]
            : null, // or handle the error as appropriate
        species_object_list: payload.speciesObjectList,
      })

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_CREATE_PRICE_LIST,
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
