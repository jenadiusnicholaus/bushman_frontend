import { defineStore } from 'pinia'
import axios from 'axios'
import { format } from 'date-fns'

export const usePriceListStore = defineStore('price-list', {
  state: () => {
    return {
      itemsByHuntingType: [] as any,
      priceList: [] as any,
      salesPackages: [] as any,
      packageOptions: [] as any,
      latestPackage: null as any,
      showModal: false,
      loadingpackages: false,
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

    async getSalesPackageList(usedAsOptions: boolean = false) {
      this.loadingpackages = true
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SALES_PACKAGE_VSET_URL,
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const response = await axios.request(config)
      if (response.status === 200) {
        this.loadingpackages = false
        if (!usedAsOptions) {
          this.salesPackages = response.data.map((item: any) => {
            return {
              id: item.id,
              name: item.name,
              area_name: item?.area?.name ?? 'N/A',
              regulatory_package_name: item?.regulatory_package?.name ?? 'N/A',
              selfItem: item,
            }
          })
        } else {
          this.latestPackage = {
            value: response.data[0].id,
            text: response.data[0].name,
          }

          this.packageOptions = response.data.map((item: { id: any; name: any }) => {
            return {
              value: item.id,
              text: item.name,
            }
          })
        }
      }
      return response
    },

    async createSalesPackage(payload: any) {
      const data = JSON.stringify({
        name: payload.name,
        area_id: payload.areaId,
        regulatory_package_id: payload.licenceId,
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
      if (response.status === 201) {
        this.showModal = true
        this.getSalesPackageList()
      }
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
