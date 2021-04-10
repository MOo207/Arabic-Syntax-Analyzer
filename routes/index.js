var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');


/* GET home page. */
router.get('/t', function (req, res, next) {
  res.render('test');
});

router.get('/', function (req, res, next) {
  res.render('home');
});

router.get('/home', function (req, res, next) {
  res.render('home');
});

router.get('/vocabularylist', function (req, res, next) {
  res.render('vocabularyList');
});


router.get('/frequencylist', function (req, res, next) {
  res.render('frequencyList');
});

router.get('/comparefreqlists', function (req, res, next) {
  res.render('compareFreqLists');
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
  limits: { fileSize: 20 * 1000 * 1000 },
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== 'text/plain') {
      // console.log(file.mimetype);
      return cb(null, false, new Error('goes wrong on the mimetype'));
    }

    cb(null, true);
  }

  // myfile is the name of file attribute
}).single("myfile");



router.post("/compare", upload, function (req, res, next) {
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
    // const data = readFileSync_encoding(file.path, '7bit');
    // console.log(data);

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
    res.render('compareResults', {
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


router.post("/vocabulary", upload, function (req, res, next) {
  try {
    if (!req.file) { // in case we do not get a file we return
      return res.render('result', { contents: 'لا يوجد ملف مرفوع' });
    }

    // console.log(rangeMenuData.length, rangeMenuData);

    const file = req.file; // We get the file in req.file

    // console.log(file);

    const data = fs.readFileSync(file.path, 'utf8');

    const normalized = normalize_text(data);

    const words = extractWords(normalized);

    const wordCount = words.length;

    const occurrenceList = getOccurrenceList(words);

    const uniqueWordCount = occurrenceList.length;

    res.render('vocabularyResult', {
      contents: {
        wordCount: wordCount,
        uniqueWordCount: uniqueWordCount,
        occurrenceList: occurrenceList.filter(Boolean),
      }
    });
  } catch (e) {
    res.send('Some problem happends' + e);
  }
});


function normalize_text(text) {

  //remove special characters
  text = text.replace(/([^\u0621-\u063A\u0641-\u064A\u0660-\u0669a-zA-Z 0-9])/g, '');
  //normalize Arabic
  // text = text.replace(/(آ|إ|أ)/g, 'ا');
  // text = text.replace(/(ة)/g, 'ه');
  // text = text.replace(/(ئ|ؤ)/g, 'ء')
  // text = text.replace(/(ى)/g, 'ي');

  //convert arabic numerals to english counterparts.
  var starter = 0x660;
  for (var i = 0; i < 10; i++) {
    text.replace(String.fromCharCode(starter + i), String.fromCharCode(48 + i));
  }

  return text;
}


router.post("/frequency", upload, function (req, res, next) {
  try {
    if (!req.file) { // in case we do not get a file we return
      return res.render('result', { contents: 'لا يوجد ملف مرفوع' });
    }

    // console.log(rangeMenuData.length, rangeMenuData);

    const file = req.file; // We get the file in req.file

    // console.log(file.encoding);

    const data = fs.readFileSync(file.path, 'utf8');

    const normalized = normalize_text(data);

    const words = extractWords(normalized);

    const process = removePreAndPost(words);

    const wordCount = words.length;

    const occurrenceList = getOccurrenceList(process);

    const uniqueWordCount = occurrenceList.length;

    res.render('frequencyResult', {
      contents: {
        wordCount: wordCount,
        uniqueWordCount: uniqueWordCount,
        occurrenceList: occurrenceList.filter(Boolean),
      }
    });
  } catch (e) {
    res.send('Some problem happends' + e);
  }
});

function extractWords(text) {
  const re = /([ء-ي]*[^\w|^\s\]^\/^[$&+,ـ{}—!&:;=?@،«»#|"'؛<>.^*َ()%!-])/ig;
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
    var word = uniqueWords[outerIndex];
    var joins = words.join(" ");
    var matches = joins.match(new RegExp(word, 'g'));
    occurrenceList[outerIndex] = [matches.length, word];
  }
  const filter = occurrenceList.filter(function (w) {
    return (w[1] == "و" || w[1] == "ب") || w[1].length > 1
  });

  let sorted = filter.sort(function (a, b) {
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

function removePreAndPost(words) {
  list = words;
  for (const word in words) {

      // و 1-و 2-الكلمة بدون الواو 3- نفس الكلمة start
      if (words[word].startsWith('و')) {
          words.push(words[word].split(/(^و)/).filter(Boolean));
      }

      // ب 1-ب 2-الكلمة بدون الباء 3- نفس الكلمة start
      if (words[word].startsWith('ب')) {
          words.push(words[word].split(/(^ب)/).filter(Boolean));
      }

      // ال  1-ال 2-الكلمة بدون ال 3- نفس الكلمة start
      if (words[word].startsWith('ال')) {
          words.push(words[word].split(/(^ال)/).filter(Boolean));
      }

      // و. 1-واو الجماعة 2- الكلمة بدون واو الجماعة   end
      if (words[word].endsWith('و')) {
          words.push(words[word].split(/(و$)/).filter(Boolean));
      }

      // ها 1-ها 2- الكلمة بدون ها  end
      if (words[word].endsWith('ها')) {
          words.push(words[word].split(/(ها$)/).filter(Boolean));
      }

      // هما 1-هما 2- الكلمة بدون هما   end
      if (words[word].endsWith('هما')) {
          words.push(words[word].split(/(هما$)/).filter(Boolean));
      }

      // نا  1-"نا" 2- الكلمة بدون "نا" 3- نفس الكلمة  end
      if (words[word].endsWith('نا')) {
          words.push(words[word].split(/(نا$)/).filter(Boolean));
      }

      // هم 1-"هم" 2- الكلمة بدون "هم" 3- نفس الكلمة  end
      if (words[word].endsWith('هم')) {
          words.push(words[word].split(/(هم$)/).filter(Boolean));
      }

      // هن  1-"هنَّ" 2- الكلمة بدون "هنَّ"

      if (words[word].endsWith('هن')) {
          words.push(words[word].split(/(هن$)/).filter(Boolean));
      }

      // ه -"هـ" 2- الكلمة بدون "هـ" 3- نفس الكلمة  end
      if (words[word].endsWith('ه')) {
          // console.log((words[word].split(/(ه$)/).filter(Boolean)));
          processedString = (words[word].split(/(ه$)/).filter(Boolean));
      }

  }

  return words.flat();
}

module.exports = router;
