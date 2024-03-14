<script setup>
import { SwitchButton } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';
const router = useRouter();
const userStore = useUserStore();
const logout = () => {
    userStore.logout();
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
                    <el-button type="normal" :icon="SwitchButton" @click="logout" text>退出登录</el-button>
                </el-col>
            </el-row>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <el-menu id="SideMenu">
                    <el-menu-item index="1">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>用户管理</span>
                    </el-menu-item>
                    <el-menu-item index="2">
                        <el-icon>
                            <OfficeBuilding />
                        </el-icon>
                        <span>组织管理</span>
                    </el-menu-item>
                    <el-menu-item index="3">
                        <el-icon>
                            <Tickets />
                        </el-icon>
                        <span>文章管理</span>
                    </el-menu-item>
                    <el-menu-item index="4">
                        <el-icon>
                            <CollectionTag />
                        </el-icon>
                        <span>类别管理</span>
                    </el-menu-item>
                    <el-menu-item index="5">
                        <el-icon>
                            <Goods />
                        </el-icon>
                        <span>商品管理</span>
                    </el-menu-item>
                    <el-menu-item index="6">
                        <el-icon>
                            <ShoppingCart />
                        </el-icon>
                        <span>订单管理</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main>
                <RouterView>
                    <div>欢迎使用</div>
                </RouterView>
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