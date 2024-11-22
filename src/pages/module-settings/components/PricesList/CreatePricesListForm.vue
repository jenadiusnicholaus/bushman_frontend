<template>
  <VaInnerLoading :loading="savingPriceList" :size="60">
    <VaForm ref="formRef">
      <div class="p-1">
        <!-- <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"> -->
        <h3 class="font-bold text-lg mb-2">Price list Infos</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <VaSelect
            v-model="form.package"
            :options="packageOptions"
            multiple
            clearable
            placeholder="Select Package list here"
            :rules="[(v: any) => v || 'Package is required']"
            label="Packages"
            required-mark
            @update:modelValue="onChangPackage"
          />
          <!-- <VaInput v-model="form.nick_name" placeholder="Nick name" label="Nick name" /> -->
          <VaSelect
            v-model="form.hunting_type_id"
            placeholder="Select Hunting Type"
            label="Hunting Type"
            :rules="[(v: any) => v || 'Hunting type is required']"
            :options="huntingTypesOptions"
            searchable
            required-mark
            highlight-matched-text
          />
          <VaSelect
            v-model="form.area"
            placeholder="Select Area"
            label="Hunting area"
            :rules="[(v: any) => v || 'Hunting area is required']"
            :options="areasOptions"
            searchable
            highlight-matched-text
            required-mark
            @update:modelValue="getAllSpieces()"
          />
        </div>

        <!-- Experience and Date Group -->
        <h3 class="font-bold text-lg mb-2">Charges per days</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <VaInput
            v-model="form.amount"
            type="text"
            placeholder="Enter Amount"
            :rules="[(value: any) => (value && value.length > 0) || 'Amount is required']"
            label="Amount"
            required-mark
          />

          <VaSelect
            v-model="form.currency"
            placeholder="Select Currency"
            label="Currency"
            :rules="[(v: any) => v || 'Currency is required']"
            :options="currencyOptions"
            searchable
            highlight-matched-text
            required-mark
          />
          <!-- <vue-tel-input v-model="form.phone" mode="international" required></vue-tel-input> -->

          <VaInput
            v-model="form.duration"
            type="text"
            required-mark
            placeholder="Enter Duration"
            :rules="[(value: any) => (value && value.length > 0) || 'Duration is required']"
            label="Duration"
          />
        </div>

        <!-- companion group -->
        <h3 class="font-bold text-lg mb-2">Companion and Observer Charges</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <VaInput
            v-model="form.companion_amount"
            type="text"
            placeholder="Enter Companion Amount"
            :rules="[(value: any) => (value && value.length > 0) || 'Companion Amount is required']"
            label="Companion Cost(Per Person)"
            required-mark
          />
          <VaInput
            v-model="form.observer_amount"
            type="text"
            placeholder="Enter observer Amount"
            :rules="[(value: any) => (value && value.length > 0) || 'Companion Amount is required']"
            label="Observer Cost(Per Person)"
            required-mark
          />
        </div>

        <h3 class="font-bold text-lg mb-2">Price List Life span</h3>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <VaDateInput v-model="form.start_date" required-mark label="Start Date" manual-input />
          <VaDateInput v-model="form.end_date" required-mark label="End Date" manual-input />
        </div>

        <!-- <h3 class="font-bold text-lg mb-2">Species</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <VaSelect
          v-model="form.species"
          label="Species"
          :options="speciesItemOptions"
          placeholder="Select Species"
          required-mark
          :rules="[(v: any) => !!v || 'Species is required']"
          required
        />
        <VaInput
          v-model="form.samount"
          type="text"
          placeholder="Species Cost"
          :rules="[(value: any) => (value && value.length > 0) || 'Species cost is required']"
          label="Species Cost"
          required-mark
        />

        <VaCounter
          v-model="form.quantity"
          required-mark
          label="Quantity"
          manual-input
          :min="1"
          :max="100"
          :rules="[(v: any) => v || 'Quantity is required']"
        />
       
        <VaButtonGroup>
          <VaButton
            class="px-0 py-0"
            color="primary"
            icon="add"
            size="small"
            round
            @click="addNewSpeciesItemToStorage()"
          />
        </VaButtonGroup>
      </div>

      <div class="mt-6">
        <VaList>
          <VaListLabel v-if="speciesObjects.length > 0" class="text-md mb-2 text-left">Selected Species</VaListLabel>
          <VaListLabel v-else color="secondary" class="va-text-code mb-2 text-left">No Species Selected</VaListLabel>

          <VaListItem v-for="(s, index) in speciesObjects" :key="index" class="list__item">
            <VaListItemSection>
              <VaListItemLabel>
                Name: {{ s.name }}
                <VaIcon name="delete" size="small" color="primary" @click="deleteFromStorage(index)" />
              </VaListItemLabel>
              <VaListItemLabel caption>Quantity: {{ s.quantity }}</VaListItemLabel>
              <VaListItemLabel caption>Costs: {{ s.amount }}</VaListItemLabel>
            </VaListItemSection>
          </VaListItem>
        </VaList>
      </div> -->
      </div>

      <div class="mt-4 d-flex p-2">
        <VaButton
          v-if="!showEditForm"
          icon="save"
          class="mr-3 mb-2"
          :disabled="!isValidForm"
          @click="validateForm() && submit()"
        >
          Save
        </VaButton>
      </div>
    </VaForm>
  </VaInnerLoading>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
