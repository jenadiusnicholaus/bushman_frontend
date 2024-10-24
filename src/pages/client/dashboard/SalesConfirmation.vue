<template>
  <VaCard>
    <div v-if="!viewDetails" class="grid grid-cols-12 gap-6 mb-6 py-4">
      <div class="col-span-12">
        <VaInput
          v-model="searchText"
          type="search"
          placeholder="Enter user name or sales code"
          @input="getOrsearchSalesInquiry"
        >
          <template #appendInner> <VaIcon name="manage_search" size="small" color="primary" /> </template
        ></VaInput>
      </div>
    </div>
    <!-- Mode=uleTable -->

    <template v-if="viewDetails">
      <SalesConfirmationClientDetails :item="item"> </SalesConfirmationClientDetails>
    </template>

    <template v-else>
      <!-- <div v-if="results?.length > 0"> -->
      <ModuleTable :items="results" :columns="columns" :loading="loadingresults" @onView="onRowClick"> </ModuleTable>
      <!-- </div> -->
      <!-- show create sales inquiry button -->
      <!-- <div v-else>
        <div class="flex flex-col justify-center items-center h-full">
          <VaIcon name="search" size="4x" color="gray-400" />
          <h2 class="text-lg font-medium mt-4">No results found</h2>
          <VaButton color="primary" @click="$router.push('/sales-inquiry')">Create Sales Inquiry</VaButton>
        </div>
      </div> -->
    </template>
  </VaCard>
</template>

<script lang="ts">
import { useSalesInquiriesStore } from '../../../stores/sales-store'
// map action from pinia
import { mapActions, mapState } from 'pinia'
import ModuleTable from '../../module-settings/components/ModuleTable.vue'
import SalesConfirmationClientDetails from './components/SalesConfirmationClientDetails.vue'

export default {
  components: {
    ModuleTable,
    SalesConfirmationClientDetails,
  },
  data() {
    return {
      items: [] as Array<any>,
      searchText: null as any,
      columns: [
        { key: 'code', label: 'Code', width: 120 },
        { key: 'name' },
        { key: 'country' },
        { key: 'nationality' },
        { key: 'preference.preferred_date', label: 'Preferred date', width: 80 },
        { key: 'actions', width: 80 },
      ],

      viewDetails: false,
      item: null as any,
    }
  },
  computed: {
    ...mapState(useSalesInquiriesStore, ['results', 'loadingresults']),
    // ...mapState(useSalesInquiriesStore, ['loadingresults']),
  },
  mounted() {
    this.getOrsearchSalesInquiry()
  },
  methods: {
    ...mapActions(useSalesInquiriesStore, ['searchSalesInquiries']),

    async getOrsearchSalesInquiry() {
      await this.searchSalesInquiries(this.searchText ?? '')
    },

    onRowClick(row: any) {
      // Do something with the row data
      console.log(row)
      this.item = row.selfitem
      console.log(this.item.selfitem)
      this.viewDetails = true
    },

    // Define your methods here if you have any to implement
  },
}
</script>

<style scoped>
/* Add any styles specific to this component */
</style>
