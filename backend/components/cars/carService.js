const Service_Response = require("../workspace/service_response.js")
const Car = require("./carModel")
const fs = require('fs');
const CarFactory = require("./CarFactory.js")
const CarErrorManager = require("./CarError/CarErrorManager.js")
const CarSeeker = require("./CarSeeker.js")


/**
 * 
 * @param {*} car l'entrée utilisateur parsée de car en js 
 * @param {*} userAuthId 
 * @param {*} fileReq 
 * @param {*} protocolReq 
 * @param {*} reqHost 
 * @returns {Service_Response}
 */
exports.createCar = async (carJson, userAuthId, fileReq, protocolReq, reqHost) => {    
    const verifError = CarErrorManager.verifyCarCreation(carJson)
    if (verifError.hasError) return new Service_Response(undefined, 400, true, verifError.error)

    const car = CarFactory.createCar(userAuthId, carJson.carType, carJson.manufacturer, carJson.year, carJson.model, carJson.color, carJson.licensePlate, carJson.airConditioner, carJson.name, protocolReq, reqHost, fileReq)

    return await car.save()
        .then(() => (new Service_Response(undefined, 201)).setLocation('/car/' + car.id))
        .catch(error => new Service_Response(undefined, 400, true, error))
};


exports.getAllCars = async () => {
    return await CarSeeker.getAll()
        .then(cars => new Service_Response(cars))
        .catch(error => new Service_Response(undefined, 500, true, error))
}


exports.getOneCar = async (carId) => {
    const verifyError = CarErrorManager.getOneCarError(carId)
    if (verifyError.hasError) return new Service_Response(undefined, 400, true, verifyError.error)

    return await CarSeeker.getOne(carId)
        .then(car => {
            const notFoundError = CarErrorManager.getNotFound(car)
            if (notFoundError.hasError) return new Service_Response(undefined, 404, true, notFoundError.error)
            return new Service_Response(car, 302)
        })
        .catch(error => new Service_Response(undefined, 400, true, error))
}


exports.modifyOneCar = async (id, userAuthId, reqFile, carReq, reqProtocol, reqHost) => {
    let newCarReq = typeof carReq == "string" ? JSON.parse(carReq) : {...carReq}
    if (reqFile !== undefined) newCarReq.imageUrl = `${reqProtocol}://${reqHost}/images/${reqFile.filename}` 

    delete newCarReq._userId;
    const verifId = CarErrorManager.getOneCarError(id)
    if (verifId.hasError) return new Service_Response(undefined, 400, true, verifId.error)

    const modifError = CarErrorManager.getModifyError(carReq)
    if (modifError.hasError) return new Service_Response(undefined, 400, true, modifError.error)

    return await CarSeeker.getOne(id)
        .then((car) => {
            const notFoundError = CarErrorManager.getNotFound(car)
            if (notFoundError.hasError) return new Service_Response(undefined, 404, true, notFoundError.error)
            
            const authError = CarErrorManager.getAuthError(car.userId, userAuthId)
            if (authError.hasError) return new Service_Response(undefined, 401, true, authError.error)

            return CarFactory.modifyCar(car.id, carReq)
                .then(() => (new Service_Response(undefined)).setLocation('/car/' + car.id))
                .catch(error => new Service_Response(undefined, 400, true, error))
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