// import axios from 'axios'/
import { VaForm, VaInput, VaSelect, VaButton } from 'vuestic-ui'
import handleErrors from '../../../../utils/errorHandler'
import { validators } from '../../../../services/utils'

// import Salesinquirieslist from '../../client/dashboard/components/Salesinquirieslist.vue'
import { useForm, useToast } from 'vuestic-ui'
import { mapActions } from 'pinia'
import { useQuotaStore } from '../../../../stores/quota-store'
// import { useSalesInquiriesStore } from '../../../stores/sales-store'
import { useSettingsStore } from '../../../../stores/settings-store'
import { usePriceListStore } from '../../../../stores/price-list-store'

export default defineComponent({
  components: {
    // Salesinquirieslist,
    VaForm,
    VaInput,
    VaSelect,
    VaButton,
  },
  setup() {
    const formRef = ref()
    // const contactFormRef = ref()
    // const showAddSalesInquiriesForm = ref(false)
    // const btnIcon = ref('add')

    const {
      isValid: isValidForm,
      validate: validateForm,
      resetValidation: resetValidationForm,
      reset: resetForm,
    } = useForm(formRef)

    const { init } = useToast()
    const showEditForm = ref(false)

    const form = reactive({
      id: null as any,
      hunting_type_id: null as any,
      package: null as any,
      // description: '',
      // sales_quota_id: null as any,
      amount: 0,
      samount: 0,
      currency: null as any,
      duration: 0,
      start_date: null as any,
      end_date: null as any,
      species: null as any,
      quantity: 0,
      area: null as any,
      // companion_days: 0,
      companion_amount: 0,
      // observer_days: 0,
      observer_amount: 0,
    })

    const contactForm = reactive({
      id: null as any,
      client_id: null as any,
      contact: '',
      contact_type: null as any,
      contactable: false,
    })

    const countries = ref([]) as any
    const nationality = ref([]) as any
    const categoryOptions = ref([]) as any
    const contactsTypes = ref([]) as any
    const clients = ref([]) as any
    const step = ref(0) as any

    return {
      formRef,
      form,
      contactForm,
      showEditForm,
      countries,
      nationality,
      categoryOptions,
      contactsTypes,
      clients,
      step,
      // steps,
      init,
      isValidForm,
      validateForm,
      resetValidationForm,
      resetForm,

      validators,
    }
  },
  data() {
    return {
      preferred_species: [] as any,
      speciesOptions: [] as any,
      speciesObjects: [] as any,
      areasOptions: [] as any,
      huntingTypesOptions: [] as any,
      salesQuotasOptions: [] as any,
      speciesItemOptions: [] as any,
      currencyOptions: [] as any,
      packageOptions: [] as any,
      savingPriceList: false,
    }
  },
  mounted() {
    // this.getAllSpeciesPerQuotaPerArea()
    this.getAreas()
    this.getHuntingTypes()
    this.getQuotaList()
    this.getCurrencyList()
    this.getSalesPackages()
  },
  methods: {
    ...mapActions(useQuotaStore, ['getSpeciesList']),
    ...mapActions(useQuotaStore, ['getAllSpeciesPerQuotaPerArea']),
    ...mapActions(useQuotaStore, ['getAreaList']),
    ...mapActions(useSettingsStore, ['getHuntingsTypes']),
    ...mapActions(useSettingsStore, ['getCurrencies']),
    ...mapActions(useQuotaStore, ['getQuotas']),
    ...mapActions(usePriceListStore, ['createPriceList']),
    ...mapActions(usePriceListStore, ['getSalesPackageList']),

    // addNewSpeciesItemToStorage() {},
    // CreateSalesInquiry

    // ...mapActions(useSalesInquiriesStore, ['createSalesInquiry']),

    onAreaChange(value: any) {
      console.log(value as any)
      this.getAllSpieces()
    },

    async submit() {
      this.savingPriceList = true
      const requestdata = {
        area: this.form.area.value,
        huntingTypeId: this.form.hunting_type_id.value,
        sales_package_ids: this.form.package.filter((v: any) => v?.value !== undefined).map((v: any) => v?.value),
        // description: this.form.description,
        // salesQuotaId: this.form.sales_quota_id.value,
        amount: this.form.amount,
        currency: this.form.currency.value,
        duration: this.form.duration,
        startDate: this.form.start_date,
        endDate: this.form.end_date,
        // speciesObjectList: this.speciesObjects,
        // companionDays: this.form.companion_days,
        companionAmount: this.form.companion_amount,
        // observerDays: this.form.observer_days,
        observerAmount: this.form.observer_amount,
      }

      try {
        const response: any = await this.createPriceList(requestdata)

        if (response.status === 201) {
          this.init({ message: response.data.message, color: 'success' })
          this.resetForm()
          this.resetValidationForm()
          this.speciesObjects = []
          this.savingPriceList = false
        }
      } catch (error: any) {
        this.savingPriceList = false
        const errors = handleErrors(error.response)
        this.init({
          message: '\n' + errors.map((error, index) => `${index + 1}. ${error}`).join('\n'),
          color: 'danger',
        })
      }
    },

    async getSpeciesItems() {
      try {
        const response = await this.getSpeciesList()

        // Add the species items from the response
        this.speciesOptions = response.data.map((item: { id: any; name: any }) => {
          return {
            value: item.id,
            text: item.name,
          }
        })

        // Combine default option with species items
        // this.speciesOptions = this.speciesOptions.concat(speciesItems)
      } catch (error) {
        console.log(error)
      }
    },

    async getSalesPackages() {
      try {
        const response = await this.getSalesPackageList()
        this.packageOptions = response.data.map((item: { id: any; name: any }) => {
          return {
            value: item.id,
            text: item.name,
          }
        })
      } catch (error) {
        console.log(error)
      }
    },

    addNewSpeciesItemToStorage() {
      // Check if all required fields in this.sform are not null
      if (!this.form.species || !this.form.quantity) {
        this.init({
          message: 'Please fill all required fields.',
          color: 'warning',
        })
        return // Exit the method if any field is null
      }

      if (this.form.samount <= 0) {
        this.init({
          message: 'Species cost must be greater than zero.',
          color: 'warning',
        })
        return // Exit the method if species cost is less than zero
      }

      // Ensure quantity is a positive number
      if (Number(this.form.quantity) <= 0) {
        // Uncomment the toast message if needed
        // this.toast.init({
        //   message: 'Quantity must be greater than zero.',
        //   color: 'warning',
        // });

        this.init({
          message: 'Quantity must be greater than zero.',
          color: 'warning',
        })

        return
      }

      // Check if the species item already exists
      const exists = this.speciesObjects.some(
        (species: { species_id: any }) => species.species_id === this.form.species.value,
      )

      if (!exists) {
        this.speciesObjects.push({
          id: this.form.species.value,
          name: this.form.species.text,
          amount: this.form.samount,
          quantity: this.form.quantity,
        })
        // console.log('New species item added:', this.speciesObjects)
      } else {
        console.log('Species item already exists:', this.form.species.value)
      }

      // this.resetSForm()
    },

    deleteFromStorage(index: number) {
      this.speciesObjects.splice(index, 1)
      console.log('Species item deleted:', index)
    },

    async getAreas() {
      try {
        const response = await this.getAreaList()
        this.areasOptions = response.data.map((item: { id: any; name: any }) => {
          return {
            value: item.id,
            text: item.name,
          }
        })
      } catch (error) {
        console.log(error)
      }
    },

    // get hunting types
    async getHuntingTypes() {
      try {
        const response = await this.getHuntingsTypes()
        this.huntingTypesOptions = response.data.map((item: { id: any; name: any }) => {
          return {
            value: item.id,
            text: item.name,
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
    onChangPackage(value: any) {
      console.log(value.filter((v: any) => v?.value !== undefined).map((v: any) => v?.value))
    },

    async getAllSpieces() {
      try {
        const response = await this.getAllSpeciesPerQuotaPerArea(null, this.form.area?.value ?? null, null)
        this.speciesItemOptions = response.data.map((item: any) => {
          return {
            value: item.species.id,
            text: item.species.name,
          }
        })
        // }
      } catch (error) {
        console.log(error)
      }
    },

    // get quotas
    async getQuotaList() {
      try {
        const response = await this.getQuotas(null)
        this.salesQuotasOptions = response.data.map((item: { id: any; name: any }) => {
          return {
            value: item.id,
            text: item.name,
          }
        })
      } catch (error) {
        console.log(error)
      }
    },

    async getCurrencyList() {
      try {
        const response = await this.getCurrencies()
        this.currencyOptions = response.data.map((item: { id: any; name: any }) => {
          return {
            value: item.id,
            text: item.name,
          }
        })
      } catch (error) {
        console.log(error)
      }
    },

    // get clients
  },
})
</script>
s
