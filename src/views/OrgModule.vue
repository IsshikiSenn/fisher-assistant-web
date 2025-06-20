<script setup>
import { useOrgApi } from '@/apis/org-api'
import { reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';

const userStore = useUserStore()
const router = useRouter()
const orgApi = useOrgApi()
const orgList = reactive({
    total: 0,
    rows: []
})
const query = reactive({
    loading: false,
    page: 1,
    pageSize: 10,
    name: ''

})
const dialogForm = reactive({
    visible: false,
    dialogTitle: '',
    data: {
        id: 0,
        name: '',
        adminId: '',
    },
    onConfirm: null
})

const showFormDialog = (title, data, onConfirm) => {
    dialogForm.dialogTitle = title
    if (data != null) {
        dialogForm.data = data
    }
    else {
        dialogForm.data = {
            name: '',
            adminId: '',
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
            handleDeleteOrg(id)
        })
}

const handleAddOrg = (data) => {
    orgApi.addOrg(data).then((res) => {
        if (res.code == 1) {
            ElMessage({
                message: '新增成功！',
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
    dialogForm.visible = false
}

const handleEditOrg = (data) => {
    orgApi.updateOrg(data).then((res) => {
        if (res.code == 1) {
            ElMessage({
                message: '编辑成功！',
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
    dialogForm.visible = false
}

const handleDeleteOrg = (id) => {
    orgApi.deleteOrg(id).then((res) => {
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
    })
}

const handleQuery = () => {
    query.loading = true
    orgApi.getOrgs(query.page, query.pageSize, query.name).then((res) => {
        if (res.code == 1) {
            console.log(res.data);
            orgList.total = res.data.total
            orgList.rows = res.data.rows
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
    query.name = ''
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
                <el-button type="primary" @click="showFormDialog('新增组织', null, handleAddOrg)">新增组织</el-button>
            </el-col>
            <el-col :span="12">
            </el-col>
            <el-col :span="6">
                <el-form-item label="组织名称">
                    <el-input v-model="query.name" />
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
        <el-table :data="orgList.rows" height="85%">
            <el-table-column prop="id" label="编号" width="60" />
            <el-table-column prop="name" label="组织名称" />
            <el-table-column prop="adminId" label="管理员编号" />
            <el-table-column prop="createTime" label="创建时间" />
            <el-table-column prop="updateTime" label="更新时间" />
            <!-- 操作按钮 -->
            <el-table-column label="操作" width="140">
                <template #default="scope">
                    <el-button size="small" @click="showFormDialog('编辑组织信息', scope.row, handleEditOrg)">编辑</el-button>
                    <el-button size="small" type="danger" @click="showDeleteDialog(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页控件 -->
        <el-pagination v-model:current-page="query.page" v-model:page-size="query.pageSize" :page-sizes="[5, 10, 20]"
            background layout="total, sizes, prev, pager, next, jumper" :total="orgList.total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />

        <!-- 对话框 -->
        <el-dialog v-model="dialogForm.visible" :title="dialogForm.dialogTitle" width="500">
            <el-form :model="dialogForm.data">
                <el-form-item label="组织名称">
                    <el-input v-model="dialogForm.data.name" />
                </el-form-item>
                <el-form-item label="管理员编号">
                    <el-input v-model="dialogForm.data.adminId" />
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