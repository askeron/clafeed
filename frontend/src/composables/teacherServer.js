import { useTeacherStore } from '@/stores/teacher'

async function jsonPost(path, body) {
  const response = await fetch(`http://localhost:8080/${path.substring(1)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    throw new Error(`api call for ${path} failed`)
  }
  return await response.json()
}

export async function useCreateRoom(name) {
  const { id, secret } = await jsonPost('/api/v1/teacher/createNewRoom', {
    name,
  })
  const teacherStore = useTeacherStore()
  teacherStore.addRoom({
    id,
    secret,
    name,
  })
}

export async function useDeleteRoom(id) {
  const teacherStore = useTeacherStore()
  const { secret } = teacherStore.getRoomById(id)
  await jsonPost('/api/v1/teacher/deleteRoom', {
    id,
    secret,
  })
  teacherStore.deleteRoom(id)
}

export async function useRenameRoom({id, name}) {
  const teacherStore = useTeacherStore()
  const { secret } = teacherStore.getRoomById(id)
  await jsonPost('/api/v1/teacher/updateRoom', {
    id,
    secret,
    name,
  })
  teacherStore.renameRoom(id, name)
}

export async function useOpenRoom(id) {
  const teacherStore = useTeacherStore()
  const { secret, name } = teacherStore.getRoomById(id)
  await jsonPost('/api/v1/teacher/updateRoom', {
    id,
    secret,
    name,
    currentlyOpen: true,
  })
  teacherStore.openRoom(id)
}

export async function useCloseRoom(id) {
  const teacherStore = useTeacherStore()
  const { secret, name } = teacherStore.getRoomById(id)
  await jsonPost('/api/v1/teacher/updateRoom', {
    id,
    secret,
    name,
    currentlyOpen: false,
  })
  teacherStore.closeRoom(id)
}

export async function useUpdateRoomFromStore(id) {
  const teacherStore = useTeacherStore()
  const { secret, name, currentlyOpen } = teacherStore.getRoomById(id)
  await jsonPost('/api/v1/teacher/updateRoom', {
    id,
    secret,
    name,
    currentlyOpen,
  })
}

export async function useUpdateRoomModeData(id, modeData) {
  const teacherStore = useTeacherStore()
  const { secret, name } = teacherStore.getRoomById(id)
  await jsonPost('/api/v1/teacher/updateRoom', {
    id,
    secret,
    name,
    modeData,
  })
}

export async function useCreateInviteCode(roomId) {
  const teacherStore = useTeacherStore()
  const { secret: roomSecret } = teacherStore.getRoomById(roomId)
  const { code, lifetimeMillis } = await jsonPost('/api/v1/teacher/createInviteCode', {
    roomId,
    roomSecret,
  })
  teacherStore.setInviteCode({
    roomId,
    code,
    validUntil: Date.now() + lifetimeMillis
  })
}

export async function useAcceptAllPendingInvites() {
  await jsonPost('/api/v1/teacher/hack/acceptAllPendingInvites', {
  })
}

export function useWebsocket(pupilModeInteractionListener) {
  const ws = new WebSocket("ws://localhost:8080/")
  //let lastKeepAlive = Date.now()
  ws.onopen = function() {
      console.log('WebSocket Client Connected')
      ws.send('{"type": "resend-all"}')
      /*
      ws.send('{"type": "resend-all"}')
      setInterval(() => {
          if (lastKeepAlive + 60000 < Date.now()) {
              setTimeout(() => {
                  document.getElementById("warning").style.display = "block"
              }, 2000)
              fetch('/isAlive')
                  .then(() => location.reload())
                  .catch(() => {})
          }
      }, 5000)
      */
  }
  ws.onmessage = function(e) {
      const message = JSON.parse(e.data)
      if (message.type === "pupil-mode-interaction") {
        pupilModeInteractionListener(message)
      }
    /*
      if (message.type === "icon") {
          document.getElementById("image"+message.index).src = "data:image/png;base64,"+message.pngBase64
      }
      if (message.type === "keepalive") {
          lastKeepAlive = Date.now()
      }
      */
  }
  /*
  return {
    disconnect() {
      ws.d
    }
  }
  */
}
