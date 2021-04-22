<template>
  <div style="height: 100%;">
    <el-container style="min-height:100%">
      <el-header class="homeHeader">
        <div class="logoTitle"><img src="../../../public/hungry.png" style="height:40px;margin-right:5px"/><span>Hungry-外卖订餐管理系统</span></div>
        <el-dropdown class="userInfo" @command="commandHandler">
      <span class="el-dropdown-link">
        <i><img :src="user.adminFace"></i>
      </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item disabled style="color: black;font-weight: bold" >{{ user.adminUsername}}</el-dropdown-item>
            <el-dropdown-item command="userinfo" @click="showUserInfo()">个人中心</el-dropdown-item>
            <el-dropdown-item command="setting">设置</el-dropdown-item>
            <el-dropdown-item command="logout">注销登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-container style="min-height:100%">
        <el-aside width="250px" style="min-height:100%">
          <el-menu router unique-opened background-color="#545c64"
                   text-color="#fff" style="min-height:100%">
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
        <el-main style="height:880px">
          <el-breadcrumb v-if="this.$router.currentRoute.path!='/home'" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="homeWelcome" v-if="this.$router.currentRoute.path=='/home'">
            <h1>欢迎进入系统</h1>
          </div>
          <router-view class="homeRouterView"/>
        </el-main>
      </el-container>
      <el-footer class="homeFooter" style="height: 22px">@xiayichao</el-footer>
    </el-container>
    <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>

</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      user: JSON.parse(window.sessionStorage.getItem('user')),
      dialogVisible:false
    }
  },
  computed: {
    routes() {
      return this.$store.state.routes;
    }
  },
  methods:{
    showUserInfo(){
      this.dialogVisible = true
    },
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
.logoTitle{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.logoTitle span{
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
.homeRouterView{
  margin-top: 10px;
}
  .homeFooter{
    background-color: #0099ec;
    display: flex;
    align-items: center;
    justify-content: center;
  }

</style>