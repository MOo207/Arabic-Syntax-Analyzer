var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('upload');
});

const multer = require("multer");

var storage = multer.diskStorage(
  {
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
}
);

// Define the maximum size for uploading
// picture i.e. 1 MB. it is optional

var upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1000 * 1000 },
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== 'text/plain') {
      // console.log(file.mimetype);
      return cb(null, false, new Error('goes wrong on the mimetype'));
    }

    cb(null, true);
  }

  // myfile is the name of file attribute
}).single("myfile");

router.post("/uploadFile", upload, function (req, res, next) {
  try {
    if (!req.file) { // in case we do not get a file we return
      return res.render('result', { contents: 'لا يوجد ملف مرفوع' });
    }

    // console.log(req.file.buffer);
    const desiredMenu = req.body.desiredMenu;
    const wordsNum = req.body.wordsNum;

    var readMenuFile = readChooseMenu(desiredMenu);

    var menuData = extractWords(readMenuFile);

    var rangeMenuData;
    if (wordsNum > menuData.length) {
      rangeMenuData = menuData.slice(0, menuData.length);
    } else {
      rangeMenuData = menuData.slice(0, parseInt(wordsNum));
    }

    // console.log(rangeMenuData.length, rangeMenuData);

    const file = req.file; // We get the file in req.file

    const data = fs.readFileSync(file.path, 'utf8');

    const words = extractWords(data);

    const wordCount = words.length;

    const occurrenceList = getOccurrenceList(words);

    const uniqueWordCount = occurrenceList.length;

    const similarity = compareByList(occurrenceList, rangeMenuData);

    const percentage = getPercentage(similarity.match);

    const commonListIdx = similarity.commonList;

    var commonList = commonListIdx.map(i => occurrenceList[i][1])
    // console.log(commonList);

    var unCommonList = occurrenceList.filter(item => !commonListIdx.includes(occurrenceList.indexOf(item)))
    // console.log(unCommonList.length);

    // console.log("main f p: " + parseFloat(percentage).toFixed(2));
    res.render('result', {
      contents: {
        wordCount: wordCount,
        uniqueWordCount: uniqueWordCount,
        occurrenceList: occurrenceList.filter(Boolean),
        wordsNum: wordsNum,
        truePercentage: parseFloat(percentage).toFixed(2),
        commonList: commonList,
        unCommonList: unCommonList
      }
    });
  } catch (e) {
    res.send('Some problem happends' + e);
  }
});

function extractWords(text) {
  const re = /([ء-ي]*[^\w|^\s\]^\/^[$&+,:;=?@،#|'<>.^*()%!-])/ig;
  var found = text.match(re);
  if (!found) {
    return found = "0";
  } else {
    return found;
  }
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
      if (word === words[innerIndex]) {
        counter++;
      }
    }
    occurrenceList[outerIndex] = [counter, word];
  }
  let sorted = occurrenceList.sort(function (a, b) {
    return a[0] < b[0] ? 1 : -1;
  });
  return sorted;
}

function readChooseMenu(menuNum) {
  var menu;
  switch (menuNum) {
    case '1':
      menu = fs.readFileSync('compare_menus/القائمة الأولى.txt', 'utf8');
      return menu;
    case '2':
      menu = fs.readFileSync('compare_menus/القائمة الثانية.txt', 'utf8');
      return menu;
    case '3':
      menu = fs.readFileSync('compare_menus/القائمة الثالثة.txt', 'utf8');
      return menu;
    case '4':
      menu = fs.readFileSync('compare_menus/القائمة الرابعة.txt', 'utf8');
      return menu;
    default:
      return "no choosen menu";
  }

}

function compareByList(occurrenceList, menu) {
  var commonList = []
  var match = [];
  var index = 0;
  for (const outerIndex in occurrenceList) {
    var wordInput = occurrenceList[outerIndex][1];
    for (const innerIndex in menu) {
      var wordList = menu[innerIndex];
      var cond = wordInput === wordList;
      // console.log(wordInput+" vs "+wordList+ " = "+ cond);
      if (cond) {
        commonList.push(parseInt(outerIndex));
        match[index] = true;
        break;
      } else {
        match[index] = false;
      }
    }
    index++;
  }
  return { match, commonList };
}

function getPercentage(match) {
  var trueList = match.filter(Boolean).length / match.length * 100;
  return trueList;
}

module.exports = router;
