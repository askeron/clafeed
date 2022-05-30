<script setup>
defineProps({
  hash: {
    type: String,
    required: true
  }
})
</script>

<template>
  <img class="gravata-rund" :src="'https://www.gravatar.com/avatar/'+hash+'?d=wavatar&s=80'" width="40" height="40"/>
</template>
