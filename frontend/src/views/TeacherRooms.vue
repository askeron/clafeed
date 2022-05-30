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
      <li v-for="room in sortedRooms" :key="room.id" class="">
        <RouterLink :to="'/teacher/room/'+room.id"><HashAvatarImg :hash="room.id"/> {{room.name}}</RouterLink>
        &nbsp;
        <span class="btn-group">
          <button v-if="room.currentlyOpen" @click.prevent="useCloseRoom(room.id)" class="btn btn-outline-primary">offen</button>
          <button v-else @click.prevent="useOpenRoom(room.id)" class="btn btn-outline-primary">geschlossen</button>
          <button @click.prevent="renameRoom(room.id, room.name)" class="btn btn-outline-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
            </svg>
          </button>
          <button @click.prevent="deleteRoom(room.id, room.name)" class="btn btn-outline-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
              <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
          </button>
        </span>
      </li>
    </transition-group>
    <br/>
    <p>
      <button @click.prevent="createNewRoom()" class="btn btn-primary">neuen Raum anlegen</button>
    </p>
  </div>
</template>

<style scoped>
.flip-list-move {
  transition: transform 1s;
}
</style>
