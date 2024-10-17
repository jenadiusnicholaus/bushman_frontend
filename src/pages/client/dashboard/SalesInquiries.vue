<template>
  <VaCard class="w-full">
    <div class="flex flex-col md:flex-row gap-2 mb-0 justify-between">
      <div class="flex flex-col md:flex-row gap-2 justify-start">
        <VaCardTitle>Sales Inquiries</VaCardTitle>
      </div>
      <VaButton
        border-color="primary"
        preset="secondary"
        :icon="btnIcon"
        class="mr-6 my-3"
        @click="toggleAddSalesInquiriesForm"
      />
    </div>

    <VaCardContent>
      <Salesinquirieslist v-if="!showAddSalesInquiriesForm" />
      <!-- <VaStepper v-else v-model="step" :steps="steps" vertical controls-hidden> -->
      <!-- <template #step-content-0> -->
      <VaForm v-else ref="formRef">
        <div class="p-1">
          <!-- <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"> -->
          <h3 class="font-bold text-lg mb-2">Basic Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <VaInput
              v-model="form.full_name"
              type="text"
              placeholder="Enter your Full name"
              :rules="[(value) => (value && value.length > 0) || 'Full name is required']"
              label="Full name"
            />
            <!-- <VaInput v-model="form.nick_name" placeholder="Nick name" label="Nick name" /> -->
            <VaSelect
              v-model="form.country"
              placeholder="Select Country"
              label="Country"
              :rules="[(v) => v || 'Country is required']"
              :options="countries"
              searchable
              highlight-matched-text
            />
            <VaSelect
              v-model="form.nationality"
              placeholder="Select Client nationality"
              label="Client Nationality"
              :rules="[(v) => v || 'Nationality is required']"
              :options="nationality"
              searchable
              highlight-matched-text
            />
          </div>

          <!-- Experience and Date Group -->
          <h3 class="font-bold text-lg mb-2">Contacts</h3>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <VaInput
              v-model="form.email"
              type="email"
              placeholder="Enter your email"
              :rules="[validators.required, validators.email]"
              label="Email"
            />

            <VaInput
              v-model="form.phone"
              type="tell"
              placeholder="eg: +971501234567"
              :rules="[validators.required, validators.tell]"
              label="Phone"
            />
            <!-- <vue-tel-input v-model="form.phone" mode="international" required></vue-tel-input> -->

            <VaInput
              v-model="form.address"
              type="text"
              placeholder="enter your address"
              :rules="[(value) => (value && value.length > 0) || 'Phone is required']"
              label="Address"
            />
          </div>

          <h3 class="font-bold text-lg mb-2">Participants and hunting days</h3>
          <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <VaInput
              v-model="form.no_of_hunters"
              label="Number of Hunters(Optional)"
              placeholder="Enter Number of Hunters"
              type="number"
              required
            />
            <VaInput
              v-model="form.no_of_observers"
              label="Number of Observers(Optional)"
              placeholder="Enter Number of Observers"
              type="number"
              required
            />
            <VaInput
              v-model="form.no_of_days"
              label="Number of Days"
              placeholder="Enter Number of Days"
              type="number"
              :rules="[(v) => v || 'This field is required']"
              required
            />
            <VaInput
              v-model="form.no_of_companions"
              label="Number of Companions(Optional)"
              placeholder="Enter Number of Companions"
              type="number"
              required
            />
            <VaSelect
              v-model="form.area"
              placeholder="Select Area"
              label="Hunting area"
              :rules="[(v) => v || 'Hunting area is required']"
              :options="areasOptions"
              searchable
              highlight-matched-text
            />
          </div>

          <h3 class="font-bold text-lg mb-2">Preferred Species</h3>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <VaSelect
              v-model="form.species"
              label="Species"
              :options="speciesOptions"
              placeholder="Select Species"
              :rules="[(v) => !!v || 'Species is required']"
              required
            />

            <VaCounter
              v-model="form.quantity"
              label="Quantity"
              manual-input
              :min="1"
              :max="100"
              :rules="[(v) => v || 'Quantity is required']"
            />
            <!-- </div> -->
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
              <VaListLabel v-if="speciesObjects.length > 0" class="text-md mb-2 text-left"
                >Selected Species</VaListLabel
              >
              <VaListLabel v-else color="secondary" class="va-text-code mb-2 text-left"
                >No Species Selected</VaListLabel
              >

              <VaListItem v-for="(s, index) in speciesObjects" :key="index" class="list__item">
                <VaListItemSection>
                  <VaListItemLabel>
                    Name: {{ s.name }}
                    <VaIcon name="delete" size="small" color="primary" @click="deleteFromStorage(index)" />
                  </VaListItemLabel>
                  <VaListItemLabel caption>Quantity: {{ s.quantity }}</VaListItemLabel>
                </VaListItemSection>
              </VaListItem>
            </VaList>
          </div>
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

      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
          <!-- <SalesAllInfos /> -->
        </div>
      </div>
      <!-- </template> -->
      <!-- </VaStepper> -->
    </VaCardContent>
  </VaCard>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { VaForm, VaInput, VaSelect, VaButton } from 'vuestic-ui'
