import { serverInstance } from "@/utils/http"

export function useArticleApi() {
    function getArticles(page, pageSize, title, author) {
        var url = '/articles?'
        if (page != null) url = url + 'page=' + page + '&'
        if (pageSize != null) url = url + 'pageSize=' + pageSize + '&'
        if (title != '' && title != null) url = url + 'title=' + title + '&'
        if (author != '' && author != null) url = url + 'author=' + author
        return serverInstance({
            method: 'get',
            url: url,
        })
    }

    function addArticle(data) {
        return serverInstance({
            method: 'post',
            url: '/articles',
            data: data
        })
    }

    function updateArticle(data) {
        return serverInstance({
            method: 'put',
            url: '/articles',
            data: data
        })
    }

    function deleteArticle(id) {
        return serverInstance({
            method: 'delete',
            url: '/articles/' + id
        })
    }

    return {
        getArticles,
        addArticle,
        updateArticle,
        deleteArticle
    }
}