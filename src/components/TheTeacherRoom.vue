<script>
export default {
  inject: ["setMainView", "globalRoom"],
  data() {
    return {
      editNameVisible: false,
      room: this.globalRoom.room,
    }
  },
  methods: {
    onCreated() {
      this.updateRoom()
    },
    async updateRoom() {
      const room = this.room
      const response = await fetch('http://localhost:8080/api/v1/owner/updateRoom', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({
          roomId: room.id,
          roomSecret: room.secret,
          name: room.name,
          currentlyOpen: room.currentlyOpen,
        }),
      })
    },
    showEditName() {
      this.$refs.editnamefield.value = this.room.name
      this.editNameVisible = true
    },
    saveEditName() {
      this.room.name = this.$refs.editnamefield.value
      this.editNameVisible = false
    },
    abortEditName() {
      this.editNameVisible = false
    },
  },
  watch: {
    globalRoom: {
      handler() {
        this.updateRoom()
      },
      deep: true,
    }
  }
}
</script>

<template>
  <p>
    <button @click.prevent="setMainView('TheTeacherRooms')">Zurück</button>
  </p>
  <p>
    Lehrer - Raum:
    <span v-show="!editNameVisible">
      {{room.name}} <a @click="showEditName()">ändern</a>
    </span>
    <span v-show="editNameVisible">
      <input type="text" ref="editnamefield"/> <a @click="saveEditName()">speichern</a> <a @click="abortEditName()">abbrechen</a>
    </span>
  </p>
  <p>
    Geöffnet: <input type="checkbox" v-model="globalRoom.room.currentlyOpen"/>
  </p>

</template>
