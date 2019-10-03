export default class Functions {
  found = null

  getMark (station) {
    return {
      lat: station.coordinates[0],
      lng: station.coordinates[1],
    }
  }

  getDistance (origin, destination) {
    // return distance in meters
    let lon1 = this.toRadian(origin[1])
    let lat1 = this.toRadian(origin[0])
    let lon2 = this.toRadian(destination[1])
    let lat2 = this.toRadian(destination[0])

    let deltaLat = lat2 - lat1
    let deltaLon = lon2 - lon1

    let a = Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon / 2), 2)
    let c = 2 * Math.asin(Math.sqrt(a))
    let EARTH_RADIUS = 6371
    return c * EARTH_RADIUS * 1000
  }

  toRadian (degree) {
    return degree * Math.PI / 180
  }
  closestStation (stations, userLocation) {
    let minDist = Infinity
    let nearest_text = '*None*'
    let markerDist
    let stationId
    // get all objects added to the map
    // iterate over objects and calculate distance between them
    for (let i = 0; i < stations.length; i += 1) {
      markerDist = this.getDistance(stations[i].coordinates.map(Number), userLocation)
      if (markerDist < minDist) {
        minDist = markerDist
        // eslint-disable-next-line camelcase
        nearest_text = stations[i].coordinates
        stationId = stations[i].id
      }
    }
    this.found = {
      id: stationId,
      lat: nearest_text[0],
      lng: nearest_text[1]
    }
  }
  async getStation (stationDetails, stationService, id) {
    stationDetails = await stationService.getStation(id)
  }
}
