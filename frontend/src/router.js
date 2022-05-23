import { createRouter, createWebHistory } from "vue-router";
import TheTeacherRooms from "./components/TheTeacherRooms.vue";
import ThePupilRooms from "./components/ThePupilRooms.vue";
import TheTeacherRoom from "./components/TheTeacherRoom.vue";

createApp(App).mount("#app");
const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})