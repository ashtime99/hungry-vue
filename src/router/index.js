//引入vue
import Vue from 'vue';
//引入vue-router
import VueRouter from 'vue-router';

import Login  from '../views/Login.vue';
import Home  from '../views/Home.vue';

//第三方库需要use一下才能用
Vue.use(VueRouter)


//定义routes路由的集合，数组类型
const routes=[
  {
    path:'/',
    name:'Login',
    component:Login,
    hidden:true
  }
]

//实例化VueRouter并将routes添加进去
const router=new VueRouter({
//ES6简写，等于routes：routes
  routes
});

//抛出这个这个实例对象方便外部读取以及访问
export default router