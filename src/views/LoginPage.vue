<script setup>
import { reactive, ref } from 'vue'
import { login } from '@/apis/login.js'
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';
import { serverInstance } from '@/utils/http'

// do not use same name with ref
const form = reactive({
    username: '',
    password: '',
})
const logging = ref(false)
const userStore = useUserStore()
const router = useRouter()
const onSubmit = () => {
    logging.value = true
    login(form.username, form.password).then((res) => {
        console.log(res)
        if (res.code == 1) {
            ElMessage({
                message: '登录成功！',
                type: 'success'
            })
            userStore.login(res.data.name, res.data.jwt)
            serverInstance.interceptors.request.use(config => {
                config.headers['token'] = res.data.jwt
                return config
            }, e => Promise.reject(e))
            router.replace('/')
        }
        else {
            logging.value = false
            ElMessage({
                message: res.msg,
                type: 'error'
            })
        }
    }).catch((err) => {
        console.log(err)
    })
}

if (userStore.isLogin == true) {
    router.replace('/')
}
</script>

<template>
    <div id="LoginPage">
        <div id="LoginPanel">
            <div style="height: 30px;" />
            <h2>FisherAssistant管理系统</h2>
            <div style="height: 30px;" />
            <el-form :model="form" label-width="auto" style="max-width: 300px;" size="large">
                <el-form-item label="用户名">
                    <el-input v-model="form.username" placeholder="请输入用户名" />
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="form.password" placeholder="请输入密码" />
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="onSubmit" :loading="logging">登录</el-button>
        </div>
    </div>

</template>

<style>
#LoginPage {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f0f0f0;
}

#LoginPanel {
    display: flex;
    width: 500px;
    height: 340px;
    flex-direction: column;
    align-items: center;
    background-color: white;
    border-radius: 20px;
    box-shadow: 0 0 10px 3px rgba(216, 216, 216, 0.5);
}
</style>