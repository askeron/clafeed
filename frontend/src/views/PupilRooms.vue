<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { ref, reactive, watch, computed } from "vue"
import HashAvatarImg from '@/components/HashAvatarImg.vue'
import ThePupilMainTabs from '@/components/ThePupilMainTabs.vue'
import { useCreateRoom, useDeleteRoom, useRenameRoom, useOpenRoom, useCloseRoom } from '@/composables/teacherServer'
import { usePupilStore } from '@/stores/pupil'
import { getArraySortedBy } from '@/utils/common'
import { notify } from "@kyvg/vue3-notification";

const pupilStore = usePupilStore()
const router = useRouter()

const sortOrderAlphabetical = ref(true)
const sortedRooms = computed(() => sortOrderAlphabetical.value ? getArraySortedBy(pupilStore.rooms, x => x.name.toLowerCase()) : pupilStore.rooms)

const deleteRoom = (id, name) => {
  if (confirm(`Den Zugang zum Raum "${name}" wirklich löschen?`)) {
    useDeleteRoom(id)
    notify({
      title: "Zugang zum Raum gelöscht",
      text: `Der Zugang zum Raum "${name}" wurde gelöscht.`,
    })
  }
}

const navigateToRoom = (roomId) => {
  router.push({
    name: 'pupilRoom',
    query: {
      roomId,
    }
  })
}

</script>

<template>
  <div>
    <ThePupilMainTabs :activeIndex="0"/>
    <div class="row">
      <div class="col">
      </div>
      <div class="col-10 text-center">
        <h1><span class="badge bg-secondary bg-gradient shadow">Raumübersicht:</span></h1>
      </div>
      <div class="col"> 
      </div>
    </div>
    <div class="row">
      <div class="col">
      </div>
      <div class="col-10 text-center">
        <div v-if="sortedRooms.length == 0">
          <h4 class="text-white">Es gibt noch keine Räume, denen beigetreten wurde.</h4>
        </div>
        <div v-else>
          <p>
            <button @click.prevent="sortOrderAlphabetical = !sortOrderAlphabetical" class="btn btn-success" type="button">
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
          <transition-group name="flip-list" tag="div">
            <div v-for="room in sortedRooms" :key="room.id" class="shadow p-3 mb-5 bg-light rounded" :data-use-later-for-onclick="'/room/'+room.id" @click.prevent="navigateToRoom(room.id)">
              <div class="row">
                <div class="col-2">
                  <HashAvatarImg :hash="room.id"/>
                </div>
                <div class="col-8 text-center">
                  <h5>{{room.name}}</h5>
                </div>
                <div class="col-2"> 
                  <span class="btn-group">
                <button @click.prevent="deleteRoom(room.id, room.name)" class="btn btn-outline-dark">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                  </svg>
                </button>
              </span>
                </div>
              </div>
                
             
              
            </div>
          </transition-group>
        </div>
      </div>
      <div class="col"> 
      </div>
    </div>
  
    
    
  </div>
</template>

<style scoped>
.flip-list-move {
  transition: transform 1s;
}
</style>
