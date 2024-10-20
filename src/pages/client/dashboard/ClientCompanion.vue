<template>
  <VaForm ref="formRef">
    <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
      <div class="flex flex-col md:flex-row gap-2 justify-start">
        <!-- <VaInput v-model="filters.search" placeholder="Search">
          <template #prependInner>
            <VaIcon name="search" color="secondary" size="small" />
          </template>
        </VaInput> -->
      </div>
      <VaButton border-color="primary" icon="list_alt" class="mr-6 my-1" @click="showModalMethod()"></VaButton>
    </div>
    <!-- Responsive grid layout for mobile and larger screens -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <!-- First Name -->
      <VaInput
        v-model="form.firstName"
        placeholder="Enter your first name"
        :rules="[(value) => (value && value.length > 0) || 'First name is required']"
        label="First Name"
      />

      <!-- Last Name -->
      <VaInput
        v-model="form.lastName"
        placeholder="Enter your last name"
        :rules="[(value) => (value && value.length > 0) || 'Last name is required']"
        label="Last Name"
      />
      <!-- email -->
      <VaInput
        v-model="form.email"
        placeholder="Enter your email"
        :rules="[(value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Email is invalid']"
        label="Email"
      />

      <VaDateInput
        v-model="form.birthDate"
        label="Birth Date"
        :rules="[(v: any) => validateBirthday(v)]"
        manual-input
        placeholder="Select a date"
      />
      <!-- Gender -->
      <VaSelect
        v-model="form.gender"
        placeholder="Select Gender"
        :options="genders"
        :rules="[(v) => v || 'Gender is required']"
        label="Gender"
      />

      <!-- Address -->
      <VaInput
        v-model="form.address"
        :rules="[(value) => value.length > 0 || 'Address is required']"
        label="Address"
        placeholder="Enter your address"
      />

      <VaInput
        v-model="form.phone"
        placeholder="Enter your phone number, e.g. +1 123 456 7890"
        :rules="[(value) => /^\+\d{10,}$/.test(value) || 'Phone number must start with + and have at least 10 digits']"
        label="Phone"
      />

      <VaSelect
        v-model="form.country"
        placeholder="Select Counrty"
        label="Country"
        :options="countries"
        searchable
        highlight-matched-text
      />

      <!-- City -->
      <VaInput
        v-model="form.city"
        placeholder="Enter your city"
        :rules="[(value) => value.length > 0 || 'City is required']"
        label="City"
      />

      <!-- State -->
      <VaInput
        v-model="form.state"
        placeholder="Enter your state"
        :rules="[(value) => value.length > 0 || 'State is required']"
        label="State"
      />

      <!-- Passport Number -->
      <VaInput
        v-model="form.passportNumber"
        placeholder="Enter your passport number"
        :rules="[(value) => value.length > 0 || 'Passport number is required']"
        label="Passport Number"
      />

      <VaFileUpload
        v-model="form.photo"
        upload-button-text="Upload your photo"
        color="secondary"
        required
        label="Upload Photo"
        undo
        size="10mb"
        type="gallery"
        file-types="image/jpeg, image/png"
        undo-duration="500"
        :rules="[(v: any) => v.length > 0 || 'Photo is required']"
        :max-files="1"
      />
    </div>

    <!-- Submit Button -->
    <div class="mt-4">
      <div class="mt-4 d-flex">
        <VaButton v-if="!showEditForm" icon="save" class="mr-3 mb-2" :disabled="!isValid" @click="validate() && add()">
          Save
        </VaButton>

        <VaButton
          v-if="showEditForm"
          class="mr-3 mb-2"
          icon="save"
          :disabled="!isValid"
          color="warning"
          @click="validate() && edit(form.id)"
        >
          save
        </VaButton>

        <VaButton
          v-if="showEditForm"
          class="ml-auto ml-5"
          icon="delete"
          :disabled="!isValid"
          color="danger"
          @click="deleteObs(form.id)"
        >
          delete
        </VaButton>
      </div>
    </div>
  </VaForm>

  <VaModal v-model="showModal" :overlay="false" size="large">
    <VaCardContent>
      <VaDataTable :items="items" selectable :columns="columns" sortable>
        <template #cell(actions)="{ row, isExpanded }">
          <VaButton
            :icon="isExpanded ? 'va-arrow-up' : 'va-arrow-down'"
            preset="secondary"
            class="w-full"
            @click="row.toggleRowDetails()"
          >
            {{ isExpanded ? 'Hide' : 'More info' }}
          </VaButton>
        </template>

        <template #expandableRow="{ rowData }">
          <div class="flex gap-2">
            <VaAvatar :src="rowData.photo" />
            <div class="pl-2">
              <div class="flex gap-1">
                <span>{{ rowData.name }}</span>
                <span class="va-link">{{ rowData.country }}</span>
              </div>
              <div class="flex items-center">
                <VaIcon size="small" name="phone" color="secondary" class="mr-2" />
                <span>{{ rowData.phone }}</span>
              </div>
              <div class="flex items-center">
                <VaIcon size="small" name="email" color="secondary" class="mr-0" />
                <span>{{ rowData.email }}</span>
              </div>
              <div class="flex items-center">
                <VaIcon size="small" name="passport" color="secondary" class="mr-2" />
                <span>{{ rowData.passport_number }}</span>
              </div>
              <!-- edit button here -->
              <div class="flex items-center">
                <VaButton
                  class="mr-2"
                  icon="edit"
                  color="warning"
                  icon-color="#812E9E"
                  @click="showEditFormMethod(rowData.id)"
                />
                <!-- delete button here -->
                <VaButton icon="delete" color="danger" icon-color="#FFFFFF" @click="deleteObs(rowData.id)" />
              </div>
            </div>
          </div>
        </template>
      </VaDataTable>
    </VaCardContent>
  </VaModal>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useForm } from 'vuestic-ui'
