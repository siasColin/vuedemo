import Vue from 'vue'
import VueRouter from 'vue-router'
import Storage from '../assets/js/storage'
/* import Main from '../components/Main.vue'
import Welcome from '../components/Welcome'
import Users from '../components/user/Users'
import Login from '../components/Login.vue' */

/*
 * 改成路由懒加载，提高页面响应效率
 * webpackChunkName： 分组，一个组内的路由级联加载
 * */
const Login = () =>
  import(/* webpackChunkName: "login_main_welcome" */ '../components/Login.vue')
const P403 = () =>
  import(
    /* webpackChunkName: "login_main_welcome" */ '../components/common/403.vue'
  )
const P404 = () =>
  import(
    /* webpackChunkName: "login_main_welcome" */ '../components/common/404.vue'
  )
const Main = () =>
  import(/* webpackChunkName: "login_main_welcome" */ '../components/Main.vue')
const Welcome = () =>
  import(/* webpackChunkName: "login_main_welcome" */ '../components/Welcome')
const Users = () =>
  import(/* webpackChunkName: "userManage" */ '../components/user/Users')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/403', component: P403 },
  { path: '/404', component: P404 },
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
// 挂载路由导航守卫,判断是否登录，没有登录不允许访问login以外页面
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

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

export default router
