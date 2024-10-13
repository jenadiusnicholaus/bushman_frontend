<template>
  <VaCard class="w-full">
    <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
      <div class="flex flex-col md:flex-row gap-2 justify-start">
        <VaCardTitle>Sales Inquiry</VaCardTitle>
      </div>
      <VaButton
        border-color="primary"
        preset="secondary"
        :icon="btnIcon"
        class="mr-6 my-3"
        @click="toggleAddSalesInquiriesForm()"
      ></VaButton>
    </div>

    <VaCardContent>
      <Salesinquirieslist v-if="!showAddSalesInquiriesForm"> </Salesinquirieslist>
      <VaStepper v-else v-model="step" :steps="steps" horizontal controls-hidden>
        <template #step-content-0>
          <VaForm ref="formRef">
            <div class="p-6">
              <!-- Responsive grid layout for mobile and larger screens -->
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <!-- First Name -->
                <VaInput
                  v-model="form.full_name"
                  type="text"
                  placeholder="Enter your Full name"
                  :rules="[(value) => (value && value.length > 0) || 'Full name is required']"
                  label="Full name"
                />

                <!-- must an email format -->
                <!-- <VaInput
                      v-model="form.email"
                      type="email"
                      :rules="[(value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Email is invalid']"
                      placeholder="Enter your email"
                      label="Email"
                    /> -->
                <!-- Phone Number -->
                <VaInput v-model="form.nick_name" placeholder="Nick name" label="Nick name" />
                <!-- 
                    <VaInput
                      v-model="form.address"
                      type="text"
                      placeholder="Enter your address"
                      :rules="[(value) => (value && value.length > 0) || 'Address is required']"
                      label="Address"
                    /> -->

                <VaSelect
                  v-model="form.country"
                  placeholder="Select Counrty"
                  label="Country"
                  :options="countries"
                  searchable
                  highlight-matched-text
                />

                <!-- City -->
                <VaSelect
                  v-model="form.nationality"
                  placeholder="Select Client nationality"
                  label="Client Nationality"
                  :options="nationality"
                  searchable
                  highlight-matched-text
                />

                <!-- form.category -->
                <VaSelect
                  v-model="form.category"
                  placeholder="Select Client Category"
                  label="Client Category"
                  :options="categoryOptions"
                  searchable
                  highlight-matched-text
                />

                <!-- Category -->
              </div>
            </div>

            <div class="mt-4 d-flex">
              <VaButton
                v-if="!showEditForm"
                icon="save"
                class="mr-3 mb-2"
                :disabled="!isValidForm"
                @click="validateForm() && add()"
              >
                Save
              </VaButton>

              <VaButton
                v-if="showEditForm"
                class="mr-3 mb-2"
                icon="save"
                :disabled="!isValidForm"
                color="warning"
                @click="validateForm() && edit(form.id)"
              >
                save
              </VaButton>
              <!-- @click="deleteClient()" -->
              <VaButton
                v-if="showEditForm"
                class="ml-auto ml-5"
                icon="delete"
                :disabled="!isValidForm"
                color="danger"
                @click="deleteSalesInquireItem(form.id)"
              >
                delete
              </VaButton>
            </div>
          </VaForm>
          <!-- <Spliter></Spliter> -->
        </template>
        <template #step-content-1>
          <VaForm ref="contactFormRef">
            <div class="p-6">
              <!-- Responsive grid layout for mobile and larger screens -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <!-- First Name -->

                <VaSelect
                  v-model="contactForm.client_id"
                  placeholder="Select client"
                  label="Client"
                  :options="clients"
                  searchable
                  highlight-matched-text
                />

                <VaSelect
                  v-model="contactForm.contact_type"
                  placeholder="Select contact type"
                  label="Contact Type"
                  :options="contactsTypes"
                  searchable
                  highlight-matched-text
                />

                <!-- City -->
                <VaInput
                  v-model="contactForm.contact"
                  :type="contactFieldType"
                  placeholder="Contact"
                  :rules="[(value) => (value && value.length > 0) || 'Full name is required']"
                  label="Caontact"
                />

                <VaCheckbox
                  v-model="contactForm.contactable"
                  :rules="[(v) => v || 'This field is required']"
                  label="Can we Contact you throught this contact"
                />

                <!-- Category -->
              </div>
            </div>

            <div class="mt-4 d-flex">
              <VaButton
                icon="save"
                class="mr-3 mb-2"
                :disabled="!isValidContactForm"
                @click="validateContactForm() && createClientContact('post')"
              >
                Save
              </VaButton>

              <VaButton
                v-if="showEditForm"
                class="mr-3 mb-2"
                icon="save"
                :disabled="!isValidContactForm"
                color="warning"
                @click="validateContactForm() && edit(form.id)"
              >
                save
              </VaButton>
              <!-- @click="deleteClient()" -->
              <VaButton
                v-if="showEditForm"
                class="ml-auto ml-5"
                icon="delete"
                :disabled="!isValidContactForm"
                color="danger"
                @click="deleteSalesInquireItem(form.id)"
              >
                delete
              </VaButton>
            </div>
          </VaForm>
          <!-- <Spliter></Spliter> -->
        </template>
        <template #step-content-2>
          <ClientPrefs :client-choice="clients"> </ClientPrefs>
        </template>
        <!-- <template #step-content-3> </template> -->
        <template #step-content-3>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
              <SalesAllInfos> </SalesAllInfos>
            </div>
          </div>

          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
              <SalesAllInfos> </SalesAllInfos>
            </div>
          </div>

          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
              <SalesAllInfos> </SalesAllInfos>
            </div>
          </div>
        </template>
      </VaStepper>
    </VaCardContent>
  </VaCard>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
