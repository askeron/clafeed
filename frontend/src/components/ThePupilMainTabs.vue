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
  <header class="justify-content-center py-3">
    <ul class="nav nav-pills nav-fill">
    <li class="nav-item">
      <RouterLink to="/" :class="{ 'nav-link': true, active: activeIndex === 0 }">Meine Räume</RouterLink>
    </li>
    <li class="nav-item">
      <RouterLink to="/join" :class="{ 'nav-link': true, active: activeIndex === 1 }">Raum beitreten</RouterLink>
    </li>
    </ul>
  </header>
</template>

<style scoped>
.active {
  font-weight: bold;
}
</style>
