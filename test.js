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

function prefix(text, pattern) {
    var list = [];
    for (let i = 0; i < text.length; i++) {
        if (text[i][0].startsWith(pattern)) {
            list.push(text[i][0]);
        }
    }
    return list;
}


function compareByList(occurrenceList, menu) {
    var commonList = []
    var match = [];
    var index = 0;
    for (const outerIndex in occurrenceList) {
        var wordInput = occurrenceList[outerIndex][1];
        console.log(wordInput);
        for (const innerIndex in menu) {
            var wordList = menu[innerIndex];
            var cond = wordInput === wordList;
            console.log(wordInput + " vs " + wordList + " = " + cond);
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


var text = `أخضر أخضر أحمر أحمر أصفر باليوم واليوم ياليوم`;

var text2 = `أخضر       ياليوم`;
var split = extractWords(text);
// console.log(split);

var occur = getOccurrenceList(split);
console.log('first ' + occur[0][1]);

var compare = compareByList(occur, extractWords(text2));
console.log(compare.match);
