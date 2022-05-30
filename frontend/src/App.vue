<script setup>
import { RouterLink, RouterView } from 'vue-router'
import DetectMultipleInstances from '@/components/DetectMultipleInstances.vue'
</script>

<template>
  <div class="container appcontent roundcorners bg-dark">
  <DetectMultipleInstances />
  <notifications position="bottom center" :duration="3000" width="90%"/>
  <div class="row bg-dark roundcorners">
    <div class="col">
    </div>
    <div class="col-6 text-center">
      <img alt="Logo" class="logo" src="@/assets/img/logo-clafeed-250.png" width="150"/>
    </div>
    <div class="col"> 
    </div>
    
  </div>
  <RouterView />
  <footer>
    <a href="https://www.clafeed.de/" target="_blank" class="text-info">Clafeed</a> 
    <span class="subtitle text-white">&nbsp;<i>(aktuell im alpha Status)</i> - das datensparsame classroom feedback tool</span>
  </footer>
  </div>
</template>

<style lang="sass">
@import '@/assets/custom.scss'
</style>

<style>
/*@import '@/assets/base.css';*/

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
