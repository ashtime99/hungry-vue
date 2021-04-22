<template>
    <div>
        <el-steps :active="active" finish-status="success">
            <el-step title="订单确认"></el-step>
            <el-step title="订单支付"></el-step>
            <el-step title="完成"></el-step>
        </el-steps>

        <el-tabs v-model="activeName" @tab-click="handleClick">
            <p>{{order.orderId}}</p>
            <el-tab-pane label="订单确认" name="first">
                <el-table
                        :data="orderDetailedsList"
                        stripe
                        style="width: 100%;height: 500px" class="el-table1">
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
                            label="单价">
                        <template slot-scope="scope">
                            <el-tag type="small">{{scope.row.orderDetailedPrice}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="数量"
                            width="120">
                        <template slot-scope="scope">
                            <el-tag type="small">{{scope.row.orderDetailedNum}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="总价">
                        <template slot-scope="scope">
                            {{scope.row.orderDetailedTotal}}
                        </template>
                    </el-table-column>
                </el-table>
                <el-button style="margin-top: 12px;" @click="initPay()">下一步</el-button>
            </el-tab-pane>
            <el-tab-pane label="订单支付" name="second">
                订单支付
                <div id="payform"></div>
            </el-tab-pane>
            <el-tab-pane label="完成" name="third">完成</el-tab-pane>
        </el-tabs>


    </div>
</template>

<script>
    export default {
        name: "FoodSettle",
        data() {
            return {
                active: 0,
                activeName: "first",
                order: null,
                orderDetailedsList: [],
                state: 0,
                oid:null
            };
        },
        mounted() {
            this.initOrderList();
        },
        methods: {
            next() {
                this.activeName = "second"
                if (this.active++ > 2) this.active = 0;
            },
            handleClick(tab, event) {
                console.log(tab, event);
            },
            initOrderList() {
                this.loading = false;

                this.getRequest('/order/byState?state=' + this.state).then(resp => {
                    if (resp) {
                        this.order = resp[0]
                        this.orderDetailedsList = resp[0].orderDetaileds
                    }
                })
            },
            initPay() {
                console.log(this.order.orderId);
                this.getRequest('/order/pay?oid='+this.order.orderId).then(resp => {
                    if (resp) {
                        console.log(resp);
                        console.log("【支付宝返回】" + resp.data);
                        this.activeName = "second"
                        if (this.active++ > 2) this.active = 0;
                        document.querySelector('#payform').innerHTML = resp;//查找到当前页面的body，将后台返回的form替换掉他的内容
                        document.forms[0].setAttribute('target', '_blank') // 新开窗口跳转
                        document.forms[0].submit();
                    }
                })

            }
        }
    }
</script>

<style scoped>

</style>