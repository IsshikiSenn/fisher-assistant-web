<script setup>
import { getArticles, addArticle, updateArticle, deleteArticle } from '@/apis/articles'
import { reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus';

const articleList = reactive({
    total: 0,
    rows: []
})
const query = reactive({
    page: 1,
    pageSize: 10,
    title: '',
    author: '',
    loading: false
})
const dialogForm = reactive({
    visible: false,
    dialogTitle: '',
    data: {
        id: 0,
        title: '',
        author: '',
        imgUrl: '',
        contentUrl: ''
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
            title: '',
            author: '',
            imgUrl: '',
            contentUrl: ''
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
            handleDeleteArticle(id)
        })
}

const handleAddArticle = (data) => {
    addArticle(data).then((res) => {
        if (res.code == 1) {
            ElMessage({
                message: '新增成功！',
                type: 'success'
            })
        }
        else {
            ElMessage.error(res.msg)
        }
        handleQuery()
    })
    dialogForm.visible = false
}

const handleEditArtcle = (data) => {
    updateArticle(data).then((res) => {
        if (res.code == 1) {
            ElMessage({
                message: '编辑成功！',
                type: 'success'
            })
        }
        else {
            ElMessage.error(res.msg)
        }
        handleQuery()
    })
    dialogForm.visible = false
}

const handleDeleteArticle = (id) => {
    deleteArticle(id).then((res) => {
        if (res.code == 1) {
            ElMessage({
                message: '删除成功！',
                type: 'success'
            })
        }
        else {
            ElMessage.error(res.msg)
        }
    })
}

const handleQuery = () => {
    query.loading = true
    getArticles(query.page, query.pageSize, query.title, query.author).then((res) => {
        if (res.code == 1) {
            console.log(res.data);
            articleList.total = res.data.total
            articleList.rows = res.data.rows
            query.loading = false
        }
        else {
            ElMessage.error(res.msg)
        }
    })
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
        <el-row justify="space-around">
            <el-col :span="3">
                <el-button type="primary" @click="showFormDialog('新增文章信息', null, handleAddArticle)">新增文章</el-button>
            </el-col>
            <el-col :span="6">
            </el-col>
            <el-col :span="5">
                <el-form-item label="标题">
                    <el-input v-model="query.title" placeholder="请输入标题" />
                </el-form-item>
            </el-col>
            <el-col :span="5">
                <el-form-item label="作者">
                    <el-input v-model="query.author" placeholder="请输入作者" />
                </el-form-item>
            </el-col>
            <el-col :span="2">
                <el-form-item>
                    <el-button type="primary" @click="handleQuery" :loading="query.loading">查询</el-button>
                </el-form-item>
            </el-col>
        </el-row>

        <!-- 表格 -->
        <el-table :data="articleList.rows" height="85%">
            <el-table-column prop="id" label="文章编号" width="60" />
            <el-table-column prop="title" label="标题" />
            <el-table-column prop="author" label="作者" />
            <el-table-column prop="imgUrl" label="图片Url">
                <template #default="scope">
                    {{ scope.row.imgUrl == null ? '无' : scope.row.imgUrl }}
                </template>
            </el-table-column>
            <el-table-column prop="contentUrl" label="内容Url" />
            <el-table-column prop="createTime" label="创建时间" />
            <el-table-column prop="updateTime" label="更新时间" />
            <!-- 操作按钮 -->
            <el-table-column label="操作" width="140">
                <template #default="scope">
                    <el-button size="small"
                        @click="showFormDialog('编辑文章信息', scope.row, handleEditArtcle)">编辑</el-button>
                    <el-button size="small" type="danger" @click="showDeleteDialog(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页控件 -->
        <el-pagination v-model:current-page="query.page" v-model:page-size="query.pageSize" :page-sizes="[5, 10, 20]"
            background="true" layout="total, sizes, prev, pager, next, jumper" :total="articleList.total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />

        <!-- 对话框 -->
        <el-dialog v-model="dialogForm.visible" :title="dialogForm.dialogTitle" width="500">
            <el-form :model="dialogForm.data">
                <el-form-item label="标题">
                    <el-input v-model="dialogForm.data.title" placeholder="请输入标题" />
                </el-form-item>
                <el-form-item label="作者">
                    <el-input v-model="dialogForm.data.author" placeholder="请输入作者" />
                </el-form-item>
                <el-form-item label="图片Url">
                    <el-input v-model="dialogForm.data.imgUrl" placeholder="请输入图片Url" />
                </el-form-item>
                <el-form-item label="内容Url">
                    <el-input v-model="dialogForm.data.contentUrl" placeholder="请输入内容Url" />
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