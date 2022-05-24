<script setup>
defineProps({
  hash: {
    type: String,
    required: true
  }
})
</script>

<template>
  <img :src="'https://www.gravatar.com/avatar/'+hash+'?d=wavatar&s=50'"/>
</template>
