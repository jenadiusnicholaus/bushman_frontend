<template>
  <VaCard class="p-6">
    <!-- Form for Adding Species -->

    <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
      <div class="flex flex-col md:flex-row gap-2 justify-start">
        <VaButton v-if="!showPriceList" class="px-2 py-2" icon="arrow_back" size="small" @click="goBack">
          Go Back
        </VaButton>
      </div>
      <VaButtonGroup v-if="!ShowCreateNewPriceListForm">
        <VaButton
          class="px-2 py-2"
          color="primary"
          label="Add New Quota"
          icon="add"
          size="small"
          @click="showCreateNewPriceListFormMethod"
        >
          Add a new Price List
        </VaButton>
      </VaButtonGroup>
    </div>
    <template v-if="!ShowCreateNewPriceListForm">
      <template v-if="showPriceList">
        <ModuleTable :items="items" :columns="columns" @onView="toggleShowPriceListMethod"></ModuleTable>
      </template>
      <template v-else>
        <PricesListDetails :prece-list-item="item"></PricesListDetails>
      </template>
    </template>
    <template v-if="ShowCreateNewPriceListForm">
      <CreatePricesListForm></CreatePricesListForm>
    </template>
  </VaCard>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { mapActions } from 'pinia'
import { useToast, useForm } from 'vuestic-ui'
import ModuleTable from './components/ModuleTable.vue'
import PricesListDetails from './components/PricesList/PricesListDetails.vue'
import { usePriceListStore } from '../../stores/price-list-store'
import CreatePricesListForm from './components/PricesList/CreatePricesListForm.vue'

const defaultItem = {
  name: '',
  start_date: null,
  end_date: null,
}

export default defineComponent({
  name: 'QuotaPage',
  components: {
    ModuleTable,
    PricesListDetails,
    CreatePricesListForm,
  },

  setup() {
    const formRef = ref(null) as any
    const sformRef = ref(null) as any

    const columns = [
      { key: 'id', sortable: true, sortingOptions: ['desc', 'asc'] },
      { key: 'package_name', sortable: true },
      { key: 'quota', sortable: true },
      { key: 'area', sortable: true },
      { key: 'hunting_type', sortable: true },
      { key: 'amount', sortable: true },
      { key: 'duration', sortable: true, label: 'Duration (Days)' },
      { key: 'status', sortable: true },
      { key: 'actions', width: 80 },
    ]

    const {
      isValid: isValidSForm,
      validate: validateSForm,
      resetValidation: resetValidationSForm,
      reset: resetSForm,
    } = useForm(sformRef)

    return {
      isValidSForm,
      validateSForm,
      resetValidationSForm,
      resetSForm,
      formRef,
      sformRef,
      columns,
    }
  },

  data() {
    const items: [] = []

    const sform = reactive({
      id: null as any,
      name: '',
      scientific_name: '',
    })

    const quotasOptions = [] as any

    return {
      items,
      item: null as any,
      editedItemId: null,
      editedItem: null,
      createdItem: { ...defaultItem },
      toast: useToast(),
      sform,
      speciesOptions: [] as any,
      areasOptions: [] as any,
      speciesObjects: [] as any,
      showModal: false,
      quotasOptions,
      showPriceList: true,
      quotaItems: [] as any,
      excellFile: [] as any,
      itemsByHuntingType: [] as any,
      ShowCreateNewPriceListForm: false,
    }
  },

  mounted() {
    this.getPriceLists()
  },

  methods: {
    ...mapActions(usePriceListStore, ['getPriceList']),
    ...mapActions(usePriceListStore, ['getPriceListByHuntingType']),

    toggleShowPriceListMethod(e: any) {
      console.log(e.id)
      this.item = e.item
      this.getPriceListByHuntingTypes(e?.item.price_list_type?.hunting_type?.id)
      this.showPriceList = !this.showPriceList
    },

    goBack() {
      this.showPriceList = !this.showPriceList
      this.ShowCreateNewPriceListForm = false
    },

    showCreateNewPriceListFormMethod() {
      this.ShowCreateNewPriceListForm = !this.ShowCreateNewPriceListForm
      this.showPriceList = false
    },

    deleteFromStorage(index: number) {
      this.speciesObjects.splice(index, 1)
      console.log('Species item deleted:', index)
    },

    async addNewSpecies() {},

    formatDate(date: Date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },

    async getPriceLists() {
      try {
        const response = await this.getPriceList()

        this.items = response?.data?.map((item: any) => ({
          id: item?.id,
          item: item,
          package_name: item?.sales_package?.name,
          quota: item?.sales_package?.sales_quota?.name,
          area: item?.price_list_type?.price_list?.area.name,
          hunting_type: item?.price_list_type?.hunting_type?.name,
          amount: `${item?.price_list_type?.currency}${item?.price_list_type.amount}`,
          duration: item?.price_list_type.duration,
          status: item?.price_list_type.is_active == true ? 'Active' : 'Inactive',
        }))

        console.log(this.items)
      } catch (error) {
        console.log(error)
      }
    },

    async getPriceListByHuntingTypes(hunting_type_id: any) {
      try {
        const response = await this.getPriceListByHuntingType(hunting_type_id)

        this.itemsByHuntingType = response?.data?.map((item: any) => ({
          id: item?.id,
          item: item,
        }))

        console.log(this.itemsByHuntingType)
      } catch (error) {
        console.log(error)
      }
    },
  },
})
</script>

<style lang="scss">
.modal-content {
  padding: 16px; /* Add padding around content */
}

.input-group {
  margin-bottom: 16px; /* Space between input fields */
}

.input-label {
  margin-bottom: 8px; /* Space between label and input */
  font-weight: bold; /* Make the label bold for clarity */
}

/* Flexbox for horizontal alignment of date inputs */
.input-container {
  display: flex;
  align-items: center; /* Align items vertically centered */
}

.input-container > VaDateInput {
  margin-right: 8px; /* Space between start date and end date */
}

.input-container > VaInput {
  flex: 1; /* Let the input take the remaining space */
}
</style>
