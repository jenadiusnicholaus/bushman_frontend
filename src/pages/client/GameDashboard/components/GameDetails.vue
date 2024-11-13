<template>
  <div class="p-4">
    <div class="permit-info">
      <VaCardTitle class="p-0, m-0"
        ><b>Permit No:</b> {{ item?.entity_contract_permit.permit_number ?? 'N/A' }}</VaCardTitle
      >

      <VaCardTitle><b>Client:</b> {{ item?.client.full_name ?? 'N/A' }}</VaCardTitle>

      <VaCardTitle><b>Company:</b> BUSHMAN HUNTING SAFARI (T) LTD</VaCardTitle>

      <VaCardTitle
        ><b>PH NAME:</b>
        {{ Array.isArray(item?.ph) ? item.ph.map((ph: any) => ph.ph.full_name).join(', ') : 'N/A' }}</VaCardTitle
      >
      <VaCardTitle><b>PH license:</b> N/A</VaCardTitle>
    </div>
    <VaCard tag="b">
      <VaCardTitle>Killed Species</VaCardTitle>
      <VaCardContent> <VaDataTable :items="gameActivies" /> </VaCardContent>
    </VaCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { formatDateTime } from '../../../../services/utils'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<any>, // Specify the correct type of the item based on your data structure
      required: true,
    },
  },
  setup() {
    return {
      formatDateTime,
    }
  },
  computed: {
    gameActivies() {
      return this.item.game_killed_activity.map((activity: any) => {
        return {
          species: activity.species.name,
          quantity: activity.quantity,
          area: activity.area.name,
          weapon_used: activity.weapon_used,
          date: activity.date,
          time: activity.time,
          gender: activity.spacies_gender,
          coordinates: ` ${activity.location.geo_coordinates.coordinates[0].lat}, ${activity.location.geo_coordinates.coordinates[0].lng} `,
          status: activity.status,
        }
      })
    },
  },
})
</script>

<style scoped></style>
