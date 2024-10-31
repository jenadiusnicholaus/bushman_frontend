<template>
  <VaCard class="w-full">
    <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between px-4 py-2">
      <div class="flex flex-col md:flex-row gap-2 justify-start">
        <VaButton
          v-if="showAddSalesInquiriesForm || showDetailsPage"
          class="px-2 py-2"
          icon="arrow_back"
          size="small"
          @click="gotBack()"
        >
          Go Back
        </VaButton>
      </div>
      <VaButtonGroup v-if="!showAddSalesInquiriesForm && !showDetailsPage">
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
          >Add sales Inquiry</VaButton
        >
      </VaButtonGroup>
    </div>

    <VaCardContent>
      <template v-if="showDetailsPage">
        <!-- <SalesConfirmationClientDetails :item="selectedInquiryItem"> </SalesConfirmationClientDetails> -->
        <!--  -->
        <SalesInquiryDetails :item="selectedInquiryItem" />
      </template>
      <template v-else>
        <Salesinquirieslist
          v-if="!showAddSalesInquiriesForm"
          @downloadBtnPressed="downloadInquiries"
          @viewBtnPressed="viewInquiries"
        >
        </Salesinquirieslist>
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
                :rules="[(value: any) => (value && value.length > 0) || 'Full name is required']"
                label="Full name"
              />
              <!-- <VaInput v-model="form.nick_name" placeholder="Nick name" label="Nick name" /> -->
              <VaSelect
                v-model="form.country"
                placeholder="Select Country"
                label="Country"
                :rules="[(v: any) => v || 'Country is required']"
                :options="countries"
                searchable
                highlight-matched-text
              />
              <VaSelect
                v-model="form.nationality"
                placeholder="Select Client nationality"
                label="Client Nationality"
                :rules="[(v: any) => v || 'Nationality is required']"
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
                :max-length="30"
                placeholder="Enter your address"
                :rules="[(value: any) => (value && value.length > 0) || 'Address is required']"
                label="Address"
              />
            </div>

            <h3 class="font-bold text-lg mb-2">Participants and hunting days</h3>
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <!-- <VaInput
                v-model="form.no_of_hunters"
                label="Number of Hunters"
                placeholder="Enter Number of Hunters"
                default-value="1"
                type="number"
                required
              /> -->
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
                :rules="[(v: any) => v || 'This field is required']"
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
                :rules="[(v: any) => v || 'Hunting area is required']"
                :options="areasOptions"
                searchable
                highlight-matched-text
                @update:modelValue="getAllSpieces"
              />
            </div>
            <h3 class="font-bold text-lg mb-2">Season and Tentative Date</h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <VaSelect
                v-model="form.season"
                placeholder="Select Season"
                label="Season"
                :rules="[(v: any) => v || 'Season is required']"
                :options="seasonsOptions"
                searchable
                highlight-matched-text
              />
              <!-- <VaInput
              v-model="form.preferred_date"
              type="date"
              placeholder="Select Preferred Date"
              :rules="[(v: any) => v || 'Preferred Date is required']"
              label="Preferred Date"
            /> -->
              <VaDateInput
                v-model="form.preferred_date"
                label="Preferred Date"
                placeholder="Select Preferred Date"
                :rules="[(v: any) => v || 'Preferred Date is required']"
                required
              />
            </div>

            <h3 class="font-bold text-lg mb-2">Preferred Species</h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <VaSelect
                v-model="form.species"
                label="Species"
                :options="speciesOptions"
                placeholder="Select Species"
                :rules="[(v: any) => !!v || 'Species is required']"
                required
              />

              <VaCounter
                v-model="form.quantity"
                label="Quantity"
                manual-input
                :min="1"
                :max="100"
                :rules="[(v: any) => v || 'Quantity is required']"
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
              v-if="!showDetailsPage"
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
      </template>
    </VaCardContent>
  </VaCard>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { VaForm, VaInput, VaSelect, VaButton } from 'vuestic-ui'
import handleErrors from '../../../utils/errorHandler'
import { validators } from '../../../services/utils'
// import SalesConfirmationClientDetails from './components/SalesConfirmationClientDetails.vue'

