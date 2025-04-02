const Car = require("./carModel")
const fs = require('fs');

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


exports.deleteCar = async (carId, imgUrl) => {
    if (imgUrl) {
        const filename = imgUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => null);
    }
    return await Car.deleteOne({_id: carId})
}