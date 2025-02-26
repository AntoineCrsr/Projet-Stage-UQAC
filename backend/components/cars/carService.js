const Car = require("./carModel")
const fs = require('fs');

exports.createCar = (carReq, userAuthId, fileReq, protocolReq, reqHost) => {
    let imgUrl = fileReq ? `${protocolReq}://${reqHost}/images/${fileReq.filename}` : null;
    // Note: si le frontend utilise un formData comme sur les tests, alors le req.body.car ne sera pas
    // converti en JSON et il s'agira alors d'une chaine, c'est pourquoi on le convertit.
    // Si l'objet est converti d'une façon ou d'une autre, au moins c'est géré aussi
    
    delete carReq._id;
    delete carReq._userId;


    const car = new Car({
        userId: userAuthId,
        carType: carReq.carType,
        manufacturer: carReq.manufacturer,
        year: carReq.year,
        model: carReq.model,
        color: carReq.color,
        licensePlate: carReq.licensePlate,
        airConditioner: carReq.airConditioner,
        name: carReq.name,
        
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