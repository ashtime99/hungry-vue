<template>
    <div>
        <div style="display: flex;justify-content: space-between">
            <div>
                <el-input style="width: 300px;margin-right: 10px" prefix-icon="el-icon-search"
                          placeholder="请输入订单号进行搜索..." v-model="searchOrderId"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="searchOrder">搜索</el-button>
                <!--                <el-button type="success" icon="el-icon-search" @click="searchOrder">高级搜索</el-button>-->
            </div>
            <div>
                <el-button type="success">
                    <i class="fa fa-level-down" aria-hidden="true">导出数据</i>
                </el-button>
            </div>
        </div>

        <div>
            <el-table
                    border
                    :data="orders"
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
                        prop="orderId"
                        fixed
                        label="订单号">
                </el-table-column>
                <el-table-column
                        fixed
                        label="订单状态">
                    <template slot-scope="scope">
                        <el-tag size="small" type="danger"
                                v-if="scope.row.orderStatus<4&&scope.row.orderStatus>0">
                            {{scope.row.stateName}}
                        </el-tag>
                        <el-tag size="small" type="warning"
                                v-if="scope.row.orderStatus<7&&scope.row.orderStatus>3">
                            {{scope.row.stateName}}
                        </el-tag>
                        <el-tag size="small" type="primary"
                                v-if="scope.row.orderStatus<10&&scope.row.orderStatus>6">
                            {{scope.row.stateName}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="admin.adminUsername"
                        fixed
                        label="用户名">
                </el-table-column>
                <el-table-column
                        prop="userAddress.addressDescribe"
                        fixed
                        label="地址">
                </el-table-column>
                <el-table-column
                        prop="operatorId"
                        fixed
                        label="操作员id">
                </el-table-column>
                <el-table-column
                        prop="driverId"
                        fixed
                        label="配送员id">
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="300"
                        fixed="right">
                    <template slot-scope="scope">
                        <el-button size="small">编辑</el-button>
                        <el-button type="primary" size="small" @click="showOrderInfo(scope.row)">查看详细</el-button>
                        <!--                        <el-button type="danger" size="small">冻结</el-button>-->
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
            <el-dialog
                    :title="dialogname"
                    :visible.sync="dialogVisible"
                    width="50%">
                <el-timeline :reverse="reverse" :timestamp="order.timestamp">
                    <el-row class="orderInfoBoxRow">
                        <el-col :span="12" class="orderInfoBoxCole">
                            <div>
                                <el-timeline>
                                    <el-timeline-item
                                            v-for="(activity, index) in activities"
                                            :key="index"
                                            :icon="activity.icon"
                                            :type="activity.type"
                                            :color="activity.color"
                                            :size="activity.size"
                                            :timestamp="activity.timestamp">
                                        {{activity.content}}
                                    </el-timeline-item>
                                </el-timeline>
                            </div>
                        </el-col>
                        <el-col :span="10" class="orderInfoBoxCole">
                            <div>
                                <el-row class="orderInfoRowRow">
                                    <el-col :span="12"><div>用户名：</div></el-col>
                                    <el-col :span="12"><div>{{order.user.userNickname}}</div></el-col>
                                </el-row>
                                <el-row class="orderInfoRowRow">
                                    <el-col :span="12"><div>订单状态：</div></el-col>
                                    <el-col :span="12"><div>{{order.orderStatus.orderStatusName}}</div></el-col>
                                </el-row>
                                <el-row class="orderInfoRowRow">
                                    <el-col :span="12"><div>订单地址：</div></el-col>
                                    <el-col :span="12"><div>{{order.userAddress.addressDescribe}}</div></el-col>
                                </el-row>
                                <el-row class="orderInfoRowRow">
                                    <el-col :span="12"><div>订单就餐方式：</div></el-col>
                                    <el-col :span="12"><div>{{order.orderDiningStyle}}</div></el-col>
                                </el-row>
                                <el-row class="orderInfoRowRow">
                                    <el-col :span="16"><div>订单备注：</div></el-col>
                                    <el-col :span="8"><div>{{order.orderRemarks}}</div></el-col>
                                </el-row>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-table
                                    :data="orderDetaileds"
                                    style="width: 100%">
                                <el-table-column
                                        prop="commoditySpec.commodity.commodityName"
                                        label="菜品"
                                        width="180">
                                </el-table-column>
                                <el-table-column
                                        prop="commoditySpec.spec.specName"
                                        label="规格"
                                        width="180">
                                </el-table-column>
                                <el-table-column
                                        prop="orderDetailedNum"
                                        label="数量"
                                        width="180">
                                </el-table-column>
                                <el-table-column
                                        prop="orderDetailedPrice"
                                        label="价格">
                                </el-table-column>
                            </el-table>
                        </el-col>

                    </el-row>


                </el-timeline>
            </el-dialog>
        </div>

    </div>
</template>

<script>
    export default {
        name: "OrdAll",
        data() {
            return {
                dialogname: "",
                searchOrderId: null,
                orders: [],
                order: {
                    orderId: null,
                    orderStatusId: null,
                    userId: null,
                    addressId: null,
                    operatorId: null,
                    orderDelivery: true,
                    driverId: null,
                    orderTotal: "",
                    orderCreateTime: null,
                    orderUpdateTime: null,
                    orderCancelTime: null,
                    orderPaidTime: null,
                    orderReceivedTime: null,
                    orderDeliveryTime: null,
                    orderCompletedTime: null,
                    orderDiningStyle: null,
                    orderRemarks: null,
                    user: {
                        userId: null,
                        userUsername: null,
                        userPassword: null,
                        userAge: null,
                        userPhone: null,
                        userNickname: "",
                        userLocked: null,
                        userEnabled: null,
                        userLoginTime: null,
                        userCreateTime: null,
                        userUpdateTime: null
                    },
                    userAddress: {
                        addressId: null,
                        userId: null,
                        addressDescribe: "",
                        addressDelete: null,
                        addressCreateTime: null,
                        addressUpdateTime: null
                    },
                    orderStatus: {
                        orderStatusId: null,
                        orderStatusName: ""
                    },
                },
                loading: true,
                total: 0,
                currentPage: 1,
                size: 10,
                dialogVisible: false,
                orderDetaileds:[],
                activities: [{
                    content: '订单创建',
                    timestamp: '2018-04-12 20:46',
                    size: 'large',
                    type: 'primary',
                    icon: 'el-icon-more'
                }, {
                    content: '下单时间',
                    timestamp: '2018-04-03 20:46',
                    color: '#0bbd87'
                }, {
                    content: '订单接收时间',
                    timestamp: '2018-04-03 20:46',
                    size: 'large'
                }, {
                    content: '订单配送时间',
                    timestamp: '2018-04-03 20:46'
                }]
            }
        },
        mounted() {
            this.initOrderList();
        },
        methods: {
            currentChange(currentPage) {
                this.currentPage = currentPage;
                this.initOrderList();
            },
            sizeChange(size) {
                this.size = size;
                this.initOrderList();
            },
            initOrderList() {
                this.loading = false;
                this.getRequest('/order/all?currentPage=' + this.currentPage + '&size=' + this.size).then(resp => {
                    console.log(resp);
                    if (resp) {
                        this.orders = resp.data;
                        this.total = resp.total;

                    }
                })
            },
            initOrderDetailedList(orderId) {
                this.loading = false;
                this.getRequest('/order/detailed/orderId='+orderId).then(resp => {
                    console.log(resp);
                    if (resp) {
                        this.orderDetaileds = resp;
                    }
                })
            },
            searchOrder() {
                this.getRequest('/order/all?currentPage=' + this.currentPage + '&size=' + this.size + '&orderId=' + this.searchOrderId).then(resp => {
                    console.log(resp);
                    if (resp) {
                        this.orders = resp.data;
                        this.total = resp.total;
                    }
                })
            },
            showOrderInfo(data) {
                this.order = {
                    orderId: data.orderId,
                    orderStatusId: null,
                    userId: null,
                    addressId: null,
                    operatorId: null,
                    orderDelivery: true,
                    driverId: null,
                    orderTotal: "",
                    orderCreateTime: data.orderCreateTime,
                    orderUpdateTime: data.orderUpdateTime,
                    orderCancelTime: data.orderCancelTime,
                    orderPaidTime: data.orderPaidTime,
                    orderReceivedTime: data.orderReceivedTime,
                    orderDeliveryTime: data.orderDeliveryTime,
                    orderCompletedTime: data.orderCompletedTime,
                    orderDiningStyle: null,
                    orderRemarks: null,
                    user: {
                        userNickname: data.user.userNickname,
                    },
                    userAddress: {
                        addressDescribe: data.userAddress.addressDescribe,
                    },
                    orderStatus: {
                        orderStatusName: data.orderStatus.orderStatusName
                    },
                    orderDetaileds: null
                }
                this.initOrderDetailedList( data.orderId);
                this.dialogname = "查看订单详细信息"
                this.dialogVisible = true;
                console.log(data);

            }
        }
    }
</script>

<style>
    .orderInfoBoxRow{
        
    }
.orderInfoRowRow{
    height: 30px;
    border-bottom: 1px solid black;
    line-height: 30px;
}
</style>