<script setup>
import { useOrderApi } from '@/apis/order-api'
import { reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import { useUserStore } from '@/stores/userStore';
import router from '@/router';

const userStore = useUserStore()

const orderApi = useOrderApi()
const orderList = reactive({
    total: 0,
    rows: []
})
const query = reactive({
    page: 1,
    pageSize: 10,
    goodsId: '',
    customerId: '',
    status: '',
    transportId: '',
    loading: false
})
const dialogForm = reactive({
    visible: false,
    dialogTitle: '',
    data: {
        id: 0,
        goodsId: '',
        customerId: '',
        amount: '',
        totalPrice: '',
        status: '',
        startLocation: '',
        endLocation: '',
        transportId: ''
    },
    file: null,
    onConfirm: null
})

const showFormDialog = (title, data, onConfirm) => {
    dialogForm.dialogTitle = title
    if (data != null) {
        dialogForm.data = data
    }
    else {
        dialogForm.data = {
            goodsId: '',
            customerId: '',
            amount: '',
            totalPrice: '',
            status: '',
            startLocation: '',
            endLocation: '',
            transportId: ''
        }

    }
    dialogForm.visible = true
    dialogForm.onConfirm = onConfirm
}

const showDeleteDialog = (id) => {
    ElMessageBox.confirm(
        '确定要删除该数据吗？',
        '警告',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            handleDeleteOrder(id)
        })
}

const handleAddOrder = (data) => {
    orderApi.addOrder(data).then((res) => {
        if (res.code == 1) {
            ElMessage({
                message: '新增成功！',
                type: 'success'
            })
            dialogForm.visible = false
        }
        else if (res.code == 0 && res.msg == 'NOT_LOGIN') {
            userStore.logout()
            router.replace('/login')
            ElMessage.error('登录过期，请登重新登录！')
        }
        else {
            ElMessage.error(res.msg)
        }
        handleQuery()
    })
}

const handleEditOrder = (data) => {
    orderApi.updateOrder(data).then((res) => {
        if (res.code == 1) {
            ElMessage({
                message: '编辑成功！',
                type: 'success'
            })
            dialogForm.visible = false
        }
        else if (res.code == 0 && res.msg == 'NOT_LOGIN') {
            userStore.logout()
            router.replace('/login')
            ElMessage.error('登录过期，请登重新登录！')
        }
        else {
            ElMessage.error(res.msg)
        }
        handleQuery()
    })
}

const handleDeleteOrder = (id) => {
    orderApi.deleteOrder(id).then((res) => {
        if (res.code == 1) {
            ElMessage({
                message: '删除成功！',
                type: 'success'
            })
        }
        else if (res.code == 0 && res.msg == 'NOT_LOGIN') {
            userStore.logout()
            router.replace('/login')
            ElMessage.error('登录过期，请登重新登录！')
        }
        else {
            ElMessage.error(res.msg)
        }
        handleQuery()
    })
}

const handleQuery = () => {
    query.loading = true
    orderApi.getOrders(query.page, query.pageSize, query.goodsId, query.customerId, query.status, query.transportId).then((res) => {
        if (res.code == 1) {
            console.log(res.data);
            orderList.total = res.data.total
            orderList.rows = res.data.rows
        }
        else if (res.code == 0 && res.msg == 'NOT_LOGIN') {
            userStore.logout()
            router.replace('/login')
            ElMessage.error('登录过期，请登重新登录！')
        }
        else {
            ElMessage.error(res.msg)
        }
        query.loading = false
    })
}

const resetQuery = () => {
    query.goodsId = ''
    query.customerId = ''
    query.status = ''
    query.transportId = ''
    handleQuery()
}

const handleSizeChange = (val) => {
    query.pageSize = val
    handleQuery()
}

const handleCurrentChange = (val) => {
    query.page = val
    handleQuery()
}

handleQuery()
</script>

