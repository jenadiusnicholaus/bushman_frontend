// VITE_APP_SALES_CONFIRMATION_CONTRACT_VSET_URL

import { defineStore } from 'pinia'
import axios from 'axios'
import { QuotaStats } from '../interfaces/IQuota'
// import { format } from 'date-fns'
// import { formatDateTime } from '../services/utils'

export const useStatsStore = defineStore('stats', {
  state: () => {
    return {
      loadingStats: false,
      quotaStats: {} as QuotaStats,
    }
  },

  actions: {
    async getStats() {
      this.loadingStats = true
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_QUOTA_STATS_URL

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
        this.quotaStats = response.data.map((item: any) => {
          return {
            confirmed: item.confirmed,
            pending: item.pending,
            cancelled: item.cancelled,
            taken: item.taken,
            provisioned: item.provisioned,
            tatalQuota: item.total_quota_balance,
            quota: item.name,
          }
        })[0]
        console.log(this.quotaStats)
        this.loadingStats = false
        return response
      }
      return response
    },
  },
})
