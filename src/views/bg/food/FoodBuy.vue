<template>
    <div>
        <el-button @click="showShoppCartView" type="primary" style="margin-left: 16px;">
            购物车
        </el-button>
        <el-tabs v-model="activeName">
            <el-tab-pane label="主菜" name="MainFood">
                <MainFood></MainFood>
            </el-tab-pane>
            <el-tab-pane label="凉菜" name="ColdFood">
                <ColdFood></ColdFood>
            </el-tab-pane>
            <el-tab-pane label="甜点" name="Sweets">
                <Sweets></Sweets>
            </el-tab-pane>
            <el-tab-pane label="饮料" name="Drink">
                <Drink></Drink>
            </el-tab-pane>
        </el-tabs>
        <div>
            <el-drawer
                    title="购物车"
                    :visible.sync="drawer">
                <div>
                    <div style="width: 100%;display: flex;justify-content:flex-end;align-items: center;">
                        <el-button type="danger" size="small" style="margin-right: 10px">删除选中的商品</el-button>
                    </div>
                    <el-table
                            :data="shoppingcarts"
                            stripe
                            show-summary
                            :summary-method="getSummaries"
                            style="width: 100%;height: 780px" class="el-table1">
                        <el-table-column
                                type="selection"
                                width="55">
                        </el-table-column>
                        <el-table-column
                                label="商品图片">
                            <template slot-scope="scope">
                                <img :src="scope.row.commodity.commodityImage" alt="" style="width: 60px;">
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="commodity.commodityName"
                                label="商品名">
                        </el-table-column>
                        <el-table-column
                                prop="commodity.commodityPrice"
                                label="单价">
                        </el-table-column>
                        <el-table-column
                                label="数量"
                                width="120">
                            <template slot-scope="scope">
                                <div style="display:flex;font-size: 25px;justify-content: center;align-items: center;">
                                    <i class="el-icon-remove" @click="subShopCart(scope.row.shoppingcartId)"></i>
                                    <el-input v-model="scope.row.shoppingcartNum" maxlength="2"/>
                                    <i class="el-icon-circle-plus" @click="addShopCart(scope.row.shoppingcartId)"></i>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="总价">
                            <template slot-scope="scope">
                                    {{(scope.row.shoppingcartNum)*(scope.row.commodity.commodityPrice)}}
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="操作">
                            <el-button type="danger" size="small" @click="deleteFood(scope.row)">删除</el-button>
                        </el-table-column>
                    </el-table>
                    <div style="width: 100%;display: flex;justify-content: center;align-items: center;">
                        <el-button type="primary" style="width: 90%;margin-top: 8px" @click="intoOrder()">下单</el-button>
                    </div>
                </div>
            </el-drawer>
        </div>
    </div>
</template>

<script>
    import MainFood from "../../../components/food/MainFood";
    import ColdFood from "../../../components/food/ColdFood";
    import Sweets from "../../../components/food/Sweets";
    import Drink from "../../../components/food/Drink";
    import ShoppingCart from "../../../components/food/ShoppingCart"

    export default {
        name: "FoodBuy",
        data() {
            return {
                activeName: 'MainFood',
                drawer: false,
                shoppingcarts: [],
                shoppingcart: {
                    shoppingcartId: null,
                    userId: null,
                    commodityId: null,
                    shoppingcartNum: 0,
                    shoppingcartLocked: false
                },
                order: {
                    orderTotal: "",
                    orderDiningStyle: true,
                    orderRemarks: "",
                    orderDetaileds: []
                },
                delids:[]
            }
        },
        components: {
            MainFood, ColdFood, Sweets, Drink, ShoppingCart
        },
        mounted() {
            this.initShoppingCartList();
        },
        methods: {
            showShoppCartView() {
                this.initShoppingCartList();
                this.drawer = true
            },
            initShoppingCartList() {
                this.loading = false;

                this.getRequest('/shoppingcart/').then(resp => {
                    if (resp) {
                        this.shoppingcarts = resp;
                    }
                })
            },
            intoOrder() {
                for (var i = 0; i < this.shoppingcarts.length; i++) {
                    var a = {commodityId: 0, orderDetailedPrice: 0, orderDetailedNum: 0};
                    a.commodityId = this.shoppingcarts[i].commodityId;
                    a.orderDetailedPrice = this.shoppingcarts[i].commodity.commodityPrice;
                    a.orderDetailedNum = this.shoppingcarts[i].shoppingcartNum;
                    this.order.orderDetaileds.push(a)
                }
                this.postRequest('/order/addOrder', this.order).then(resp => {
                    if (resp) {
                        this.delids=this.shoppingcarts.map(item=>item.shoppingcartId);
                        //console.log(ids);
                        this.deleteRequest(/shoppingcart/,this.delids).then(resp1=>{
                            if (resp1){
                                this.shoppingcarts=[];
                                this.drawer = false;
                                this.$router.replace('/food/settlement')
                            }
                        })
                    }
                })
            },
            getSummaries(param) {
                const { columns, data } = param;
                const sums = [];
                sums[0]='合计';
                sums[4]=0;
                data.forEach(item=> {
                    sums[4]+=Number(item.shoppingcartNum)
                })
                sums[5]=0;
                data.forEach(item=> {
                    sums[5]+=Number(item.shoppingcartNum*item.commodity.commodityPrice)
                })
                this.order.orderTotal=sums[5];
                return sums;
            }

        }
    }
</script>

<style>
    .el-table1 th, .el-table1 td {
        text-align: center;
    }
</style>