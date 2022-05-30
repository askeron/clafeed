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
    <div>
      <RouterLink to="/">zurück</RouterLink>
      <HashAvatarImg :hash="roomId"/>
      {{ room.name }} {{ roomId.substring(0,4) }}
    </div>
    <DropdownWithSlots :displayNames="['Inaktiv','Quiz','Interaktion']">
      <template v-slot:content1>
        <div>
          <h1>Modus: Inaktiv</h1>
          <h2>aktuell gibt es keine Aktivität</h2>
        </div>
      </template>
      <template v-slot:content2>
        <div>
          <h1>Modus: Quiz</h1>
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
          <h1>Modus: Interaktion</h1>
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
