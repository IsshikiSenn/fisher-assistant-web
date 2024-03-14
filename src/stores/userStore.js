import { defineStore } from "pinia";

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            isLogin: false,
            jwt: '',
            name: ''
        }
    },
    actions: {
        login(name,jwt) {
            this.isLogin = true
            this.name = name
            this.jwt = jwt
        },
        logout() {
            this.isLogin = false
            this.jwt = ''
            this.name = ''
        }
    },
    persist: true
})