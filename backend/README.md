To run the API:

docker build -t api-uqac-project .

then

docker run -d -p 3000:3000 api-uqac-project

After this, you'll be able to access the API at localhost:3000/your_route


Without docker, just do "nodemon" or "node server.js"


The API:
Pour l'instant, on peut:
> Signup
> Login
> Créer, modifier, supprimer des trajets
> Créer, modifier, supprimer des voitures

En cours:
> Vérification des données avant insertion (validité syntaxique et validité logique)
> Sécurisation (avis donnables qu'une fois par journey, à déterminer le reste)

TODO:
> Lors de la modification de l'état d'une journey à 'done', update les statistiques du conducteur / passagers
> Vérifier les adresses avec l'API google maps?




Les routes:

Pour chaque "auth required", cela signifie avoir un header Authorization avec comme contenu "Bearer {TOKEN}", avec TOKEN le token obtenu avec le login.  


> POST /api/auth/signup
Body required:
{
	"user": {
		"email": "vjost@etu.uqac.ca",
		"password": "password1234",
		"dateBirthday": 1739393559842,

		"name": {
				"firstName": "Victor",
				"lastName": "Jost"
		},
		"phone": {
				"type": "mobile",
				"prefix": "+1",
				"number": "4185503023"
		},
		"parameters": {
			"preferredLangage": "FR"
		}
	}
}

Retour:
{
	"message": "user created!",
	"user": {
		"email": "vjost@etu.uqac.ca",
		"isStudent": false,
		"dateBirthday": "2025-02-12T20:52:39.842Z",
		"name": {
			"publicName": "Victor Jost",
			"firstName": "Victor",
			"lastName": "Jost"
		},
		"phone": {
			"type": "mobile",
			"prefix": "+1",
			"number": "4185503023"
		},
		"parameters": {
			"show": {
				"showAgePublically": false,
				"showEmailPublically": false,
				"showPhonePublically": false
			},
			"notification": {
				"sendNewsletter": false,
				"remindEvaluations": false,
				"remindDeparture": false
			},
			"preferredLangage": "FR"
		},
		"statistics": {
			"nbRidesCompleted": 0,
			"nbKmTravelled": 0,
			"nbPeopleTravelledWith": 0,
			"nbTonsOfCO2Saved": 0
		},
		"_id": "67bd1d3003c823af73e1933c",
		"__v": 0
	}
}

/!\ Amélioration en cours: exécution automatique du login, donc renvoi du token prochainement


> POST /api/auth/login
Body required:
{
	"user": {
		"email": "vjost@etu.uqac.ca",
		"password": "password1234"
	}
}

Retour:
{
	"_id": "67bd18f63429613060bbb24f",
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2JkMThmNjM0Mjk2MTMwNjBiYmIyNGYiLCJpYXQiOjE3NDA1MzU4MjEsImV4cCI6MTc0MDYyMjIyMX0.EJtyfbgFArhzK4gYqSBiz4WqI58FnDDlbRyZlw5mIVk"
}


> GET /api/journey

Retour: 
[
	{
		"starting": {
			"city": "Montréal",
			"adress": "Une rue à Montréal"
		},
		"arrival": {
			"city": "Québec",
			"adress": "Une rue à Québec"
		},
		"seats": {
			"total": 5,
			"left": 4
		},
		"_id": "67bdedde083739b08808258a",
		"ownerId": "67bd18f63429613060bbb24f",
		"date": "07/06/2025",
		"price": 100,
		"passengers": [],
		"__v": 0
	}
]


> GET /api/journey/<id>
Exemple: /api/journey/67bdedfd083739b08808258e

Retour:
{
	"starting": {
		"city": "Chicoutimi",
		"adress": "1 Rue price Est"
	},
	"arrival": {
		"city": "Montreal",
		"adress": "10 Rue St-Pierre"
	},
	"seats": {
		"total": 5,
		"left": 3
	},
	"_id": "67bdedfd083739b08808258e",
	"ownerId": "67bd18f63429613060bbb24f",
	"date": "07/06/2025",
	"price": 10,
	"passengers": [],
	"__v": 0
}


> POST /api/journey (auth required)
Body required:
{
	"journey": {
		"starting": {
			"city": "Chicoutimi",
			"adress": "1 Rue price Est"
		},
		"arrival": {
			"city": "Montreal",
			"adress": "10 Rue St-Pierre"
		},
		"date": "07/06/2025",
		"seats": {
			"total": 5,
			"left": 3
		},
		"price": 10.0
	}
}

Retour:
{
	"message": "Journey created!",
	"journey": {
		"ownerId": "67bd18f63429613060bbb24f",
		"starting": {
			"city": "Chicoutimi",
			"adress": "1 Rue price Est"
		},
		"arrival": {
			"city": "Montreal",
			"adress": "10 Rue St-Pierre"
		},
		"date": "07/06/2025",
		"seats": {
			"total": 5,
			"left": 3
		},
		"price": 10,
		"passengers": [],
		"_id": "67bdedfd083739b08808258e",
		"__v": 0
	}
}


> PUT /api/journey/<id> (auth required)
Exemple: PUT /api/journey/67bdedfd083739b08808258e
Body required:
{
	"journey": {
		"starting": {
			"city": "Montréal",
			"adress": "Une rue à Montréal"
		},
		"arrival": {
			"city": "Québec",
			"adress": "Une rue à Québec"
		},
		"date": "07/06/2025",
		"seats": {
			"total": 5,
			"left": 4
		},
		"price": 100.0
	}
}

Retour:
{
	"message": "Journey successfully modified!"
}

/!\ Amélioration en cours (renvoi de la nouvelle journey)


> DELETE /api/journey/<id> (auth required)
Exemple: DELETE /api/journey/67bdec759237a4294f5a4417

Retour:
{
	"message": "The journey has been deleted."
}


> GET /api/car

Retour:
[
    {
        "_id": "67be7b0f0f6397c752a02620",
        "userId": "67bd18f63429613060bbb24f",
        "carType": "VUS 2016",
        "manufacturer": "Peugeot",
        "year": "2016",
        "model": "208",
        "color": "Rouge",
        "licensePlate": "ABC DEF GHI",
        "airConditioner": true,
        "name": "Mon super char !!",
        "imageUrl": null,
        "__v": 0
    }
]


> GET /api/car/<id>
Exemple: /api/car/67be7b0f0f6397c752a02620

Retour:
{
	"_id": "67be7b0f0f6397c752a02620",
	"userId": "67bd18f63429613060bbb24f",
	"carType": "VUS 2016",
	"manufacturer": "Peugeot",
	"year": "2016",
	"model": "208",
	"color": "Rouge",
	"licensePlate": "ABC DEF GHI",
	"airConditioner": true,
	"name": "Mon super char !!",
	"imageUrl": null,
	"__v": 0
}


> POST /api/car (auth required)
Body required:
{
	"car": {
		"carType": "VUS 2016",
		"manufacturer": "Peugeot",
		"year": "2016",
		"model": "208",
		"color": "Rouge",
		"licensePlate": "ABC DEF GHI",
		"airConditioner": true,
		"name": "Mon char !!"
	}
}

Retour:
{
	"message": "Objet enregistré !"
}

/!\ Amélioration en cours: renvoi de l'objet modifié


> PUT /api/car/<id>
Exemple: PUT /api/car/67be7b0f0f6397c752a02620
Body required:
{
	"car": {
		"carType": "VUS 2016",
		"manufacturer": "Peugeot",
		"year": "2016",
		"model": "208",
		"color": "Rouge",
		"licensePlate": "ABC DEF GHI",
		"airConditioner": true,
		"name": "Mon super char !!"
	}
}

Retour:
{
	"message": "Objet modifié!"
}


> DELETE /api/car/<id> (auth required)
Exemple: DELETE /api/car/67be7b0f0f6397c752a02620

Retour:
{
	"message": "Objet supprimé !"
}