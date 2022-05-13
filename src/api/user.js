import axios from 'axios'

export default {
  async signIn (form) {
    return axios.post('/api/account/token/', form)
  },
  async register (form) {
    return axios.post('/api/account/user/', form)
  }
}
