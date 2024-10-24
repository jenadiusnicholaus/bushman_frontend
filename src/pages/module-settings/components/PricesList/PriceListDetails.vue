<template>
  <!-- <h1 class="h1">Price List Details</h1> -->

  <VaSkeletonGroup v-if="cardStore.loading">
    <VaSkeleton class="mb-4" height="160px" variant="squared" />
    <VaSkeleton class="mb-4" height="160px" variant="squared" />
    <VaSkeleton height="360px" variant="squared" />
  </VaSkeletonGroup>

  <template v-else>
    <PriceListPackagesDetails :prece-list-item="preceListItem" />
    <PriceListQuota :item="preceListItem" />
    <PricesSpeciesList :species-items="preceListItem.sales_package.species"> </PricesSpeciesList>
    <ComponionCosts :companion-items="preceListItem.componions_hunter"></ComponionCosts>
    <AdditionCharges></AdditionCharges>
    <!-- <PriceListByHuntingType /> -->
  </template>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import PaymentInfo from './../../billing/PaymentInfo.vue'
// import Invoices from './../../billing/Invoices.vue'
import { usePaymentCardsStore } from '../../../../stores/payment-cards'
import PriceListPackagesDetails from './PriceListPackagesDetails.vue'
import PriceListQuota from './PriceListQuota.vue'
// import PriceListByHuntingType from './PriceListByHuntingType.vue'
import PricesSpeciesList from './PricesSpeciesList.vue'
import ComponionCosts from './ComponionCosts.vue'
import AdditionCharges from './AdditionCharges.vue'

export default defineComponent({
  components: {
    PriceListQuota,
    // PriceListByHuntingType,
    PriceListPackagesDetails,
    PricesSpeciesList,
    ComponionCosts,
    AdditionCharges,
  },

  props: {
    preceListItem: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      cardStore: usePaymentCardsStore(),
    }
  },
  computed: {
    loading() {
      return this.cardStore.loading
    },
  },
  mounted() {
    this.cardStore.load()
  },
})
</script>
