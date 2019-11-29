
export default class Functions {
  setBackgroundColor (measurements, symbol, opacity) {
    let colorArray = []
    let compartments = [
      {
        symbol: 'PM10',
        limits: [20.00, 60.00, 100.00, 140.00, 200.00]
      },
      {
        symbol: 'PM2.5',
        limits: [12.00, 36.00, 60.00, 84.00, 120.00]
      },
      {
        symbol: 'O3',
        limits: [30.00, 70.00, 120.00, 160.00, 240.00]
      },
      {
        symbol: 'NO2',
        limits: [40.00, 100.00, 150.00, 200.00, 400.00]
      },
      {
        symbol: 'SO2',
        limits: [50.00, 100.00, 200.00, 350.00, 500.00]
      },
      {
        symbol: 'C6H6',
        limits: [5.00, 10.00, 15.00, 20.00, 50.00]
      },
      {
        symbol: 'CO',
        limits: [2499.00, 6499.00, 10499.00, 14499.00, 20499.00]
      }
    ]
    let colors = [
      'rgba(87, 177, 8)',
      'rgba(176, 221, 16)',
      'rgba(255, 217, 17)',
      'rgba(229, 129, 0)',
      'rgba(229, 0, 0)',
      'rgba(153, 0, 0)'
    ]
    let opacityColors = [
      'rgba(87, 177, 8, 0.6)',
      'rgba(176, 221, 16, 0.6)',
      'rgba(255, 217, 17, 0.6)',
      'rgba(229, 129, 0, 0.6)',
      'rgba(229, 0, 0, 0.6)',
      'rgba(153, 0, 0, 0.6)'
    ]
    let currSymbolLimits = compartments.find(test => test.symbol === symbol).limits
    measurements.forEach(measurement => {
      let currMeasurementWithLimits = currSymbolLimits.concat([measurement])
      currMeasurementWithLimits.sort((a, b) => { return a - b })
      if (opacity) {
        colorArray.push(opacityColors[currMeasurementWithLimits.indexOf(measurement)])
      } else {
        colorArray.push(colors[currMeasurementWithLimits.indexOf(measurement)])
      }
    })
    return colorArray
  }
}
