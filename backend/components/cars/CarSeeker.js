const Car = require("./carModel")

exports.getAll = async (constraints, limit) => {
    return await Car.find(constraints).limit(limit)
}

exports.getOne = async (id) => {
    return await Car.findOne({ _id: id })
}