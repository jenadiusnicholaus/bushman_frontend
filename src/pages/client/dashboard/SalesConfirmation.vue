<template>
  <VaCard>
    <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between px-4 py-2">
      <div class="flex flex-col md:flex-row gap-2 justify-start">
        <VaButton v-if="viewDetails" class="px-2 py-2" icon="arrow_back" size="small" @click="gotBack()">
          Go Back
        </VaButton>
      </div>
    </div>
    <!-- <div v-if="!viewDetails" class="grid grid-cols-12 gap-6 mb-6 py-4">
      <div class="col-span-12">
        <VaInput
          v-model="searchText"
          type="search"
          placeholder="Enter user name or sales code"
          @input="getOrsearchSalesInquiry"
        >
          <template #appendInner> <VaIcon name="manage_search" size="small" color="primary" /> </template
        ></VaInput>
      </div> -->
    <!-- </div> -->
    <!-- Mode=uleTable -->

    <template v-if="viewDetails">
      <SalesConfirmationClientDetails :sales-data="item" @downloadConfirmation="generateSalesConfirmationPDF">
      </SalesConfirmationClientDetails>
    </template>

    <template v-else>
      <!-- <div v-if="results?.length > 0"> -->

      <VaDataTable :items="results" :columns="columns">
        <!-- <template #header(status)="{ label }">
          <VaChip size="small">
            {{ label }}
          </VaChip>
        </template> -->
        <template #cell(status)="{ value }">
          <VaChip :color="getStatusColorForModal(value)" size="small">
            {{ value }}
          </VaChip>
        </template>
        <!-- <template #cell(username)="{ value }">
          <strong>{{ value }}</strong>
        </template> -->
        <!-- actions -->
        <template #cell(actions)="{ rowData }">
          <div class="flex justify-center items-center">
            <VaButton plain color="primary" class="mr-2" @click="onRowClick(rowData)">
              {{ getbuttonTextBasedOnStatus(rowData.status) }}
            </VaButton>
            <VaButton plain icon="download" @click="generateSalesConfirmationPDF(rowData.selfitem)"> </VaButton>
          </div>
        </template>
      </VaDataTable>
    </template>
    <!-- <ModuleTable :items="results" :columns="columns" :loading="loadingresults" @onView="onRowClick"> </ModuleTable> -->
    <!-- </div> -->
    <!-- show create sales inquiry button -->
    <!-- <div v-else>
        <div class="flex flex-col justify-center items-center h-full">
          <VaIcon name="search" size="4x" color="gray-400" />
          <h2 class="text-lg font-medium mt-4">No results found</h2>
          <VaButton color="primary" @click="$router.push('/sales-inquiry')">Create Sales Inquiry</VaButton>
        </div>
      </div> -->
    <!-- </template> -->
  </VaCard>
</template>

<script lang="ts">
import { useSalesInquiriesStore } from '../../../stores/sales-store'
// map action from pinia
import { mapActions, mapState } from 'pinia'
// import ModuleTable from '../../module-settings/components/ModuleTable.vue'
import SalesConfirmationClientDetails from './components/SalesConfirmationClientDetails.vue'
import pdfMake from 'pdfmake/build/pdfmake'
import * as pdfFonts from 'pdfmake/build/vfs_fonts'
pdfMake.vfs = pdfFonts?.pdfMake?.vfs
import { formatDateTime } from '../../../services/utils'

