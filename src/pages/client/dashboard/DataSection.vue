<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
    <DataSectionItem
      v-for="metric in dashboardMetrics"
      :key="metric.id"
      :title="metric.title"
      :value="metric.value"
      :change-text="metric.changeText"
      :up="metric.changeDirection === 'up'"
      :icon-background="metric.iconBackground"
      :icon-color="metric.iconColor"
    >
      <template #icon>
        <VaIcon :name="metric.icon" size="large" />
      </template>
    </DataSectionItem>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useColors } from 'vuestic-ui'
import DataSectionItem from './DataSectionItem.vue'

interface DashboardMetric {
  id: string
  title: string
  value: string
  icon: string
  changeText: string
  changeDirection: 'up' | 'down'
  iconBackground: string
  iconColor: string
}

const { getColor } = useColors()

const dashboardMetrics = computed<DashboardMetric[]>(() => [
  {
    id: 'openInvoices',
    title: 'Open invoices',
    value: '$35,548',
    icon: 'mso-attach_money',
    changeText: '2024-2025',
    changeDirection: 'up',
    iconBackground: getColor('success'),
    iconColor: getColor('on-success'),
  },
  {
    id: 'totalquota',
    title: 'Total Quota Balance',
    value: '15',
    icon: 'mso-folder_open',
    changeText: '2024-2025',
    changeDirection: 'up',
    iconBackground: getColor('success'),
    iconColor: getColor('on-info'),
  },
  {
    id: 'species',
    title: 'Taken Species',
    value: '25',
    icon: 'pets',
    changeText: '2024-2025',
    changeDirection: 'up',
    iconBackground: getColor('primary'),
    iconColor: getColor('on-danger'),
  },
  {
    id: 'newProfit',
    title: 'Confirmed Species',
    value: '100',
    icon: 'pets',
    changeText: '2024-2025',
    changeDirection: 'up',
    iconBackground: getColor('success'),
    iconColor: getColor('on-primary'),
  },
])
</script>
