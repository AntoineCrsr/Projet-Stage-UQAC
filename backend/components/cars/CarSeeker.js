const Car = require("./carModel")

exports.getAll = async () => {
    return await Car.find()
}

exports.getOne = async (id) => {
    return await Car.findOne({ _id: id })
}