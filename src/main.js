import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from '../../hungry-vue/src/App.vue'
import router from '../../hungry-vue/src/router'
//axios
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.config.productionTip=false

Vue.use(VueAxios, axios)


Vue.use(ElementUI)

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
