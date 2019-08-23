import appHttpClient from '../lib/appHttpClient'
import { prop } from 'ramda'

export default class StationsService {
  async getAll () {
    return appHttpClient.get('/stations').then(prop('data'))
  }
}
