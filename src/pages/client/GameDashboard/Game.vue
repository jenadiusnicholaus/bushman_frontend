<template>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between px-4 py-2">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaButton
            v-if="showDetails || showAddContractForm"
            class="px-2 py-2"
            icon="arrow_back"
            size="small"
            @click="gotBack()"
          >
            Go Back
          </VaButton>
        </div>
        <VaButtonGroup v-if="!showAddContractForm && !showDetails">
          <VaButton
            class="px-2 py-2"
            color="primary"
            label="Add New Quota"
            round
            present="secondary"
            border-color="primary"
            icon="add"
            size="small"
            @click="toggleAddSalesInquiriesForm()"
            >Create Contract</VaButton
          >
        </VaButtonGroup>
      </div>

      <template v-if="!showDetails">
        <template v-if="!showAddContractForm">
          <VaDataTable :items="contracts" :columns="columns" :loading="loadingContracts">
            <template #cell(actions)="{ rowData }">
              <VaButton preset="plain" icon="download" @click="downloadPdf(rowData.pdf)"></VaButton>
              <VaButton preset="plain" icon="visibility" @click="viewContract(rowData.selfitem)"></VaButton>
            </template>
          </VaDataTable>
        </template>
        <template v-else>
          <ContractForm> </ContractForm>
        </template>
      </template>
      <template v-else>
        <ContractDetails :contract-item="item"></ContractDetails>
      </template>
    </VaCardContent>
  </VaCard>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia'
import { defineComponent } from 'vue'
import { useContractsStore } from '../../../stores/contracts-store'
import downloadPdf from '../../../utils/pdfDownloader'
import ContractDetails from './components/GameDetails.vue'
import ContractForm from './components/GameForm.vue'

export default defineComponent({
  components: {
    ContractDetails,
    ContractForm,
  },
  data() {
    const columns = [
      { key: 'contract_number', sortable: true },
      { key: 'client_name', sortable: true },
      { key: 'start_date', sortable: true },
      { key: 'end_date', sortable: true },
      { key: 'created_at', sortable: true },
      { key: 'actions', label: 'Actions' },
    ]

    return {
      columns,
      downloadPdf,
      item: null as any,
      showDetails: false,
      showAddContractForm: false,
    }
  },
  computed: {
    ...mapState(useContractsStore, ['contracts', 'loadingContracts']),
  },
  mounted() {
    this.getContracts()
  },
  methods: {
    ...mapActions(useContractsStore, ['getContracts']),

    viewContract(contract: any) {
      this.item = contract
      this.showDetails = true
      this.showAddContractForm = false
    },

    gotBack() {
      this.getContracts()

      this.showDetails = false
      this.showAddContractForm = false
    },

    toggleAddSalesInquiriesForm() {
      this.showDetails = false
      this.showAddContractForm = !this.showAddContractForm
    },
  },
})
</script>
