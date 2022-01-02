import Vue from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'

// element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import htmlToPdf from "utils/htmlToPdf.js"


Vue.config.debug = true


Vue.use(ElementUI)

Vue.use(htmlToPdf)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')