<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { ref, reactive, watch, computed, onMounted } from "vue"
import HashAvatarImg from '@/components/HashAvatarImg.vue'
import ThePupilMainTabs from '@/components/ThePupilMainTabs.vue'
import { usePupilStore } from '@/stores/pupil'
import { getArraySortedBy, getArraySortedByDesc } from '@/utils/common'
import { notify } from "@kyvg/vue3-notification";

const pupilStore = usePupilStore()
const router = useRouter()

const sortOrderAlphabetical = ref(true)
const sortedRooms = computed(() => sortOrderAlphabetical.value ? getArraySortedBy(pupilStore.rooms, x => x.name.toLowerCase()) : getArraySortedByDesc(pupilStore.rooms, x => x.name.toLowerCase()))
const roomDisplayCount = ref(1)
const displayedRooms = computed(() => sortedRooms.value.slice(-roomDisplayCount.value))

const deleteRoom = (id, name) => {
  if (confirm(`Den Zugang zum Raum "${name}" wirklich löschen?`)) {
    pupilStore.removeRoom(id)
    notify({
      title: "Zugang zum Raum gelöscht",
      text: `Der Zugang zum Raum "${name}" wurde gelöscht.`,
    })
  }
}

const navigateToRoom = (roomId) => {
  router.push({
    name: 'pupilRoom',
    params: {
      roomId,
    }
  })
}

onMounted(() => {
  const interval = 500
  roomDisplayCount.value = 1
  setTimeout(() => {
    roomDisplayCount.value = 2
  }, 1 * interval)
  setTimeout(() => {
    roomDisplayCount.value = 3
  }, 2 * interval)
  setTimeout(() => {
    roomDisplayCount.value = 4
  }, 3 * interval)
  setTimeout(() => {
    roomDisplayCount.value = 5
  }, 4 * interval)
  setTimeout(() => {
    roomDisplayCount.value = 6
  }, 5 * interval)
  setTimeout(() => {
    roomDisplayCount.value = 7
  }, 6 * interval)
  setTimeout(() => {
    roomDisplayCount.value = 8
  }, 7 * interval)
  setTimeout(() => {
    roomDisplayCount.value = 9
  }, 8 * interval)
  setTimeout(() => {
    roomDisplayCount.value = 1000000
  }, 9 * interval)
})

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
                <span v-if="sortOrderAlphabetical">
                    sortiert nach Name (A-Z)
                </span>
                <span v-else>
                    sortiert nach Name (Z-A)
                </span>
            </button>
          </p>
          <br/>
          <transition-group name="flip-list" tag="div">
            <div v-for="room in displayedRooms" :key="room.id" class="shadow p-3 mb-5 bg-light rounded" :data-use-later-for-onclick="'/room/'+room.id" @click.prevent="navigateToRoom(room.id)">
              <div class="row">
                <div class="col-2">
                  <HashAvatarImg :hash="room.id"/>
                </div>
                <div class="col-8 text-center">
                  <h5>{{room.name}}</h5>
                </div>
                <div class="col-2"> 
                  <span class="btn-group">
                <button @click.prevent="deleteRoom(room.id, room.name); $event.stopPropagation()" class="btn btn-outline-dark">
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
  transition: transform 0.5s;
}
</style>
