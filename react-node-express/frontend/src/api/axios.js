import axios from 'axios'
import {baseURL} from './Apis'

const axiosInstance = axios.create({
  baseURL,
  timeout: 2000,
})

export default axiosInstance