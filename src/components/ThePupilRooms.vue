<script>
export default {
  inject: ["setMainView"],
}
</script>

<template>
  <p>
    <button @click.prevent="setMainView('TheRoleChoice')">Zurück</button>
  </p>
  <p>
    Schüler-Räume:
  </p>
</template>
