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
      <div class="row bg-primary bg-gradient py-2 align-items-center shadow-sm">
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
          <div class="row">
            <h6>Room ID: {{ roomId.substring(0,4) }}</h6>
          </div>
          
        </div>
      </div>
    
    <DropdownWithSlots :displayNames="['Inaktiv','Quiz','Interaktion']">
      <template v-slot:content1>
        <div>
          <div class="row">
            <div class="col-1">
            </div>
            <div class="col-10 text-center py-4">
              <h1><span class="badge bg-modus-color bg-gradient shadow">Modus: Inaktiv</span></h1>
            </div>
            <div class="col-1"> 
            </div>
          </div>
          <div class="row">
            <div class="col-1">
            </div>
            <div class="col-10 text-center">
              <h4 class="shadow  p-3 mb-5 bg-btn4-color text-black rounded">aktuell gibt es keine Aktivität</h4>
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
            <div class="col-10 text-center py-3">
              <h1><span class="badge bg-modus-color bg-gradient shadow">Modus: Quiz</span></h1>
            </div>
            <div class="col-1"> 
            </div>
          </div>
          <DropdownWithSlots :displayNames="['Screen1','Screen2','Screen3','Screen4']">
            <template v-slot:content1>
              <div>
                <div class="row py-2" id="btn1">
                  <div class="col-1">
                  </div>
                  <div class="col-10 text-center">
                    <h4 class="p-3 bg-btn1-color text-white rounded shadow">A</h4>
                  </div>
                  <div class="col-1"> 
                  </div>
                </div>
                <div class="row py-2" id="btn2">
                  <div class="col-1">
                  </div>
                  <div class="col-10 text-center">
                    <h4 class="p-3 bg-btn2-color text-white rounded shadow">B</h4>
                  </div>
                  <div class="col-1"> 
                  </div>
                </div>
                <div class="row py-2" id="btn3">
                  <div class="col-1">
                  </div>
                  <div class="col-10 text-center">
                    <h4 class="p-3 bg-btn3-color text-white rounded shadow">C</h4>
                  </div>
                  <div class="col-1"> 
                  </div>
                </div>
                <div class="row py-2" id="btn4">
                  <div class="col-1">
                  </div>
                  <div class="col-10 text-center">
                    <h4 class="p-3 bg-btn4-color text-white rounded shadow">D</h4>
                  </div>
                  <div class="col-1"> 
                  </div>
                </div>

              </div>
            </template>
            <template v-slot:content2>
              <div>
                <div class="row py-2" id="btn1">
                  <div class="col-1">
                  </div>
                  <div class="col-10 text-center">
                    <h4 class="p-3 bg-btn1-color text-white rounded shadow">A</h4>
                  </div>
                  <div class="col-1"> 
                  </div>
                </div>
                <div class="row py-2" id="btn2">
                  <div class="col-1">
                  </div>
                  <div class="col-10 text-center">
                    <h4 class="p-3 bg-btn2-color text-white rounded btn-selected">B</h4>
                  </div>
                  <div class="col-1"> 
                  </div>
                </div>
                <div class="row py-2" id="btn3">
                  <div class="col-1">
                  </div>
                  <div class="col-10 text-center">
                    <h4 class="p-3 bg-btn3-color text-white rounded shadow">C</h4>
                  </div>
                  <div class="col-1"> 
                  </div>
                </div>
                <div class="row py-2" id="btn4">
                  <div class="col-1">
                  </div>
                  <div class="col-10 text-center">
                    <h4 class="p-3 bg-btn4-color text-white rounded shadow">D</h4>
                  </div>
                  <div class="col-1"> 
                  </div>
                </div>
              </div>
            </template>
            <template v-slot:content3>
              <div>
                <div class="row py-2 align-items-center" id="btn1">
                  <div class="col-1"> 
                  </div>
                  <div class="col-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" fill="white" class="bi bi-x-circle" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                  </div>
                  <div class="col-9 px-4 text-center">
                    <h4 class="p-3 bg-btn1-color text-white rounded shadow">A</h4>
                  </div>
                  <div class="col-1"> 
                  </div>
                </div>
                <div class="row py-2 align-items-center" id="btn2">
                  <div class="col-1"> 
                  </div>
                  <div class="col-1 px-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" fill="white" class="bi bi-check-circle" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                      <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                    </svg>
                  </div>
                  <div class="col-9 px-4 text-center">
                    <h4 class="p-3 bg-btn2-color text-white rounded btn-selected">B</h4>
                  </div>
                  <div class="col-1"> 
                  </div>
                </div>
                <div class="row py-2 align-items-center" id="btn3">
                  <div class="col-1"> 
                  </div>
                  <div class="col-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" fill="white" class="bi bi-x-circle" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                  </div>
                  <div class="col-9 px-4 text-center">
                    <h4 class="p-3 bg-btn3-color text-white rounded shadow">C</h4>
                  </div>
                  <div class="col-1"> 
                  </div>
                </div>
                <div class="row py-2 align-items-center" id="btn4">
                  <div class="col-1"> 
                  </div>
                  <div class="col-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" fill="white" class="bi bi-x-circle" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                  </div>
                  <div class="col-9 px-4 text-center">
                    <h4 class="p-3 bg-btn4-color text-white rounded shadow">D</h4>
                  </div>
                  <div class="col-1"> 
                  </div>
                </div>
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
            <div class="col-10 text-center py-4">
              <h1><span class="badge bg-modus-color bg-gradient shadow">Modus: Interaktion</span></h1>
            </div>
            <div class="col-1"> 
            </div>
          </div>
          <DropdownWithSlots :displayNames="['Screen1','Screen2','Screen3']">
            <template v-slot:content1>
              <div>
                <button type="button" class="btn btn-btn2-color bg-gradient w-100 py-5 shadow">MELDEN</button>
              </div>
            </template>
            <template v-slot:content2>
              <div>
                <button type="button" class="btn btn-btn1-color bg-gradient w-100 py-5 shadow">MELDUNG ZURÜCKZIEHEN</button>
              </div>
            </template>
            <template v-slot:content3>
              <div>
                <div class="card shadow w-100 text-bg-btn2-color bg-gradient text-white" style="width: 18rem;">
                  <div class="card-footer text-center">
                    <img alt="icon" src="@/assets/img/selected.svg" width="150"/>
                  </div>
                  
                  <div class="card-body py-5" >
                    <h1 class="card-text text-black text-center">Du wurdest drangenommen</h1>
                  </div>
                  <div class="card-footer text-center">
                    <button type="button" class="btn btn-btn3-color bg-gradient w-50 py-4 ">OK</button>
                  </div>
                </div>
                
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
