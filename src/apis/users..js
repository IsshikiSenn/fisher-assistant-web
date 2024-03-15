import { serverInstance } from "@/utils/http"

export function getUsers(page, pageSize, name, phone, role, orgId) {
    var url = '/users?'
    if (page != null) url = url + 'page=' + page + '&'
    if (pageSize != null) url = url + 'pageSize=' + pageSize + '&'
    if (name != '' && name != null) url = url + 'name=' + name + '&'
    if (phone != '' && phone != null) url = url + 'phone=' + phone + '&'
    if (role != '' && role != null) url = url + 'role=' + role + '&'
    if (orgId != '' && orgId != null) url = url + 'orgId=' + orgId
    return serverInstance({
        method: 'get',
        url: url,
    })
}

export function addUser(data) {
    return serverInstance({
        method: 'post',
        url: '/users',
        data: data
    })
}

export function updateUser(data) {
    return serverInstance({
        method: 'put',
        url: '/users',
        data: data
    })
}

export function deleteUser(id) {
    return serverInstance({
        method: 'delete',
        url: '/users/' + id
    })
}