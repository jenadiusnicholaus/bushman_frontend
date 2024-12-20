<template>
  <template v-if="requistionItems.length > 0">
    <VaList>
      <VaListItem v-for="(item, index) in requistionItems" :key="index" class="list__item">
        <VaListItemSection>
          <VaListItemLabel>
            <b class="text-primary py-6">{{ item.item_name }}</b>
          </VaListItemLabel>

          <VaDataTable :items="item.items" :columns="columns" :loading="loadingRequistionItems"></VaDataTable>
        </VaListItemSection>

        <VaListItemSection icon>
          <VaIcon name="remove_red_eye" color="background-element" />
        </VaListItemSection>
      </VaListItem>
    </VaList>
  </template>
  <template v-else>
    <p class="text-center">No Requistion Items Found</p>
  </template>
</template>

<script lang="ts">
import { mapState } from 'pinia'
import { useRequisitionStore } from '../../../../stores/requistions-store'

export default {
  components: {},
  props: {
    showRequisitionDetails: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const columns = [
      { key: 'name', label: 'Name' },
      { key: 'quantity' },
      { key: 'actions', label: 'Actions', sortable: false },
    ]
    return {
      isStriped: true,
      isHoverable: true,
      columns,
    }
  },
  computed: {
    ...mapState(useRequisitionStore, ['requistionItems', 'loadingRequistionItems']),
  },
  beforeMount() {},
  methods: {
    gotBack() {
      this.$router.push('/client/game-dashboard/requistions')
    },

    setShowAddForm(showAddForm: boolean) {
      console.log(showAddForm)
      //   this.$store.commit('requistions/setShowAddForm', showAddForm)
    },
  },
}
</script>

<style lang="scss">
@import '@vuestic/ag-grid-theme';
</style>
