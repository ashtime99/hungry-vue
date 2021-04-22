<template>
    <div>
        <div style="display: flex;justify-content: space-between">
            <div>
                <el-input style="width: 300px;margin-right: 10px" prefix-icon="el-icon-search"
                          placeholder="请输入菜名进行搜索..." v-model="searchFoodName"></el-input>
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
                    :data="foods"
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
                        prop=""
                        fixed
                        label="菜品图片">
                    <template slot-scope="scope">
                        <img :src="scope.row.commodityImage" alt="" style="width: 60px;">
                    </template>
                </el-table-column>
                <el-table-column
                        prop="commodityName"
                        fixed
                        label="菜品名称">
                </el-table-column>
                <el-table-column
                        prop="category.categoryName"
                        fixed
                        label="菜品类别">
                </el-table-column>
                <el-table-column
                        label="菜品价格">
                    <template slot-scope="scope">
                        <el-tag size="small">{{scope.row.commodityPrice}}</el-tag>
                        元
                    </template>
                </el-table-column>
                <el-table-column
                        prop="commodityStock"
                        label="菜品库存">
                </el-table-column>
                <el-table-column
                        prop="commodityLocked"
                        label="菜品是/否冻结">
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
        <el-dialog
                :title="title"
                :visible.sync="dialogVisible"
                width="50%">
            <div>
                <el-form ref="foodForm" :model="food" :rules="rules">
                    <el-row style="display: flex;justify-content: center;align-items: center">
                        <el-col :span="12">
                            <el-form-item label="菜品名字：" prop="commodityName">
                                <el-input size="mini" style="width:150px;"
                                          prefix-icon="el-icon-edit" placeholder="请输入菜品名字"
                                          v-model="food.commodityName">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" class="foodImg"
                                style="display: flex;flex-direction: column;align-items: center;justify-content: center">
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="菜品类别：" prop="commodityName">
                                <el-select v-model="food.categoryId" placeholder="请选择菜品类别" size="mini">
                                    <el-option v-for="c in categoryOptions" :label="c.categoryName"
                                               :value="c.categoryId"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="菜品价格：" prop="commodityName">
                                <el-input size="mini" style="width:150px;"
                                          prefix-icon="el-icon-edit" placeholder="请输入菜品价格"
                                          v-model="food.commodityPrice">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="菜品库存：" prop="commodityName">
                                <el-input size="mini" style="width:150px;"
                                          prefix-icon="el-icon-edit" placeholder="请输入菜品库存"
                                          v-model="food.commodityStock">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
