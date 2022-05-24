<script setup>
const resetLocalStorage = () => {
  if (confirm("LocalStorage wirklich löschen?")) {
    localStorage.clear()
    alert("LocalStorage wurde gelöscht")
  }
}
</script>

<template>
  <div>
    <p>
      Debug
    </p>
    <p>
      <button @click.prevent="resetLocalStorage()">LocalStorage löschen</button>
    </p>
  </div>
</template>

<style>
</style>
