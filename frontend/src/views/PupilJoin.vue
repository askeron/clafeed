<script setup>
import ThePupilMainTabs from '@/components/ThePupilMainTabs.vue'
import { useStorage } from '@vueuse/core'
import { ref, reactive, watch, computed } from "vue"
import { usePupilStore } from '@/stores/pupil'
import { useCheckPendingInvites, useUseInviteCode } from '@/composables/pupilServer'
import { useDateNow } from '@/composables/useDateNow'
import { getSecondsLeftString } from '@/utils/common'
const pupilStore = usePupilStore()

const inviteCode = ref("")
const suggestedName = useStorage('pupilSuggestedName', "Max Mustermann")

const dateNow = useDateNow()

const pendingInvitesToShow = computed(() => {
  const now = dateNow.value
  return pupilStore.pendingInvites.filter(x => x.validUntil >= now)
})

setInterval(() => useCheckPendingInvites(), 5000)

const joinRoom = () => {
  useUseInviteCode(inviteCode.value, suggestedName.value)
}

</script>

<template>
  <div>
    <ThePupilMainTabs :activeIndex="1"/>
    <div>
      <p>Einladungscode:</p>
      <input v-model="inviteCode" maxlength="8">
      <p>Schüler*innenname:</p>
      <input v-model="suggestedName">
      <br/>
      <button @click.prevent="joinRoom()">Raum beitretten</button>
    </div>
    <div>
      <transition-group name="flip-list" tag="div">
        <div v-for="pendingInvite in pendingInvitesToShow" :key="pendingInvite.roomDeviceId">
          {{ pendingInvite.roomName }} ({{ pendingInvite.roomId.substring(0,4) }}) - noch gültig für {{ getSecondsLeftString(pendingInvite.validUntil - dateNow) }}
        </div>
      </transition-group>
    </div>
  </div>
</template>

<style scoped>
.flip-list-move {
  transition: transform 1s;
}
</style>
