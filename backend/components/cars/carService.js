const Service_Response = require("../workspace/service_response.js")
const Car = require("./carModel")
const fs = require('fs');



/**
 * 
 * @param {*} car l'entrée utilisateur parsée de car en js 
 * @param {*} userAuthId 
 * @param {*} fileReq 
 * @param {*} protocolReq 
 * @param {*} reqHost 
 * @returns la promise du save du de la voiture
 */
exports.createCar = async (carJson, userAuthId, fileReq, protocolReq, reqHost) => {
    let imgUrl = fileReq ? `${protocolReq}://${reqHost}/images/${fileReq.filename}` : null;
    
    delete carJson._id;
    delete carJson._userId;

    const car = new Car({
        userId: userAuthId,
        carType: carJson.carType,
        manufacturer: carJson.manufacturer,
        year: carJson.year,
        model: carJson.model,
        color: carJson.color,
        licensePlate: carJson.licensePlate,
        airConditioner: carJson.airConditioner,
        name: carJson.name,
        
        imageUrl: imgUrl
    });

    return await car.save()
        .then(() => new Service_Response(undefined, 201))
        .catch(error => new Service_Response(undefined, 400, true))
};


exports.getAllCars = async () => {
    return await Car.find()
        .then(cars => new Service_Response(cars))
        .catch(error => new Service_Response(undefined, 500, true))
}


exports.getOneCar = async (carId) => {
    return await Car.findOne({ _id: carId })
        .then(car => {
            if (car !== null)
                return new Service_Response(car, 302)
            return new Service_Response(undefined, 404, true)
        })
        .catch(error => new Service_Response(undefined, 400, true))
}


exports.modifyOneCar = async (id, userAuthId, reqFile, carReq, reqProtocol) => {
    carReq.imageUrl = reqFile ? `${reqProtocol}://${req.get('host')}/images/${reqFile.filename}` : null
  
    delete carReq._userId;
    return await Car.findOne({_id: id})
        .then((car) => {
            if (car.userId != userAuthId) {
                return new Service_Response(undefined, 401, true)
            } else {
                Car.updateOne({ _id: id}, { ...carObject, _id: id})
                    .then(() => new Service_Response(undefined))
                    .catch(error => new Service_Response(undefined, 400, true))
            }
        })
        .catch((error) => {
            return new Service_Response(undefined, 400)
        });
 };


 exports.deleteOneCar = async (id, userAuthId) => {
    return await Car.findOne({_id: id})
        .then(car => {
            if (userAuthId !== car.userId) {
                return new Service_Response(undefined, 401, true)
            } else {
                if (car.imageUrl) {
                    const filename = car.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`);
                }
                Car.deleteOne({_id: id})
                    .then(() => new Service_Response(undefined))
                    .catch(error => new Service_Response(undefined, 400))
            }
        })
        .catch(error => new Service_Response(undefined, 400, true))
}