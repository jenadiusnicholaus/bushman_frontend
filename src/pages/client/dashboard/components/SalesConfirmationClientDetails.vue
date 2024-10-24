<template>
  <VaSplit
    class="split-demo h-[40rem] py-6"
    :limits="[
      ['30px', '20rem'],
      [5 as any, 'any'],
    ]"
  >
    <template #start>
      <div class="p-6">
        <VaTitle style="font-weight: bold">Sales Inquiry Details</VaTitle>

        <h2>Inquiry Code: {{ item?.code }}</h2>
        <VaTitle>Created on: {{ formatDate(item?.create_date) }}</VaTitle>

        <VaDivider />
        <div class="flex flex-col py-4 px-6">
          <VaTitle style="font-weight: bold">Client Information</VaTitle>
          <p>Full Name: {{ safeString(item?.entity?.full_name) }}</p>
          <p>Nationality: {{ safeString(item?.entity?.nationality?.name) }}</p>
          <p>Country: {{ safeString(item?.entity?.country?.name) }}</p>

          <VaTitle style="font-weight: bold">Contacts:</VaTitle>
          <VaList>
            <VaListItem v-for="(contact, index) in safeArray(item.entity?.contacts)" :key="index">
              <VaListItemContent>{{ contact.contact }}</VaListItemContent>
            </VaListItem>
          </VaList>

          <VaDivider />

          <VaTitle style="font-weight: bold">Preference Information</VaTitle>
          <p>Preferred Date: {{ formatDate(item?.preference?.preferred_date) }}</p>
          <p>Number of Hunters: {{ safeString(item?.preference?.no_of_hunters?.toString()) }}</p>
          <p>Number of Companions: {{ safeString(item?.preference?.no_of_companions?.toString()) }}</p>
          <p>Number of Days: {{ safeString(item?.preference?.no_of_days?.toString()) }}</p>

          <VaDivider />

          <VaTitle style="font-weight: bold">Preferred Species</VaTitle>
          <VaList>
            <VaListItem v-if="safeArray(item?.preferred_species).length === 0">
              <VaListItemContent>No preferred species listed.</VaListItemContent>
            </VaListItem>
            <VaListItem v-for="(species, index) in safeArray(item?.preferred_species)" :key="index">
              <VaListItemContent>
                {{ safeString(species.species?.name) }} (Quantity: {{ safeString(species?.quantity?.toString()) }})
              </VaListItemContent>
            </VaListItem>
          </VaList>

          <VaDivider />

          <VaTitle style="font-weight: bold">Area Information</VaTitle>
          <VaList>
            <VaListItem v-if="safeArray(item.area).length === 0">
              <VaListItemContent>No area information available.</VaListItemContent>
            </VaListItem>
            <VaListItem v-for="(area, index) in safeArray(item.area)" :key="index">
              <VaListItemContent>
                Area ID: {{ safeString(area.id.toString()) }}, Area: {{ safeString(area.area?.name || 'Unnamed') }}
              </VaListItemContent>
            </VaListItem>
          </VaList>

          <VaDivider />

          <VaTitle style="font-weight: bold">Remarks</VaTitle>
          <p>{{ safeString(item?.remarks, 'No remarks provided.') }}</p>
        </div>
      </div>
    </template>
    <template #grabber>
      <div class="custom-grabber">
        <VaIcon name="swap_horiz" />
      </div>
    </template>
    <template #end>
      <div class="p-6">
        <SalesProposalForm :item="item"> </SalesProposalForm>
      </div>
    </template>
  </VaSplit>
</template>

<script lang="ts">
import { useForm } from 'vuestic-ui'
import { defineComponent, ref, reactive } from 'vue'
import { useSettingsStore } from '../../../../stores/settings-store'
import SalesProposalForm from './SalesProposalForm.vue'

export default defineComponent({
  name: 'SalesConfirmationClientDetails',
  components: {
    SalesProposalForm,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  data() {
    const formRef = ref()
    const {
      isValid: isValidForm,
      validate: validateForm,
      resetValidation: resetValidationForm,
      reset: resetForm,
    } = useForm(formRef)

    const form = reactive({
      id: null as any,
      package_id: null as any,
      airport: null as any,
      departure: null as any,
      charters: null as any,
      arrival: null as any,
      hotel_booking: null as any,
    })

    return {
      isValidForm,
      validateForm,
      resetValidationForm,
      resetForm,
      formRef,
      form,
    }
  },
  computed: {
    logo() {
      return useSettingsStore().logo // Get the logo from the store
    },
  },
  methods: {
    formatDate(dateString: string | number | Date) {
      return dateString ? new Date(dateString).toLocaleDateString() : 'Not provided'
    },
    safeArray(arr: any) {
      return arr || []
    },
    safeString(str: any, fallback = 'Not provided') {
      return str || fallback
    },
    gotBack() {
      // Your logic to go back to the previous view
    },
  },
})
</script>

<style lang="scss" scoped>
.sales-inquiry {
  margin: 20px;
}

.split-demo {
  & .custom-grabber {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--va-background-element);
  }
}
</style>
