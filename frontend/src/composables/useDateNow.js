import { ref } from "vue"

export function useDateNow() {
  const dateNow = ref(Date.now())
  setInterval(() => dateNow.value = Date.now(), 1000)
  return dateNow
}
