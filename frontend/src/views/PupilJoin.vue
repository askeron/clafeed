<script setup>
import ThePupilMainTabs from '@/components/ThePupilMainTabs.vue'
import { useStorage } from '@vueuse/core'
import { ref, reactive, watch, computed, onMounted } from "vue"
import { useRoute } from 'vue-router'
import { usePupilStore } from '@/stores/pupil'
import { useCheckPendingInvites, useUseInviteCode } from '@/composables/pupilServer'
import { useDateNow } from '@/composables/useDateNow'
import { getSecondsLeftString } from '@/utils/common'
import { notify } from "@kyvg/vue3-notification"

const pupilStore = usePupilStore()

const route = useRoute()
const inviteCodeParam = computed(() => route.params.inviteCodeParam)

const inviteCode = ref("")
const suggestedName = useStorage('pupilSuggestedName', "Max Mustermann")

const dateNow = useDateNow()

const pendingInvitesToShow = computed(() => {
  const now = dateNow.value
  return pupilStore.pendingInvites.filter(x => x.validUntil >= now)
})

setInterval(() => useCheckPendingInvites(), 5000)

const joinRoom = () => {
  if (pupilStore.hasPendingInviteWithInviteCode(inviteCode.value)) {
    notify({
      title: "Raumbeitritt",
      text: `Du hast bereits einen laufenden Beitritt mit diesem Einladungcode.`,
      type: "warn",
    })
    return
  }
  useUseInviteCode(inviteCode.value, suggestedName.value)
}

onMounted(() => {
  if (inviteCodeParam.value) {
    inviteCode.value = inviteCodeParam.value.substring(0,8)
  }
})

</script>

<template>
  <div>
    <ThePupilMainTabs :activeIndex="1"/>
    <div>
      <br/>
      <label for="inviteCode" class="form-label text-white">Einladungscode</label>
      <input v-model="inviteCode" id="inviteCode" class="form-control shadow" type="text" pattern="\d*" maxlength="8">
      <br/>
      <label for="suggestedName" class="form-label text-white">Name Schüler*innen</label>
      <input v-model="suggestedName" id="suggestedName" class="form-control">
      <br/>
      <button @click.prevent="joinRoom()" class="btn btn-primary shadow">Raum beitreten</button>
    </div>
    <div>
      <transition-group name="flip-list" tag="div">
        <div v-for="pendingInvite in pendingInvitesToShow" :key="pendingInvite.roomDeviceId" class="text-white">
          {{ pendingInvite.roomName }} ({{ pendingInvite.roomId.substring(0,4) }}) mit Einladungscode {{ pendingInvite.inviteCode }} - noch gültig für {{ getSecondsLeftString(pendingInvite.validUntil - dateNow) }}
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
