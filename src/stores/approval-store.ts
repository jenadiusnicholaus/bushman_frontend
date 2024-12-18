// VITE_APP_APPROVAL_CHAIN_VSET_URL

import { defineStore } from 'pinia'
import axios from 'axios'
import { formatDate } from 'date-fns'

export const useApprovalChainStore = defineStore('approval-chain-store', {
  state: () => {
    return {
      approvalChainModules: [] as any,
      loadingApprovalChain: false,
    }
  },

  actions: {
    async getRequisitionsApprovalChain(usedAsOptions: boolean = false) {
      this.loadingApprovalChain = true

      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_APPROVAL_CHAIN_VSET_URL

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
        this.loadingApprovalChain = false
        if (!usedAsOptions) {
          this.approvalChainModules = response.data.map((requisition: any) => {
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
        } else {
          this.approvalChainModules = response.data.map((requisition: any) => {
            return {
              value: requisition.id,
              text: requisition.name,
            }
          })
        }
      }

      return response
    },
  },
})
