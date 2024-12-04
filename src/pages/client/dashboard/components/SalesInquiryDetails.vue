<template>
  <VaSplit
    class="split-demo h-[40rem]"
    :limits="[
      ['30px', '20rem'],
      [5 as any, 'any'],
    ]"
  >
    <template #start>
      <div class="p-1">
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
          <table class="table-auto w-full mb-4 va-table">
            <thead>
              <tr>
                <th class="px-4 py-2">Species Name</th>
                <th class="px-4 py-2">Quantity</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="safeArray(item?.preferred_species).length === 0">
                <td colspan="2" class="text-center">No preferred species listed.</td>
              </tr>
              <tr v-for="(species, index) in safeArray(item?.preferred_species)" :key="index">
                <td class="border px-4 py-2">{{ safeString(species.species?.name) }}</td>
                <td class="border px-4 py-2">{{ safeString(species?.quantity?.toString()) }}</td>
              </tr>
            </tbody>
          </table>

          <VaTitle style="font-weight: bold">Area Information</VaTitle>
          <table class="table-auto w-full va-table">
            <thead>
              <tr>
                <th class="px-4 py-2">Area ID</th>
                <th class="px-4 py-2">Area Name</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="safeArray(item.area).length === 0">
                <td colspan="2" class="text-center">No area information available.</td>
              </tr>
              <tr v-for="(area, index) in safeArray(item.area)" :key="index">
                <td class="border px-4 py-2">{{ safeString(area.id.toString()) }}</td>
                <td class="border px-4 py-2">{{ safeString(area.area?.name || 'Unnamed') }}</td>
              </tr>
            </tbody>
          </table>

          <VaDivider />
          <VaTitle style="font-weight: bold">Observers</VaTitle>
          <VaDataTable :items="observers" />
          <VaTitle style="font-weight: bold">Companions</VaTitle>

          <VaDataTable :items="companions" />
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
      <div class="flex justify-end">
        <VaButton
          preset="primary"
          class="mr-6 mb-2"
          round
          icon="arrow_downward"
          size="small"
          border-color="primary"
          @click="scrollTo(observerScollRef)"
          >Add Observers</VaButton
        >
        <VaButton
          preset="primary"
          class="mr-6 mb-2"
          round
          icon="arrow_downward"
          border-color="primary"
          size="small"
          @click="scrollTo(companionsScollRef)"
          >Companions</VaButton
        >
      </div>
      <section ref="observerScollRef">
        <ObserversForm :sales-inquiry-id="item.id"> </ObserversForm>
      </section>
      <section ref="companionsScollRef">
        <CompanionForm :sales-inquiry-id="item.id"> </CompanionForm>
      </section>
    </template>
  </VaSplit>
</template>

<script lang="ts">
import { useForm } from 'vuestic-ui'
import { defineComponent, ref, reactive } from 'vue'
import { useSettingsStore } from '../../../../stores/settings-store'
import SalesProposalForm from './SalesProposalForm.vue'
import ObserversForm from './ObserversForm.vue'
import CompanionForm from './CompanionForm.vue'
import { useSalesInquiriesStore } from '../../../../stores/sales-store'
import { mapState, mapActions } from 'pinia'

export default defineComponent({
  name: 'SalesConfirmationClientDetails',
  components: {
    SalesProposalForm,
    ObserversForm,
    CompanionForm,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  setup() {
    const observerScollRef = ref<HTMLDivElement | null>(null)
    const companionsScollRef = ref<HTMLDivElement | null>(null)

    const scrollTo = (view: any) => {
      console.log('Scroll View:', view) // For debugging
      console.log('Section Ref El:', observerScollRef.value) // For debugging
      if (view) {
        view.scrollIntoView({ behavior: 'smooth' })
      } else {
        console.error('View is null or undefined')
      }
    }

    return {
      observerScollRef,
      companionsScollRef,
      scrollTo,
    }
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
      searchText: '',
    }
  },
  computed: {
    ...mapState(useSalesInquiriesStore, ['observers', 'companions']),
    logo() {
      return useSettingsStore().logo // Get the logo from the store
    },
  },
  mounted() {
    this.getObservers(this.item.id)
    this.getCompanions(this.item.id)
  },
  methods: {
    ...mapActions(useSalesInquiriesStore, ['getObservers', 'getCompanions']),
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
    getOrsearchSalesInquiry() {},
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
