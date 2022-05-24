<script setup>
import { ref, computed } from "vue"
import { RouterLink, useRoute } from 'vue-router'
import HashAvatarImg from '@/components/HashAvatarImg.vue'

const route = useRoute()
const roomId = computed(() => route.params.roomId)

const createNewRoom = async () => {
  const response = await fetch('http://localhost:8080/api/v1/owner/createNewRoom', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', 
    },
//    body: JSON.stringify({
//      name: this.enteredName,
//      rating: this.chosenRating,
//    }),
  })
  if (response.ok) {
    const result = await response.json()
    const { id, secret } = result
    rooms.value.push({
      id,
      secret,
      name: result.name,
      currentlyOpen: false,
      inviteCodes: [],
    })
  }
}
</script>

<template>
  <div>
    <RouterLink to="/teacher">zurück</RouterLink>
    <HashAvatarImg :hash="roomId"/>
    <p>
      Raum: {{ roomId.substring(0,8) }}
    </p>
  </div>
</template>

<style>
</style>
