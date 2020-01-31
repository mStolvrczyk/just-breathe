import axios from 'axios'
import { prop } from 'ramda'

export default class StationsService {
  async getAll () {
    return axios.get('http://localhost:8000/api/stations').then(prop('data'))
  }
  async getStation (id) {
    return axios.get(`http://localhost:8000/api/stations/${id}`).then(prop('data'))
  }
  // async getSensor (id) {
  //   return appHttpClient.get(`/sensors/${id}`).then(prop('data'))
  // }
}
