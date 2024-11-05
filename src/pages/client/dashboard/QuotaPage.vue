<template>
  <VaCard class="w-full p-2">
    <div class="grid md:grid-cols-4 gap-6 mb-6">
      <!-- <VaInput v-model="filter" placeholder="Filter Area" class="w-full" /> -->
      <!-- <img src="/logo.png" alt="logo" width="100" height="100" /> -->
      <VaSelect
        v-model="area"
        placeholder="Filter by Area"
        :options="areasOptions"
        searchable
        value-by="value"
        lable="Area"
        @update:modelValue="getAllSpeces()"
      />

      <VaSelect
        v-model="quota"
        placeholder="Filter by Quota year"
        :options="yearOptions"
        value-by="value"
        lable="Quota year"
        @update:modelValue="getAllSpeces()"
      />

      <VaSelect
        v-model="species"
        placeholder="Filter by Species"
        :options="speciesOptions"
        value-by="value"
        lable="Species"
        @update:modelValue="getAllSpeces()"
      />
      <!-- <VaButton icon="print" icon-color="#fff" @click="createPDF"> print</VaButton> -->
      <VaButton icon="download"> Download </VaButton>
    </div>
    <!-- :filter-method="" -->
    <VaDataTable :items="speciesItems" :columns="columns" :filter="filter" :loading="loading">
      <template #cell(provision_sales)="{ value }">
        <VaChip color="warning" size="small">
          {{ value }}
        </VaChip>
      </template>

      <template #cell(confirmed)="{ value }">
        <VaChip color="success" size="small">
          {{ value }}
        </VaChip>
      </template>

      <template #cell(canceled)="{ value }">
        <VaChip color="danger" size="small">
          {{ value }}
        </VaChip>
      </template>

      <template #cell(taken)="{ value }">
        <VaChip color="primary" size="small">
          {{ value }}
        </VaChip>
      </template>
    </VaDataTable>
  </VaCard>
</template>

