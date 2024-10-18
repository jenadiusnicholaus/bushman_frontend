<template>
  <VaCard class="mb-6">
    <VaCardContent>
      <h2 class="page-sub-title">Quota and Area</h2>

      <div class="flex items-center justify-between md:justify-items-stretch">
        <div
          class="flex grow flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-1 justify-between items-start md:items-center"
        >
          <div class="md:w-48">
            <p class="mb-1">Quota</p>
            <p class="font-bold">{{ item.sales_package.sales_quota.name }}&nbsp;</p>
          </div>
        </div>

        <div class="md:w-48 flex flex-col justify-end items-end">
          <VaChip flat preset="primary">Start - end </VaChip>

          <div v-if="!paymentPlan.isYearly" class="mt-2 text-regularSmall">
            <span
              >{{ item.sales_package.sales_quota.start_date }} <strong>To</strong>
              {{ item.sales_package.sales_quota.end_date }}</span
            >
            <!-- <span class="text-danger ml-1">save 16%</span> -->
          </div>
        </div>
      </div>

      <template v-if="paymentCard">
        <VaDivider />

        <div class="flex items-center justify-between md:justify-items-stretch">
          <div
            class="flex grow flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-1 justify-between items-start md:items-center"
          >
            <div class="md:w-48">
              <p class="mb-1">Area</p>
              <p class="font-bold capitalize">{{ item.price_list_type.price_list.area.name }}</p>
            </div>
          </div>
          <!-- <div class="md:w-48 flex justify-end">
            <VaButton :to="{ name: 'payment-methods' }" preset="primary">Payment preferences</VaButton>
          </div> -->
        </div>
      </template>
    </VaCardContent>
  </VaCard>

  <!-- Uncomment the code below if you want to use the ChangeYourPaymentPlan component -->
  <!-- <ChangeYourPaymentPlan
      v-if="isChangeYourPaymentPlanModalOpen"
      :yearly-plan="paymentPlan.isYearly"
      @confirm="updatePaymentPlan"
      @cancel="togglePaymentPlanModal"
    /> -->
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { usePaymentCardsStore } from '../../../../stores/payment-cards'
// import ChangeYourPaymentPlan from '../..modals/ChangeYourPaymentPlan.vue';

export default defineComponent({
  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  setup() {
    const paymentPlan = ref({
      id: '1',
      name: 'Gold',
      isYearly: false,
      type: 'current',
      padletsUsed: 19,
      padletsTotal: '20',
      priceMonth: '$6.99',
      priceYear: '$69.99',
      switchToYearlySave: '16%',
      uploadLimit: '100MB',
    })

    const cardStore = usePaymentCardsStore()
    const isChangeYourPaymentPlanModalOpen = ref(false)

    const paymentCard = computed(() => cardStore.currentPaymentCard)

    const togglePaymentPlanModal = () => {
      isChangeYourPaymentPlanModalOpen.value = !isChangeYourPaymentPlanModalOpen.value
    }

    const updatePaymentPlan = () => {
      paymentPlan.value.isYearly = !paymentPlan.value.isYearly
      isChangeYourPaymentPlanModalOpen.value = false
    }

    return {
      paymentPlan,
      paymentCard,
      togglePaymentPlanModal,
      isChangeYourPaymentPlanModalOpen,
      updatePaymentPlan,
    }
  },
})
</script>
