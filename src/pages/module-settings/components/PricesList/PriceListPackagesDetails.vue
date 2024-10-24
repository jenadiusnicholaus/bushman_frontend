<template>
  <VaCard class="mb-6">
    <VaCardContent>
      <h2 class="page-sub-title">Package Infos</h2>
      <!-- <template v-for="(plan, index) in plans" :key="plan.id"> -->
      <div class="flex items-center justify-between md:justify-items-stretch">
        <div
          class="flex grow flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-1 justify-between items-start md:items-center"
        >
          <div class="flex items-center md:w-48">
            <div class="font-bold">Name: {{ preceListItem.sales_package.name }}</div>
          </div>

          <div class="md:w-48">
            <p class="mb-1">
              Status:<VaBadge
                v-if="preceListItem.price_list_type.is_active"
                class="ml-2"
                color="success"
                text="active"
              />
            </p>
            <p>{{ preceListItem.sales_package.descrption }}&nbsp;</p>
          </div>
          <div class="md:w-48">
            <template v-if="preceListItem.price_list_type">
              <p class="mb-1">
                {{ preceListItem.price_list_type.currency }}{{ preceListItem.price_list_type.amount }}&nbsp;/{{
                  preceListItem.price_list_type.duration
                }}days
              </p>
              <p>Hunting type: {{ preceListItem.price_list_type.hunting_type.name }}</p>
            </template>
            <!-- <p v-else>Free</p> -->
          </div>
        </div>
        <div class="md:w-48 flex justify-end">
          <!-- <div v-if="plan.type === 'current'" class="font-bold">{{ plan.padletsUsed }} padlets used</div> -->
          <!-- <VaButton>Upgrade</VaButton> -->
          <!-- <VaButton v-else preset="primary" @click="switchPlan(plan.id)">Downgrade</VaButton> -->
        </div>
      </div>

      <VaDivider />
      <!-- </template> -->
    </VaCardContent>
  </VaCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useToast } from 'vuestic-ui'

export default defineComponent({
  props: {
    preceListItem: {
      type: Object,
      required: true,
    },
  },

  setup() {
    const { init } = useToast()

    type MembershipTier = {
      id: string
      name: string
      type: 'upgrade' | 'downgrade' | 'current'
      padletsUsed: number
      padletsTotal: string
      priceMonth?: string
      priceYear?: string
      uploadLimit: string
    }

    const plans: MembershipTier[] = [
      {
        id: '1',
        name: 'Platinum',
        type: 'upgrade',
        padletsUsed: 0,
        padletsTotal: 'Unlimited',
        priceMonth: '$9.99',
        priceYear: '$99.99',
        uploadLimit: '500MB',
      },
      {
        id: '2',
        name: 'Gold',
        type: 'current',
        padletsUsed: 19,
        padletsTotal: '20',
        priceMonth: '$6.99',
        priceYear: '$69.99',
        uploadLimit: '100MB',
      },
      {
        id: '3',
        name: 'Neon',
        type: 'downgrade',
        padletsUsed: 0,
        padletsTotal: '3',
        priceMonth: undefined,
        priceYear: undefined,
        uploadLimit: '20MB',
      },
    ]

    const switchPlan = (planId: string) => {
      plans.forEach((item, index) => {
        if (item.id === planId) {
          item.type = 'current'
        } else {
          const selectedIndex = plans.findIndex((plan) => plan.id === planId)
          item.type = index < selectedIndex ? 'upgrade' : 'downgrade'
        }
      })
      init({
        message: "You've successfully changed the membership tier",
        color: 'success',
      })
    }

    return {
      plans,
      switchPlan,
    }
  },
})
</script>
