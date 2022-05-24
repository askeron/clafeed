<script setup>
import { ref, computed } from "vue"
import { RouterLink, RouterView } from 'vue-router'
import TheTeacherMainTabs from '@/components/TheTeacherMainTabs.vue'
import HashAvatarImg from '@/components/HashAvatarImg.vue'
const rooms = ref([])

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

//    openRoom(room) {
//      this.globalRoom.room = room
//      this.setMainView("TheTeacherRoom")
//    },

}
</script>

<template>
  <div class="about">
    <TheTeacherMainTabs :activeIndex="0"/>
    <p>
      Lehrer-Räume:
    </p>
    <ul>
      <li v-for="room in rooms" :key="room.id">
        <RouterLink :to="'/teacher/room/'+room.id"><HashAvatarImg :hash="room.id"/> {{room.name}} - {{ room.currentlyOpen ? "offen" : "geschlossen" }}</RouterLink>
      </li>
    </ul>
    <p>
      <button @click.prevent="createNewRoom()">neuen Raum anlegen</button>
    </p>
  </div>
</template>

<style>
</style>
