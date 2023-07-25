import axios from 'axios'
const baseUrl = '/api/login'

const login = async (token) => {
  const response = await axios.post(baseUrl, token)
  return response.data
}

export default { login }