<template>
    <div style="height: 100%;">

        <!-- 操作栏 -->
        <el-row justify="space-between">
            <el-col :span="2">
                <el-button type="primary" @click="showFormDialog('新增订单', null, handleAddOrder)">新增订单</el-button>
            </el-col>
            <el-col :span="3"></el-col>
            <el-col :span="4">
                <el-form-item label="商品编号">
                    <el-input v-model="query.goodsId" />
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label="买家编号">
                    <el-input v-model="query.customerId" />
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label="订单状态">
                    <el-select v-model="query.status" placeholder="选择订单状态" clearable>
                        <el-option label="待发货" value="待发货" />
                        <el-option label="运输中" value="运输中" />
                        <el-option label="已签收" value="已签收" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label="运输编号">
                    <el-input v-model="query.transportId" />
                </el-form-item>
            </el-col>
            <el-col :span="1">
                <el-form-item>
                    <el-button type="primary" @click="handleQuery" :loading="query.loading" size="small">查询</el-button>
                </el-form-item>
            </el-col>
            <el-col :span="1">
                <el-form-item>
                    <el-button type="default" @click="resetQuery" size="small">重置</el-button>
                </el-form-item>
            </el-col>
        </el-row>

        <!-- 表格 -->
        <el-table :data="orderList.rows" height="85%">
            <el-table-column prop="id" label="编号" width="60" />
            <el-table-column prop="goodsId" label="商品编号" />
            <el-table-column prop="customerId" label="买家编号" />
            <el-table-column prop="amount" label="数量" />
            <el-table-column prop="totalPrice" label="总价" />
            <el-table-column prop="status" label="订单状态" />
            <el-table-column prop="startLocation" label="发货地址"></el-table-column>
            <el-table-column prop="endLocation" label="收货地址"></el-table-column>
            <el-table-column prop="transportId" label="运输编号">
                <template #default="scope">
                    {{ scope.row.transportId == null ? '无' : scope.row.transportId }}
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" />
            <el-table-column prop="updateTime" label="更新时间" />
            <!-- 操作按钮 -->
            <el-table-column label="操作" width="140">
                <template #default="scope">
                    <el-button size="small" @click="showFormDialog('编辑用户信息', scope.row, handleEditOrder)">编辑</el-button>
                    <el-button size="small" type="danger" @click="showDeleteDialog(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页控件 -->
        <el-pagination v-model:current-page="query.page" v-model:page-size="query.pageSize" :page-sizes="[5, 10, 20]"
            background layout="total, sizes, prev, pager, next, jumper" :total="orderList.total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />

        <!-- 对话框 -->
        <el-dialog v-model="dialogForm.visible" :title="dialogForm.dialogTitle" width="500">
            <el-form :model="dialogForm.data">
                <el-form-item label="商品编号">
                    <el-input v-model="dialogForm.data.goodsId" />
                </el-form-item>
                <el-form-item label="买家编号">
                    <el-input v-model="dialogForm.data.customerId" />
                </el-form-item>
                <el-form-item label="数量">
                    <el-input v-model="dialogForm.data.amount" />
                </el-form-item>
                <el-form-item label="总价">
                    <el-input v-model="dialogForm.data.totalPrice" />
                </el-form-item>
                <el-form-item label="订单状态">
                    <el-select v-model="dialogForm.data.status" placeholder="选择订单状态">
                        <el-option label="待发货" value="待发货" />
                        <el-option label="运输中" value="运输中" />
                        <el-option label="已签收" value="已签收" />
                    </el-select>
                </el-form-item>
                <el-form-item label="发货地址">
                    <el-input v-model="dialogForm.data.startLocation" />
                </el-form-item>
                <el-form-item label="收货地址">
                    <el-input v-model="dialogForm.data.endLocation" />
                </el-form-item>
                <el-form-item label="运输编号">
                    <el-input v-model="dialogForm.data.transportId" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogForm.visible = false">取消</el-button>
                    <el-button type="primary" @click="dialogForm.onConfirm(dialogForm.data)">
                        确认
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>