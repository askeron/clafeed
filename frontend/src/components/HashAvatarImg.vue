<script setup>
defineProps({
  hash: {
    type: String,
    required: true
  }
})
</script>

<template>
  <img class="gravatar-rounded" :src="'https://www.gravatar.com/avatar/'+hash+'?d=wavatar&s=80'" width="50" height="50"/>
</template>
