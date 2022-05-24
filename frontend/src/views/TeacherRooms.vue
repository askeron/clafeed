<script setup>
import { reactive, watch, computed } from "vue"
import { RouterLink, RouterView } from 'vue-router'
import HashAvatarImg from '@/components/HashAvatarImg.vue'

const rooms = reactive(JSON.parse(localStorage.getItem('teacher-rooms-v1') ?? "[]"))
watch(rooms, (currentValue, oldValue) => {
  localStorage.setItem('teacher-rooms-v1', JSON.stringify(currentValue))
})

const createNewRoom = async () => {
  const name = prompt("Wie soll der Raum heißen", "Deutsch 7a bei Herrn Mustermann")
  if (!name || name.length == 0) {
    return
  }
  if (name.length > 200) {
    alert("Der Raumname darf maximal 200 Zeichen enthalten.")
    return
  }
  const response = await fetch('http://localhost:8080/api/v1/owner/createNewRoom', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify({
      name,
    }),
  })
  if (response.ok) {
    const result = await response.json()
    const { id, secret } = result
    rooms.push({
      id,
      secret,
      name: result.name,
      currentlyOpen: false,
      inviteCodes: [],
    })
  }
}

const deleteRoom = (id, name) => {
  if (confirm(`Den Raum "${name}" wirklich löschen?`)) {
    deleteItemFromArray(rooms, (x) => x.id === id)
  }
}

const deleteItemFromArray = (array, predicate) => {
  for(let i = 0; i < array.length; i++){ 
    if (predicate(array[i])) { 
      array.splice(i, 1); 
      i--;
    }
  }
}
</script>

<template>
  <div class="about">
    <p>
      Lehrer-Räume:
    </p>
    <ul>
      <li v-for="room in rooms" :key="room.id">
        <RouterLink :to="'/teacher/room/'+room.id"><HashAvatarImg :hash="room.id"/> {{room.name}} - {{ room.currentlyOpen ? "offen" : "geschlossen" }}</RouterLink>
        - <a @click.prevent="deleteRoom(room.id, room.name)">löschen</a>
      </li>
    </ul>
    <p>
      <button @click.prevent="createNewRoom()">neuen Raum anlegen</button>
    </p>
  </div>
</template>

<style>
</style>
