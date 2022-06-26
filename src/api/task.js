import axios from 'axios'

export default {
  async getTask (id) {
    return axios.get('/api/task/' + id + '/')
  },
  async getTasks () {
    return axios.get('/api/task/')
  },
  async postTask (data) {
    return axios.post('/api/task/', data)
  },
  async deleteTask (id) {
    return axios.delete('/api/task/' + id + '/')
  }
}