<script lang="ts">
import { mapActions } from 'pinia'
import { useQuotaStore } from '../../../stores/quota-store'
import { ref } from 'vue'
import { useToast } from 'vuestic-ui'
// import pdfMake from 'pdfmake/build/pdfmake'
// import { pdfMake as pdfFonts } from 'pdfmake/build/vfs_fonts' // Use named import
// pdfMake.vfs = pdfFonts.vfs // Assign VFS directly
export default {
  setup() {
    const columns = [
      { key: 'id', sortable: true },
      { key: 'area', sortable: true },
      { key: 'name', sortable: true },
      { key: 'scientific_name', sortable: true },
      { key: 'no_of_species', sortable: true },
      { key: 'provision_sales', sortable: true },
      { key: 'confirmed', sortable: true },
      { key: 'canceled', sortable: true },
      { key: 'taken', sortable: true },
    ]

    const filter = ref('')

    return {
      filter,
      columns,
    }
  },
  data() {
    const { init } = useToast()

    const area: any = null
    const quota: any = null
    const species: any = null
    const logo = '/logo.png'
    const selectQuota = null as any
    return {
      speciesItems: [],
      area,
      quota,
      species,
      currentQuota: null as any,
      areasOptions: [] as any,
      yearOptions: [] as any,
      speciesOptions: [] as any,
      init,
      logo,
      selectQuota,
      with: 12,
      height: 100,
      loading: false,
    }
  },
  mounted() {
    this.getAllSpeces()
    this.getQuota()
    this.getSpeciesItems()
    this.getAreas()
  },

  methods: {
    ...mapActions(useQuotaStore, ['getAllSpeciesPerQuotaPerArea']),
    ...mapActions(useQuotaStore, ['getQuotas']),
    ...mapActions(useQuotaStore, ['getSpeciesList']),
    ...mapActions(useQuotaStore, ['getAreaList']),
    ...mapActions(useQuotaStore, ['generateQuotaYear']),

    async getAllSpeces() {
      try {
        this.currentQuota = this.yearOptions.find((item: any) => item.value === this.quota)
        const response = await this.getAllSpeciesPerQuotaPerArea(this.quota, this.area, this.species)
        this.speciesItems = response.data.map((item: any) => {
          return {
            id: item.id,
            name: item.species.name,
            area: item.area.name,
            scientific_name: item.species.scientific_name,
            no_of_species: item.quantity,
            provision_sales: item.provision_quantity,
            confirmed: item.confirmed_quantity,
            canceled: item.declined_quantity || item.cancelled_quantity,
            taken: item.completed_quantity, // New column
          }
        })
      } catch (error) {
        console.log(error)
      }
    },

    async getQuota() {
      this.loading = true
      try {
        const response = await this.getQuotas(null)

        // current select quota
        if (response.status === 200) {
          this.loading = false
          const currentQuota = response.data[0]

          this.quota = currentQuota.id
          this.currentQuota = currentQuota
          this.yearOptions = response.data.map((item: any) => {
            const result = this.generateQuotaYear(item.start_date, item.end_date)

            return {
              value: item.id,
              text: `${result} - ${item.name}`,
              name: item.name,
              start_date: item.start_date,
              end_date: item.end_date,
            }
          })
        }
      } catch (error) {
        this.loading = false
        console.log(error)
      }
    },

    async getSpeciesItems() {
      try {
        const response = await this.getSpeciesList()

        // Start with the default option
        this.speciesOptions = [
          {
            value: 'all',
            text: 'All',
          },
        ]

        // Add the species items from the response
        const speciesItems = response.data.map((item: any) => {
          return {
            value: item.id,
            text: item.name,
          }
        })

        // Combine default option with species items
        this.speciesOptions = this.speciesOptions.concat(speciesItems)
      } catch (error) {
        console.log(error)
      }
    },

    async getAreas() {
      try {
        const response = await this.getAreaList()
        this.areasOptions = response.data.map((item: any) => {
          return {
            value: item.id,
            text: item.name,
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
    // createPDF() {
    //   const data = this.speciesItems

    //   if (data.length === 0) {
    //     this.init({ message: 'No data to print', color: 'warning' })
    //     return
    //   }

    //   const logoUrl = this.logo

    //   const convertImageToBase64 = (url: string): Promise<string> => {
    //     return new Promise((resolve, reject) => {
    //       const img = new Image()
    //       img.crossOrigin = 'Anonymous'

    //       img.onload = () => {
    //         const canvas = document.createElement('canvas')
    //         canvas.width = img.width
    //         canvas.height = img.height
    //         const ctx = canvas.getContext('2d')

    //         if (ctx) {
    //           ctx.drawImage(img, 0, 0)
    //           const dataURL = canvas.toDataURL('image/png')
    //           resolve(dataURL)
    //         } else {
    //           reject(new Error('Failed to get canvas context'))
    //         }
    //       }

    //       img.onerror = (error: any) => {
    //         reject(new Error(`Error loading image: ${error.message}`))
    //       }

    //       img.src = url
    //     })
    //   }

    //   const currentDateTime = new Date().toLocaleString() // Get the current date/time

    //   convertImageToBase64(logoUrl)
    //     .then((base64Image) => {
    //       const docDefinition: any = {
    //         pageSize: { width: 594 * 2.83465, height: 841 * 2.83465 }, // A1 size in points
    //         pageMargins: [60, 100, 60, 100], // Margins for A1 size
    //         header: {
    //           margin: [10, 10, 10, 0],
    //           columns: [
    //             {
    //               image: base64Image,
    //               width: 150,
    //               alignment: 'left',
    //             },
    //             {
    //               text: 'Quota Report\n\n',
    //               alignment: 'right',
    //               fontSize: 36, // Larger font size for A1 format
    //               bold: true,
    //             },
    //           ],
    //         },
    //         content: [
    //           {
    //             text: `Quota Report for ${this.currentQuota.name} (${this.currentQuota.start_date} - ${this.currentQuota.end_date})`,
    //             style: 'header',
    //             fontSize: 48, // Header font size
    //             margin: [0, 20, 0, 10],
    //           },
    //           {
    //             style: 'table',
    //             table: {
    //               headerRows: 1,
    //               widths: ['auto', '*', '*', '*', '*', '*', '*', '*'], // Dynamic column widths
    //               body: [
    //                 [
    //                   { text: 'ID', bold: true, fillColor: '#f0f0f0', alignment: 'center', fontSize: 24 },
    //                   { text: 'Name', bold: true, fillColor: '#f0f0f0', alignment: 'center', fontSize: 24 },
    //                   { text: 'Scientific Name', bold: true, fillColor: '#f0f0f0', alignment: 'center', fontSize: 24 },
    //                   { text: 'No. of Species', bold: true, fillColor: '#f0f0f0', alignment: 'center', fontSize: 24 },
    //                   { text: 'Provision Sales', bold: true, fillColor: '#f0f0f0', alignment: 'center', fontSize: 24 },
    //                   { text: 'Confirmed', bold: true, fillColor: '#f0f0f0', alignment: 'center', fontSize: 24 },
    //                   { text: 'Canceled', bold: true, fillColor: '#f0f0f0', alignment: 'center', fontSize: 24 },
    //                   { text: 'Taken', bold: true, fillColor: '#f0f0f0', alignment: 'center', fontSize: 24 },
    //                 ],
    //                 ...data.map((item: any) => [
    //                   { text: item?.id || 'N/A', alignment: 'center', fontSize: 18 },
    //                   { text: item?.name || 'N/A', alignment: 'left', fontSize: 18, minWidth: 150 },
    //                   { text: item?.scientific_name || 'N/A', alignment: 'left', fontSize: 18, minWidth: 200 },
    //                   { text: item?.no_of_species || 0, alignment: 'center', fontSize: 18 },
    //                   { text: item?.provision_sales || 0, alignment: 'center', fontSize: 18 },
    //                   { text: item?.confirmed || 0, alignment: 'center', fontSize: 18 },
    //                   { text: item?.canceled || 0, alignment: 'center', fontSize: 18 },
    //                   { text: item?.taken || 0, alignment: 'center', fontSize: 18 },
    //                 ]),
    //               ],
    //             },
    //             layout: {
    //               hLineColor: (i: any) => (i === 0 ? 'black' : '#cccccc'),
    //               vLineColor: (i: any) => (i === 0 ? 'black' : '#cccccc'),
    //               hLineWidth: (i: any) => (i === 0 ? 1 : 0.5),
    //               vLineWidth: (i: any) => (i === 0 ? 1 : 0.5),
    //             },
    //           },
    //         ],
    //         footer: (currentPage: any, pageCount: any) => {
    //           return {
    //             columns: [
    //               {
    //                 text: `Created on: ${currentDateTime}`, // Display current date/time on the left
    //                 fontSize: 12,
    //                 alignment: 'left',
    //                 margin: [60, 10, 0, 0],
    //               },
    //               {
    //                 text: `Page ${currentPage} of ${pageCount}`, // Page numbers on the right
    //                 fontSize: 12,
    //                 alignment: 'right',
    //                 margin: [0, 10, 60, 0],
    //               },
    //             ],
    //             margin: [0, 0, 0, 10], // Margin for the footer
    //           }
    //         },
    //         styles: {
    //           header: {
    //             fontSize: 48,
    //             bold: true,
    //             margin: [0, 20, 0, 10],
    //           },
    //         },
    //       }

    //       pdfMake.createPdf(docDefinition).download('species-list.pdf')
    //     })
    //     .catch((error) => {
    //       console.error('Error converting logo to Base64:', error)
    //       this.init({ message: 'Error generating PDF', color: 'danger' })
    //     })
    // },
  },
}
</script>

<style scoped>
/* Add your styles here if needed */
</style>