export default {
  components: {
    // ModuleTable,
    SalesConfirmationClientDetails,
  },
  data() {
    return {
      items: [] as Array<any>,
      searchText: null as any,
      columns: [
        { key: 'sales_inquiry_code', label: 'Sales Inquiry ID', width: 80 },
        { key: 'name', label: 'package', width: 120 },
        { key: 'airport_name', label: 'Airport', width: 50 },
        { key: 'arrival', label: 'Arrival', width: 120 },
        { key: 'charter_in', label: 'Charter In', width: 120 },
        { key: 'charter_out', label: 'Charter Out', width: 80 },
        { key: 'status', label: 'Status', width: 120 },
        { key: 'actions', width: 80 },
      ],

      viewDetails: false,
      item: null as any,
      buttondisables: true,
    }
  },
  computed: {
    ...mapState(useSalesInquiriesStore, ['results', 'loadingresults']),
    // ...mapState(useSalesInquiriesStore, ['loadingresults']),
  },
  mounted() {
    this.getOrsearchSalesInquiry()
  },
  methods: {
    ...mapActions(useSalesInquiriesStore, ['getallSalesConfirmation']),

    async getOrsearchSalesInquiry() {
      await this.getallSalesConfirmation()
    },

    onRowClick(row: any) {
      // Do something with the row data
      // console.log(row)
      this.item = row.selfitem
      this.viewDetails = true
    },

    gotBack() {
      this.viewDetails = false
      this.getOrsearchSalesInquiry()
      // this.item = null
    },

    getStatusColorForModal(status: any) {
      switch (status) {
        case 'pending':
          return 'warning'
        case 'provision_sales':
          return 'warning' // Adjust as needed
        case 'confirmed':
          return 'success'
        case 'declined':
          return 'danger' // Corresponds to VaBadge color
        case 'cancelled':
          return 'danger' // or appropriate color
        case 'completed':
          return 'primary' // or appropriate color
        default:
          return 'default' // fallback color
      }
    },

    getbuttonTextBasedOnStatus(status: any) {
      switch (status) {
        case 'pending':
          return 'confirm'
        case 'provision_sales':
          return 'confirm' // Adjust as needed
        case 'confirmed':
          return 'cancel'
        case 'declined':
          this.buttondisables = true
          return 'View' // Corresponds to VaBadge color
        case 'cancelled':
          return 'view' // or appropriate color
        case 'completed':
          return 'View' // or appropriate color
        default:
          return 'default' // fallback color
      }
    },

    // import pdfMake from 'pdfmake/build/pdfmake';

    // import pdfMake from 'pdfmake/build/pdfmake';
    // import pdfMake from 'pdfmake/build/pdfmake';

    generateSalesConfirmationPDF(salesData: any): void {
      console.log(salesData)

      // Fallback for missing data
      const getValueOrDefault = (value: any, defaultValue: string = 'N/A') =>
        value != null && value !== '' ? value : defaultValue

      // Check for sales inquiry existence
      if (!salesData.sales_inquiry) {
        console.error('sales_inquiry is undefined in salesData')
        return // Exit the function
      }

      const salesInquiry = salesData.sales_inquiry
      const salesEntity = salesInquiry.entity

      // Check for contact information (email, phone, address)
      const emailContact = salesEntity?.contacts?.find((c: any) => c.contact_type === 1) || null
      const phoneContact = salesEntity?.contacts?.find((c: any) => c.contact_type === 4) || null
      const addressContact = salesEntity?.contacts?.find((c: any) => c.contact_type === 3) || null

      // Safely get preferred species or default to a placeholder if missing
      salesInquiry.preferred_species?.[0]?.species || {
        name: 'Unknown',
        description: 'No species available',
      }

      // Safely calculate total amount due
      const totalAmountDue =
        salesData.installments?.length > 0
          ? salesData.installments
              .reduce((sum: any, installment: any) => sum + parseFloat(installment.amount_due || '0'), 0)
              .toFixed(2)
          : '0.00'

      // Define a layout for bordered tables
      const borderedLayout = {
        hLineWidth: () => 0.5,
        vLineWidth: () => 0.5,
        hLineColor: () => '#CCCCCC',
        vLineColor: () => '#CCCCCC',
      }

      // Document definition for PDF generation
      const docDefinition: any = {
        content: [
          { text: 'BUSHMAN SALES CONFIRMATION', style: 'header', alignment: 'center' },
          { text: '', style: 'subheader', margin: [0, 20, 0, 10] },

          // Client and Trip Information
          {
            table: {
              widths: ['auto', '*'],
              body: [
                [{ text: 'Client Name:', bold: true }, getValueOrDefault(salesEntity?.full_name)],
                [{ text: 'Address:', bold: true }, getValueOrDefault(addressContact?.contact)],
                [{ text: 'Home Tel:', bold: true }, getValueOrDefault(phoneContact?.contact)],
                [{ text: 'Email:', bold: true }, getValueOrDefault(emailContact?.contact)],
                [
                  { text: 'Type of Hunting Trip:', bold: true },
                  getValueOrDefault(salesData.proposed_package?.price_list_type?.hunting_type?.name),
                ],
                [{ text: 'Hunting Area:', bold: true }, getValueOrDefault(salesInquiry.area?.[0]?.area?.name)],
                [{ text: 'Outfitter:', bold: true }, 'Bushman Safari Trackers Limited'],
                [
                  { text: 'Dates:', bold: true },
                  `${formatDateTime(getValueOrDefault(salesData.itinerary?.arrival))} - ${formatDateTime(
                    getValueOrDefault(salesData.itinerary?.charter_out),
                  )}`,
                ],
              ],
            },
            margin: [0, 0, 0, 20],
            layout: borderedLayout,
          },

          // Total Amount Due
          {
            table: {
              widths: ['*', '*'],
              body: [
                [
                  { text: 'Total Amount Due:', style: 'subheader', margin: [0, 2, 0, 10] },
                  { text: `USD ${totalAmountDue}`, margin: [0, 2, 0, 10], alignment: 'right' },
                ],
              ],
            },
            margin: [0, 0, 0, 20],
            layout: borderedLayout,
          },

          // Installment Details
          { text: 'Installment Details:', style: 'subheader', margin: [0, 20, 0, 10] },
          {
            table: {
              widths: ['*', '*', 'auto', 'auto'], // Added columns for days and due limit
              body: [
                [
                  { text: 'Description', bold: true },
                  { text: 'Amount Due (USD)', bold: true },
                  { text: 'Days', bold: true },
                  { text: 'Due Limit', bold: true },
                ],
                ...(salesData.installments?.length > 0
                  ? salesData.installments.map((installment: any) => [
                      getValueOrDefault(installment.description),
                      getValueOrDefault(installment.amount_due),
                      getValueOrDefault(installment.days), // Added days
                      getValueOrDefault(installment.due_limit), // Added due limit
                    ])
                  : [['No installments available', '', '', '']]),
              ],
            },
            margin: [0, 10, 0, 20],
            layout: borderedLayout,
          },

          // Price Includes and Excludes
          {
            columns: [
              {
                width: '*',
                table: {
                  body: [
                    [{ text: 'Price includes:', style: 'subheader' }],
                    ['- Service of experienced professional hunter'],
                    ['- Service of staff'],
                    ['- Camp accommodation'],
                    ['- Daily laundry'],
                    ['- Government and concession fees'],
                    ['- 2 Gun Permits'],
                    ['- Dip and pack'],
                    ['- Trophy handling'],
                  ],
                },
                layout: borderedLayout,
              },
              {
                width: '*',
                table: {
                  body: [
                    [{ text: 'Price does not include:', style: 'subheader' }],
                    ['- Trophy fees for animals taken, wounded, or lost'],
                    ['- International flights or charter costs'],
                    ['- Hotel charges before or after safari'],
                    ['- Air freight of trophies from Tanzania'],
                    ['- Insurance for trophies being shipped'],
                    ['- Gratuities, Insurance'],
                    ['- Entry Visa'],
                  ],
                },
                layout: borderedLayout,
              },
            ],
            margin: [0, 10, 0, 20],
          },

          // NOTE Section
          { text: 'NOTE:', style: 'subheader', margin: [0, 20, 0, 10] },
          {
            text: `Estimated trophy fees and charter cost will be invoiced prior to the start of the safari. Trophy fees and charter prices are subject to 
change at any time by government and charter companies without notice. Trophy fee deposit is strictly a credit toward your trophy fees. 
Any difference in trophies taken will be billed or refunded accordingly on the final bill. Change of area fee will be added to the final bill 
after the safari should the hunter change areas at any time.`,
            margin: [0, 5, 0, 5],
          },

          // Contract Information
          {
            text: `CONTRACT IS SUBJECT TO THE FULL BUSHMAN SAFARI TRACKERS LIMITED TERMS & CONDITIONS, RELEASE OF LIABILITY AND
ASSUMPTION OF RISKS FOR ADULTS AND MINORS. CLIENT IS RESPONSIBLE FOR SUBMISSION OF ALL DOCUMENTS TO THE 
COMPANY PRIOR TO SAFARI. THE COMPANY IS NOT LIABLE FOR DELAYS IN THE HUNT DUE TO LATE SUBMISSION OF DOCUMENTS.`,
            margin: [0, 5, 0, 5],
          },

          { text: '', style: 'subheader', margin: [0, 20, 0, 10] },

          // Signature Section
          {
            columns: [
              { text: 'Client Signature: ___________________', margin: [0, 30, 0, 10] },
              { text: 'Date: ___________________', margin: [0, 30, 0, 10], alignment: 'right' },
            ],
          },
          { text: '', style: 'subheader', margin: [0, 10, 0, 10] },

          {
            text: `Please sign, date, and return contract and deposit to our accounting office at:
Bushman Safari Trackers Limited,
Plot No. 61-64, Block E, Kihonda Industrial Complex,
P.O. Box 678, Morogoro, Tanzania.`,
          },
        ],
        styles: {
          header: { fontSize: 18, bold: true },
          subheader: { fontSize: 14, bold: true },
        },
      }

      // Generate and download the PDF
      pdfMake.createPdf(docDefinition).download('sales_confirmation.pdf')
    },
  },
}

// Define your methods here if you have any to implement
</script>

<style scoped>
/* Add any styles specific to this component */
</style>
