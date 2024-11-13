// VITE_APP_SALES_CONFIRMATION_CONTRACT_VSET_URL

import { defineStore } from 'pinia'
import axios from 'axios'
import { format } from 'date-fns'
import { formatDateTime } from '../services/utils'

export const useGameStore = defineStore('sales_game', {
  state: () => {
    return {
      games: [] as any,
      loadinggames: false,
      permits: [] as any,
      loadingPermits: false,
    }
  },

  actions: {
    async getRegisteredGames() {
      this.loadinggames = true
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_GAME_ACTIVITY_VSET_URL

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
        this.games = response.data.map((item: any) => {
          return {
            permit_number: item?.entity_contract_permit?.permit_number ?? '',
            client_name: item?.client.full_name,
            pdf: item.pdf,
            selfitem: item,
            start_date: formatDateTime(item?.start_date),
            end_date: formatDateTime(item.end_date),
          }
        })
        this.loadinggames = false
        return response
      }
      console.log(this.games)
      return response
    },

    // create Game Activity
    async createGameActivity(payload: any) {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_GAME_ACTIVITY_REGISTRATION_VSET_URL
      const data = JSON.stringify({
        entity_contract_permit_id: payload.entity_contract_permit_id,
        client_id: payload.client_id,
        start_date: format(payload.start_date, 'yyyy-MM-dd'),
        end_date: format(payload.end_date, 'yyyy-MM-dd'),
        coordinates_type: 'Point',
        professional_hunters_ids: payload.professional_hunters_ids,
        games: payload.games,
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
  },
})
