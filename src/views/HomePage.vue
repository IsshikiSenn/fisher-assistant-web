<script setup>
import { SwitchButton } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { serverInstance } from '@/utils/http'

const router = useRouter();
const userStore = useUserStore();
const logout = () => {
    userStore.logout();

    serverInstance.interceptors.request.use(config => {
        config.headers['token'] = ''
        return config
    }, e => Promise.reject(e))
    router.replace('/login');
}
const routeList = ['/users', '/orgs', '/articles', '/categorys', '/goods', '/orders']
const routeIndex = routeList.indexOf(router.currentRoute.value.path) + 1

if (userStore.isLogin == false && router.currentRoute.value.path != '/login') {
    ElMessage.error('请登录！')
    router.replace('/login');
}
</script>

<template>
    <el-container>
        <el-header>
            <el-row>
                <el-col :span="12" :offset="6" id="Title" :gutter="20">
                    Fisher Assistant 管理系统
                </el-col>
                <el-col :span="4" style="text-align:center; line-height: 60px;">
                    <el-text size="large">
                        <el-icon>
                            <User />
                        </el-icon>
                        登录身份：{{ userStore.name }}
                    </el-text>
                </el-col>
                <el-col :span="2" style="text-align: center; line-height: 56px;">
                    <el-button type="default" :icon="SwitchButton" @click="logout" text>退出登录</el-button>
                </el-col>
            </el-row>
        </el-header>
        <el-container>
            <el-aside width="140px">
                <el-menu id="SideMenu" :default-active="routeIndex.toString()">
                    <el-menu-item index="1" @click="() => router.push('/users')">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>用户管理</span>
                    </el-menu-item>
                    <el-menu-item index="2" @click="() => router.push('/orgs')">
                        <el-icon>
                            <OfficeBuilding />
                        </el-icon>
                        <span>组织管理</span>
                    </el-menu-item>
                    <el-menu-item index="3" @click="() => router.push('/articles')">
                        <el-icon>
                            <Tickets />
                        </el-icon>
                        <span>文章管理</span>
                    </el-menu-item>
                    <el-menu-item index="4" @click="() => router.push('/categorys')">
                        <el-icon>
                            <CollectionTag />
                        </el-icon>
                        <span>类别管理</span>
                    </el-menu-item>
                    <el-menu-item index="5" @click="() => router.push('/goods')">
                        <el-icon>
                            <Goods />
                        </el-icon>
                        <span>商品管理</span>
                    </el-menu-item>
                    <el-menu-item index="6" @click="() => router.push('/orders')">
                        <el-icon>
                            <ShoppingCart />
                        </el-icon>
                        <span>订单管理</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main>
                <RouterView />
            </el-main>
        </el-container>
    </el-container>
</template>

<style>
.el-header {
    background-color: whitesmoke;
}

#Title {
    font-size: 24px;
    text-align: center;
    line-height: 60px;
}

.el-container {
    height: 100%;
}

.el-aside {
    height: 100%;
}

.el-menu {
    height: 100%;
}
</style>