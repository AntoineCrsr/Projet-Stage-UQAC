const Service_Response = require("../workspace/service_response.js")
const Car = require("./carModel")
const fs = require('fs');


function verifyCarInformation(carJson) {
    console.log(carJson)
    if (
        carJson.carType == undefined
        || carJson.manufacturer == undefined
        || carJson.year == undefined
        || carJson.model == undefined
        || carJson.color
        || carJson.licensePlate == undefined
        || carJson.airConditioner == undefined
        || carJson.name == undefined
    ) {
        return new Service_Response(undefined, 400, true, {
            "errors": {
                "car": {
                    "code": "missing-fields",
                    "name": "La requete ne dispose pas des attributs nécessaires (carType, manufacturer, year, model, color, licensePlate, airConditioner, name)"
                }
            }
        })
    }
    return new Service_Response(undefined)
}

/**
 * 
 * @param {*} car l'entrée utilisateur parsée de car en js 
 * @param {*} userAuthId 
 * @param {*} fileReq 
 * @param {*} protocolReq 
 * @param {*} reqHost 
 * @returns
 */
exports.createCar = async (carJson, userAuthId, fileReq, protocolReq, reqHost) => {
    let imgUrl = fileReq ? `${protocolReq}://${reqHost}/images/${fileReq.filename}` : null;
    
    delete carJson._id;
    delete carJson._userId;

    carVerification = verifyCarInformation(carJson)
    if (carVerification.hasError) return carVerification

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
        .then(() => (new Service_Response(undefined, 201)).setLocation('/car/' + car.id))
        .catch(error => new Service_Response(undefined, 400, true, error))
};


exports.getAllCars = async () => {
    return await Car.find()
        .then(cars => new Service_Response(cars))
        .catch(error => new Service_Response(undefined, 500, true, error))
}


exports.getOneCar = async (carId) => {
    return await Car.findOne({ _id: carId })
        .then(car => {
            if (car !== null)
                return new Service_Response(car, 302)
            return new Service_Response(undefined, 404, true)
        })
        .catch(error => new Service_Response(undefined, 400, true, error))
}


exports.modifyOneCar = async (id, userAuthId, reqFile, carReq, reqProtocol, reqHost) => {
    let newCarReq = typeof carReq == "string" ? JSON.parse(carReq) : {...carReq}
    if (reqFile !== undefined) newCarReq.imageUrl = `${reqProtocol}://${reqHost}/images/${reqFile.filename}` 

    delete newCarReq._userId;
    return await Car.findOne({_id: id})
        .then((car) => {
            if (car.userId != userAuthId) {
                return new Service_Response(undefined, 401, true)
            } else {
                return Car.updateOne({ _id: id}, { ...newCarReq, _id: id})
                    .then(() => (new Service_Response(undefined)).setLocation('/car/' + car.id))
                    .catch(error => new Service_Response(undefined, 400, true, error))
            }
        })
        .catch((error) => new Service_Response(undefined, 400, true, error));
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
                return Car.deleteOne({_id: id})
                    .then(() => new Service_Response(undefined))
                    .catch(error => new Service_Response(undefined, 400, true, error))
            }
        })
        .catch(error => new Service_Response(undefined, 404, true, error))
}