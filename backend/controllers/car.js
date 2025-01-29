const Car = require("../models/Cars")
const fs = require('fs');

exports.createCar = (req, res, next) => {
    let carObject = undefined;
    // Note: si le frontend utilise un formData comme sur les tests, alors le req.body.car ne sera pas
    // converti en JSON et il s'agira alors d'une chaine, c'est pourquoi on le convertit.
    // Si l'objet est converti d'une façon ou d'une autre, au moins c'est géré aussi
    if (typeof(req.body.car) === "string"){
        carObject = JSON.parse(req.body.car);
    }
    else {
        carObject = req.body.car;
    }
    delete carObject._id;
    delete carObject._userId;

    const car = new Car({
        name: carObject.name,
        marque: carObject.marque,
        immatriculation: carObject.immatriculation,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    car.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch(error => res.status(400).json({ error }));
};

exports.getAllCars = (req, res, next) => {
    Car.find()
        .then(elts => {
            console.log(elts)
            res.status(200).json(elts)
        })
        .catch(error => res.status(400).json({error}))
}

exports.getOneCar = (req, res, next) => {
    Car.findOne({ _id: req.params.id })
        .then(car => res.status(200).json(car))
        .catch(error => res.status(404).json({ error }));
}

exports.modifyOneCar = (req, res, next) => {
    const carObject = req.file ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete carObject._userId;
    Car.findOne({_id: req.params.id})
        .then((car) => {
            if (car.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Car.updateOne({ _id: req.params.id}, { ...carObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
 };

exports.deleteOneCar = (req, res, next) => {
    Car.findOne({_id: req.params.id})
        .then(car => {
            if (req.auth.userId !== car.userId) {
                res.status(401).json({message: "Unauthorized"})
            } else {
                const filename = car.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Car.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => res.status(500).json(error))
}