import {serverInstance} from "@/utils/http";

export function login(username, password) {
    return serverInstance({
        method: 'post',
        url: '/login?username=' + username + '&password=' + password,
    })
}