import { defineStore } from 'pinia'
import axios from 'axios'
import { format } from 'date-fns'
import { formatDateTime } from '../services/utils'

export const useSalesInquiriesStore = defineStore('sales_inquiries', {
  state: () => {
    return {
      salesInquiries: [] as any,
      results: [] as any,
      loadingresults: false,
    }
  },

  actions: {
    async getSalesInquiries(seasonId: any, preferredDate: any) {
      // ?season_id=1&preferred_date=2024-10-14
      const formattedDate = preferredDate ? format(new Date(preferredDate), 'yyyy-MM-dd') : ''

      const url =
        import.meta.env.VITE_APP_BASE_URL +
        import.meta.env.VITE_APP_SALES_INQUIRIES_URL +
        '?season_id=' +
        seasonId +
        '&preferred_date=' +
        formattedDate

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
      const formattedDate = payload?.preferredDate ? format(new Date(payload.preferredDate), 'yyyy-MM-dd') : null
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
        season: payload?.season.value,
        preferred_date: formattedDate,
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

    async searchSalesInquiries(query: any) {
      this.loadingresults = true
      const url =
        import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SEARCH_SALES_INQUIRIES_URL + '?query=' + query

      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: url,
        headers: {
          'Content-Type': 'application/json',
        },
      }

      try {
        const response = await axios.request(config)
        if (response.data.length > 0 && response.status === 200) {
          this.loadingresults = false
          this.results = response.data.map((item: any) => ({
            id: item.id,
            selfitem: item,
            name: item?.entity?.full_name,
            code: item?.code,
            country: item?.entity?.country?.name,
            nationality: item?.entity?.nationality.name,
            contacts: item?.entity?.contacts?.map((contact: any) => ({
              id: contact.id,
              name: contact?.contact,
              contactable: contact?.contactable,
            })),
            preference: {
              no_of_hunters: item?.preference?.no_of_hunters,
              no_of_observers: item?.preference?.no_of_observers,
              no_of_days: item?.preference?.no_of_days,
              no_of_companions: item?.preference?.no_of_companions,
              special_requests: item?.preference?.special_requests,
              budget_estimation: item?.preference?.budget_estimation,
              prev_experience: item?.preference?.prev_experience,
              preferred_date: formatDateTime(item?.preference?.preferred_date),
              accommodation_type: item?.preference?.accommodation_type,
              payment_method: item?.preference?.payment_method,
            },
            preferred_species: item?.preferred_species?.map((species: any) => ({
              id: species?.id,
              name: species?.species?.name,
              quantity: species?.quantity,
            })),
          }))
        }
        return response
      } catch (error) {
        console.log(error)
        this.loadingresults = false
        this.results = []
        return error
      }
    },

    async createSalesConfirmationFinalization(payload: any) {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SALES_CONFIRMATION_VSET_URL
      const data = JSON.stringify({
        sales_inquiry_id: payload.salesInquiryId,
        package_id: payload.packageId,
        airport_name: payload.airportName,
        charter_in: payload.charterIn,
        charter_out: payload.charterOut,
        arrival: payload.arrival,
        installments: payload.installments,
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

    get,
  },
})
