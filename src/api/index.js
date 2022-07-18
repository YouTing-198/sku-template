import request from '@/utils/request'

export const statistics1API = () => {
  return request({
    url: '/statistics1',
    method: 'GET'
  })
}

export const statistics2API = () => {
  return request({
    url: '/statistics2',
    method: 'GET'
  })
}

export const statistics3API = (data) => {
  return request({
    url: '/statistics3',
    method: 'GET',
    data
  })
}
