import axios from 'axios'

export default {
  async uploadCoordinate (coordinate) {
    const data = await axios.post('/api/map/upload', coordinate)
    return data
  }
}
