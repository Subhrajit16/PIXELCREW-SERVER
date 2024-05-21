const { body } = require('express-validator');

const ValidationRules = () => {
    return [
        body('title').notEmpty().withMessage('Title is required'),
        body('body').notEmpty().withMessage('Body is required'),
        body('latitude').isFloat().withMessage('Latitude must be a number'),
        body('longitude').isFloat().withMessage('Longitude must be a number')
    ];
};

module.exports = {
    ValidationRules
};
