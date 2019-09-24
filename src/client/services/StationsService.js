import appHttpClient from '../libs/appHttpClient'
import { prop } from 'ramda'

export default class StationsService {
  async getAll () {
    return appHttpClient.get('/stations').then(prop('data'))
  }
  async getStation (id) {
    return appHttpClient.get(`/${id}`).then(prop('data'))
  }
}
