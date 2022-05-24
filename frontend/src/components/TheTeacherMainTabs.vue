<script setup>
import { RouterLink } from 'vue-router'

const props = defineProps({
  activeIndex: {
    type: Number,
  },
})
//const { activeIndex } = toRef(props)
//console.log(activeIndex)
</script>

<template>
  <div class="tabs">
    <RouterLink to="/teacher" :class="{ active: activeIndex === 0 }">Meine Räume</RouterLink> | 
    <RouterLink to="/teacher/create" :class="{ active: activeIndex === 1 }">anlegen</RouterLink>
  </div>
</template>

<style scoped>
.active {
  font-weight: bold;
}
</style>
