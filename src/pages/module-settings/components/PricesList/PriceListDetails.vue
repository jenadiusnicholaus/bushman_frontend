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

    <ObComCosts :companion-items="preceListItem.componions_hunter" :title="'Companion Costs'"></ObComCosts>
    <ObComCosts :companion-items="preceListItem.observer" :title="'Observer Cost'"></ObComCosts>

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
import ObComCosts from './ObComCosts.vue'
import AdditionCharges from './AdditionCharges.vue'

export default defineComponent({
  components: {
    PriceListQuota,
    // PriceListByHuntingType,
    PriceListPackagesDetails,
    PricesSpeciesList,
    ObComCosts,
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
