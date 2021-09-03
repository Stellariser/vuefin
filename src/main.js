import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'

var axios = require('axios')

axios.defaults.baseURL = 'http://localhost:8081/PlatFormInterfaceTest_war_exploded/'
// axios.defaults.baseURL = 'http://10.10.10.131:8080/PlatFormInterfaceTest_war/'
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios.defaults.baseURL = 'http://192.168.244.129:8080/PlatFormInterfaceTest_war/'
axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
