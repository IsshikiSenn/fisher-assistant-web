<script setup>
import { useCategoryApi } from '@/apis/category-api'
import { reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';

const userStore = useUserStore()
const router = useRouter()
const categoryApi = useCategoryApi()
const categoryList = reactive({
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
        imgUrl: '',
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
            imgUrl: '',
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
            handleDeleteCategory(id)
        })
}

const handleAddCategory = (data) => {
    categoryApi.addCategory(data).then((res) => {
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

const handleEditCategory = (data) => {
    categoryApi.updateCategory(data).then((res) => {
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

const handleDeleteCategory = (id) => {
    categoryApi.deleteCategory(id).then((res) => {
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
    categoryApi.getCategorys(query.page, query.pageSize, query.name).then((res) => {
        if (res.code == 1) {
            console.log(res.data);
            categoryList.total = res.data.total
            categoryList.rows = res.data.rows
            query.loading = false
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

const handleAvatarSuccess = (
    response
) => {
    console.log(response);
    dialogForm.data.imgUrl = 'http://106.14.72.81:81/' + response.data
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
                <el-button type="primary" @click="showFormDialog('新增类别', null, handleAddCategory)">新增类别</el-button>
            </el-col>
            <el-col :span="12">
            </el-col>
            <el-col :span="6">
                <el-form-item label="类别名称">
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
        <el-table :data="categoryList.rows" height="85%" table-layout="auto">
            <el-table-column prop="id" label="编号" width="60" />
            <el-table-column prop="name" label="类别名称" />
            <el-table-column prop="imgUrl" label="图片">
                <template #default="scope">
                    <div style="display: flex; align-items: center; width: 100px; height: 100px;">
                        <el-image :preview-src-list="[scope.row.imgUrl]" :src="scope.row.imgUrl"
                            :hide-on-click-modal="true" :preview-teleported="true">
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
                    <el-button size="small"
                        @click="showFormDialog('编辑类别信息', scope.row, handleEditCategory)">编辑</el-button>
                    <el-button size="small" type="danger" @click="showDeleteDialog(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页控件 -->
        <el-pagination v-model:current-page="query.page" v-model:page-size="query.pageSize" :page-sizes="[5, 10, 20]"
            background layout="total, sizes, prev, pager, next, jumper" :total="categoryList.total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />

        <!-- 对话框 -->
        <el-dialog v-model="dialogForm.visible" :title="dialogForm.dialogTitle" width="500">
            <el-form :model="dialogForm.data">
                <el-form-item label="类别名称">
                    <el-input v-model="dialogForm.data.name" />
                </el-form-item>
                <el-form-item label="图片">
                    <el-upload class="avatar-uploader" action="http://106.14.72.81:6615/upload" :show-file-list="false"
                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="dialogForm.data.imgUrl" :src="dialogForm.data.imgUrl"
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