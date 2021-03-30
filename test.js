function extractWord(text) {
    const re = /([ء-ي]*[^\w|^\s\]^\/^[$&+,:;=?@،#|'<>.^*()%!-])/ig;
    const found = text.match(re);
    return found;
}

function getOccurrenceList(words) {
    var occurrenceList = [];
    var unique = new Set(words);
    var uniqueWords = Array.from(unique);
    console.log(uniqueWords);
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
    return occurrenceList;
}

function prefix(text, pattern){
    var list = [];
    for (let i = 0; i < text.length; i++) {
     if(text[i][0].startsWith(pattern)){
         list.push(text[i][0]);
     }   
    }
    return list;
}
var text = `أخضر أخضر أحمر أحمر أصفر باليوم واليوم ياليوم`;

var split = extractWord(text);
console.log(split);
var occur = getOccurrenceList(split);
console.log(occur);

var wawa = prefix(occur, 'ب');
console.log(wawa);