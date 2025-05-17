const JourneySeeker = require("../journeys/JourneySeeker")

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
                }
            }));

            lastUpdate = Date.now();
        }
        next();
    } catch (error) {
        next(error); 
    }
}
