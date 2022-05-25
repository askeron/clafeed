import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { deleteItemFromArray } from '@/utils/common'

export const useTeacherStoredRoomsStore = defineStore({
  id: 'teacherStoredRooms',
  state: () => ({
    rooms: useStorage('teacherStoredRooms', [])
  }),
  getters: {
    getRoomById: (state) => {
      return (id) => state.rooms.find((room) => room.id === id)
    },
  },
  actions: {
    addRoom({ id, secret, name }) {
      this.rooms.push({
        id,
        secret,
        name,
      })
    },
    deleteRoom(id) {
      deleteItemFromArray(this.rooms, (room) => room.id === id)
    },
  }
})
