<template>
  <VaInnerLoading :loading="loadingSales">
    <VaForm ref="iformRef">
      <h3 class="font-bold text-lg mb-2">Sales Confirmation</h3>
      <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
        <VaSelect
          v-model="form.proposal"
          :options="proposalOptions"
          :rules="[(value: any) => value || 'Sales is required']"
          placeholder="Select confirmation "
          label="Choose sales confirmation"
          @update:modelValue="onValueChange"
        />
      </div>
      <h3 class="font-bold text-lg mb-2">Contract Details</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <!-- arrival -->
        <VaDateInput
          v-model="form.start_date"
          placeholder="Choose start date"
          :rules="[(value: any) => value || 'Start date is required']"
          label="Start Date"
        />
        <VaDateInput
          v-model="form.end_date"
          placeholder="Choose charter in date"
          :rules="[(value: any) => value || 'Arrival Date is required']"
          label="Charter In Date"
        />
      </div>
      <!-- description -->
      <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
        <VaTextarea
          v-model="form.description"
          max-length="125"
          label="Short text about something"
          counter
          required-mark
          :rules="[(v: any) => (v && v.length > 0) || 'Required', (v: any) => v && v.length < 125]"
        />
      </div>

      <div class="flex justify-end">
        <VaButton :disabled="!isValidForm" @click="validateForm() && onSubmit()"> Submit</VaButton>
      </div>
    </VaForm>
  </VaInnerLoading>
</template>

<script lang="ts">
import { useForm, useToast } from 'vuestic-ui'
import { defineComponent, ref, reactive } from 'vue'
import { useSalesInquiriesStore } from '../../../../stores/sales-store'
import { mapActions } from 'pinia'
import { useContractsStore } from '../../../../stores/contracts-store'
import handleErrors from '../../../../utils/errorHandler'

export default defineComponent({
  setup() {
    const { init } = useToast()

    const iformRef = ref(null as any)
    const {
      isValid: isValidForm,
      validate: validateForm,
      resetValidation: resetValidationForm,
      reset: resetForm,
    } = useForm(iformRef)

    const isNotUpBookingSelected = ref(true)

    const onInputChange = (event: any) => {
      console.log(event)
      if (event.value == 'prior' || event.value == 'after') {
        isNotUpBookingSelected.value = false
      }
    }

    const form = reactive({
      proposal: null as any,
      start_date: null as any,
      end_date: null as any,
      description: '',
    })

    return {
      iformRef,
      isValidForm,
      validateForm,
      resetValidationForm,
      resetForm,
      form,
      init,
      onInputChange,
      isNotUpBookingSelected,
    }
  },

  data() {
    const packages = [] as any
    return {
      packages,
      installments: [] as any,
      regulatoryPackages: [] as any,
      proposalOptions: [] as any,
      loadingSales: false,
      salesItem: null as any,
    }
  },
  computed: {},

  mounted() {
    this.getSalesProposalOptions()
  },

  methods: {
    ...mapActions(useContractsStore, ['createContract']),
    ...mapActions(useSalesInquiriesStore, ['getallSalesConfirmation']),
    onValueChange(value: any) {
      console.log(value)
      this.salesItem = value.selfitem
    },
    async onSubmit() {
      const data = {
        sales_confirmation_proposal_id: this.form.proposal.value,
        entity_id: this?.salesItem?.sales_inquiry?.entity.id,
        start_date: this.form.start_date,
        end_date: this.form.end_date,
        description: this.form.description,
      }
      console.log(data)
      try {
        const response: any = await this.createContract(data)
        if (response.status === 201) {
          this.init({ message: 'Contract created successfully', color: 'success' })
        }
      } catch (error: any) {
        const errors = handleErrors(error.response)
        this.init({
          message: '\n' + errors.map((error, index) => `${index + 1}. ${error}`).join('\n'),
          color: 'danger',
        })
      }
    },

    async getSalesProposalOptions() {
      this.loadingSales = true
      const response: any = await this.getallSalesConfirmation()
      if (response.status === 200) {
        this.loadingSales = false
        this.proposalOptions = response.data.map((item: any) => {
          // Corrected: added arrow function
          //   this.salesItem = item.selfitem
          return {
            text: `sales confirmation for ${item.sales_inquiry.entity.full_name}`,
            value: item.id,
          }
        })
      } else {
        this.loadingSales = false // Handle case when response status is not 200
      }
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
