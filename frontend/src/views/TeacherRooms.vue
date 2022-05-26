<script setup>
import { reactive, watch, computed } from "vue"
import { RouterLink, RouterView } from 'vue-router'
import HashAvatarImg from '@/components/HashAvatarImg.vue'
import { useCreateRoom, useDeleteRoom, useRenameRoom, useOpenRoom, useCloseRoom } from '@/composables/teacherServer'
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

const deleteRoom = (id) => {
  if (confirm(`Den Raum "${name}" wirklich löschen?`)) {
    useDeleteRoom(id)
  }
}

const renameRoom = (id) => {
  const name = prompt("Wie soll der Raum heißen", "Deutsch 7a bei Herrn Mustermann")
  if (!name || name.length == 0) {
    return
  }
  if (name.length > 200) {
    alert("Der Raumname darf maximal 200 Zeichen enthalten.")
    return
  }
  useRenameRoom({id, name})
}

</script>

<template>
  <div>
    <p>
      Lehrer-Räume:
    </p>
    <ul>
      <li v-for="room in teacherStore.rooms" :key="room.id">
        <RouterLink :to="'/teacher/room/'+room.id"><HashAvatarImg :hash="room.id"/> {{room.name}}</RouterLink>
        <span v-if="room.currentlyOpen">
          - <a @click.prevent="useCloseRoom(room.id)">offen</a>
        </span>
        <span v-else>
          - <a @click.prevent="useOpenRoom(room.id)">geschlossen</a>
        </span>
        - <a @click.prevent="renameRoom(room.id)">umbenennen</a>
        - <a @click.prevent="deleteRoom(room.id)">löschen</a>
      </li>
    </ul>
    <p>
      <button @click.prevent="createNewRoom()">neuen Raum anlegen</button>
    </p>
  </div>
</template>

<style>
</style>
