import {serverInstance} from "@/utils/http"

export function getArticles() {
    return serverInstance({
        method: 'get',
        url: '/articles',
    })
}