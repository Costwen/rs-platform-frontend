import axios from 'axios'

export default {
  async getProjects (status) {
    return axios.get('/api/project/', {
      params: {
        status
      }
    })
  },
  async postProject (data) {
    return axios.post('/api/project/', data)
  },
  async putProject (id, data) {
    return axios.put('/api/project/' + id + '/', data)
  },
  async deleteProject (id) {
    return axios.put('/api/project/' + id + '/', {
      status: 'delete'
    })
  },
  async recoveryProject (id) {
    return axios.put('/api/project/' + id + '/', {
      status: 'normal'
    })
  },
  async entireDelete (id) {
    return axios.delete('/api/project/' + id + '/')
  },
  async getProject (id) {
    return axios.get('/api/project/' + id + '/')
  }
}