import axios from 'axios'
import { onMounted } from 'vue'
import handleErrors from '../../../utils/errorHandler'

import { useModal, useToast } from 'vuestic-ui'

const { confirm } = useModal()
const { isValid, validate, reset, resetValidation } = useForm('formRef')
const { init } = useToast()
const photo = reactive([] as any)
const showEditForm = ref(false)
const showModal = ref(false)
const items = ref([])

const add = () => {
  submit('post')
}

const edit = (id: any) => {
  console.log(id)
  submit('patch', id)
}

const showModalMethod = () => {
  getCompanions()
  showModal.value = !showModal.value
}

const showEditFormMethod = (id: any) => {
  getCompanionsInfo(id)
  showModal.value = !showModal.value
  showEditForm.value = !showEditForm.value
}

const deleteObs = async (id: any) => {
  const result = await confirm({
    message: 'Be careful! This action cannot be undone.',
    title: 'Are you sure?',
    okText: "I'm sure!",
    cancelText: 'Cancel',
  })

  if (result) {
    const url =
      import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_CLIENT_COMPANION_VSET_URL + '?companion_id=' + id
    const config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: url,
      headers: {
        'Content-Type': 'application/json',
      },
    }
    try {
      const response = await axios.request(config)
      if (response.status === 200) {
        init({ message: response.data.message, color: 'warning' })
        showEditForm.value = false
        showModal.value = false
        reset()
        resetValidation()
        photo.push('')
        getCompanions()
      }
    } catch (error) {
      console.log(error)
      reset()
      resetValidation()
      photo.push('')

      const errors: any = handleErrors(error)

      init({
        message: '\n' + errors.map((error: any, index: any) => `${index + 1}. ${error}`).join('\n'),
        color: 'danger',
      })
    }
  }
}

const form = reactive({
  id: null as any,
  email: '',
  firstName: '',
  lastName: '',
  gender: null as any,
  address: '',
  phone: '',
  country: null as any,
  city: '',
  state: '',
  photo: [] as any,
  passportNumber: '',
  birthDate: null as any,
  // createdAt: '2023-10-03T12:00:00Z', // Example pre-filled data
})

const countries: any[] = []

