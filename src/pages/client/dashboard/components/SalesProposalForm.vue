<template>
  <VaForm ref="iformRef">
    <h3 class="font-bold text-lg mb-2">Package Details</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <VaSelect
        v-model="form.package_id"
        :options="packages"
        :rules="[(value: any) => value || 'Package is required']"
        placeholder="Select Package"
        label="Package"
      />
    </div>
    <h3 class="font-bold text-lg mb-2">Itinerary Details</h3>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <VaInput
        v-model="form.airport_name"
        type="text"
        placeholder=" Enter Airport Name"
        :rules="[(value: any) => (value && value.length > 0) || ' Airport Name is required']"
        label="Airport Name"
      />

      <!-- arrival -->
      <VaDateInput
        v-model="form.arrival"
        placeholder="Select Arrival Date"
        :rules="[(value: any) => value || 'Arrival Date is required']"
        label="Arrival Date"
      />
      <VaDateInput
        v-model="form.charter_in"
        placeholder="Choose charter in date"
        :rules="[(value: any) => value || 'Arrival Date is required']"
        label="Charter In Date"
      />
      <VaDateInput
        v-model="form.charter_out"
        placeholder="Choose charter out date"
        :rules="[(value: any) => value || 'Arrival Date is required']"
        label="Charter Out Date"
      />
    </div>

    <h3 class="font-bold text-lg mb-2">Create Client Installment plan</h3>
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
      <VaInput
        v-model="form.installment_desc"
        type="text"
        placeholder="Description"
        :rules="[(value: any) => (value && value.length > 0) || ' Installment Description is required']"
      />
      <VaInput
        v-model="form.installment_due_amount"
        type="number"
        placeholder="Amount"
        :rules="[(value: any) => (value && value > 0) || ' Installment Amount is required']"
      />
      <!-- days  -->

      <!-- limit -->
      <VaSelect
        v-model="form.installment_due_limit"
        :options="[
          // up on Booking
          { value: 'none', text: '25% Upon Booking' },
          { value: 'prior', text: `days Prior ` },
          { value: 'after', text: `days After ` },
        ]"
        :rules="[(value: any) => value || 'Due Limit is required']"
        placeholder="Select Due Limit"
        @update:modelValue="onInputChange"
      />

      <VaInput
        v-model="form.installment_due_days"
        type="number"
        :disabled="isNotUpBookingSelected"
        placeholder="Days"
      />

      <VaButton icon="add" @click="createInstallmentList()"> </VaButton>
    </div>

    <div v-if="installments.length > 0" class="mb-4">
      <h3 class="font-bold text-lg mb-2">Installment Plans</h3>
      <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
        <div class="flex items-center">
          <div class="va-table-responsive">
            <table class="va-table va-table--striped">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Days</th>
                  <th>Deposit Limit</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="i in installments" :key="i.id">
                  <td>{{ i.description }}</td>
                  <td>{{ i.amount }}</td>
                  <td>{{ i.days }}</td>
                  <td>{{ i.text }}</td>
                  <td><VaButton plain icon="delete" @click="deleteInstallment(i.id)"> </VaButton></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-end">
      <VaButton :disabled="!isValidForm" @click="validateForm() && onSubmit()"> Submit</VaButton>
    </div>
  </VaForm>
</template>

<script lang="ts">
import { useForm, useToast } from 'vuestic-ui'
import { defineComponent, ref, reactive } from 'vue'
import { mapActions } from 'pinia'
import { useSalesInquiriesStore } from '../../../../stores/sales-store'
import { usePriceListStore } from '../../../../stores/price-list-store'
import handleErrors from '../../../../utils/errorHandler'

export default defineComponent({
  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  // "installments": [
  //       {
  //           "sales_confirmation_proposal": 1,
  //           "description": "First installment payment",
  //           "amount": 100.00,
  //           "days": 30,
  //           "due_limit": "2023-10-15"
  //       },
  //       {
  //           "sales_confirmation_proposal": 1,
  //           "description": "Second installment payment",
  //           "amount": 150.00,
  //           "days": 60,
  //           "due_limit": "prior"
  //       },
  //       {
  //           "description": "Third installment payment",
  //           "amount": 200.00,
  //           "days": 90,
  //           "due_limit": "prior"
  //       }
  //   ]

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
      package_id: null as any,
      airport_name: null as any,
      charter_in: null as any,
      charter_out: null as any,
      arrival: null as any,
      installment_desc: null as any,
      installment_due_amount: null as any,
      installment_due_days: 0,
      installment_due_limit: null as any,
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
    }
  },

  mounted() {
    this.getPL()
  },

  methods: {
    ...mapActions(useSalesInquiriesStore, ['createSalesConfirmationFinalization']),
    ...mapActions(usePriceListStore, ['getPriceList']),

    async getPL() {
      const response = await this.getPriceList()

      if (response.status === 200) {
        this.packages = response.data.map((item: any) => ({
          value: item.sales_package.id,
          text: item?.sales_package.name,
        }))
      } else {
        console.log('Error getting price list')
      }
    },

    createInstallmentList() {
      if (this.form.installment_desc && this.form.installment_due_amount) {
        this.installments.push({
          description: this.form.installment_desc,
          amount: this.form.installment_due_amount,
          days: this.form.installment_due_days,
          due_limit: this.form.installment_due_limit.value,
          text: this.form.installment_due_limit.text,
        })
      } else {
        this.init({ message: 'Add at least one installment plan', color: 'warning' })
      }
    },

    deleteInstallment(index: number) {
      this.installments.splice(index, 1)
    },

    async onSubmit() {
      const requestDate = {
        charterIn: this.form.charter_in,
        charterOut: this.form.charter_out,
        arrival: this.form.arrival,
        airportName: this.form.airport_name,
        packageId: this.form.package_id.value,
        salesInquiryId: this.item.id,
        installments: this.installments,
      }

      try {
        const response = await this.createSalesConfirmationFinalization(requestDate)

        if (response.status === 201) {
          this.init({ message: response.data.message, color: 'success' })
          this.resetForm()
          this.resetValidationForm()
          this.installments = []
        } else {
          this.init({ message: response.data.message, color: 'error' })
        }
      } catch (error: any) {
        this.resetForm()
        this.resetValidationForm()
        this.installments = []
        const errors = handleErrors(error.response)
        this.init({
          message: '\n' + errors.map((error, index) => `${index + 1}. ${error}`).join('\n'),
          color: 'danger',
        })
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
