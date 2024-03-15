<script setup>
import { useUserStore } from '@/stores/userStore'
import { serverInstance } from "@/utils/http";

const userStore = useUserStore()

serverInstance.interceptors.request.use(config => {
    config.headers['token'] = userStore.jwt
    return config
}, e => Promise.reject(e))
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