import { defineStore } from 'pinia'
import axios from 'axios'
import { formatDate } from 'date-fns'

export const useRequisitionStore = defineStore('requisition-store', {
  state: () => {
    return {
      requisitions: [] as any,
      requistionItems: [] as any,
      loadingRequisitions: false,
      loadingRequistionItems: false,
    }
  },

  actions: {
    async getRequisitions() {
      this.loadingRequisitions = true

      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_REQUISITION_VSET_URL

      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: url,
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const response = await axios.request(config)
      if (response.status === 200) {
        this.loadingRequisitions = false
        this.requisitions = response.data.map((requisition: any) => {
          return {
            status:
              requisition.next_level !== null
                ? `Waiting to be ${requisition.next_level.approval_chain_role.past} by ${requisition.next_level.approval_chain_role.name}`
                : requisition.status,
            requested_at: formatDate(requisition.date, 'MMM dd yyyy'),
            required_date: formatDate(requisition.required_date, 'MMM dd yyyy'),
            requested_by:
              requisition.requested_by.first_name === '' && requisition.requested_by.last_name === ''
                ? requisition.requested_by.username
                : requisition.requested_by.first_name + '' + requisition.requested_by.last_name,
            type: requisition.type,
            selfItem: requisition,
          }
        })
      }

      return response
    },

    async getRequistionItems(id: any) {
      this.loadingRequistionItems = true
      const url =
        import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_REQUISITION_ITEM_VSET_URL + `?requisition_id=${id}`
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: url,
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const response = await axios.request(config)
      if (response.status === 200) {
        this.loadingRequistionItems = false
        this.requistionItems = response.data.map((item: any) => {
          return {
            item_name: item.name,
            items: item.items,
          }
        })
      }
      return response.data
    },
  },
})
