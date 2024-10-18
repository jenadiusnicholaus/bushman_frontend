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
        <ModuleTable :items="items" :columns="columns" :loading="loading" @onView="toggleShowPriceListMethod">
          <template #filter-elements-and-download-btn>
            <div class="grid sm:grid-cols-4 gap-6 mb-6">
              <VaSelect
                v-model="huntingTypeValue"
                :options="huntingTypeOptions"
                placeholder="Filter By Hunting Type"
                @update:modelValue="getPriceLists"
              />
              <VaSelect
                v-model="areaValue"
                :options="areasOptions"
                placeholder="Filter By Area"
                @update:modelValue="getPriceLists"
              />
              <VaSelect
                v-model="quotaValue"
                :options="quotasOptions"
                placeholder="Filter By Quota"
                @update:modelValue="getPriceLists"
              />
              <!-- <div class="flex justify-end"> -->
              <VaButton
                class="px-2 py-0"
                color="primary"
                label="Download"
                icon="download"
                size="small"
                @click="generatePDF()"
              >
                Download
              </VaButton>
              <!-- </div> -->
            </div>
          </template>
        </ModuleTable>
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
import { useQuotaStore } from '../../stores/quota-store'
import { useSettingsStore } from '../../stores/settings-store'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

pdfMake.vfs = pdfFonts.pdfMake.vfs
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
    const printableDataList: [] = []

    const sform = reactive({
      id: null as any,
      name: '',
      scientific_name: '',
    })

    const quotasOptions = [] as any

    return {
      items,
      printableDataList,
      item: null as any,
      editedItemId: null,
      editedItem: null,
      createdItem: { ...defaultItem },
      toast: useToast(),
      sform,
      speciesOptions: [] as any,
      areasOptions: [] as any,
      huntingTypeOptions: [] as any,
      speciesObjects: [] as any,
      showModal: false,
      quotasOptions,
      showPriceList: true,
      quotaItems: [] as any,
      excellFile: [] as any,
      itemsByHuntingType: [] as any,
      ShowCreateNewPriceListForm: false,
      loading: false,
      currentQuota: null as any,
      // for filter
      huntingTypeValue: null as any,
      areaValue: null as any,
      quotaValue: null as any,
      logo: '',
    }
  },

  mounted() {
    this.getPriceLists()
    this.getAreas()
    this.getQuota()
    this.getHuntingTypesOptions()
    this.loadLogo()
  },

  methods: {
    ...mapActions(usePriceListStore, ['getPriceList']),
    ...mapActions(usePriceListStore, ['getPriceListByHuntingType']),
    ...mapActions(useQuotaStore, ['getQuotas']),
    ...mapActions(useQuotaStore, ['getAreaList']),
    ...mapActions(useQuotaStore, ['generateQuotaYear']),
    ...mapActions(useSettingsStore, ['getHuntingsTypes']),

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
      this.loading = true

      try {
        // hunting_type_id: any = '', area_id: any = '', quota_id: any = ''
        const response = await this.getPriceList(
          this.huntingTypeValue?.value ?? '',
          this.areaValue?.value ?? '',
          this.quotaValue?.value ?? '',
        )
        if (response.status === 200) {
          this.loading = false
          this.printableDataList = response?.data
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
        }
      } catch (error) {
        this.loading = false
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

    async getAreas() {
      try {
        const response = await this.getAreaList()
        const all = {
          value: '',
          text: 'All',
        }

        this.areasOptions = response.data.map((item: any) => {
          return {
            value: item.id,
            text: item.name,
          }
        })
        this.areasOptions.unshift(all)
        // make all default value
        this.areaValue = this.areasOptions[0]
      } catch (error) {
        console.log(error)
      }
    },

    async getQuota() {
      try {
        const response = await this.getQuotas(null)

        if (response.status === 200) {
          const currentQuota = response.data[0]
          const result1 = this.generateQuotaYear(currentQuota.start_date, currentQuota.end_date)

          this.quotaValue = {
            value: currentQuota.id,
            text: `${result1} - ${currentQuota.name}`,
            name: currentQuota.name,
            start_date: currentQuota.start_date,
            end_date: currentQuota.end_date,
          }
          this.currentQuota = currentQuota

          // all object
          const all = {
            value: '',
            text: 'All',
          }

          this.quotasOptions = response.data.map((item: any) => {
            const result = this.generateQuotaYear(item.start_date, item.end_date)

            return {
              value: item.id,
              text: `${result} - ${item.name}`,
              name: item.name,
              start_date: item.start_date,
              end_date: item.end_date,
            }
          })
          // add all option
          this.quotasOptions.unshift(all)
          // make all default value
          // this.quotaValue = this.quotasOptions[0]
        }
      } catch (error) {
        console.log(error)
      }
    },

    async getHuntingTypesOptions() {
      const response = await this.getHuntingsTypes()
      if (response.status === 200) {
        const all = {
          value: '',
          text: 'All',
        }
        this.huntingTypeOptions = response.data.map((item: any) => {
          return {
            value: item.id,
            text: item.name,
          }
        })
        this.huntingTypeOptions.unshift(all)
        // make all default value
        this.huntingTypeValue = this.huntingTypeOptions[0]
      }
    },

    loadLogo() {
      // Fetch the logo image and convert to base64
      const img = new Image()
      img.src = '/logo.png' // Your logo image path
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx: any = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        const dataURL = canvas.toDataURL('image/png') // Convert to base64
        this.logo = dataURL // Assign the base64 string to logo
      }
    },
    generatePDF() {
      try {
        const mylogo = this.logo
        console.log('Printable Data List:', this.printableDataList) // Log for inspection

        const documentDefinition: any = {
          pageSize: 'A1',
          pageMargins: [40, 60, 40, 60], // left, top, right, bottom

          footer: (currentPage: number, pageCount: number) => ({
            columns: [
              { text: `Generated on: ${new Date().toLocaleDateString()}`, alignment: 'left', style: 'footer' },
              { text: `Page ${currentPage} of ${pageCount}`, alignment: 'right', style: 'footer' },
            ],
            margin: [40, 20], // Add margin above the footer
          }),

          header: function (currentPage: number, pageCount: number) {
            console.log('Current Page:', currentPage) // Log for inspection
            console.log('Page Count:', pageCount) // Log for inspection
            return {
              columns: [
                {
                  image: mylogo, // Use logo from the component data
                  width: 150, // Adjust width as necessary
                  margin: [0, 15, 0, 0], // Add margin to position the logo
                },
                {
                  text: 'Quota List Report',
                  style: 'header',
                  alignment: 'right',
                  margin: [0, 20, 0, 0], // Add margin to position title
                  fontSize: 24,
                  bold: true,
                  color: '#4A4A4A',
                },
              ],
              margin: [0, 0, 0, 10], // Overall header margin
            }
          },

          content: [
            {
              text: 'Comprehensive breakdown of sales packages, associated species, and companions.',
              style: 'subheader',
              alignment: 'center',
              margin: [0, 0, 0, 20],
            },
            {
              style: 'table',
              table: {
                widths: ['*', '*', '*', 'auto', 'auto', '*', '*', 'auto'], // Define column widths
                body: [
                  // Table Header
                  [
                    {
                      text: 'Sales Package',
                      bold: true,
                      fillColor: '#6F4C3E',
                      color: 'white',
                      alignment: 'center',
                      margin: [5, 10],
                    },
                    {
                      text: 'Description',
                      bold: true,
                      fillColor: '#6F4C3E',
                      color: 'white',
                      alignment: 'center',
                      margin: [5, 10],
                    },
                    {
                      text: 'Area',
                      bold: true,
                      fillColor: '#6F4C3E',
                      color: 'white',
                      alignment: 'center',
                      margin: [5, 10],
                    },
                    {
                      text: 'Quota',
                      bold: true,
                      fillColor: '#6F4C3E',
                      color: 'white',
                      alignment: 'center',
                      margin: [5, 10],
                    },
                    {
                      text: 'Created Date',
                      bold: true,
                      fillColor: '#6F4C3E',
                      color: 'white',
                      alignment: 'center',
                      margin: [5, 10],
                    },
                    {
                      text: 'Species Info',
                      bold: true,
                      fillColor: '#6F4C3E',
                      color: 'white',
                      alignment: 'center',
                      margin: [5, 10],
                    },
                    {
                      text: 'Companions',
                      bold: true,
                      fillColor: '#6F4C3E',
                      color: 'white',
                      alignment: 'center',
                      margin: [5, 10],
                    },
                    {
                      text: 'Additional Costs',
                      bold: true,
                      fillColor: '#6F4C3E',
                      color: 'white',
                      alignment: 'center',
                      margin: [5, 10],
                    },
                  ],
                  // Loop through printableDataList and populate table rows
                  ...this.printableDataList.map((item: any) => {
                    if (!item || !item?.sales_package) {
                      console.warn('Invalid Item:', item)
                      return [
                        { text: 'N/A', margin: [5, 10] },
                        { text: 'N/A', margin: [5, 10] },
                        { text: 'N/A', margin: [5, 10] },
                        { text: 'N/A', margin: [5, 10] },
                        { text: 'N/A', margin: [5, 10] },
                        { text: 'N/A', margin: [5, 10] },
                        { text: 'N/A', margin: [5, 10] },
                        { text: 'N/A', margin: [5, 10] },
                      ]
                    }

                    const salesPackage = item.sales_package
                    const area = item?.price_list_type?.price_list?.area?.name || 'N/A'
                    const quotaName = salesPackage.sales_quota?.name || 'N/A'
                    const createdDate = item?.create_date ? item.create_date.split('T')[0] : 'N/A'

                    const speciesInfo = Array.isArray(salesPackage?.species)
                      ? salesPackage.species
                          .map(
                            (species: any) =>
                              `${species?.species?.name || 'Unknown Species'} (Quantity: ${
                                species?.quantity || 0
                              }, Amount: ${species?.amount || '0.00'})`,
                          )
                          .join(', ')
                      : 'No species information available.'

                    // Companions' information (days and costs)
                    const companionsInfo =
                      Array.isArray(item.componions_hunter) && item.componions_hunter.length > 0
                        ? item.componions_hunter
                            .map((companion: any) => `Days: ${companion.days}, Cost: ${companion.amount}`)
                            .join(', ')
                        : 'No companions information available.'

                    // If additional cost info is available, include it here (Example: 200 for each companion)
                    const additionalCosts = item.componions_hunter
                      .reduce((total: any, companion: any) => total + parseFloat(companion.amount), 0)
                      .toFixed(2)

                    return [
                      { text: salesPackage?.name || 'N/A', margin: [5, 10] },
                      { text: salesPackage?.description || 'N/A', margin: [5, 10] },
                      { text: area, margin: [5, 10] },
                      { text: quotaName, margin: [5, 10] },
                      { text: createdDate, margin: [5, 10] },
                      { text: speciesInfo, margin: [5, 10] },
                      { text: companionsInfo, margin: [5, 10] },
                      { text: `$${additionalCosts}`, margin: [5, 10] },
                    ]
                  }),
                ],
              },
              layout: {
                hLineWidth: (i: any) => (i === 0 ? 2 : 1), // Bold for the header
                vLineWidth: () => 0, // No vertical lines
                hLineColor: () => '#ccc',
                paddingLeft: () => 10,
                paddingRight: () => 10,
                paddingTop: () => 10,
                paddingBottom: () => 10,
              },
            },
          ],
          styles: {
            header: {
              fontSize: 24,
              bold: true,
              color: '#4A4A4A',
              margin: [0, 20, 0, 10],
            },
            subheader: {
              fontSize: 14,
              bold: true,
              margin: [0, 0, 0, 10],
              color: '#555555',
            },
            footer: {
              fontSize: 10,
              margin: [0, 0, 0, 0],
              alignment: 'left',
            },
          },
        }

        pdfMake.createPdf(documentDefinition).download('quota_list.pdf')
      } catch (error) {
        console.error('Error generating PDF:', error)
        alert('An error occurred while generating the PDF. Please try again.')
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
