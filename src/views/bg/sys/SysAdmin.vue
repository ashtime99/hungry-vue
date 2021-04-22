<template>
    <div>
        <div style="display: flex;justify-content: space-between">
            <div>
                <el-input style="width: 300px;margin-right: 10px" prefix-icon="el-icon-search"
                          placeholder="请输入用户名进行搜索..." v-model="searchFoodName"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="searchFood">搜索</el-button>
            </div>
            <div>
                <el-button type="success">
                    <i class="fa fa-level-up" aria-hidden="true">导入数据</i>
                </el-button>
                <el-button type="success">
                    <i class="fa fa-level-down" aria-hidden="true">导出数据</i>
                </el-button>
                <el-button type="primary" icon="el-icon-plus" @click="showAddFood">添加菜品</el-button>
            </div>
        </div>
        <div>
            <el-table
                    max-height="700"
                    border
                    :data="userList"
                    stripe
                    style="width: 100%;margin-top: 10px"
                    v-loading="loading"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="adminId"
                        fixed
                        label="用户id">
                </el-table-column>
                <el-table-column
                        prop="adminUsername"
                        fixed
                        label="用户名">
                </el-table-column>
                <el-table-column
                        prop="adminPhone"
                        fixed
                        label="用户电话">
                </el-table-column>
                <el-table-column
                        label="用户角色">
                    <template slot-scope="scope">
                        <el-tag size="small">{{scope.row.roles[0].roleName}}</el-tag>
                    </template>
                </el-table-column>
              <el-table-column
                      label="用户中文角色">
                <template slot-scope="scope">
                  <el-tag size="small">{{scope.row.roles[0].roleNameZh}}</el-tag>
                </template>
              </el-table-column>
                <el-table-column
                        prop="commodityLocked"
                        label="用户是/否冻结">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.commodityLocked" size="mini"
                                   @change="changeLocked(scope.row.commodityId)"
                                   active-color="#ff4949"
                                   inactive-color="#13ce66">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="300"
                        fixed="right">
                    <template slot-scope="scope">
                        <el-button size="small" @click="showFoodEditView(scope.row)">编辑</el-button>
                        <el-button type="primary" size="small">查看详细</el-button>
                        <el-button type="danger" size="small" @click="deleteFood(scope.row)">删除</el-button>
                    </template>

                </el-table-column>
            </el-table>
            <div style="display: flex;justify-content: flex-end;margin-top: 10px">
                <el-pagination
                        background
                        @size-change="sizeChange"
                        @current-change="currentChange"
                        layout="prev, pager, next, jumper, ->, total"
                        :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SysAdmin",
        data() {
          return {
            searchUserName: '',
            loading: true,
            userList: [],
            total: 0,
            currentPage: 1,
            size: 10,
          }
        },
        mounted() {
            this.initUserList();
        },
        methods: {
          initUserList(){
            this.loading = false;
            this.getRequest('/system/admin/all?currentPage=' + this.currentPage + '&size=' + this.size+'&adminType=' + 1 + '&keywords=' + this.searchUserName).then(resp => {
              if (resp) {
                this.userList = resp.data;
                this.total = resp.total;
              }
            })
          }
        }

    }
</script>

<style scoped>

</style>