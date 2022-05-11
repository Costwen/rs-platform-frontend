import Vue from 'vue'
import App from './App.vue'
import router from './router'
import api from './api'
import ElementUI from 'element-ui'
import vuetify from '@/plugins/vuetify' // path to vuetify export
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
  vuetify,
  render: h => h(App)
}).$mount('#app')