<!--                        <el-col :span="12">-->
<!--                            <el-form-item label="菜品规格：" prop="commodityName">-->
<!--                                <el-checkbox-group v-model="food.specs" @change="handleCheckedspecsChange"-->
<!--                                                   style="display: flex;align-items: center">-->
<!--                                    <el-checkbox v-for="c in specOptions" :label="c.specName" :key="c.specId">-->
<!--                                        {{c.specName}}-->
<!--                                    </el-checkbox>-->
<!--                                </el-checkbox-group>-->
<!--                                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"-->
<!--                                             @change="handleCheckAllChange" style="margin-left: 30px">全选-->
<!--                                </el-checkbox>-->
<!--                            </el-form-item>-->
<!--                        </el-col>-->
                        <el-col :span="24">
                            <el-form-item label="菜品是否冻结：" prop="commodityName"
                                          style="display: flex;align-content: center">
                                <el-switch v-model="food.commodityLocked" size="mini"
                                           @change="changeLocked(food.commodityId)"
                                           active-color="#ff4949"
                                           inactive-color="#13ce66">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="菜品描述：" prop="commodityName">
                                <el-input
                                        type="textarea"
                                        :rows="2"
                                        placeholder="请输入菜品描述"
                                        v-model="food.commodityDescribe">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addFood">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "FoodAll",
        data() {
            return {
                searchFoodName: '',
                title: '',
                foods: [],
                categoryOptions: [],
                specOptions: [],
                checkedspecs: [],
                loading: true,
                total: 0,
                currentPage: 1,
                size: 10,
                dialogVisible: false,
                food: {
                    commodityId: null,
                    commodityImage: '',
                    commodityName: '',
                    commodityStock: null,
                    commodityPrice: null,
                    commodityDiscount: '',
                    commodityDescribe: '',
                    commodityLocked: null,
                    commodityEnable: null,
                    commodityCreateTime: '',
                    commodityUpdateTime: '',
                    categoryId:'',
                    category: {
                        categoryId: null,
                        categoryName: ""
                    }
                },
                checkAll: false,
                isIndeterminate: false,
                rules: {
                    commodityName: [
                        {required: true, message: '请输入菜品名称', trigger: 'blur'},
                        {min: 3, max: 5, message: '长度在 3 到 12 个字符', trigger: 'blur'}
                    ]
                }
            }
        },
        mounted() {
            this.initFoodList();
            this.initFoodCategorys();
        },
        methods: {
            addFood() {
                console.log(this.food);
                if (this.food.commodityId==null){
                    this.postRequest('/commodity/', this.food).then(resp => {
                        if (resp) {
                            this.dialogVisible = false;
                            this.initFoodList();
                        }
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '添加失败！'
                        })
                    })
                }else{
                    this.putRequest('/commodity/', this.food).then(resp => {
                        if (resp) {
                            this.dialogVisible = false;
                            this.initFoodList();
                        }
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '更新失败！'
                        })
                    })
                }
            },
            deleteFood(data) {
                this.$confirm("此操作将删除[" + data.commodityName + "],是否继续？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest('/commodity/' + data.commodityId).then(resp => {
                        if (resp) {
                            this.initFoodList();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    })
                })
            },
            handleCheckAllChange(val) {
                this.food.specs = val ? this.specOptions : [];
                this.isIndeterminate = false;
            },
            handleCheckedspecsChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.specOptions.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.specOptions.length;
            },
            currentChange(currentPage) {
                this.currentPage = currentPage;
                this.initFoodList();
            },
            sizeChange(size) {
                this.size = size;
                this.initFoodList();
            },
            showAddFood() {
                this.title = '添加菜品';
                this.food = {
                    commodityId: null,
                    commodityImage: '',
                    commodityName: '',
                    commodityStock: null,
                    commodityPrice: null,
                    commodityDiscount: '',
                    commodityDescribe: '',
                    commodityLocked: null,
                    commodityEnable: null,
                    commodityCreateTime: '',
                    commodityUpdateTime: '',
                    category: {
                        categoryId: null,
                        categoryName: ""
                    }
                };
                this.dialogVisible = true;
            },
            showFoodEditView(data) {
                this.food = {
                    commodityId: data.commodityId,
                    commodityImage: data.commodityImage,
                    commodityName: data.commodityName,
                    commodityStock: data.commodityStock,
                    commodityPrice: data.commodityPrice,
                    commodityDiscount: data.commodityDiscount,
                    commodityDescribe: data.commodityDescribe,
                    commodityLocked: data.commodityLocked,
                    categoryId: data.category.categoryId,
                    category:{
                        categoryName: data.category.categoryName,
                    }
                };
                this.title = '编辑菜品'
                this.dialogVisible = true;

            },
            initFoodList() {
                this.loading = false;
                this.getRequest('/commodity/all?currentPage=' + this.currentPage + '&size=' + this.size).then(resp => {
                    if (resp) {
                        this.foods = resp.data;
                        this.total = resp.total;

                    }
                })
            },
            initFoodCategorys() {
                this.getRequest('/category/').then(resp => {
                    if (resp) {
                        this.categoryOptions = resp;
                    }
                })
            },
            searchFood() {
                this.loading = false;
                this.getRequest('/commodity/all?currentPage=' + this.currentPage + '&size=' + this.size + '&keywords=' + this.searchFoodName).then(resp => {
                    if (resp) {
                        this.foods = resp.data;
                        this.total = resp.total;

                    }
                })
            },
            //修改商品状态
            changeLocked(data) {
                if (data!=null){
                    this.putRequest('/commodity/locked/'+data, this.food).then(resp => {
                    })
                }
            }
        }
    }
</script>

<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>