const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Function to generate a salt
module.exports.GenerateSalt = async () => {
    return await bcrypt.genSalt();
};

// Function to hash a password using a salt
module.exports.GeneratePassword = async (password, salt) => {
    return await bcrypt.hash(password, salt);
};