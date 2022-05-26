<script setup>
import { ref, computed } from "vue"
const activeIndex = ref(0)

const props = defineProps({
  displayNames: {
    type: Array,
  },
})

const onChange = (event) => {
  activeIndex.value = parseInt(event.target.value)
}

</script>

<template>
  <div>
    <div>
      <select @change="onChange($event)">
        <option v-for="(displayName, index) in displayNames" :key="index" :value="index">{{ displayName }}</option>
      </select>
    </div>
    <div v-if="activeIndex === 0">
      <slot name="content1"/>
    </div>
    <div v-if="activeIndex === 1">
      <slot name="content2"/>
    </div>
    <div v-if="activeIndex === 2">
      <slot name="content3"/>
    </div>
    <div v-if="activeIndex === 3">
      <slot name="content4"/>
    </div>
    <div v-if="activeIndex === 4">
      <slot name="content5"/>
    </div>
    <div v-if="activeIndex === 5">
      <slot name="content6"/>
    </div>
    <div v-if="activeIndex === 6">
      <slot name="content7"/>
    </div>
    <div v-if="activeIndex === 7">
      <slot name="content8"/>
    </div>
  </div>
</template>

<style scoped>
.active {
  font-weight: bold;
}
</style>
