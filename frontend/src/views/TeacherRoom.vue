<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue"
import { RouterLink, useRoute } from 'vue-router'
import HashAvatarImg from '@/components/HashAvatarImg.vue'
import TabsWithSlots from '@/components/TabsWithSlots.vue'
import DropdownWithSlots from '@/components/DropdownWithSlots.vue'
import { useTeacherStore } from '@/stores/teacher'
import { useDateNow } from '@/composables/useDateNow'
import { useUpdateRoomFromStore, useCreateInviteCode, useOpenRoom, useCloseRoom } from '@/composables/teacherServer'
import { getSecondsLeftString } from '@/utils/common'

const teacherStore = useTeacherStore()

const route = useRoute()
const roomId = computed(() => route.params.roomId)
const room = computed(() => teacherStore.getRoomById(roomId.value))
const dateNow = useDateNow()

onMounted(() => {
  useUpdateRoomFromStore(roomId.value)
})

</script>

<template>
  <div style="background-color:aliceblue">
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
            <h2>Einladungscode</h2>
            <div v-if="room.inviteCode && room.inviteCodeValidUntil > dateNow">
              <h3>{{ room.inviteCode }}</h3>
              <p>noch gültig für {{ getSecondsLeftString(room.inviteCodeValidUntil - dateNow) }}</p>
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

<style scoped>
</style>
