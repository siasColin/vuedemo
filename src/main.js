import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/fonts/iconfont.css'
import './assets/css/global.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import qs from 'qs'
import Storage from './assets/js/storage'
import Common from './assets/js/common'

Vue.use(ElementUI)
Vue.config.productionTip = false
// 配置超时时间
axios.defaults.timeout = 30000
// 配置公共请求头
axios.defaults.baseURL = 'http://192.168.0.135:8081/'
// 配置公共的请求头
// axios.defaults.headers.common['Authorization'] = '123';
// 配置公共的 post 的 Content-Typ
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded'
// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    var authorization = Storage.localGet('Authorization')
    var refresh_token = Storage.localGet('Refresh_token')
    if (!Common.isEmpty(authorization)) {
      config.headers['Authorization'] = authorization
    }
    if (!Common.isEmpty(refresh_token)) {
      config.headers['Refresh_token'] = refresh_token
    }
    return config
  },
  function (error) {
    console.log(error)
  }
)
// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    var authorization = response.headers.authorization
    var refresh_token = response.headers.refresh_token
    if (!Common.isEmpty(refresh_token)) {
      Storage.localSet('Authorization', authorization)
    }
    if (!Common.isEmpty(refresh_token)) {
      Storage.localSet('Refresh_token', refresh_token)
    }
    return response
  },
  function (error) {
    // 对响应错误做点什么
    console.log(error)
  }
)

// 全局注册，使用方法为:this.$axios
Vue.prototype.$axios = axios
Vue.prototype.$qs = qs
new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
