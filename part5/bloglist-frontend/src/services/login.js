import axios from 'axios'
const baseUrl = '/api/login'

const login = async (token) => {
  const response = await axios.post(baseUrl, token)
  return response.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { login }
