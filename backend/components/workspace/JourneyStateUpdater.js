const JourneySeeker = require("../journeys/JourneySeeker")
const UserSeeker = require("../users/userSeeker")
const ReservationSeeker = require("../reservation/ReservationSeeker")

let lastUpdate = undefined
const updateFrequency = 60 // Seconds

exports.updateJourneys = async (req, res, next) => {
    try {
        if (lastUpdate == undefined || lastUpdate + updateFrequency * 1000 < Date.now()) {
            const journeys = await JourneySeeker.getLastJourneys({ state: "w" });
            const nowISO = (new Date(Date.now())).toISOString();
            // On attend que tous les .save() soient terminés
            await Promise.all(journeys.map(async journey => {
                if (journey.date < nowISO) {
                    journey.state = "d";
                    await journey.save();
                    await this.updateStatistics(journey)
                }
            }));

            lastUpdate = Date.now();
        }
        next();
    } catch (error) {
        next(error); 
    }
}

exports.updateStatistics = async (journey) => {
    const nbPeopleTravelledWith = journey.seats.total - journey.seats.left
    const owner = await UserSeeker.getOneUser(journey.ownerId.toString())
    owner.statistics.nbRidesCompleted += 1
    owner.statistics.nbPeopleTravelledWith += nbPeopleTravelledWith
    await owner.save()

    const reservers = await ReservationSeeker.getReservations({"journeyId": journey._id.toString()})
    for (let i = 0; i < reservers.length; i++) {
        let reserver = await UserSeeker.getOneUser(reservers[i].userId.toString())
        reserver.statistics.nbRidesCompleted += 1
        reserver.statistics.nbPeopleTravelledWith += nbPeopleTravelledWith // Le +1 du conducteur s'annule avec le -1 du passager
        await reserver.save()
    }
}