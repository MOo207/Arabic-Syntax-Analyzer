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
    cb(null, file.originalname.replace(/\.[A-z]*$/, '') + "-" + Date.now() + ".txt")
  }
})

// Define the maximum size for uploading
// picture i.e. 1 MB. it is optional

var upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1000 * 1000 },
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== 'text/plain') {
      return cb(null, false, new Error('goes wrong on the mimetype'));
    }

    cb(null, true);
  }

  // mypic is the name of file attribute
}).single("myfile");

router.post("/uploadFile", upload, function (req, res, next) {
  try {
    if (!req.file) { // in case we do not get a file we return
      return res.render('result', { contents: 'لا يوجد ملف مرفوع'});
    }
    const file = req.file; // We get the file in req.file
    const data = fs.readFileSync(file.path, 'utf8');

    const words = extractWords(data);
    const wordCount = words.length;
    const occurrenceList = getOccurrenceList(words);
    const uniqueWordCount = occurrenceList.length;

    res.render('result', { contents: {
      wordCount: wordCount,
      uniqueWordCount: uniqueWordCount,
      occurrenceList: occurrenceList
    } });
  } catch (e) {
    res.send('Some problem happends' + e);
  }
});

function extractWords(text) {
  const re = /[ء-ي]+/ig;
  const found = text.match(re);
  return found;
}

function getOccurrenceList(words) {
  var occurrenceList = [];
  var unique = new Set(words);
  var uniqueWords = Array.from(unique);
  counter = 0;
  for (const outerIndex in uniqueWords) { 
      counter = 0;
      var word = uniqueWords[outerIndex];
      for (const innerIndex in words) {
         if(word === words[innerIndex]){
             counter++;
         }
      }
      occurrenceList[outerIndex] = [word, counter];
  }
  let sorted = occurrenceList.sort(function(a, b) { 
    return a[1] < b[1] ? 1 : -1;
});
  return sorted;
}



module.exports = router;
