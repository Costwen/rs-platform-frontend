import axios from 'axios'

export default {
  async getTask (id) {
    return axios.get('/api/task/' + id + '/')
  },
  async getTasks () {
    return axios.get('/api/task/')
  }
}
