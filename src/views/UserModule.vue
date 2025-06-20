<script setup>
import { useUserApi } from '@/apis/user-api'
import { reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import { useUserStore } from '@/stores/userStore';
import router from '@/router';

const userStore = useUserStore()

const userApi = useUserApi()
const userList = reactive({
    total: 0,
    rows: []
})
const query = reactive({
    page: 1,
    pageSize: 10,
    name: '',
    phone: '',
    role: '',
    orgId: '',
    loading: false
})
const dialogForm = reactive({
    visible: false,
    dialogTitle: '',
    data: {
        id: 0,
        username: '',
        password: '',
        name: '',
        phone: '',
        role: '',
        orgId: '',
        certificateUrl: ''
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
            username: '',
            password: '',
            name: '',
            phone: '',
            role: '',
            orgId: '',
            certificateUrl: ''
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
            handleDeleteUser(id)
        })
}

const handleAddUser = (data) => {
    userApi.addUser(data).then((res) => {
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

const handleEditUser = (data) => {
    userApi.updateUser(data).then((res) => {
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

const handleDeleteUser = (id) => {
    userApi.deleteUser(id).then((res) => {
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
    userApi.getUsers(query.page, query.pageSize, query.name, query.phone, query.role, query.orgId).then((res) => {
        if (res.code == 1) {
            console.log(res.data);
            userList.total = res.data.total
            userList.rows = res.data.rows
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
    query.phone = ''
    query.role = ''
    query.orgId = ''
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

const handleAvatarSuccess = (
    response
) => {
    console.log(response);
    dialogForm.data.certificateUrl = 'http://106.14.72.81:81/' + response.data
}

const beforeAvatarUpload = (rawFile) => {
    if (rawFile.type != 'image/jpeg' && rawFile.type != 'image/jpg' && rawFile.type != 'image/png') {
        ElMessage.error('请上传图片！')
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('图片大小不能超过2M！')
        return false
    }
    return true
}

handleQuery()
</script>

<template>
    <div style="height: 100%;">

        <!-- 操作栏 -->
        <el-row justify="space-between">
            <el-col :span="2">
                <el-button type="primary" @click="showFormDialog('新增用户', null, handleAddUser)">新增用户</el-button>
            </el-col>
            <el-col :span="4">
                <el-form-item label="姓名">
                    <el-input v-model="query.name" />
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label="手机号">
                    <el-input v-model="query.phone" />
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label="用户类型">
                    <el-select v-model="query.role" placeholder="选择用户类型" clearable>
                        <el-option label="管理员" value="管理员" />
                        <el-option label="渔民用户" value="渔民用户" />
                        <el-option label="普通用户" value="普通用户" />
                        <el-option label="第三方运输用户" value="第三方运输用户" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-form-item label="所属组织编号">
                    <el-input v-model="query.orgId" />
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
        <el-table :data="userList.rows" height="85%">
            <el-table-column prop="id" label="编号" width="60" />
            <el-table-column prop="username" label="用户名" />
            <el-table-column prop="password" label="密码" />
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="phone" label="手机号" />
            <el-table-column prop="role" label="用户类型" />
            <el-table-column prop="orgId" label="所属组织编号">
                <template #default="scope">
                    {{ scope.row.orgId == null ? '无' : scope.row.orgId }}
                </template>
            </el-table-column>
            <el-table-column prop="certificateUrl" label="证书">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <el-image :preview-src-list="[scope.row.certificateUrl]" :src="scope.row.certificateUrl"
                            hide-on-click-modal="true" preview-teleported="true">
                            <template #placeholder>
                                <div>加载中...</div>
                            </template>
                            <template #error>
                                <div>无</div>
                            </template>
                        </el-image>

                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" />
            <el-table-column prop="updateTime" label="更新时间" />
            <!-- 操作按钮 -->
            <el-table-column label="操作" width="140">
                <template #default="scope">
                    <el-button size="small" @click="showFormDialog('编辑用户信息', scope.row, handleEditUser)">编辑</el-button>
                    <el-button size="small" type="danger" @click="showDeleteDialog(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页控件 -->
        <el-pagination v-model:current-page="query.page" v-model:page-size="query.pageSize" :page-sizes="[5, 10, 20]"
            background layout="total, sizes, prev, pager, next, jumper" :total="userList.total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />

        <!-- 对话框 -->
        <el-dialog v-model="dialogForm.visible" :title="dialogForm.dialogTitle" width="500">
            <el-form :model="dialogForm.data">
                <el-form-item label="用户名">
                    <el-input v-model="dialogForm.data.username" />
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="dialogForm.data.password" />
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="dialogForm.data.name" />
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="dialogForm.data.phone" />
                </el-form-item>
                <el-form-item label="用户类型">
                    <el-select v-model="dialogForm.data.role" placeholder="选择用户类型">
                        <el-option label="管理员" value="管理员" />
                        <el-option label="渔民用户" value="渔民用户" />
                        <el-option label="普通用户" value="普通用户" />
                        <el-option label="第三方运输用户" value="第三方运输用户" />
                    </el-select>
                </el-form-item>
                <el-form-item label="所属组织编号">
                    <el-input v-model="dialogForm.data.orgId" />
                </el-form-item>
                <el-form-item label="证书">
                    <el-upload class="avatar-uploader" action="http://106.14.72.81:6615/upload" :show-file-list="false"
                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="dialogForm.data.certificateUrl" :src="dialogForm.data.certificateUrl"
                            style="object-fit: contain;" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
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

<style scoped>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>