// import { useForm } from 'vuestic-ui'
import axios from 'axios'
// import { useToast } from 'vuestic-ui'
import { VaForm, VaInput, VaSelect, VaButton } from 'vuestic-ui'
import { onMounted, computed } from 'vue'
import handleErrors from '../../../utils/handleClientRegFormError'
import { useForm, useToast, defineVaStepperSteps } from 'vuestic-ui'
import SalesAllInfos from './components/SalesAllInfos.vue'
import ClientPrefs from './components/ClientPrefs.vue'
import Salesinquirieslist from './components/Salesinquirieslist.vue'

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
import { useModal } from 'vuestic-ui'

// const photo: any[] = []
// const IsAddButton = false
const showEditForm = ref(false)

const form = reactive({
  id: null,
  full_name: '',
  nick_name: '',
  country: null as any,
  nationality: null as any,
  category: null as any,
})

const contactForm = reactive({
  id: null,
  client_id: null as any,
  contact: '',
  contact_type: null as any,
  contactable: false,
})

const toggleAddSalesInquiriesForm = () => {
  showAddSalesInquiriesForm.value = !showAddSalesInquiriesForm.value
  if (showAddSalesInquiriesForm.value) {
    btnIcon.value = 'list_alt'
  } else {
    btnIcon.value = 'add'
  }
}

const { confirm } = useModal()

const countries: any[] = []
const nationality: any[] = []
// const showModal = ref(false)
const categoryOptions: any[] = []
const contactsTypes: any[] = []
const clients: any[] = []

const items = ref([])

const step = ref(0)

const steps = defineVaStepperSteps([
  {
    label: 'Basic infos',
    beforeLeave: (fromStep, toStep) => {
      if (fromStep !== toStep) {
        sessionStorage.getItem('client_id')
        getClients()
      }
    },
  },
  { label: 'Contacts' },
  { label: 'Preferences' },
  { label: 'Preview' },
])

const createClientContact = async (method: string = 'post') => {
  const data = JSON.stringify({
    entity_id: contactForm.client_id.value,
    contact: contactForm.contact,
    contact_type: contactForm.contact_type.value,
    contactable: contactForm.contactable,
  })
  const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SALES_CLIENT_CONTACT_URL

  const config = {
    method: method,
    maxBodyLength: Infinity,
    url: url,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  }
  try {
    const response = await axios.request(config)
    if (response.status === 200 || response.status === 201) {
      init({ message: response.data.message, color: 'success' })
      //  reset
      resetContactForm()
      resetValidationContactForm()
      //  redirect to client dashboard
      //  save the saved client id session storage
      // sessionStorage.setItem('client_id', response.data.entity.id)
    } else {
      init({ message: 'Something went wrong', color: 'danger' })
    }
  } catch (error: any) {
    if (error.response) {
      const errors: any = handleErrors(error)
      init({
        message: '\n' + errors.map((error: any, index: any) => `${index + 1}. ${error}`).join('\n'),
        color: 'danger',
      })
    } else {
      console.log(error)
      init({ message: 'Something went wrong', color: 'danger' })
    }
  }
}

