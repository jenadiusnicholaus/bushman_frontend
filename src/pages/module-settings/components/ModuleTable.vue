<template>
  <!-- fiter elemenets  and download btn slot -->
  <!-- create a slot for filter elements -->
  <slot name="filter-elements-and-download-btn"> </slot>
  <VaDataTable
    v-model:sort-by="sortBy"
    v-model:sorting-order="sortingOrder"
    :items="items"
    :columns="columns"
    hoverable
    striped
  >
    <template #cell(actions)="{ rowData }">
      <VaButton preset="plain" icon="visibility" @click="clickedView(rowData)"> </VaButton>
    </template>
  </VaDataTable>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'List',

  props: {
    items: {
      type: Array,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['on-view'],
  data() {
    const sortingOrderOptions = [
      { text: 'asc', value: 'asc' },
      { text: 'desc', value: 'desc' },
      { text: 'no sorting', value: null },
    ]
    return {
      sortBy: 'username',
      sortingOrder: 'asc',
      sortingOrderOptions,
    }
  },

  mounted() {
    console.log('mounted')
    console.log(this.items)
  },

  methods: {
    sortByOptions() {
      return this.columns.map(({ name, key, sortable }) => sortable && (name || key)).filter(Boolean)
    },

    clickedView(data) {
      this.$emit('on-view', data)
    },
  },
})
</script>
