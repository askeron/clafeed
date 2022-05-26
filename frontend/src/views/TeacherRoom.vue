<script setup>
import { ref, computed } from "vue"
import { RouterLink, useRoute } from 'vue-router'
import HashAvatarImg from '@/components/HashAvatarImg.vue'
import TabsWithSlots from '@/components/TabsWithSlots.vue'
import DropdownWithSlots from '@/components/DropdownWithSlots.vue'
import { useTeacherStore } from '@/stores/teacher'

const teacherStore = useTeacherStore()

const route = useRoute()
const roomId = computed(() => route.params.roomId)
const room = computed(() => teacherStore.getRoomById(roomId.value))

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
            <p>TODO: Raum geöffnet - hier keine Checkbox</p>
            <p>TODO: Einladungcode</p>
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
