<template>
  <VaCard class="p-6">
    <!-- Form for Adding Species -->

    <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
      <div class="flex flex-col md:flex-row gap-2 justify-start">
        <VaButton v-if="!showSpeciesList" size="small" class="px-2" icon="arrow_back" @click="showSpecies">
          Go Back
        </VaButton>
      </div>
      <VaButtonGroup>
        <VaButton class="px-2 py-2" color="primary" label="Add New Quota" icon="add" size="small" @click="showSpecies"
          >Add a new species</VaButton
        >
      </VaButtonGroup>
    </div>

    <ModuleTable
      v-if="showSpeciesList"
      :items="items"
      :columns="columns"
      :loading="loading"
      @onView="showSpecies"
    ></ModuleTable>

    <div v-else class="p-2">
      <VaForm ref="sformRef" class="mb-6">
        <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
          <!-- name -->

          <VaInput
            v-model="sform.name"
            label="Species Name"
            placeholder="Enter Species Name"
            :rules="[(v: any) => !!v || 'Species Name is required']"
            required
          />
          <VaInput
            v-model="sform.scientific_name"
            label="Scientific Name"
            placeholder="Select Scientific Name"
            :rules="[(v: any) => !!v || 'Scientific Name is required']"
            required
          />
          <!-- Type -->
          <div class="mb-4 grid grid-cols-1 md:grid-cols-1">
            <VaSelect
              v-model="sform.type"
              label="Type"
              :options="TYPES"
              :rules="[(v: any) => !!v || 'Type is required']"
              required-mark
            />
          </div>
        </div>
        <!-- description -->
        <div class="mb-4 grid grid-cols-1 md:grid-cols-1">
          <VaTextarea
            v-model="sform.description"
            label="Description"
            placeholder="Enter Description"
            :rules="[(v: any) => !!v || 'Description is required']"
            required
          />
        </div>
        <!-- start_date -->
      </VaForm>

      <div class="mb-6">
        <VaButton
          :disabled="!isValidSForm"
          color="primary"
          icon="save"
          icon-color="#fff"
          @click="validateSForm() && addNewSpecies()"
        >
          Save
        </VaButton>
      </div>
    </div>
  </VaCard>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useQuotaStore } from '../../stores/quota-store'
import { mapActions } from 'pinia'
import { reactive } from 'vue'
import { useToast, useForm } from 'vuestic-ui'
import ModuleTable from './components/ModuleTable.vue'
import { useSpeciesStore } from '../../stores/species-store'
import handleErrors from '../../utils/errorHandler'
// import PDFViewer from 'pdf-viewer-vue'
const defaultItem = {
  name: '',
  start_date: null,
  end_date: null,
  // description: '',
}

export default defineComponent({
  name: 'QuotaPage',
  components: {
    ModuleTable,
    // PDFViewer,
  },

  setup() {
    const formRef = ref(null) as any
    const sformRef = ref(null) as any

    const columns = [
      { key: 'id', sortable: true, sortingOptions: ['desc', 'asc'] },
      { key: 'name', sortable: true },
      { key: 'scientific_name', sortable: true },
      { key: 'type', sortable: true },

      // { key: 'actions', width: 80 },
    ]

    const {
      isValid: isValidSForm,
      validate: validateSForm,
      resetValidation: resetValidationSForm,
      reset: resetSForm,
    } = useForm(sformRef)

    // Make sure to use `isValidForm`, `validateForm`, and `resetValidationForm` in your component logic as needed
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
      type: null as any,
      scientific_name: '',
      description: '',
    })

    const TYPES = [
      {
        value: 'MAIN',
        text: 'Main Species',
      },
      {
        value: 'NORMAL',
        text: 'Normal Species',
      },
    ]

    const quotasOptions = [] as any

    return {
      items,
      editedItemId: null,
      editedItem: null,
      createdItem: { ...defaultItem },
      toast: useToast(), // Initialize useToast here

      sform,
      speciesOptions: [] as any,
      areasOptions: [] as any,
      speciesObjects: [] as any,
      showModal: false,
      quotasOptions,
      showSpeciesList: true,
      quotaItems: [] as any,
      excellFile: [] as any,
      loading: false,
      saving: false,
      TYPES,
    }
  },

  mounted() {
    this.getSpeciesItems()
  },

  methods: {
    ...mapActions(useQuotaStore, ['getSpeciesList']),
    ...mapActions(useSpeciesStore, ['createSpecies']),

    showSpecies(e: any) {
      console.log(e.id)
      this.showSpeciesList = !this.showSpeciesList
      // this.sform.salesQuota = {
      //   value: e.id,
      //   text: this.generateQuotaYear(e.start_date, e.end_date) + ` - ${e.name}`,
      // }
    },

    deleteFromStorage(index: number) {
      this.speciesObjects.splice(index, 1)
      console.log('Species item deleted:', index)
    },

    async addNewSpecies() {
      this.saving = true
      const requestData = {
        name: this.sform.name,
        type: this.sform.type.value,
        scientific_name: this.sform.scientific_name,
        description: this.sform.description,
      }
      try {
        const response = await this.createSpecies(requestData)
        if (response.status === 201) {
          this.saving = false
          this.toast.init({
            message: response.data.message,
            color: 'success',
          })
          this.resetSForm()
          this.getSpeciesItems()
        }
      } catch (error: any) {
        this.saving = false
        const errors = handleErrors(error.response || error) // Handle any error response

        console.log('Caught errors:', errors) // Log caught errors for debugging

        const message =
          errors.length > 0
            ? '\n' + errors.map((error, index) => `${index + 1}. ${error}`).join('\n')
            : 'An unexpected error occurred. Please try again later.' // Fallback message

        this.toast.init({
          message, // Use the constructed message
          color: 'danger',
        })
      }
    },

    formatDate(date: Date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-indexed
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },

    async getSpeciesItems() {
      try {
        this.loading = true
        const response = await this.getSpeciesList()

        if (response.status === 200) {
          this.items = response?.data?.map((item: any) => ({
            id: item.id,
            name: item.name,
            type: item.type,
            scientific_name: item.scientific_name,
          }))

          this.loading = false
        } else {
          this.loading = false
          this.toast.init({
            message: 'Failed to fetch species items',
            color: 'danger',
          })
        }
      } catch (error) {
        this.loading = false
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
ss
