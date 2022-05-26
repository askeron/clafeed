<script setup>
import { ref, computed, onMounted } from "vue"
import { RouterLink, useRoute } from 'vue-router'
import HashAvatarImg from '@/components/HashAvatarImg.vue'
import TabsWithSlots from '@/components/TabsWithSlots.vue'
import DropdownWithSlots from '@/components/DropdownWithSlots.vue'
import { useTeacherStore } from '@/stores/teacher'
import { useUpdateRoomFromStore, useCreateInviteCode, useOpenRoom, useCloseRoom } from '@/composables/teacherServer'
import { getTimeStringForSeconds } from '@/utils/common'

const teacherStore = useTeacherStore()

const route = useRoute()
const roomId = computed(() => route.params.roomId)
const room = computed(() => teacherStore.getRoomById(roomId.value))
const nowState = ref(Date.now())
setInterval(() => nowState.value = Date.now(), 1000)

const getSecondsLeftString = (validUntil) => {
  const secondsLeft = Math.round((validUntil - Date.now())/1000)
  return getTimeStringForSeconds(secondsLeft)
}

onMounted(() => {
  useUpdateRoomFromStore(roomId.value)
})

</script>

<template>
  <div>
    <div>
      <RouterLink to="/teacher">zurück</RouterLink>
      <HashAvatarImg :hash="roomId"/>
      {{ room.name }} {{ roomId.substring(0,4) }}
    </div>
    <TabsWithSlots :displayNames="['Aktivität','Verwaltung']">
      <template v-slot:content1>
        Aktivität - content
      </template>
      <template v-slot:content2>
        <DropdownWithSlots :displayNames="['Optionen','Schüler*innen','Austehende Eintritte','Eventdaten']">
          <template v-slot:content1>
            <div v-if="room.currentlyOpen">
              Raum geöffnet - <button @click.prevent="useCloseRoom(roomId)">schliessen</button>
            </div>
            <div v-else>
              Raum geschlossen - <button @click.prevent="useOpenRoom(roomId)">öffnen</button>
            </div>
            <h2>Einladungcode</h2>
            <div v-if="room.inviteCode && room.inviteCodeValidUntil > nowState">
              <h3>{{ room.inviteCode }}</h3>
              <p>noch gültig für {{ getSecondsLeftString(room.inviteCodeValidUntil) }}</p>
              <button @click.prevent="useCreateInviteCode(roomId)">neu generieren</button>
            </div>
            <div v-else>
              <button @click.prevent="useCreateInviteCode(roomId)">generieren</button>
            </div>
          </template>
          <template v-slot:content2>
            <p>TODO: Schüler*innen Liste</p>
          </template>
          <template v-slot:content3>
            <p>TODO: Austehende Eintritte Liste</p>
          </template>
          <template v-slot:content4>
            <p>TODO: Eventdaten</p>
          </template>
        </DropdownWithSlots>
      </template>
    </TabsWithSlots>
  </div>
  
</template>

<style>
.active {
  font-weight: bold;
}
</style>
