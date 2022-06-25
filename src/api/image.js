import axios from 'axios'

export default {
  async getImages (query) {
    return axios.get('/api/image/', {
      params: query
    })
  },
  async postImage (form) {
    return axios.post('/api/image/', form)
  },
  async putImage (form) {
    return axios.put('/api/image/', form)
  },
  async deleteImage (id) {
    return axios.delete('/api/image/' + id + '/')
  }
}
