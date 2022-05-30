<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue"
import { RouterLink, useRoute } from 'vue-router'
import HashAvatarImg from '@/components/HashAvatarImg.vue'
import TabsWithSlots from '@/components/TabsWithSlots.vue'
import DropdownWithSlots from '@/components/DropdownWithSlots.vue'
import { usePupilStore } from '@/stores/pupil'
import { useDateNow } from '@/composables/useDateNow'
import { getSecondsLeftString } from '@/utils/common'

const pupilStore = usePupilStore()

const route = useRoute()
const roomId = computed(() => route.params.roomId)
const room = computed(() => pupilStore.getRoomById(roomId.value))
const dateNow = useDateNow()

onMounted(() => {
  //useUpdateRoomFromStore(roomId.value)
})

</script>

<template>
  <div>
      <div class="row bg-primary bg-gradient">
        <div class="col-2">
          <RouterLink to="/">
            <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" fill="white" class="bi bi-arrow-left-square" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm11.5 5.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
            </svg>
          </RouterLink>
        </div>
        <div class="col-2">
          <div><HashAvatarImg :hash="roomId"/></div>
        </div>
        <div class="col-8 text-white">
          <div class="row">
            <h5>{{ room.name }} </h5>
          </div>
          <div class="row text-end ">
            <h5>{{ roomId.substring(0,4) }}</h5>
          </div>
          
        </div>
      </div>
    
    <DropdownWithSlots :displayNames="['Inaktiv','Quiz','Interaktion']">
      <template v-slot:content1>
        <div>
          <div class="row">
            <div class="col-1">
            </div>
            <div class="col-10 text-center">
              <h1><span class="badge bg-secondary bg-gradient shadow">Modus: Inaktiv</span></h1>
            </div>
            <div class="col-1"> 
            </div>
          </div>
          <div class="row">
            <div class="col-1">
            </div>
            <div class="col-10 text-center">
              <div class="shadow p-3 mb-5 bg-light rounded">aktuell gibt es keine Aktivität</div>
            </div>
            <div class="col-1"> 
            </div>
          </div>
        </div>
      </template>
      <template v-slot:content2>
        <div>
          <div class="row">
            <div class="col-1">
            </div>
            <div class="col-10 text-center">
              <h1><span class="badge bg-secondary bg-gradient shadow">Modus: Quiz</span></h1>
            </div>
            <div class="col-1"> 
            </div>
          </div>
          <DropdownWithSlots :displayNames="['Screen1','Screen2','Screen3','Screen4']">
            <template v-slot:content1>
              <div>
                <h2>TODO: Screen1</h2>
              </div>
            </template>
            <template v-slot:content2>
              <div>
                <h2>TODO: Screen2</h2>
              </div>
            </template>
            <template v-slot:content3>
              <div>
                <h2>TODO: Screen3</h2>
              </div>
            </template>
            <template v-slot:content4>
              <div>
                <h2>TODO: Screen4</h2>
              </div>
            </template>
          </DropdownWithSlots>
        </div>
      </template>
      <template v-slot:content3>
        <div>
          <div class="row">
            <div class="col-1">
            </div>
            <div class="col-10 text-center">
              <h1><span class="badge bg-secondary bg-gradient shadow">Modus: Interaktion</span></h1>
            </div>
            <div class="col-1"> 
            </div>
          </div>
          <DropdownWithSlots :displayNames="['Screen1','Screen2','Screen3']">
            <template v-slot:content1>
              <div>
                <h2>TODO: Screen1</h2>
              </div>
            </template>
            <template v-slot:content2>
              <div>
                <h2>TODO: Screen2</h2>
              </div>
            </template>
            <template v-slot:content3>
              <div>
                <h2>TODO: Screen3</h2>
              </div>
            </template>
          </DropdownWithSlots>
        </div>
      </template>
    </DropdownWithSlots>
  </div>
</template>

<style>
</style>
