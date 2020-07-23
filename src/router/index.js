import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Main from '../components/Main.vue'
import Storage from '../assets/js/storage'

Vue.use(VueRouter)

const routes = [
  {path: '/', redirect: '/login'},
  {path: '/login', component: Login},
  {path: '/main', component: Main}
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  // next() 放行；next('/login') 强制跳转
  if (to.path === '/login') {
    return next()
  }
  // 获取token
  const tokenStr = Storage.localGet('Authorization')
  if (!tokenStr) return next('/login')
  next()
})

export default router
