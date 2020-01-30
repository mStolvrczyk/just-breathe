import axios from 'axios'

const appHttpClient = axios.create({
  baseURL: process.env.API_BASE_URL
})

export default appHttpClient
