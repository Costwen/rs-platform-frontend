import Vue from 'vue'
import App from './App.vue'
import router from './router'
import api from './api'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import ol from 'openlayers'
import 'openlayers/css/ol.css'
import './assets/global.css'
Vue.prototype.$ol = ol
Vue.config.productionTip = false
Vue.prototype.$api = api
Vue.use(ElementUI)
const echarts = require('echarts')
Vue.prototype.$echarts = echarts
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
