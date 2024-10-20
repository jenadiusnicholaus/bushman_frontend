<template>
  <RouterView />
</template>
<script lang="ts">
import { mapActions } from 'pinia'
import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import { useSettingsStore } from './stores/settings-store'

export default defineComponent({
  name: 'App',

  components: {
    RouterView,
  },
  computed: {},
  mounted() {
    this.loadLogo()
  },
  methods: {
    ...mapActions(useSettingsStore, ['loadLogo']),
  },
})
</script>

<style lang="scss">
#app {
  font-family: 'Inter', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  min-width: 20rem;
}
</style>
