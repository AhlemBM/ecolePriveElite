const multer = require('multer');
const path = require('path');

const MIME_TYPE_IMG = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const MIME_TYPE_DOC = {
    'application/pdf': 'pdf',
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isImg = MIME_TYPE_IMG[file.mimetype];
        const isDoc = MIME_TYPE_DOC[file.mimetype];
        if (isImg) {
            cb(null, 'backend/images');
        } else if (isDoc) {
            cb(null, 'backend/docs');
        }
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const extension = MIME_TYPE_IMG[file.mimetype] || MIME_TYPE_DOC[file.mimetype];
        const filename = `${name}-${Date.now()}-crococoder.${extension}`;
        cb(null, filename);
    }
});

module.exports = storage;
