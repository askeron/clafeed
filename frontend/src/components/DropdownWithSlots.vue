<script setup>
import { ref, computed } from "vue"
const activeIndexString = ref("0")
const activeIndex = computed(() => parseInt(activeIndexString.value))

const props = defineProps({
  displayNames: {
    type: Array,
  },
  showRemoveButton: {
    type: Boolean,
  },
})

const showDropdown = ref(true)
const hideDropdown = () => {
  showDropdown.value = false
}

</script>

<template>
  <div>
    <div v-if="showDropdown">
      <select v-model="activeIndexString">
        <option v-for="(displayName, index) in displayNames" :key="index" :value="index">{{ displayName }}</option>
      </select>
      <button v-if="showRemoveButton" @click.prevent="hideDropdown()">remove dropdown</button>
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
