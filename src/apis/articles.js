import httpInstance from "@/utils/http";

export function getArticles() {
  return httpInstance({
    method: 'get',
    url: '/articles',
  })
}