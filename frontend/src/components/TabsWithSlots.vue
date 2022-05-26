<script setup>
import { ref, toRefs, computed } from "vue"
const activeIndex = ref(0)

const props = defineProps({
  displayNames: {
    type: Array,
  },
})
const { displayNames } = toRefs(props)

const count = computed(() => displayNames.value.length)

</script>

<template>
  <div>
    <div class="tabs">
      <a :class="{ active: activeIndex === 0 }" @click.prevent="activeIndex = 0">{{ displayNames[0] }}</a>
      <span v-if="count > 1"> | <a :class="{ active: activeIndex === 1 }" @click.prevent="activeIndex = 1">{{ displayNames[1] }}</a></span>
      <span v-if="count > 2"> | <a :class="{ active: activeIndex === 2 }" @click.prevent="activeIndex = 2">{{ displayNames[2] }}</a></span>
      <span v-if="count > 3"> | <a :class="{ active: activeIndex === 3 }" @click.prevent="activeIndex = 3">{{ displayNames[3] }}</a></span>
      <span v-if="count > 4"> | <a :class="{ active: activeIndex === 4 }" @click.prevent="activeIndex = 4">{{ displayNames[4] }}</a></span>
      <span v-if="count > 5"> | <a :class="{ active: activeIndex === 5 }" @click.prevent="activeIndex = 5">{{ displayNames[5] }}</a></span>
      <span v-if="count > 6"> | <a :class="{ active: activeIndex === 6 }" @click.prevent="activeIndex = 6">{{ displayNames[6] }}</a></span>
      <span v-if="count > 7"> | <a :class="{ active: activeIndex === 7 }" @click.prevent="activeIndex = 7">{{ displayNames[7] }}</a></span>
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
