const Car = require("./carModel")

exports.createCar = (userAuthId, carType, manufacturer, year, model, color, licensePlate, airConditioner, name, protocolReq, reqHost, fileReq) => {
    let imgUrl = fileReq ? `${protocolReq}://${reqHost}/images/${fileReq.filename}` : null;
    return new Car({
        userId: userAuthId,
        carType: carType,
        manufacturer: manufacturer,
        year: year,
        model: model,
        color: color,
        licensePlate: licensePlate,
        airConditioner: airConditioner,
        name: name,
        
        imageUrl: imgUrl
    });
}


exports.modifyCar = async (carId, newCar) => {
    delete newCar._id;
    delete newCar._userId;
    return await Car.updateOne({ _id: carId}, { ...newCar, _id: carId})
} 