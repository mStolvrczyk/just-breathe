// import appHttpClient from '../libs/appHttpClient'
import { prop } from 'ramda'
import axios from 'axios'
export default class StationsService {
  async getAll () {
    return axios.get('https://just-breathe-app.netlify.app/.netlify/functions/server/stations').then(prop('data'))
  }

  async getStation (id) {
    return axios.get(`https://just-breathe-app.netlify.app/.netlify/functions/server/stations/${id}`).then(prop('data'))
  }

  // async getSensor (id) {
  //   return appHttpClient.get(`/sensors/${id}`).then(prop('data'))
  // }
}
