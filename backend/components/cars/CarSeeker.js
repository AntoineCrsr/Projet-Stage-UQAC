const Car = require("./carModel")

exports.getAll = async (constraints) => {
    return await Car.find(constraints)
}

exports.getOne = async (id) => {
    return await Car.findOne({ _id: id })
}