const submit = async (method: string = 'post', id: any | null = null) => {
  const data = JSON.stringify({
    full_name: form.full_name,
    nick_name: form.nick_name,
    country: form.country.value,
    nationality: form.nationality.value,
    category: form.category.value,
  })

  let url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SALES_CLIENT_BASIC_INFO_URL
  if (method === 'patch' && id != null) {
    url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SALES_CLIENT_BASIC_INFO_URL + '?entity_id=' + id
  }

  const config = {
    method: method,
    maxBodyLength: Infinity,
    url: url,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  }
  try {
    const response = await axios.request(config)
    if (response.status === 200 || response.status === 201) {
      init({ message: response.data.message, color: 'success' })
      //  save the saved client id session storage
      sessionStorage.setItem('client_id', response.data.entity.id)
      //  redirect to client dashboard
      resetForm()
      resetValidationForm()
      contactForm.client_id = {
        value: response.data.entity.id,
        text: response.data.entity.full_name,
      }
      showEditForm.value = false

      // if (method === 'patch') {
      //   getSalesInquiries(id)
      // } else {
      //   getSalesInquiries()
      // }
    } else {
      init({ message: 'Something went wrong', color: 'danger' })
    }
  } catch (error: any) {
    if (error.response) {
      const errors: any = handleErrors(error)
      init({
        message: '\n' + errors.map((error: any, index: any) => `${index + 1}. ${error}`).join('\n'),
        color: 'danger',
      })
    } else {
      console.log(error)
      init({ message: 'Something went wrong', color: 'danger' })
    }
  }
}

const edit = (id: any) => {
  submit('patch', id)
}
const add = () => {
  submit('post')
}

const getSalesInquiries = async (id: any | null = null) => {
  let url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SALES_INQUIRIES_URL
  if (id != null) {
    url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SALES_INQUIRIES_URL + '?entity_id=' + id
  }
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: url,
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const response = await axios.request(config)
  if (response.status === 200) {
    const data = response.data
    if (id != null) {
      showEditForm.value = true
      feedForm(data)
    } else {
      updateItems(data)
    }
  }
}

const feedForm = async (data: any) => {
  form.id = data?.id
  form.full_name = data.full_name
  form.nick_name = data?.nicl_name
  form.nationality = data?.nationality
  form.category = {
    text: data?.category?.category?.name,
    value: data?.category?.category?.id,
  }
  form.country = { value: data?.country?.code, text: data?.country?.name }
}
const updateItems = (data: any) => {
  items.value = data.map((item: any) => ({
    id: item.id,
    name: item?.full_name,
    email: item?.email,
    country: item?.country?.name,
    phone_number: item?.phone_number,
    category: item?.category.category,
    nationality: item?.nationality.name,
    actions: 'Actions',
  }))
}

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
    countries.push(...response.data.map((country: any) => ({ value: country.id, text: country.name })))
  }
}

const deleteSalesInquireItem = async (id: any) => {
  const result = await confirm('Are you sure you want to delete your account?')
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
    categoryOptions.push(...response.data.map((category: any) => ({ value: category.id, text: category.name })))
  }
}

const getNationalities = async () => {
  // VITE_APP_NATIONALITIES_URL

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
    nationality.push(...response.data.map((nationality: any) => ({ value: nationality.id, text: nationality.name })))
  }
}

const getContactTypes = async () => {
  // VITE_APP_CONTACT_TYPES_URL
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
    contactsTypes.push(...response.data.map((contactType: any) => ({ value: contactType.id, text: contactType.name })))
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

// const getSalesInquiriesList = async () => {
//   //
// }

const getClients = async () => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_CLIENTS_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const response = await axios.request(config)
  if (response.status === 200) {
    clients.push(...response.data.map((client: any) => ({ value: client.id, text: client.full_name })))
    const client_id = sessionStorage.getItem('client_id')

    contactForm.client_id = client_id

    console.log(client_id)

    if (client_id != null) {
      const client = clients.find((cl: any) => {
        return cl.value == client_id
      })

      // Todo
      console.log(client)
      if (client != null) {
        console.log(client)
        contactForm.client_id = {
          text: client.full_name,
          value: client.id,
        }
      }
    }
  }

  // get payment methods
}

onMounted(() => {
  getCountries()
  getCategories()
  getNationalities()
  getContactTypes()
  getClients()
})
</script>
