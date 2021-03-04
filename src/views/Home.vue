<template>
  <el-container>
    <el-header class="homeHeader">
      <div class="logoTitle">Hungry-外卖订餐管理系统</div>
      <el-dropdown class="userInfo" @command="commandHandler">
      <span class="el-dropdown-link">
        <i><img :src="user.adminFace"></i>
      </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item disabled style="color: black;font-weight: bold" >{{ user.adminUsername}}</el-dropdown-item>
          <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
          <el-dropdown-item command="setting">设置</el-dropdown-item>
          <el-dropdown-item command="logout">注销登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu router unique-opened>
          <el-submenu :index="index+''"
                      v-for="(item,index) in routes" :key="index"
                      v-if="!item.hidden">
            <template slot="title">
              <i :class="item.iconCls" style="color:#0099ec;margin-right: 5px"></i>
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item :index="children.path"
                            v-for="(children,index) in item.children">{{ children.name }}
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <el-breadcrumb v-if="this.$router.currentRoute.path!='/home'" separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="homeWelcome" v-if="this.$router.currentRoute.path=='/home'">
          欢迎进入系统
        </div>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      user: JSON.parse(window.sessionStorage.getItem('user'))
    }
  },
  computed: {
    routes() {
      return this.$store.state.routes;
    }
  },
  methods:{
    commandHandler(command){
      if (command=='logout'){
        this.$confirm('此操作将注销登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //注销登录
          this.postRequest('/logout');
          //清空用户信息
          window.sessionStorage.removeItem('tokenStr');
          window.sessionStorage.removeItem('user');
          //清空菜单
          this.$store.commit('initRoutes',[]);
          //跳转到登录页
          this.$router.replace('/')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }
    }
  }
}
</script>

<style>
.homeHeader {
  background-color: #0099ec;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  box-sizing: border-box;
}

.logoTitle {
  font-size: 24px;
  color: white;
}
.userInfo{
  width:100px;
  cursor: pointer;
  color: white;
}
.userInfo span{
  display: block;
  height: 40px;
}

.el-dropdown-link img{
  width:40px;
  height: 40px;
  border-radius: 20px;
}

</style>