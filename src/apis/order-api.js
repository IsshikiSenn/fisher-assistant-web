import { serverInstance } from "@/utils/http"

export function useOrderApi() {
    function getOrders(page, pageSize, goodsId, customerId, status, transportId) {
        var url = '/orders?'
        if (page != null) url = url + 'page=' + page + '&'
        if (pageSize != null) url = url + 'pageSize=' + pageSize + '&'
        if (goodsId != null) url = url + 'goodsId=' + goodsId + '&'
        if (customerId != null) url = url + 'customerId=' + customerId + '&'
        if (status != '' && status != null) url = url + 'status=' + status + '&'
        if (transportId != null) url = url + 'transportId=' + transportId
        return serverInstance({
            method: 'get',
            url: url,
        })
    }

    function addOrder(data) {
        return serverInstance({
            method: 'post',
            url: '/orders',
            data: data
        })
    }

    function updateOrder(data) {
        return serverInstance({
            method: 'put',
            url: '/orders',
            data: data
        })
    }

    function deleteOrder(id) {
        return serverInstance({
            method: 'delete',
            url: '/orders/' + id
        })
    }

    return {
        getOrders,
        addOrder,
        updateOrder,
        deleteOrder
    }
}