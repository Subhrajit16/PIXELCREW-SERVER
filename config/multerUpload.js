const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },

});


//For single and multiple files upload
const uploadMiddleware = multer({
    storage: storage,
    limits: { fileSize: 10000000 },
}).fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 5 }
]);

module.exports = uploadMiddleware;