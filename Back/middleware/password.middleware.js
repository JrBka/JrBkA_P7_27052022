//importation de password-validator
const passwordValidator = require('password-validator');

let schemaPwd = new passwordValidator();
schemaPwd
.is().min(8)
.is().max(100)
.has().uppercase()
.has().lowercase()
.has().digits(2)
.has().not().spaces()
.is().not().oneOf(['Passw0rd', 'Password123']);

module.exports = schemaPwd;