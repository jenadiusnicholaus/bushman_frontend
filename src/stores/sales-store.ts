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
      priceBreakDown: null as any,
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

    async getallSalesConfirmation() {
      this.loadingresults = true
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SALES_CONFIRMATION_VSET_URL

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
          this.results = response.data.map((item: any) => {
            return {
              sales_inquiry_code: item.sales_inquiry.id,
              name: item.proposed_package?.package.name,
              airport_name: item.itinerary.airport_name,
              charter_in: formatDateTime(item.itinerary.charter_in),
              charter_out: formatDateTime(item.itinerary.charter_out),
              arrival: formatDateTime(item.itinerary.arrival),
              status: item?.status?.status ?? 'No Status',
              selfitem: item,
              // total_sales_amount: item.total_sales_amount,
              // total_sales_amount_usd: item.total_sales_amount_usd,
            }
          })
          return response
        }
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
        regulatory_package_id: payload.regulatoryPackageId,
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

    async getSalesPriceBreakdown(payload: any) {
      //     # http://localhost:8000/api/v1.0/sales-confirmation/total-sales-amount/?package_id=1&sales_inquiry_id=1
      // VITE_APP_SALESPRICE_BREAK_DOWN_URL=sales-confirmation/total-sales-amount/
      const url =
        import.meta.env.VITE_APP_BASE_URL +
        import.meta.env.VITE_APP_SALESPRICE_BREAK_DOWN_URL +
        '?package_id=' +
        payload.packageId +
        '&sales_inquiry_id=' +
        payload.salesInquiryId
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
        this.priceBreakDown = response.data
        return response
      } catch (error) {
        console.log(error)
        return error
      }
    },

    async updatesalesConfirmationStatus(payload: any) {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SALES_CONFIRMATION_STATUS_VSET_URL
      const data = new FormData()

      data.append('doc_type_id', payload.docTypeId)
      data.append('entity_id', payload.entityId)
      // data.append('documents', JSON.stringify(payload.documents))
      data.append('contract_doc', payload.contractDoc)
      data.append('payment_doc', payload.paymentDoc)
      data.append('sales_confirmation_proposal_id', payload.salesConfirmationProposalId)
      data.append('status_id', payload.statusId)
      data.append('area_id', payload.areaId)
      data.append('quota_id', payload.quotaId)

      const config = {
        method: 'patch',
        maxBodyLength: Infinity,
        url: url,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: data,
      }

      const response = await axios.request(config)
      return response
    },
  },
})
