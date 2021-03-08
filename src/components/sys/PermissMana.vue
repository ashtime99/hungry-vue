<template>
<div>
  <div class="permissManaTool">
    <el-input size="small" placeholder="请输入角色英文名" v-model="role.name">
    <template slot="prepend">ROLE_</template>
    </el-input>
    <el-input size="small" v-model="role.nameZh" placeholder="请输入角色中文名"></el-input>
    <el-button size="small" type="primary" icon="el-icon-plus">添加角色</el-button>
  </div>
  <div class="permissManaMain">
    <el-collapse v-model="activeName" accordion @change="change">
      <el-collapse-item :title="r.roleNameZh" :name="r.roleId" v-for="(r,index) in roles" :key="index">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>可访问菜单资源</span>
            <el-button style="float: right; padding: 3px 0;color: red" type="text" icon="el-icon-delete"></el-button>
          </div>
          <div>
            <el-tree :data="allMenus"
                     :props="defaultProps"
                     :default-checked-keys="selectedMenus"
                     :key="index"
                     ref="treeRef"
                     node-key="menuId"
                     show-checkbox></el-tree>
            <div style="display: flex;justify-content: flex-end">
                <el-button size="mini" @click="cancelUpdate">取消修改</el-button>
                <el-button size="mini" type="primary" @click="doUpdate(r.roleId,index)">确认修改</el-button>
            </div>
          </div>
        </el-card>
      </el-collapse-item>
    </el-collapse>
  </div>
</div>
</template>

<script>
export default {
  name: "PermissMana",
  data(){
    return{
      role:{
        name:'',
        nameZh:''
      },
      roles:[],
      allMenus:[],
      selectedMenus:[],
      defaultProps:{
        children:'children',
        label:'menuName'
      },
      activeName:-1// 折叠面板 默认关闭
    }
  },
  mounted() {
    this.initRoles();
    this.initAllMenus();
  },
  methods:{
    cancelUpdate(){
      this.activeName=-1;//关闭折叠面板
    },
    doUpdate(roleId,index){
      let tree=this.$refs.treeRef[index];
      let selectedKeys=tree.getCheckedKeys();
      let url='/system/basic/permission/?rid='+roleId;
      selectedKeys.forEach(key=>{
        url+='&mids='+key;
      });
      //更新角色菜单
      this.putRequest(url).then(resp=>{
        if (resp){
          this.initRoles();
          this.initSelectedMenus(roleId);
          this.activeName=-1;
        }
      })
    },
    change(roleId){
      if (roleId){
        this.initAllMenus();
        this.initSelectedMenus(roleId);
      }
    },
    initSelectedMenus(roleId){
      //根据角色 id 查询菜单 id
      this.getRequest('/system/basic/permission/mid/'+roleId).then(resp=>{
        if (resp){
          this.selectedMenus=resp;
          console.log(resp);
        }
      })
    },
    initAllMenus(){
      //查询所有菜单
      this.getRequest('/system/basic/permission/menus').then(resp=>{
        if (resp){
          this.allMenus=resp;
        }
      })
    },
    initRoles(){
      //获取所有角色
      this.getRequest('/system/basic/permission/').then(resp=>{
        if (resp){
          this.roles=resp;
        }
      })
    }
  }
}
</script>

<style>
.permissManaTool{
  display: flex;
}
.permissManaTool .el-input{
  width: 300px;
  margin-right: 8px;
}
.permissManaMain{
  margin-top: 10px;
  width: 750px;
}
</style>