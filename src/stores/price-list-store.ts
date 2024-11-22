import { defineStore } from 'pinia'
import axios from 'axios'
import { format } from 'date-fns'

export const usePriceListStore = defineStore('price-list', {
  state: () => {
    return {
      itemsByHuntingType: [] as any,
      priceList: [] as any,
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
      if (response.data.length > 0) {
        this.priceList = response.data
      }
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

    async getSalesPackageList() {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SALES_PACKAGE_VSET_URL,
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const response = await axios.request(config)
      return response
    },

    async createSalesPackage(payload: any) {
      // VITE_APP_SALES_PACKAGE_VSET_URL=settings/sales-package-vset/
      const data = JSON.stringify({
        name: payload.name,
        description: payload.description,
        species_object_list: payload.speciesObjectList,
      })

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SALES_PACKAGE_VSET_URL,
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      }

      const response = await axios.request(config)
      return response
    },

    async createPriceList(payload: any) {
      const startDate = payload?.startDate ? format(new Date(payload.startDate), 'yyyy-MM-dd') : null
      const endDate = payload?.endDate ? format(new Date(payload.endDate), 'yyyy-MM-dd') : null
      const data = JSON.stringify({
        area: payload.area,
        hunting_type_id: payload.huntingTypeId,
        sales_package_ids: payload.sales_package_ids,
        description: payload.description,
        sales_quota_id: payload.salesQuotaId,
        amount: payload.amount,
        currency: payload.currency,
        duration: payload.duration,
        companion_days: payload.companionDays,
        companion_amount: payload.companionAmount,
        observer_days: payload.observerDays,
        observer_amount: payload.observerAmount,
        start_date: startDate,
        end_date: endDate,
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
