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
        const now = Date.now()
        const { id, secret, name } = storedRoom
        const inviteCode = state.inviteCodes.find(x => x.roomId == id && x.validUntil >= now)
        return {
          id,
          secret,
          name,
          currentlyOpen: state.openedRooms.includes(id),
          inviteCode: inviteCode?.code,
          inviteCodeValidUntil: inviteCode?.validUntil,
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
    renameRoom(id, name) {
      const room = this.storedRooms.find((room) => room.id === id)
      if (room) {
        room.name = name
      }
    },
    openRoom(id) {
      if (! this.openedRooms.includes(id)) {
        this.openedRooms.push(id)
      }
    },
    closeRoom(id) {
      deleteItemFromArray(this.openedRooms, (x) => x === id)
    },
    setInviteCode({roomId, code, validUntil}) {
      const now = Date.now()
      deleteItemFromArray(this.inviteCodes, (x) => x.roomId === roomId || x.validUntil < now)
      this.inviteCodes.push({roomId, code, validUntil})
    },
  }
})
