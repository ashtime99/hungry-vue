import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import Router from 'vue-router'
import 'font-awesome/css/font-awesome.css'
//axios
import axios from 'axios'
import VueAxios from 'vue-axios'
//Vuex
import store from './store'

import {postRequest} from "./utils/api";
import {getRequest} from "./utils/api";
import {putRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";
import {initMenu} from "@/utils/menus";

Vue.config.productionTip=false;

Vue.use(VueAxios, axios);

Vue.use(ElementUI);
//插件形式使用请求
Vue.prototype.postRequest=postRequest;
Vue.prototype.getRequest=getRequest;
Vue.prototype.putRequest=putRequest;
Vue.prototype.deleteRequest=deleteRequest;

//vue-router@3.0版本及以上回调形式已经改成promise api的形式了，返回的是一个promise，
//如果路由地址跳转相同, 且没有捕获到错误，控制台始终会出现如图所示的警告
//（注：3.0以下版本则不会出现以下警告！！！，因路由回调问题…）
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}


router.beforeEach((to,from,next)=>{
  if (window.sessionStorage.getItem('tokenStr')){
    initMenu(router,store);
    if (!window.sessionStorage.getItem('user')){
      return getRequest('/admin/info').then(resp=>{
        //判断用户信息是否存在
        if(resp){
          //存入用户信息
          window.sessionStorage.setItem('user',JSON.stringify(resp));
          next();
        }
      })
    }
    next();
  }else {
    if (to.path=='/'||to.path=='/user/'){
      next();
    }else{
      next('/?redirect='+to.path);
    }
  }
})

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
