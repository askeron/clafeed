<script setup>
const bc = new BroadcastChannel("dectect-multiple-instances");

const amIFirst = "Am I the first?"
const noYouAreNot = "No you're not." 

bc.onmessage = (event) => {
  if (event.data === amIFirst) {
    bc.postMessage(noYouAreNot);
    //alert(`Another tab of this site just got opened`);
  }
  if (event.data === noYouAreNot) {
    //alert(`An instance of this site is already running`);
    window.location.href = "/multiple-instances.html"
  }
};

bc.postMessage(amIFirst);

</script>

<template>
</template>
