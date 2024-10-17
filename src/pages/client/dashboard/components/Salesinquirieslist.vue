<template>
  <div class="grid sm:grid-cols-2 md:grid-cols-5 gap-6 mb-6">
    <VaInput v-model.number="perPage" type="number" placeholder="Items..." label="Items per page" />
    <VaInput v-model.number="currentPage" type="number" placeholder="Page..." label="Current page" />
    <VaInput
      v-model="filter"
      label="filter By any Column"
      class="sm:col-span-2 md:col-span-3"
      placeholder="Filter..."
    />
  </div>
  <VaDataTable
    striped
    :loading="loading"
    :items="salesInquiryItems"
    :columns="columns"
    :per-page="perPage"
    :current-page="currentPage"
    selectable
    :filter="filter"
    @filtered="filtered = $event.items"
  >
    <template #bodyAppend>
      <tr>
        <td colspan="6">
          <div class="flex justify-center mt-4">
            <VaPagination v-model="currentPage" :pages="pages" />
          </div>
        </td>
      </tr>
    </template>
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
        <VaAvatar src="/imageUploadPh.png" />
        <div class="pl-2">
          <div class="flex gap-1">
            <span>{{ rowData.name }}</span>
            <span class="va-link"> From {{ rowData.country }}</span>
          </div>
          <VaDivider color="primary" orientation="left" class="my-2 py-3">
            <span class="px-2">Contacts</span>
          </VaDivider>
          <div v-for="contact in rowData?.contacts" :key="contact.id" class="flex items-center">
            <VaIcon size="small" name="perm_phone_msg" color="secondary" class="mr-2" />
            <span>{{ contact.name }}</span>
          </div>
          <VaDivider color="primary" orientation="left" class="my-2 py-3">
            <span class="px-2">Species</span>
          </VaDivider>
          <div v-for="species in rowData?.preferred_species" :key="species.id" class="flex items-center">
            <VaIcon size="small" name="pets" color="secondary" class="mr-2" />
            <span>
              <b>{{ species.name }}-{{ species.quantity }}</b></span
            >
          </div>
          <VaDivider color="primary" orientation="left" class="my-2 py-3">
            <span class="px-2">Other Preferences</span>
          </VaDivider>
          <div v-for="(value, key) in rowData.preference" :key="key" class="flex items-center">
            <VaIcon size="small" name="dynamic_feed" color="secondary" class="mr-2" />
            <span
              >{{ formatKey(key) }}: <b style="color: #0077cc">{{ value }}</b></span
            >
          </div>
        </div>
      </div>
    </template>
  </VaDataTable>
</template>

<script lang="ts">
import { mapActions } from 'pinia'
import { defineComponent, ref } from 'vue'
import { useSalesInquiriesStore } from '../../../../stores/sales-store'
import { formatDateTime } from '../../../../services/utils'

export default defineComponent({
  name: 'SalesInquiriesList',
  data() {
    return {
      loading: ref(false),
      columns: [{ key: 'name' }, { key: 'country' }, { key: 'nationality' }, { key: 'actions', width: 80 }],
      salesInquiryItems: [],
      perPage: 10,
      currentPage: 1,
      filter: '',
      filtered: [],
    }
  },
  computed: {
    pages() {
      return this.perPage && this.perPage !== 0 ? Math.ceil(this.filtered.length / this.perPage) : this.filtered.length
    },
  },
  mounted() {
    this.getSalesInquiryList()
  },

  methods: {
    // getSalesInquiries()
    ...mapActions(useSalesInquiriesStore, ['getSalesInquiries']),
    async getSalesInquiryList() {
      this.loading = true
      const response: any = await this.getSalesInquiries()
      if (response.status === 200) {
        this.loading = false
        this.salesInquiryItems = response.data.map((item: any) => ({
          id: item.id,
          name: item?.entity?.full_name,
          country: item?.entity?.country?.name,
          nationality: item?.entity?.nationality.name,
          contacts: item?.entity?.contacts?.map((contact: any) => ({
            id: contact.id,
            name: contact?.contact,
            contactable: contact?.contactable,
          })),
          preference: {
            no_of_hunters: item?.preference?.no_of_hunters,
            no_of_observers: item?.preference?.no_of_observers,
            no_of_days: item?.preference?.no_of_days,
            no_of_companions: item?.preference?.no_of_companions,
            special_requests: item?.preference?.special_requests,
            budget_estimation: item?.preference?.budget_estimation,
            prev_experience: item?.preference?.prev_experience,
            prefferred_date: formatDateTime(item?.preference?.prefferred_date),
            accommodation_type: item?.preference?.accommodation_type,
            payment_method: item?.preference?.payment_method,
          },
          preferred_species: item?.preferred_species?.map((species: any) => ({
            id: species?.id,
            name: species?.species?.name,
            quantity: species?.quantity,
          })),
        }))

        this.filtered = this.salesInquiryItems

        // Add more fields here
      }
    },

    formatKey(key: string): string {
      return key
        .replace(/_/g, ' ') // Replace underscores with spaces
        .split(' ') // Split the string into words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join(' ') // Join the words back into a single string
    },
  },
})
</script>
