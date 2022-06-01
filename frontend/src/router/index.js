import { createRouter, createWebHistory } from 'vue-router'
import PupilRooms from '../views/PupilRooms.vue'
import PupilRoom from '../views/PupilRoom.vue'
import PupilJoin from '../views/PupilJoin.vue'
import TeacherRooms from '../views/TeacherRooms.vue'
import TeacherRoom from '../views/TeacherRoom.vue'
import Debug from '../views/Debug.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'pupilRooms',
      component: PupilRooms
    },
    {
      path: '/join',
      name: 'pupilJoin',
      component: PupilJoin
    },
    {
      path: '/join/:inviteCodeParam',
      component: PupilJoin
    },
    {
      path: '/room/:roomId',
      name: 'pupilRoom',
      component: PupilRoom
    },
    {
      path: '/teacher',
      name: 'teacherRooms',
      component: TeacherRooms
    },
    {
      path: '/teacher/room/:roomId',
      name: 'teacherRoom',
      component: TeacherRoom
    },
    {
      path: '/debug',
      name: 'debug',
      component: Debug
    },
  ]
})

export default router
