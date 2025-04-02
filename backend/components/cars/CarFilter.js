
/**
 * 
 * @param {object} car 
 * @param {string} showPrivate 
 * @returns {Car}
 */
exports.filterOneCar = (car, showPrivate) => {
    car.__v = undefined

    if (showPrivate !== "true") {
        car.licensePlate = undefined
        car.name = undefined
    }

    return car
}

/**
 * 
 * @param {Array} cars 
 * @returns {Array}
 */
exports.filterMultipleCars = (cars) => {
    cars.forEach(car => {
        this.filterOneCar(car, "false")
    })
    return cars
}