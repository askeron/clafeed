<script>
import HelloWorld from "./components/HelloWorld.vue";
import TheWelcome from "./components/TheWelcome.vue";
import TheRoleChoice from "./components/TheRoleChoice.vue";
import TheTeacherRooms from "./components/TheTeacherRooms.vue";
import ThePupilRooms from "./components/ThePupilRooms.vue";
import TheTeacherRoom from "./components/TheTeacherRoom.vue";
export default {
  components: {
    HelloWorld,
    TheWelcome,
    TheRoleChoice,
    TheTeacherRooms,
    ThePupilRooms,
    TheTeacherRoom,
  },
  data() {
    return {
      mainView: "TheRoleChoice",
      globalRoom: {
        room: null
      },
    }
  },
  methods: {
    setMainView(mainView) {
      this.mainView = mainView
    },
  },
  provide() {
    const { setMainView, globalRoom } = this
    return {
      setMainView,
      globalRoom,
    }
  },
}
</script>

<template>
  <header>
    <img
      alt="Vue logo"
      class="logo"
      src="./assets/logo.svg"
      width="125"
      height="125"
    />
  </header>

  <main>
    <KeepAlive>
      <component :is="mainView"></component>
    </KeepAlive>
  </main>
</template>

<style>
@import "./assets/base.css";

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
}

header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

a,
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

@media (min-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }

  #app {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
  }

  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  .logo {
    margin: 0 2rem 0 0;
  }
}
</style>
