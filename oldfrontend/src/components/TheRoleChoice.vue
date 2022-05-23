<script>
export default {
  inject: ["setMainView"],
}
</script>

<template>
  <p>
    <button @click.prevent="setMainView('TheTeacherRooms')">Lehrer</button>
  </p>
  <p>
    <button @click.prevent="setMainView('ThePupilRooms')">Schüler</button>
  </p>
</template>
