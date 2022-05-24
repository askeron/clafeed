<script setup>
import { RouterLink, RouterView } from 'vue-router'
import ThePupilMainTabs from '@/components/ThePupilMainTabs.vue'
</script>

<template>
  <div class="about">
    <ThePupilMainTabs :activeIndex="0"/>
    <h1>This is the pupil room overview</h1>
  </div>
</template>

<style>
</style>
