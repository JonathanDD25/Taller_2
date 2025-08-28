const multer = require("multer");

//almacenamitno en memoria
const storage = multer.memorystorage();
const upload = multer({ storage });

module.exports = upload;