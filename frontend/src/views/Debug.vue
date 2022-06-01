<script setup>
import { ref } from "vue"
const resetLocalStorage = () => {
  if (confirm("LocalStorage wirklich löschen?")) {
    localStorage.clear()
    alert("LocalStorage wurde gelöscht")
  }
}
const enableMultipleInstances = () => {
  localStorage.setItem("allowMultipleInstaces","true")
}
const disableMultipleInstances = () => {
  localStorage.removeItem("allowMultipleInstaces")
}
const enablePictureMode = () => {
  localStorage.setItem("allowPictureMode","true")
}
const disablePictureMode = () => {
  localStorage.removeItem("allowPictureMode")
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
    <p>
      <button @click.prevent="enableMultipleInstances()">mehrere Instanzen erlauben</button>
    </p>
    <p>
      <button @click.prevent="disableMultipleInstances()">mehrere Instanzen verbieten</button>
    </p>
    <p>
      <button @click.prevent="enablePictureMode()">Bild-Modus erlauben</button>
    </p>
    <p>
      <button @click.prevent="disablePictureMode()">Bild-Modus verbieten</button>
    </p>
  </div>
</template>

<style>
</style>
