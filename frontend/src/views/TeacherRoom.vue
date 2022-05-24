<script setup>
import { ref, computed } from "vue"
import { RouterLink, useRoute } from 'vue-router'
import HashAvatarImg from '@/components/HashAvatarImg.vue'

const route = useRoute()
const roomId = computed(() => route.params.roomId)
</script>

<template>
  <div>
    <RouterLink to="/teacher">zurück</RouterLink>
    <p>
      Raum: {{ roomId.substring(0,4) }} <HashAvatarImg :hash="roomId"/>
    </p>
  </div>
</template>

<style>
</style>
