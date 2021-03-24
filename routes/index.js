var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('upload');
});

const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var dir = 'uploads/';

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    // Uploads is the Upload_folder_name
    cb(null, "uploads/")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + "-" + Date.now() + ".txt")
  }
})

// Define the maximum size for uploading
// picture i.e. 1 MB. it is optional

var upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1000 * 1000 },
  fileFilter: function (req, file, cb) {

    // Set the filetypes, it is optional
    var filetypes = /txt|text/;
    var mimetype = filetypes.test(file.mimetype);

    var extname = filetypes.test(path.extname(
      file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }

    cb("Error: File upload only supports the "
      + "following filetypes - " + filetypes);
  }

  // mypic is the name of file attribute
}).single("myfile");

router.post("/uploadFile", upload, function (req, res, next) {
  try {
    const file = req.file; // We get the file in req.file
    console.log(file);
    if (!file || !file.mimetype == 'text/plain') { // in case we do not get a file we return
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      return next(error);
    }

    var data = fs.readFileSync(file.path, 'utf8');
    res.render('result', { contents: data });
  } catch (e) {
    res.send('Some problem happends' + e);
  }
});

module.exports = router;
