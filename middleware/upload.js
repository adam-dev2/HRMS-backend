const multer = require('multer');
const path = require('path');
const fs = require('fs');

// This function returns a middleware configured with custom folder and field name
const upload = (destination, fieldName) => {
  // Ensure destination directory exists
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destination);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  };

  const limits = { fileSize: 5 * 1024 * 1024 }; // Max 5MB

  return multer({ storage, fileFilter, limits }).single(fieldName);
};

module.exports = upload;
