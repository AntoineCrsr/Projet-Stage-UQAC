exports.createUser = (req) => {
    if (!verifyInformation)
        throw new Error("Please verify your informations and retry.")
    // TODO: Créer et renvoie un objet utilisateur en fonction des valeurs passées dans req,
    // et en prenant soin de mettre les autres données aux valeurs par défaut. 
}

exports.verifyPhoneType = (phoneType) => {
    // Retourne vrai si phoneType est une valeur parmis "mobile", "work", "pager", "other"
}

exports.verifyPhonePrefix = (phonePrefix) => {
    // Req à une API ?
}

exports.verifyExistingCity = (city) => {
    // Req à une API ?
}

exports.verifyBirthDate = (birthDate) => {
    // Vérifie si la personne a moins de 80 ans ?
}

function verifyInformation(req) {
    /*
    First name,
    Last name,
    City,
    Email,
    Password,
    Birth date,
    Phone number (type, prefix, number, ext)
    */
   // TODO: Vérifie les informations données par l'utilisateur, notamment le format, l'existance de la ville,
   // l'unicité du téléphone, validation du préfix, du type ect. 
   return true;
}