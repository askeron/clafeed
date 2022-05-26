<script setup>
import { reactive, watch, computed } from "vue"
import { RouterLink, RouterView } from 'vue-router'
import HashAvatarImg from '@/components/HashAvatarImg.vue'
import { useCreateRoom, useDeleteRoom } from '@/composables/teacherServer'
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
  useCreateRoom(name)
}

const deleteRoom = ({id, secret, name}) => {
  if (confirm(`Den Raum "${name}" wirklich löschen?`)) {
    useDeleteRoom({id, secret})
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
        - <a @click.prevent="deleteRoom(room)">löschen</a>
      </li>
    </ul>
    <p>
      <button @click.prevent="createNewRoom()">neuen Raum anlegen</button>
    </p>
  </div>
</template>

<style>
</style>
