import { serverInstance } from "@/utils/http"

export function useOrgApi() {
    function getOrgs(page, pageSize, name) {
        var url = '/orgs?'
        if (page != null) url = url + 'page=' + page + '&'
        if (pageSize != null) url = url + 'pageSize=' + pageSize + '&'
        if (name != '' && name != null) url = url + 'name=' + name
        return serverInstance({
            method: 'get',
            url: url,
        })
    }

    function addOrg(data) {
        return serverInstance({
            method: 'post',
            url: '/orgs',
            data: data
        })
    }

    function updateOrg(data) {
        return serverInstance({
            method: 'put',
            url: '/orgs',
            data: data
        })
    }

    function deleteOrg(id) {
        return serverInstance({
            method: 'delete',
            url: '/orgs/' + id
        })
    }

    return {
        getOrgs,
        addOrg,
        updateOrg,
        deleteOrg
    }
}