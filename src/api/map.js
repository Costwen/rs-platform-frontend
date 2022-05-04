import axios from 'axios'

export default {
  async uploadCoordinate (uploadData) {
    console.log(uploadData)
    const data = await axios.post('/api/inference/new_task', uploadData)
    return data
  }
}
