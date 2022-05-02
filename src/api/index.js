import axios from 'axios'

import map from './map.js'

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
export default {
  map
}
