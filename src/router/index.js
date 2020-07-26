import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Main from '../components/Main.vue'
// import Storage from '../assets/js/storage'
import Welcome from '../components/Welcome'
import Users from '../components/user/Users'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/main',
    component: Main,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/userManage/userManageList', component: Users }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
/* router.beforeEach((to, from, next) => {
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
}) */

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

export default router
