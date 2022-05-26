import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { deleteItemFromArray } from '@/utils/common'

export const useTeacherStore = defineStore({
  id: 'teacher',
  state: () => ({
    storedRooms: useStorage('teacherStoredRooms', []),
    openedRooms: [],
    inviteCodes: [],
  }),
  getters: {
    rooms: (state) => {
      return state.storedRooms.map(storedRoom => {
        const { id, secret, name } = storedRoom
        return {
          id,
          secret,
          name,
          opened: state.openedRooms.includes(id),
        }
      })
    },
    getRoomById: (state) => {
      return (id) => state.rooms.find((room) => room.id === id)
    },
  },
  actions: {
    addRoom({ id, secret, name }) {
      this.storedRooms.push({
        id,
        secret,
        name,
      })
    },
    deleteRoom(id) {
      deleteItemFromArray(this.storedRooms, (room) => room.id === id)
    },
    openRoom(id) {
      // TODO call server
      if (! this.openedRooms.includes(id)) {
        this.openedRooms.push(id)
      }
    },
    closeRoom(id) {
      // TODO call server
      deleteItemFromArray(this.openedRooms, (x) => x === id)
    },
  }
})
