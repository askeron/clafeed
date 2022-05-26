import { useTeacherStore } from '@/stores/teacher'

const teacherStore = useTeacherStore()

async function jsonPost(path, body) {
  const response = await fetch(`http://localhost:8080${path}`, {
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
  const { id, secret } = await jsonPost('/api/v1/owner/createNewRoom', {
    name,
  })
  teacherRoomsStore.addRoom({
    id,
    secret,
    name: result.name,
  })
}
