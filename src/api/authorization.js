import axios from 'axios'

async function authorization () {
  const storage = localStorage
  let hasLogin = false
  const username = storage.getItem('username')
  const expiredTime = Number(storage.getItem('expiredTime'))
  const current = (new Date()).getTime()
  const refreshToken = storage.getItem('refresh')
  // 初始 token 未过期
  if (expiredTime > current) {
    hasLogin = true
    console.log('authorization access')
  } else if (refreshToken !== null) {
    try {
      const response = await axios.post('/api/token/refresh/', { refresh: refreshToken })
      const nextExpiredTime = Date.parse(response.headers.date) + 6000000
      storage.setItem('access', response.data.access)
      storage.setItem('expiredTime', nextExpiredTime)
      storage.removeItem('refresh')
      hasLogin = true
      console.log('authorization refresh')
    } catch (err) {
      storage.clear()
      hasLogin = false
      console.log('authorization err')
    }
  } else {
    storage.clear()
    hasLogin = false
    console.log('authorization exp')
  }
  console.log('authorization done')
  return [hasLogin, username]
}
export default authorization
