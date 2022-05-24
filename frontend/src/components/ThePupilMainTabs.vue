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
    <RouterLink to="/" :class="{ active: activeIndex === 0 }">Meine Räume</RouterLink> | 
    <RouterLink to="/join" :class="{ active: activeIndex === 1 }">beitretten</RouterLink>
  </div>
</template>

<style scoped>
.active {
  font-weight: bold;
}
</style>
