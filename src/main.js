import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
//axios
import axios from 'axios'
import VueAxios from 'vue-axios'

import {postRequest} from "./utils/api";
import {getRequest} from "./utils/api";
import {putRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";

Vue.config.productionTip=false;

Vue.use(VueAxios, axios);

Vue.use(ElementUI);
//插件形式使用请求
Vue.prototype.postRequest=postRequest;
Vue.prototype.getRequest=getRequest;
Vue.prototype.putRequest=putRequest;
Vue.prototype.deleteRequest=deleteRequest;

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