import handleErrors from '../../../utils/handleClientRegFormError'
import { validators } from '../../../services/utils'

import Salesinquirieslist from './components/Salesinquirieslist.vue'
import { useForm, useToast } from 'vuestic-ui'
import { mapActions } from 'pinia'
import { useQuotaStore } from '../../../stores/quota-store'
import { useSalesInquiriesStore } from '../../../stores/sales-store'

export default defineComponent({
  components: {
    Salesinquirieslist,
    VaForm,
    VaInput,
    VaSelect,
    VaButton,
  },
  setup() {
    const formRef = ref()
    const contactFormRef = ref()
    const showAddSalesInquiriesForm = ref(false)
    const btnIcon = ref('add')

    const {
      isValid: isValidForm,
      validate: validateForm,
      resetValidation: resetValidationForm,
      reset: resetForm,
    } = useForm(formRef)

    const {
      isValid: isValidContactForm,
      validate: validateContactForm,
      resetValidation: resetValidationContactForm,
      reset: resetContactForm,
    } = useForm(contactFormRef)

    const { init } = useToast()
    const showEditForm = ref(false)

    const form = reactive({
      id: null as any,
      full_name: '',
      nick_name: '',
      country: null as any,
      nationality: null as any,
      category: null,
      email: '',
      phone: '',
      address: '',
      no_of_hunters: 0,
      no_of_observers: 0,
      no_of_days: 0,
      no_of_companions: 0,
      species: null as any,
      quantity: 0,
      area: null as any,
    })

    const contactForm = reactive({
      id: null as any,
      client_id: null as any,
      contact: '',
      contact_type: null as any,
      contactable: false,
    })

    const toggleAddSalesInquiriesForm = () => {
      showAddSalesInquiriesForm.value = !showAddSalesInquiriesForm.value
      btnIcon.value = showAddSalesInquiriesForm.value ? 'list_alt' : 'add'
    }

    const countries = ref([]) as any
    const nationality = ref([]) as any
    const categoryOptions = ref([]) as any
    const contactsTypes = ref([]) as any
    const clients = ref([]) as any
    const step = ref(0) as any
    // const salesInquiryItems = ref([]) as any

    const getCountries = async () => {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_COUNTRIES_URL,
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const response = await axios.request(config)
      if (response.status === 200) {
        countries.value.push(
          ...response.data.map((country: { id: any; name: any }) => ({ value: country.id, text: country.name })),
        )
      }
    }

    const deleteSalesInquireItem = async (id: string) => {
      const result = await confirm('Are you sure you want to delete this item?')
      const config = {
        method: 'delete',
        maxBodyLength: Infinity,
        url: import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SALES_INQUIRIES_URL + '?entity_id=' + id,
        headers: {
          'Content-Type': 'application/json',
        },
      }
      if (result) {
        const response = await axios.request(config)
        if (response.status === 200) {
          init({ message: response.data.message, color: 'warning' })
          showEditForm.value = false
          form.id = null
          form.full_name = ''
          form.nick_name = ''
          form.nationality = ''
          form.category = null
          form.country = null
        }
        getSalesInquiries()
        resetValidation()
      }
    }

    const getCategories = async () => {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_ENTITY_CATEGORIES_VSET_URL,
      }

      const response = await axios.request(config)
      if (response.status === 200) {
        categoryOptions.value.push(
          ...response.data.map((category: { id: any; name: any }) => ({ value: category.id, text: category.name })),
        )
      }
    }

    const getNationalities = async () => {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_NATIONALITIES_URL,
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const response = await axios.request(config)
      if (response.status === 200) {
        nationality.value.push(
          ...response.data.map((nationality: { id: any; name: any }) => ({
            value: nationality.id,
            text: nationality.name,
          })),
        )
      }
    }

    const getContactTypes = async () => {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_CONTACT_TYPES_URL,
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const response = await axios.request(config)
      if (response.status === 200) {
        contactsTypes.value.push(
          ...response.data.map((contactType: { id: any; name: any }) => ({
            value: contactType.id,
            text: contactType.name,
          })),
        )
      }
    }

    const contactFieldType = computed(() => {
      let contact_field_type = ''
      const contactType = contactForm.contact_type?.value

      if (contactType === 'email') {
        contact_field_type = 'email'
      } else if (contactType === 'phone_number') {
        contact_field_type = 'phone'
      } else {
        contact_field_type = ''
      }

      return contact_field_type
    })

    onMounted(() => {
      getCountries()
      getCategories()
      getNationalities()
      getContactTypes()
      // getClients()
    })

    return {
      formRef,
      contactFormRef,
      showAddSalesInquiriesForm,
      btnIcon,
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
      toggleAddSalesInquiriesForm,
      isValidForm,
      validateForm,
      resetValidationForm,
      resetForm,
      isValidContactForm,
      validateContactForm,
      resetValidationContactForm,
      resetContactForm,

      validators,
      getCountries,
      deleteSalesInquireItem,
      getCategories,
      getNationalities,
      getContactTypes,
      contactFieldType,
    }
  },
  data() {
    return {
      preferred_species: [] as any,
      speciesOptions: [] as any,
      speciesObjects: [] as any,
      areasOptions: [] as any,
    }
  },
  mounted() {
    this.getSpeciesItems()
    this.getAreas()
  },
  methods: {
    ...mapActions(useQuotaStore, ['getSpeciesList']),
    ...mapActions(useQuotaStore, ['getAreaList']),
    // addNewSpeciesItemToStorage() {},
    // CreateSalesInquiry

    ...mapActions(useSalesInquiriesStore, ['createSalesInquiry']),

    async submit() {
      if (this.speciesObjects.length === 0) {
        this.init({
          message: 'Please select at least one species.',
          color: 'warning',
        })
        return
      }

      const contacts = [
        {
          contact_type: 'email',
          contact: this.form.email,
        },
        {
          contact_type: 'phone',
          contact: this.form.phone,
        },
        {
          contact_type: 'address',
          contact: this.form.address,
        },
      ]

      const requestdata = {
        fullName: this.form.full_name,
        contacts: contacts,
        nationality: this.form.nationality.value,
        country: this.form.country.value,
        noOfHunters: this.form.no_of_hunters,
        noOfDays: this.form.no_of_days,
        noOfCompanions: this.form.no_of_companions,
        noOfObservers: this.form.no_of_observers,
        species: this.speciesObjects,
        areaId: this.form.area.value,
      }
      try {
        const response: any = await this.createSalesInquiry(requestdata)

        if (response.status === 201) {
          this.init({ message: response.data.message, color: 'success' })
        }
      } catch (error: any) {
        const errors = handleErrors(error.response)
        console.log(errors)
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

    addNewSpeciesItemToStorage() {
      // Check if all required fields in this.sform are not null
      if (!this.form.species || !this.form.quantity) {
        this.init({
          message: 'Please fill all required fields.',
          color: 'warning',
        })
        return // Exit the method if any field is null
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
          species_id: this.form.species.value,
          name: this.form.species.text,
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
  },
})
</script>
s
