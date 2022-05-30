<script setup>
import { RouterLink, RouterView } from 'vue-router'
import DetectMultipleInstances from '@/components/DetectMultipleInstances.vue'
</script>

<template>
  <div class="container">
  <DetectMultipleInstances />
  <notifications position="bottom center" :duration="3000" width="90%"/>
  <div>
    <img alt="Logo" class="logo" src="@/assets/logo-clafeed-150.png" width="75"/>
  </div>
  <RouterView />
  <footer>
    <a href="https://www.clafeed.de/" target="_blank">Clafeed</a> 
    <span class="subtitle">&nbsp;<i>(aktuell im alpha Status)</i> - das datensparsame classroom feedback tool</span>
  </footer>
  </div>
</template>

<style>
@import '@/assets/base.css';

footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  /*
  background-color: lightgray;
  color: black;
  */
  text-align: center;
}

.subtitle {
  font-size: x-small;
}

.vue-notification {
  font-size: large !important;
}
</style>
