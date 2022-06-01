<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from "vue"
import { RouterLink, useRoute } from 'vue-router'
import HashAvatarImg from '@/components/HashAvatarImg.vue'
import TabsWithSlots from '@/components/TabsWithSlots.vue'
import DropdownWithSlots from '@/components/DropdownWithSlots.vue'
import { useTeacherStore } from '@/stores/teacher'
import { useDateNow } from '@/composables/useDateNow'
import { useUpdateRoomFromStore, useUpdateRoomModeData, useCreateInviteCode, useOpenRoom, useCloseRoom, useAcceptAllPendingInvites, useWebsocket } from '@/composables/teacherServer'
import { getSecondsLeftString, getQuizLetterStringFromIndex, getIndiciesFromCount, deleteItemFromArray } from '@/utils/common'

const teacherStore = useTeacherStore()

const route = useRoute()
const roomId = computed(() => route.params.roomId)
const room = computed(() => teacherStore.getRoomById(roomId.value))
const dateNow = useDateNow()
const modeIndex = ref(0)
const mode = computed(() => {
  const index = modeIndex.value
  if (index === 0 ) {
    return "inactive"
  }
  if (index === 1 ) {
    return "quiz"
  }
  if (index === 2 ) {
    return "interaction"
  }
})
const modeDatas = reactive({
  inactive: {
  },
  quiz: {
    answersCount: 4,
    correctAnswerIndex: 0,
    closeAndShowResults: false,
  },
  interaction: {
    enabled: true,
    calledRaiseHandRoomDeviceId: null,
  },
})

onMounted(() => {
  useUpdateRoomFromStore(roomId.value)
})

const interactionRaisedHands = reactive([])

const { sendMessageOverWebsocket } = useWebsocket((msg) => {
  if (msg.subtype === "interactionRaisedHand" && msg.roomId === roomId.value) {
    const { roomDeviceId, suggestedPupilName } = msg
    if (msg.raisedHand) {
      if (interactionRaisedHands.filter(x => x.roomDeviceId === roomDeviceId).length === 0) {
        interactionRaisedHands.push({
          roomDeviceId,
          suggestedPupilName,
        })
      }
    } else {
      deleteItemFromArray(interactionRaisedHands, x => x.roomDeviceId === roomDeviceId)
    }
  }
})

const updateModeData = () => {
  useUpdateRoomModeData(roomId.value, {
    mode: mode.value,
    data: JSON.parse(JSON.stringify(modeDatas[mode.value])),
  })
}

const quizAnswersCountString = ref("4")
watch(quizAnswersCountString, (currentValue, oldValue) => {
  modeDatas.quiz.answersCount = currentValue
})

const quizCorrectAnswerLetterString = ref("0")
watch(quizCorrectAnswerLetterString, (currentValue, oldValue) => {
  modeDatas.quiz.correctAnswerIndex = currentValue
})

watch(mode, (currentValue, oldValue) => {
  updateModeData()
})

watch(modeDatas, (currentValue, oldValue) => {
  updateModeData()
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
        <DropdownWithSlots :displayNames="['Inaktiv','Quiz','Interaktion']" v-model="modeIndex">
          <template v-slot:content1>
            <div>
            </div>
          </template>
          <template v-slot:content2>
            <div>
              <div>
                Antwortanzahl:
              </div>
              <select v-model="quizAnswersCountString">
                <option v-for="count in 6" :key="count" :value="count">{{ count }}</option>
              </select>
            </div>
            <div>
              <div>
                Richtige Antwort:
              </div>
              <select v-model="quizCorrectAnswerLetterString">
                <option v-for="index in getIndiciesFromCount(modeDatas.quiz.answersCount)" :key="index" :value="index">{{ getQuizLetterStringFromIndex(index) }}</option>
              </select>
            </div>
            <div>
              <input type="checkbox" v-model="modeDatas.quiz.closeAndShowResults"/> Schließen und Schüler*innen Ergebnis anzeigen
            </div>
          </template>
          <template v-slot:content3>
            <div>
              <div>
                <input type="checkbox" v-model="modeDatas.interaction.enabled"/> melden möglich
              </div>
              <div>
                <h3>Gemeldet:</h3>
                <transition-group name="flip-list" tag="div">
                  <div v-for="raisedHandData in interactionRaisedHands" :key="raisedHandData.roomDeviceId">
                    {{ raisedHandData.suggestedPupilName }} ({{ raisedHandData.roomDeviceId.substring(0,4) }}){{ (modeDatas.interaction.calledRaiseHandRoomDeviceId === raisedHandData.roomDeviceId) ? ' - drangenommen' : ''}}
                    <button @click.prevent="modeDatas.interaction.calledRaiseHandRoomDeviceId = raisedHandData.roomDeviceId">drannehmen</button>
                  </div>
                </transition-group>
                <button @click.prevent="modeDatas.interaction.calledRaiseHandRoomDeviceId = null">niemand drannehmen</button>
              </div>
            </div>
          </template>
        </DropdownWithSlots>
      </template>
      <template v-slot:content2>
        <DropdownWithSlots :displayNames="['Optionen','Schüler*innen','Austehende Eintritte','Eventdaten']" :modelValue="0">
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
            <button @click.prevent="useAcceptAllPendingInvites()">alle austehenden Einladungen akzeptieren</button>
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
