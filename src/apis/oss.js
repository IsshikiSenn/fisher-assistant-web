import {ossInstance} from '@/utils/http'

export function getFile(fileName) {
    return ossInstance({
        method: 'get',
        url: '/' + fileName
    })
}