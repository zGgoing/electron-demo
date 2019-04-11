import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import 'iview/dist/styles/iview.css'

Vue.use(iView)

// 接收主进程消息，在关闭前清store
let ipcRenderer = require('electron').ipcRenderer
ipcRenderer.on('clear-store', () => {
  store.dispatch('setLoginState', false)
})

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
