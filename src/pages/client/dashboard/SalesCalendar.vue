<template>
  <Calendar />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Calendar from './components/Calendar.vue'
export default defineComponent({
  name: 'SalesCalendar',
  components: {
    Calendar,
  },
})
</script>
