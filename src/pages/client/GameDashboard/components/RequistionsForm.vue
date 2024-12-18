<template>
  <VaForm ref="formRef">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <VaSelect
        v-model="form.approval_chain_module_id"
        :options="approvalChainModules"
        label="Approval Chain"
        :rules="[(v) => !!v || 'Approval Chain Module is required']"
      />
      <VaInput
        v-model="form.level_id"
        label="Point the starting approval level"
        type="number"
        :rules="[(v) => !!v || 'Level ID is required']"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <VaInput v-model="form.type" label="Type" />
      <VaDateInput v-model="form.date" label="Date" :rules="[(v: any) => !!v || 'Date is required']" />
      <VaDateInput
        v-model="form.required_date"
        label="Required Date"
        :rules="[(v: any) => !!v || 'Required Date is required']"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
      <VaTextarea
        v-model="form.remarks"
        label="Remarks"
        type="textarea"
        :rules="[(v) => !!v || 'Remarks is required']"
      />
    </div>

    <div class="mt-4 flex p-2">
      <VaButton :loading="saving" icon="save" class="mr-3 mb-2" :disabled="!isValidForm" @click="handleSubmit">
        Save
      </VaButton>
    </div>
  </VaForm>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia'
import { defineComponent, reactive, ref } from 'vue'
import { VaForm, VaInput, VaSelect, VaButton, VaTextarea, VaDateInput } from 'vuestic-ui'
import { useForm } from 'vuestic-ui'
import { useApprovalChainStore } from '../../../../stores/approval-store'

export default defineComponent({
  name: 'RequistionsForm',
  components: {
    VaForm,
    VaInput,
    VaSelect,
    VaButton,
    VaTextarea,
    VaDateInput,
  },
  setup() {
    const formRef = ref()
    const form = reactive({
      requested_by: null,
      approval_chain_module_id: null,
      level_id: null,
      type: '',
      date: null as any,
      required_date: null as any,
      remarks: '',
    })

    const {
      isValid: isValidForm,
      validate: validateForm,
      resetValidation: resetValidationForm,
      reset: resetForm,
    } = useForm(formRef)

    // Separate the submit logic into a function
    const handleSubmit = async () => {
      const isValid = await validateForm()
      if (isValid) {
        console.log('Requisition Form Submitted:', form)
        // Handle requisition form submission...
      } else {
        console.log('Form validation failed')
      }
    }

    return {
      formRef,
      form,
      handleSubmit, // Updated to use the handleSubmit function
      isValidForm,
      resetValidationForm,
      resetForm,
    }
  },
  data() {
    return {
      saving: false,
    }
  },
  computed: {
    ...mapState(useApprovalChainStore, ['approvalChainModules']),
  },
  mounted() {
    this.getRequisitionsApprovalChain(true)
  },

  methods: {
    ...mapActions(useApprovalChainStore, ['getRequisitionsApprovalChain']),
  },
})
</script>

<style scoped>
/* Add your custom styles here */
</style>
