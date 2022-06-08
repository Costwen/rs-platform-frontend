import axios from 'axios'
import authorization from './authorization'
import map from './map'

import user from './user'
import project from './project'
import image from './image'
import task from './task'

axios.interceptors.request.use(function (config) {
  if (localStorage.getItem('access')) {
    const token = localStorage.getItem('access')
    if (!config.headers) {
      config.headers = {}
    }
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  console.log(error)
  const { response: { data: { detail: apiDetail } = {} } = {} } = error
  error.api_detail = apiDetail || ''
  return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  const { response: { status: apiStatus } = {} } = error
  if (apiStatus === 401) {
    location.href = '/login'
  }
  return Promise.reject(error)
})
export default {
  authorization,
  map,
  user,
  project,
  image,
  task
}
