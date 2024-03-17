import { serverInstance } from "@/utils/http"

export function useGoodsApi() {
    function getGoods(page, pageSize, name) {
        var url = '/goods?'
        if (page != null) url = url + 'page=' + page + '&'
        if (pageSize != null) url = url + 'pageSize=' + pageSize + '&'
        if (name != '' && name != null) url = url + 'name=' + name
        return serverInstance({
            method: 'get',
            url: url,
        })
    }

    function addGoods(data) {
        return serverInstance({
            method: 'post',
            url: '/goods',
            data: data
        })
    }

    function updateGoods(data) {
        return serverInstance({
            method: 'put',
            url: '/goods',
            data: data
        })
    }

    function deleteGoods(id) {
        return serverInstance({
            method: 'delete',
            url: '/goods/' + id
        })
    }

    return {
        getGoods,
        addGoods,
        updateGoods,
        deleteGoods
    }
}