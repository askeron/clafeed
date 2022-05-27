<script setup>
import { ref, reactive, watch, computed } from "vue"
import { RouterLink, RouterView } from 'vue-router'
import HashAvatarImg from '@/components/HashAvatarImg.vue'
import { useCreateRoom, useDeleteRoom, useRenameRoom, useOpenRoom, useCloseRoom } from '@/composables/teacherServer'
import { useTeacherStore } from '@/stores/teacher'
import { getArraySortedBy } from '@/utils/common'
import { notify } from "@kyvg/vue3-notification";

const teacherStore = useTeacherStore()

const sortOrderAlphabetical = ref(true)
const sortedRooms = computed(() => sortOrderAlphabetical.value ? getArraySortedBy(teacherStore.rooms, x => x.name.toLowerCase()) : teacherStore.rooms)

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

const deleteRoom = (id, name) => {
  if (confirm(`Den Raum "${name}" wirklich löschen?`)) {
    useDeleteRoom(id)
    notify({
      title: "Raum gelöscht",
      text: `Der Raum "${name}" wurde gelöscht.`,
    })
  }
  
}

const renameRoom = (id, oldName) => {
  const name = prompt("Wie soll der Raum heißen", oldName)
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
    <p>
      <button @click.prevent="sortOrderAlphabetical = !sortOrderAlphabetical" class="btn btn-primary" type="button">
          <span class="d-flex justify-content-center" v-if="sortOrderAlphabetical">
              <svg id="sortUp" width="6px" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sort-up" class="svg-inline--fa fa-sort-up fa-w-10" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M279 224H41c-21.4 0-32.1-25.9-17-41L143 64c9.4-9.4 24.6-9.4 33.9 0l119 119c15.2 15.1 4.5 41-16.9 41z"></path></svg>
              sortiert nach Name
          </span>
          <span v-else>
              <svg id="sortDown" width="6px" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sort-down" class="svg-inline--fa fa-sort-down fa-w-10" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41z"></path></svg>
              sortiert nach Erstelldatum
          </span>
      </button>
    </p>
    <br/>
    <transition-group name="flip-list" tag="ul">
      <li v-for="room in sortedRooms" :key="room.id">
        <RouterLink :to="'/teacher/room/'+room.id"><HashAvatarImg :hash="room.id"/> {{room.name}}</RouterLink>
        <span v-if="room.currentlyOpen">
          - <a href="#" @click.prevent="useCloseRoom(room.id)">offen</a>
        </span>
        <span v-else>
          - <a href="#" @click.prevent="useOpenRoom(room.id)">geschlossen</a>
        </span>
        - <a href="#" @click.prevent="renameRoom(room.id, room.name)">umbenennen</a>
        - <a href="#" @click.prevent="deleteRoom(room.id, room.name)">löschen</a>
      </li>
    </transition-group>
    <br/>
    <p>
      <button @click.prevent="createNewRoom()">neuen Raum anlegen</button>
    </p>
  </div>
</template>

<style scoped>
.flip-list-move {
  transition: transform 1s;
}
</style>
