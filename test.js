
function extractWords(text) {
    const re = /([ء-ي]*[^\w|^\s\]^\/^[$&+,:;=?@،#|'<>.^*()%!-])/ig;
    var found = text.match(re);
    if (!found) {
        return found = "0";
    } else {
        return found;
    }
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
            console.log((words[word].split(/(ه$)/).filter(Boolean)));
            processedString = (words[word].split(/(ه$)/).filter(Boolean));
        }

    }

    return words.flat();
}

function getOccurrenceList(words) {
    var occurrenceList = [];
    var unique = new Set(words);
    var uniqueWords = Array.from(unique);
    counter = 0;
    for (const outerIndex in uniqueWords) {
        var word = uniqueWords[outerIndex];
        var joins = words.join(" ");
        var regex = new RegExp(`([^ء-ي](${word})[^ء-ي])`, 'g');
        console.log(regex);
        var matches = joins.match(regex );
        console.log(matches);
        if (matches) {
            occurrenceList[outerIndex] = [matches.length, word];
        }

    }
    const filter = occurrenceList.filter(function (w) {
        return (w[1] == "و" || w[1] == "ب" || w[1] == "ه") || w[1].length > 1
      });
    
      let sorted = filter.sort(function (a, b) {
        return a[0] < b[0] ? 1 : -1;
      });
      return sorted;
}


function compareByList(occurrenceList, menu) {
    var commonList = []
    var match = [];
    var index = 0;
    for (const outerIndex in occurrenceList) {
        var wordInput = occurrenceList[outerIndex][1];
        // console.log(wordInput);
        for (const innerIndex in menu) {
            var wordList = menu[innerIndex];
            var cond = wordInput === wordList;
            // console.log(wordInput + " vs " + wordList + " = " + cond);
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


normalize_text = function (text) {
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


var fs = require('fs');
var file = fs.readFileSync('test.txt', 'utf-8');
// console.log(file);

// var norm = normalize_text(file);
// console.log(norm);


var split = extractWords(file);
// console.log(split);


// var list = removePreAndPost(split);
// var pre = removePreAndPost(split, 'و');
// console.log(pre);

// var concatList = split.concat(pre);

// console.log(concatList);

var occur = getOccurrenceList(list);
console.log(occur);
// console.log('first ' + occur[0][1]);

// var compare = compareByList(occur, extractWords(text2));
// console.log(compare.match);