const genders = [
  { value: 'Female', text: 'Female' },
  { value: 'Male', text: 'Male' },
]

const validateBirthday = (value: Date | null) => {
  if (!value) {
    return 'Birth date is required'
  }

  const today = new Date()
  let yearDiff = today.getFullYear() - value.getFullYear()
  const monthDiff = today.getMonth() - value.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < value.getDate())) {
    yearDiff--
  }

  return yearDiff >= 18 || 'You must be at least 18 years old'
}

const submit = async (method: string = 'post', id: any = null) => {
  try {
    const data = new FormData()
    // format it to 1990-05-15
    data.append('date_of_birth', form.birthDate?.toISOString().split('T')[0])
    data.append('gender', form.gender.value)
    data.append('photo', form.photo[0]) // Assuming the file has been added to form.photo
    data.append('address', form.address)
    data.append('phone', form.phone)
    data.append('country', form.country?.value)
    data.append('city', form.city)
    data.append('state', form.state)
    data.append('first_name', form.firstName)
    data.append('last_name', form.lastName)
    data.append('email', form.email)
    data.append('passport_number', form.passportNumber)

    let url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_CLIENT_COMPANION_VSET_URL

    if (id !== null && method === 'patch') {
      url =
        import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_CLIENT_COMPANION_VSET_URL + '?companion_id=' + id
    }

    const config = {
      method: method,
      maxBodyLength: Infinity,
      url: url,
      headers: {
        'Content-Type': 'multipart/form-data',
      },

      data: data,
    }

    const response = await axios.request(config)
    if (response.status === 201 || response.status === 200) {
      init({ message: response.data.message, color: 'success' })
    }
  } catch (error) {
    const errors: any = handleErrors(error)
    init({
      message: '\n' + errors.map((error: any, index: any) => `${index + 1}. ${error}`).join('\n'),
      color: 'danger',
    })
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getCompanionsInfo = async (id: any) => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_CLIENT_COMPANION_VSET_URL + '?companion_id=' + id,
    headers: {
      'Content-Type': 'application/json',
    },
  }
  try {
    const response = await axios.request(config)
    if (response.status === 200) {
      const data = response.data
      form.id = data.id
      form.firstName = data?.user?.first_name
      form.lastName = data?.user?.last_name
      form.country = {
        value: data?.user_profile?.country.code,
        text: data?.user_profile?.country.name,
      }
      form.gender = {
        value: data?.user_profile?.gender,
        text: data?.user_profile?.gender,
      }
      form.address = data?.user_profile?.address
      form.phone = data?.user_profile?.phone
      form.city = data?.user_profile?.city
      form.state = data?.user_profile?.state ?? ''
      form.passportNumber = data?.user_profile?.passport_number ?? ''
      form.birthDate = new Date(data?.user_profile?.date_of_birth)
      form.email = data?.user.email
      photo.push(data?.user_profile.photo)
    } else {
      console.log('Error getting companion info')
    }
  } catch (error) {
    console.log(error)
    reset()
    resetValidation()
    photo.push('')
    showEditForm.value = false
  }
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
    console.log(response.data)
    countries.push(...response.data.map((country: any) => ({ value: country.code, text: country.name })))
  }
}

const columns = ref([
  { key: 'Name' },
  { key: 'email' },
  { key: 'phone' },
  { key: 'passport_number' },
  { key: 'actions', width: 80 },
])

const getCompanions = async () => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_CLIENT_COMPANION_VSET_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const response = await axios.request(config)
  if (response.status === 200) {
    const data = response.data
    items.value = data.map((item: any) => {
      // Update the reactive reference
      return {
        id: item.id,
        name: item.user?.first_name + ' ' + item?.user?.last_name,
        email: item.user?.email,
        photo: item?.user_profile?.photo,
        phone: item?.user_profile?.phone,
        country: item.user_profile?.country?.name,
        passport_number: item?.user_profile?.passport_number, // Ensure you are accessing the correct field
      }
    })
  }
}

onMounted(() => {
  getCountries()
})
</script>
