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
        searchable
        value-by="value"
        lable="Quota year"
        @update:modelValue="getAllSpeces()"
      />

      <VaSelect
        v-model="species"
        placeholder="Filter by Species"
        :options="speciesOptions"
        searchable
        value-by="value"
        lable="Species"
        @update:modelValue="getAllSpeces()"
      />
      <!-- <VaButton icon="print" icon-color="#fff" @click="createPDF"> print</VaButton> -->
      <VaButton icon="download" @click="createPDF"> download </VaButton>
    </div>
    <!-- :filter-method="" -->
    <VaDataTable :items="speciesItems" :columns="columns" :filter="filter"></VaDataTable>

    <!-- <VaAlert class="!mt-6" color="info" outline>
    Number of filtered items:
    <VaChip>{{ filteredCount }}</VaChip>
  </VaAlert> -->
  </VaCard>
</template>

<script lang="ts">
import { mapActions } from 'pinia'
import { useQuotaStore } from '../../../stores/quota-store'
import { ref } from 'vue'
import { useToast } from 'vuestic-ui'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

pdfMake.vfs = pdfFonts.pdfMake.vfs

export default {
  setup() {
    const columns = [
      { key: 'id', sortable: true },
      { key: 'area', sortable: true },
      { key: 'name', sortable: true },
      { key: 'scientific_name', sortable: true },
      { key: 'no_of_species', sortable: true },
      // { key: 'provision_sales', sortable: true },
      // { key: 'confirmed', sortable: true },
      // { key: 'canceled', sortable: true },
      // { key: 'taken', sortable: true },
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
      areasOptions: [] as any,
      yearOptions: [] as any,
      speciesOptions: [] as any,
      init,
      logo,
      selectQuota,
      with: 12,
      height: 100,
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
        const response = await this.getAllSpeciesPerQuotaPerArea(this.quota, this.area, this.species)
        this.speciesItems = response.data.map((item: any) => {
          return {
            id: item.id,
            area: item.area.name,
            name: item.species.name,
            scientific_name: item.species.scientific_name,
            no_of_species: item.quantity,
            // provision_sales: 'No', // New column
            // confirmed: 'Yes', // New column
            // canceled: 'No', // New column
            // taken: 'No', // New column
          }
        })
      } catch (error) {
        console.log(error)
      }
    },

    async getQuota() {
      try {
        const response = await this.getQuotas(null)

        // current select quota

        const currentQuota = response.data[0]

        this.quota = currentQuota.id

        this.yearOptions = response.data.map((item: any) => {
          // current select quota

          const result = this.generateQuotaYear(item.start_date, item.end_date)

          return {
            value: item.id,
            text: `${result} - ${item.name}`,
            name: item.name,
          }
        })
      } catch (error) {
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

    createPDF() {
      const data = this.speciesItems
      if (data.length === 0) {
        this.init({ message: 'No data to print', color: 'warning' })
        return
      }

      const logoUrl = this.logo

      const convertImageToBase64 = (url: any) => {
        return new Promise((resolve, reject) => {
          const img = new Image()
          img.crossOrigin = 'Anonymous'
          img.onload = function () {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const self: any = this
            const canvas = document.createElement('canvas')
            canvas.width = self.width
            canvas.height = self.height
            const ctx: any = canvas.getContext('2d')
            ctx.drawImage(this, 0, 0)
            const dataURL = canvas.toDataURL('image/png')
            resolve(dataURL)
          }
          img.onerror = reject
          img.src = url
        })
      }

      convertImageToBase64(logoUrl)
        .then((base64Image) => {
          const docDefinition: any = {
            content: [
              {
                image: base64Image,
                width: 100,
                alignment: 'center',
                margin: [0, 0, 0, 20],
              },
              { text: `Quata Report for ${this.quota.text}`, style: 'header' },
              {
                table: {
                  headerRows: 1,
                  widths: ['auto', '*', '*', 'auto'],
                  body: [
                    [
                      { text: 'ID', bold: true },
                      { text: 'Name', bold: true },
                      { text: 'Scientific Name', bold: true },
                      { text: 'No. of Species', bold: true },
                    ],
                    ...data.map((item: any) => [
                      item.id,
                      item.name,
                      item.scientific_name,
                      item.no_of_species || 0, // Default to 0 if invalid
                      // item.provision_sales,
                      // item.confirmed,
                      // item.canceled,
                      // item.taken,
                    ]),
                  ],
                },
              },
            ],
            styles: {
              header: {
                fontSize: 18,
                bold: true,
                marginBottom: 10,
              },
            },
          }

          pdfMake.createPdf(docDefinition).download('species-list.pdf')
        })
        .catch((error) => {
          console.error('Error converting logo to Base64:', error)
        })
    },
  },
}
</script>

<style scoped>
/* Add your styles here if needed */
</style>
