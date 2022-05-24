<script setup>
import { RouterLink, RouterView } from 'vue-router'
import TheTeacherMainTabs from '@/components/TheTeacherMainTabs.vue'
</script>

<template>
  <div class="about">
    <TheTeacherMainTabs :activeIndex="1"/>
    <h1>This is the teacher room create</h1>
  </div>
</template>

<style>
</style>
