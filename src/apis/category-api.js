import { serverInstance } from "@/utils/http"

export function useCategoryApi() {
    function getCategorys(page, pageSize, name) {
        var url = '/category?page=' + page + '&pageSize=' + pageSize
        if (name != null && name != '') url = url + '&name=' + name
        return serverInstance({
            method: 'get',
            url: url,
        })
    }

    function addCategory(data) {
        return serverInstance({
            method: 'post',
            url: '/category',
            data: data
        })
    }

    function updateCategory(data) {
        return serverInstance({
            method: 'put',
            url: '/category',
            data: data
        })
    }

    function deleteCategory(id) {
        return serverInstance({
            method: 'delete',
            url: '/category/' + id
        })
    }

    return {
        getCategorys,
        addCategory,
        updateCategory,
        deleteCategory
    }
}