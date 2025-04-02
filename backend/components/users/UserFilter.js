/**
 * 
 * @param {object} user 
 * @param {string} showPrivate 
 * @return {User}  
 */
exports.filterOneUser = (user, showPrivate) => {
    // Attributs non visibles par défaut:
    user.password = undefined
    user.emailNonce = undefined
    user.phoneNonce = undefined
    user.__v = undefined

    // Choix du user
    if (!user.parameters.show.showAgePublically && !showPrivate) user.dateBirthday = undefined
    if (!user.parameters.show.showEmailPublically && !showPrivate) user.email = undefined
    if (!user.parameters.show.showPhonePublically && !showPrivate) user.phone = undefined

    // Data privées
    if (showPrivate !== "true") {
        user.alternateEmail = undefined
        user.statistics = undefined
        user.parameters = undefined
        user.isStudent = undefined
        user.testimonial = undefined
    }
    return user
}


/**
 * 
 * @param {Array} users 
 * @returns {User}
 */
exports.filterMultiple = (users) => {
    users.forEach(user => {
        this.filterOneUser(user, "false")
    })
    return users
}