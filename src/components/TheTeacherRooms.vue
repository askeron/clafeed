<script>
export default {
  inject: ["setMainView", "globalRoom"],
  data() {
    return {
      rooms: []
    }
  },
  methods: {
    async createNewRoom() {
      const response = await fetch('http://localhost:8080/api/v1/owner/createNewRoom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
//        body: JSON.stringify({
//          name: this.enteredName,
//          rating: this.chosenRating,
//        }),
      })
      if (response.ok) {
        const result = await response.json()
        const { id, secret } = result
        this.rooms.push({
          id,
          secret,
          name: result.name,
          currentlyOpen: false,
        })
      }
    },
    openRoom(room) {
      this.globalRoom.room = room
      this.setMainView("TheTeacherRoom")
    },
  },
}
</script>

<template>
  <p>
    <button @click.prevent="setMainView('TheRoleChoice')">Zurück</button>
  </p>
  <p>
    Lehrer-Räume:
  </p>
  <ul>
    <li v-for="room in rooms" :key="room.id">
      <a @click.prevent="openRoom(room)">{{room.name}} - {{ room.currentlyOpen ? "offen" : "geschlossen" }}</a>
    </li>
  </ul>
  <p>
    <button @click.prevent="createNewRoom()">neuen Raum anlegen</button>
  </p>

</template>
