<script setup>
import { useUserStore } from './stores/userStore';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const router = useRouter();
const userStore = useUserStore();
if (userStore.isLogin == false && router.currentRoute != '/login') {
  ElMessage.error('请登录！')
  router.replace('/login');
}
</script>

<template>
  <RouterView />
</template>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
}
</style>