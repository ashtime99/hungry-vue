<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="角色管理" name="ArMana"><ArMana/></el-tab-pane>
      <el-tab-pane label="菜单管理" name="MenuMana"><menu-mana/></el-tab-pane>
      <el-tab-pane label="订单状态组" name="OrderStMana"><OrderStMana/></el-tab-pane>
      <el-tab-pane label="权限组" name="PermissMana"><permiss-mana/></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
 import ArMana from "@/components/sys/ArMana";
 import MenuMana from "@/components/sys/MenuMana";
 import OrderStMana from "@/components/sys/OrderStMana";
 import PermissMana from "@/components/sys/PermissMana";

export default {
name: "SysBasic",
  data(){
    return{
      activeName:'PermissMana'
    }
  },
  components:{
    ArMana,
    MenuMana,
    OrderStMana,
    PermissMana
  }
}
</script>

<style scoped>

</style>