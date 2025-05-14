exports.formatJourney = (journey, correctStarting, correctArrival) => {
    journey.starting.address = correctStarting
    journey.arrival.address = correctArrival

    const startingCity = correctStarting.split(",")[1].trim()
    const arrivalCity = correctArrival.split(",")[1].trim()

    const startingProvince = correctStarting.split(",")[2].substring(0, 3).trim()
    const arrivalProvince = correctStarting.split(",")[2].substring(0, 3).trim()

    journey.starting.city = startingCity.toLowerCase()
    journey.arrival.city = arrivalCity.toLowerCase()
    journey.starting.province = startingProvince
    journey.arrival.province = arrivalProvince
}