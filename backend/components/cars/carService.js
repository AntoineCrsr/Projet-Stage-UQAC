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
exports.createCar = (carJson, userAuthId, fileReq, protocolReq, reqHost) => {
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

    return car.save()
};


exports.getAllCars = () => {
    return Car.find()
}


exports.getOneCar = (carId) => {
    return Car.findOne({ _id: carId })
}


exports.modifyOneCar = (id, userAuthId, reqFile, carReq, reqProtocol) => {
    carReq.imageUrl = reqFile ? `${reqProtocol}://${req.get('host')}/images/${reqFile.filename}` : null
  
    delete carReq._userId;
    return Car.findOne({_id: id})
        .then((car) => {
            if (car.userId != userAuthId) {
                throw new Error("Not Authorized.")
            } else {
                return Car.updateOne({ _id: id}, { ...carObject, _id: id})
            }
        })
        .catch((error) => {
            throw error
        });
 };


 exports.deleteOneCar = (id, userAuthId) => {
    return Car.findOne({_id: id})
        .then(car => {
            if (userAuthId !== car.userId) {
                throw new Error("Unauthorized")
            } else {
                if (car.imageUrl) {
                    const filename = car.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`);
                }
                return Car.deleteOne({_id: id})
            }
        })
        .catch(error => {throw error})
}