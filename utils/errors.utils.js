module.exports.signUpErrors = (err) => {
    let errors = { pseudo: "", email: "", password: "" };

    if (err.message.includes("pseudo"))
        errors.pseudo = "Pseudo incorrect ou déjà pris";

    if (err.message.includes("email")) errors.email = "Email incorrect ou email déjà enregistré";

    if (err.message.includes("password"))
        errors.password = "Le mot de passe doit faire 6 caractères minimum";

    // if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("pseudo"))
    //     errors.pseudo = "Ce pseudo est déjà pris";

    // if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
    //     errors.email = "Cet email est déjà enregistré";

    return errors;
};

module.exports.LoginError = (err) => {
    let errors = { email: '', password: '' }

    if (err.message.includes('email'))
        errors.email = "Email inconnue";

    if (err.message.includes('password'))
        errors.password = "le mot de passe ne correspond pas";

    return errors;
};

module.exports.uploadErrors = (err) => {

    let errors = { maxSize: '', format: '' }

    if (err.message.includes('invalid file'))
        errors.format = "Format non pris en charge ";

    if (err.message.includes('maxSize'))
        errors.maxSize = "la taille du fichier est trop grand , 50Ko";

    return errors;
}