const Service_Response = require("../workspace/service_response.js")
const CarFactory = require("./CarFactory.js")
const CarErrorManager = require("./CarError/CarErrorManager.js")
const GeneralErrorManager = require("../workspace/GeneralError/GeneralErrorManager.js")
const CarSeeker = require("./CarSeeker.js")
const CarFilter = require("./CarFilter.js")


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

    const userRegistrationCompleteError = await GeneralErrorManager.isUserVerified(userAuthId)
    if (userRegistrationCompleteError.hasError) return new Service_Response(undefined, 401, true, userRegistrationCompleteError.error)

    const car = CarFactory.createCar(userAuthId, carJson.carType, carJson.manufacturer, carJson.year, carJson.model, carJson.color, carJson.licensePlate, carJson.airConditioner, carJson.name, protocolReq, reqHost, fileReq)

    return await car.save()
        .then(() => (new Service_Response(undefined, 201)).setLocation('/car/' + car.id))
        .catch(error => new Service_Response(undefined, 400, true, error))
};


exports.getAllCars = async (constraints) => {
    const verifyConstraints = CarErrorManager.verifyConstraints(constraints)
    if (verifyConstraints.hasError) return new Service_Response(undefined, 400, true, verifyConstraints.error)
    
    return await CarSeeker.getAll(constraints)
        .then(cars => { 
            CarFilter.filterMultipleCars(cars)
            return new Service_Response(cars)
        })
        .catch(error => new Service_Response(undefined, 500, true, error))
}


exports.getOneCar = async (carId, userAuthId, showPrivate) => {
    const verifyError = CarErrorManager.getOneCarError(carId)
    if (verifyError.hasError) return new Service_Response(undefined, 400, true, verifyError.error)

    return await CarSeeker.getOne(carId)
        .then(car => {
            const notFoundError = CarErrorManager.getNotFound(car)
            if (notFoundError.hasError) return new Service_Response(undefined, 404, true, notFoundError.error)

            const permissionPrivateError = CarErrorManager.verifyPrivatePermission(car.userId, userAuthId, showPrivate)
            if (permissionPrivateError.hasError) return new Service_Response(undefined, 401, true, permissionPrivateError.error)
            
            CarFilter.filterOneCar(car, showPrivate)
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
    const verifId = CarErrorManager.getOneCarError(id)
    if (verifId.hasError) return new Service_Response(undefined, 400, true, verifId.error)

    return await CarSeeker.getOne(id)
        .then(car => {
            const notFound = CarErrorManager.getNotFound(car)
            if (notFound.hasError) return new Service_Response(undefined, 404, true, authError.error)

            const authError = CarErrorManager.getAuthError(userAuthId, car.userId)
            if (authError.hasError) return new Service_Response(undefined, 401, true, authError.error)
            else {
                return CarFactory.deleteCar(id, car.imageUrl)
                    .then(() => new Service_Response(undefined))
                    .catch(error => new Service_Response(undefined, 400, true, error))
            }
        })
        .catch(error => new Service_Response(undefined, 400, true, error))
}


/**
 * Cette fonction n'est supposée s'utiliser dans un contrôleur
 * @param {string} userId 
 * @param {string} carId 
 * @returns {Promise}
 */
exports.verifyIfUserHasCar = async (userId, carId) => {
    const internalVerif = CarErrorManager.getCarVerifError(userId, carId)
    if (internalVerif.hasError) return false
    
    return await this.getAllCars({"userId": userId})
        .then(cars => {
            let hasTheCar = false
            cars.result.forEach(car => {
                if (car._id.toString() === carId) {
                    hasTheCar = true
                    return; // Arrête la boucle
                }
            })
            return hasTheCar
        })
        .catch(error => false)
}