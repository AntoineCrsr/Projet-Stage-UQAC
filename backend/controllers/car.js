const Car = require("../models/Cars")
const fs = require('fs');

exports.createCar = (req, res, next) => {
    console.log(req.body)
    const carObject = req.body.car; // Suppose un objet "car" en json venant de la requete
    delete carObject._id;
    delete carObject._userId;
    const thing = new Car({
        ...carObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
  
    thing.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
 };

exports.getAllCars = (req, res, next) => {
    Car.find()
        .then(elts => res.status(200).json(elts))
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