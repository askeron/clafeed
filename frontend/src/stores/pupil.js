import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { deleteItemFromArray } from '@/utils/common'

export const usePupilStore = defineStore({
  id: 'pupil',
  state: () => ({
    storedRooms: useStorage('pupilStoredRooms', []),
    pendingInvites: useStorage('pupilPendingInvites', []),
  }),
  getters: {
    rooms: (state) => {
      return state.storedRooms.map(storedRoom => storedRoom)
    },
    getRoomById: (state) => {
      return (id) => state.rooms.find((room) => room.id === id)
    },
    getPendingInvitesByRoomDeviceId: (state) => {
      return (roomDeviceId) => state.pendingInvites.find((x) => x.roomDeviceId === roomDeviceId)
    },
  },
  actions: {
    addRoom({ roomId, roomName, roomDeviceId, roomDeviceSecret }) {
      this.storedRooms.push({
        id: roomId,
        name: roomName,
        roomDeviceId,
        roomDeviceSecret,
      })
      deleteItemFromArray(this.pendingInvites, x => x.roomId === roomId)
    },
    removeRoom(id) {
      console.log(`delete $id`)
      deleteItemFromArray(this.storedRooms, x => x.id === id)
    },
    addPendingInvite({ roomId, roomName, roomDeviceId, roomDeviceSecret, validUntil }) {
      this.pendingInvites.push({
        roomId,
        roomName,
        roomDeviceId,
        roomDeviceSecret,
        validUntil,
      })
    },
    removePendingInvite(roomDeviceId) {
      deleteItemFromArray(this.pendingInvites, x => x.roomDeviceId === roomDeviceId)
    },
  }
})
