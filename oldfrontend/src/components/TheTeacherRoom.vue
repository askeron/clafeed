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
      this.$refs.editNameField.value = this.room.name
      this.editNameVisible = true
    },
    saveEditName() {
      this.room.name = this.$refs.editNameField.value
      this.editNameVisible = false
    },
    abortEditName() {
      this.editNameVisible = false
    },
    goBack() {
      this.room.inviteCodes = []
      this.setMainView('TheTeacherRooms')
    },
    async createInviteCode() {
      const room = this.room
      const response = await fetch('http://localhost:8080/api/v1/owner/createRoomInviteCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({
          roomId: room.id,
          roomSecret: room.secret,
        }),
      })
      if (response.ok) {
        const result = await response.json()
        const { code, lifetimeMillis } = result
        this.room.inviteCodes.push({
          code,
          lifetimeMillisDate: Date.now() + lifetimeMillis,
        })
        setTimeout(() => {
          this.room.inviteCodes = this.room.inviteCodes.filter(x => x.lifetimeMillisDate > Date.now())
        }, lifetimeMillis + 100)
      }
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
    <button @click.prevent="goBack()">Zurück</button>
  </p>
  <p>
    Lehrer - Raum:
    <span v-show="!editNameVisible">
      {{room.name}} <a @click="showEditName()">ändern</a>
    </span>
    <span v-show="editNameVisible">
      <input type="text" ref="editNameField"/> <a @click="saveEditName()">speichern</a> <a @click="abortEditName()">abbrechen</a>
    </span>
  </p>
  <p>
    Geöffnet: <input type="checkbox" v-model="globalRoom.room.currentlyOpen"/>
  </p>
  <p v-if="room.inviteCodes.length > 0">
    Einladungscodes:
    <ul>
      <li v-for="inviteCode in room.inviteCodes" :key="inviteCode.code">
        {{ inviteCode.code }} - gültig bis {{ new Date(inviteCode.lifetimeMillisDate).toLocaleString() }}
      </li>
    </ul>
  </p>
  <p>
    <button @click.prevent="createInviteCode()">Einladungscode generieren</button>
  </p>

</template>