import Salesinquirieslist from './components/Salesinquirieslist.vue'
import { useForm, useToast } from 'vuestic-ui'
import { mapActions, mapState } from 'pinia'
import { useQuotaStore } from '../../../stores/quota-store'
import { useSalesInquiriesStore } from '../../../stores/sales-store'
import { useSettingsStore } from '../../../stores/settings-store'
import SalesInquiryDetails from './components/SalesInquiryDetails.vue'
import pdfMake from 'pdfmake/build/pdfmake'
import * as pdfFonts from 'pdfmake/build/vfs_fonts'

pdfMake.vfs = pdfFonts?.pdfMake?.vfs
// pdfMake.vfs = pdfFonts.pdfMake.vfs
export default defineComponent({
  components: {
    Salesinquirieslist,
    VaForm,
    VaInput,
    VaSelect,
    VaButton,
    SalesInquiryDetails,
    // SalesConfirmationClientDetails,
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
    const showDetailsPage = ref(false)

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
      no_of_hunters: 1,
      no_of_observers: 0,
      no_of_days: 0,
      no_of_companions: 0,
      species: null as any,
      quantity: 0,
      area: null as any,
      season: null as any,
      preferred_date: null as any,
    })

    const contactForm = reactive({
      id: null as any,
      client_id: null as any,
      contact: '',
      contact_type: null as any,
      contactable: false,
    })

    const toggleAddSalesInquiriesForm = () => {
      showAddSalesInquiriesForm.value = true
    }
    const gotBack = () => {
      showAddSalesInquiriesForm.value = false
      showDetailsPage.value = false
      // btnIcon.value = showAddSalesInquiriesForm.value ? 'list_alt' : 'add'
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
      showDetailsPage,
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
      // deleteSalesInquireItem,
      getCategories,
      getNationalities,
      getContactTypes,
      contactFieldType,
      gotBack,
    }
  },
  data() {
    return {
      preferred_species: [] as any,
      speciesOptions: [] as any,
      speciesObjects: [] as any,
      areasOptions: [] as any,
      seasonsOptions: [] as any,
      selectedInquiryItem: null as any,
    }
  },
  computed: {
    ...mapState(useSettingsStore, ['logo']),
  },

  mounted() {
    // this.getSpeciesItems()
    this.getAreas()
    this.getSeasonList()
  },
  methods: {
    ...mapActions(useQuotaStore, ['getSpeciesList']),
    ...mapActions(useQuotaStore, ['getAreaList']),
    ...mapActions(useQuotaStore, ['getAllSpeciesPerQuotaPerArea']),
    ...mapActions(useSalesInquiriesStore, ['createSalesInquiry']),
    ...mapActions(useSettingsStore, ['getSeasons']),

    async submit() {
      if (this.speciesObjects.length === 0) {
        this.init({
          message: 'Please select at least one species.',
          color: 'warning',
        })
        return
      }

      if (this.form.no_of_hunters <= 0) {
        this.init({
          message: 'Number of hunters must be greater than zero.',
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
        season: this.form.season,
        preferredDate: this.form.preferred_date,
      }
      try {
        const response: any = await this.createSalesInquiry(requestdata)

        if (response.status === 201) {
          this.init({ message: response.data.message, color: 'success' })
          this.resetForm()
          this.resetValidationContactForm()
          this.speciesObjects = []
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

    viewInquiries(i: any) {
      this.showDetailsPage = true
      this.selectedInquiryItem = i.selfitem
    },

    downloadInquiries(i: any) {
      console.log(i.selfitem)
      const item = i.selfitem
      const logo = useSettingsStore().logo // Assuming the logo is a base64 image.

      const formatDate = (dateString: string | undefined) =>
        dateString ? new Date(dateString).toLocaleDateString() : 'Not provided'

      const safeArray = (arr: any[] | null | undefined) => arr || []

      const safeString = (str: string | null | undefined, fallback: string = 'Not provided') => str || fallback

      // Header styles
      const headerStyle = {
        fontSize: 20,
        bold: true,
        color: '#FFFFFF', // Text color (white) for better contrast against brown
        fillColor: '#8B4513', // Brown color
        margin: [0, 10, 0, 10],
        alignment: 'center',
      }

      const documentDefinition: any = {
        content: [
          {
            image: logo,
            width: 200, // Increased width of the logo for a larger size
            alignment: 'center',
            margin: [0, 20, 0, 20],
          },
          {
            text: 'Sales Inquiry Details',
            style: headerStyle,
          },
          {
            text: `Inquiry Code: ${safeString(item.code)}`,
            style: 'subheader',
            margin: [0, 0, 0, 10],
          },
          {
            text: `Created on: ${formatDate(item.create_date)}`,
            style: 'subheader',
            margin: [0, 0, 0, 20],
          },
          {
            text: 'Customer Information',
            style: 'sectionHeader',
            decoration: 'underline',
            margin: [0, 20],
          },
          {
            text: `Full Name: ${safeString(item.entity?.full_name)}`,
            margin: [0, 5],
          },
          {
            text: `Nationality: ${safeString(item.entity?.nationality?.name)}`,
            margin: [0, 5],
          },
          {
            text: `Country: ${safeString(item.entity?.country?.name)}`,
            margin: [0, 5],
          },
          {
            text: 'Contacts:',
            margin: [0, 10],
            bold: true,
            decoration: 'underline',
          },
          ...safeArray(item.entity?.contacts).map((contact: any) => ({
            text: `• ${contact.contact}`,
            margin: [0, 3],
            color: '#555555',
          })),
          {
            text: 'Preference Information',
            style: 'sectionHeader',
            decoration: 'underline',
            margin: [0, 20],
          },
          {
            text: `Preferred Date: ${formatDate(item.preference?.preferred_date)}`,
            margin: [0, 5],
          },
          {
            text: `Number of Hunters: ${safeString(item.preference?.no_of_hunters?.toString())}`,
            margin: [0, 5],
          },
          {
            text: `Number of Companions: ${safeString(item.preference?.no_of_companions?.toString())}`,
            margin: [0, 5],
          },
          {
            text: `Number of Days: ${safeString(item.preference?.no_of_days?.toString())}`,
            margin: [0, 5],
          },
          {
            text: 'Preferred Species',
            style: 'sectionHeader',
            decoration: 'underline',
            margin: [0, 20],
          },
          ...(safeArray(item.preferred_species).length > 0
            ? safeArray(item.preferred_species).map((species: any) => ({
                text: `• ${safeString(species.species?.name)} (Quantity: ${safeString(species.quantity?.toString())})`,
                margin: [0, 3],
              }))
            : [{ text: 'No preferred species listed.', margin: [0, 3] }]),
          {
            text: 'Area Information',
            style: 'sectionHeader',
            decoration: 'underline',
            margin: [0, 20],
          },
          ...(safeArray(item.area).length > 0
            ? safeArray(item.area).map((area: any) => ({
                text: `Area ID: ${safeString(area.id.toString())}, Area: ${safeString(area.area?.name || 'Unnamed')}`,
                margin: [0, 3],
              }))
            : [{ text: 'No area information available.', margin: [0, 3] }]),
          {
            text: 'Remarks',
            style: 'sectionHeader',
            decoration: 'underline',
            margin: [0, 20],
          },
          {
            text: safeString(item.remarks, 'No remarks provided.'),
            margin: [0, 5, 0, 20],
            italics: true,
          },
        ],
        styles: {
          header: {
            fontSize: 20,
            bold: true,
            color: '#333333',
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 5],
            color: '#444444',
          },
          sectionHeader: {
            fontSize: 14,
            bold: true,
            margin: [0, 15, 0, 5],
            color: '#333333',
            decoration: 'underline',
          },
        },
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 50],
        footer: (currentPage: any, pageCount: any) => ({
          columns: [
            {
              text: `Created at: ${formatDate(item.create_date)}`,
              alignment: 'left',
              margin: [20, 10],
              italics: true,
            },
            {
              text: `Page ${currentPage} of ${pageCount}`,
              alignment: 'right',
              margin: [20, 10],
              italics: true,
              color: '#777777',
            },
          ],
        }),
      }

      // Trigger PDF download
      pdfMake.createPdf(documentDefinition).download('sales_inquiry.pdf')
    },
    async getAllSpieces() {
      try {
        // if (this.form.sales_quota_id?.value || this.form?.area?.value) {
        const response = await this.getAllSpeciesPerQuotaPerArea(null, this.form.area?.value ?? null, null)
        this.speciesOptions = response.data.map((item: any) => {
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
    async getSeasonList() {
      try {
        const response = await this.getSeasons()
        this.seasonsOptions = response.data.map((item: { id: any; name: any }) => {
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
