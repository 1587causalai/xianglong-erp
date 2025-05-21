import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

Vue.config.productionTip = false

// 使用ElementUI
Vue.use(ElementUI)

// 配置axios
axios.defaults.baseURL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api'
axios.interceptors.request.use(config => {
  const token = store.state.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器处理错误
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // 处理401未授权错误
      if (error.response.status === 401) {
        store.dispatch('logout')
        router.push('/login')
      }
      
      // 显示错误消息
      const errorMessage = error.response.data.message || '请求失败'
      Vue.prototype.$message.error(errorMessage)
    } else {
      Vue.prototype.$message.error('网络错误，请检查您的连接')
    }
    return Promise.reject(error)
  }
)

Vue.prototype.$http = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
