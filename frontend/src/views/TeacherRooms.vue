<script setup>
import { reactive, watch, computed } from "vue"
import { RouterLink, RouterView } from 'vue-router'
import HashAvatarImg from '@/components/HashAvatarImg.vue'
import { useTeacherStore } from '@/stores/teacher'

const teacherStore = useTeacherStore()

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
    teacherStore.addRoom({
      id,
      secret,
      name: result.name,
    })
  }
}

const deleteRoom = (id, name) => {
  if (confirm(`Den Raum "${name}" wirklich löschen?`)) {
    teacherStore.deleteRoom(id)
  }
}
</script>

<template>
  <div>
    <p>
      Lehrer-Räume:
    </p>
    <ul>
      <li v-for="room in teacherStore.rooms" :key="room.id">
        <RouterLink :to="'/teacher/room/'+room.id"><HashAvatarImg :hash="room.id"/> {{room.name}} - {{ false ? "offen" : "geschlossen" }}</RouterLink>
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
