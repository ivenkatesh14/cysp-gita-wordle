#!/usr/bin/env node

///////////////////////////////////////////
//
// This script converts the various Thai wordlists in this directory to the World dicts:
//   - wordlist.ts: The big list of day-by-day hidden words. Target size ~2000 entries
//   - validGuesses.ts: A big list of acceptable words. Target size ~10000 entries
//   - tonemarks.ts: A big dictionary of where to put accents over the above words
//
// A note on the source files:
//   From PyThaiNLP/corpus:
//      - words_th.txt:  A very large and fairly well scrubbed list of Thai words from many sources
//      - tnc_freq.txt:  A count of occurences of words in the Thai National Corpus
//      - ttc_freq.txt:  A count of occurences of words in the Thai Textbook Corpus
//   From nevmenandr/thai-language/new_data:
//      - Word.frequency.txt: A count of word occurences on Thai websites.
//   From @nv23:
//      - thai-wordlist.txt:  A filtered version of the Thai Royal Institute Dictionary
//   From https://gist.github.com/anonymous/36568e5aaa73790e718757ff5f481afe
//      - thai.dict:  Apparently an unfiltered version of the R.I.D.
//
//  The strategy is:
//       1. the wordlist should contain ~1000–2000 commonly-used words that are in the RID 
//       2. the validGuesses should contain all words in the dictionary and common words
//
////////////////////////////////////////////

const fs = require("fs");
const F8 = "utf-8";
const WORDLEN = 5;
const WHITELIST = ['จากลา']
const BLACKLIST = [ "กระดอ", "กระเด้า", "กระหรี่", "กะปิ", "กู", "ขี้", "ควย", "จิ๋ม", "จู๋", "เจ๊ก", "เจี๊ยว", "ดอกทอง", "ตอแหล", "ตูด", "น้ําแตก", "มึง", "แม่ง", "เย็ด", "รูตูด", "ล้างตู้เย็น", "ส้นตีน", "สัด", "เสือก", "หญิงชาติชั่ว", "หลั่ง", "ห่า", "หํา", "หี", "เหี้ย", "อมนกเขา", "ไอ้ควาย" ,];

const OVERRIDE_DICT_FREQ = 1500;
const WLIST_MIN_FREQ = 250;
const GUESS_MIN_FREQ = 40;
const NONTHAI_WORD = /[^\u0e01-\u0e2e\u0e30-\u0e39\u0e40-\u0e44\u0e47-\u0e4c]/;
const OUTPATH = "../src/constants/";
const OUTEXT = ".ts";

function removeAccents(word) {
   return word.replace(/[\u0e34-\u0e3a]/g,'')
     .replace(/[\u0e31]/g,'')
     .replace(/[\u0e47-\u0e4c]/g,'');
}
function isValidThaiWord(word) {
   if (NONTHAI_WORD.test(word)) return false;
   return (removeAccents(word).length == WORDLEN);
}

class DefaultDict {
  constructor(defaultVal) {
    return new Proxy({}, {
      get: (target, name) => name in target ? target[name] : defaultVal
    })
  }
}

// Construct the master word frequency dictionary
var freqs = new DefaultDict(0);
function addToFreqsDict(freqs, filename, sep) {
    console.log("Reading in " + filename + "...");
    var data = fs.readFileSync(filename, F8);
    data = data.split('\n');
    for (const line of data) {
        const [w, f] = line.split(sep);
        if (isValidThaiWord(w)) {
            freqs[w] += Number.parseInt(f);
        }
    }
}
addToFreqsDict(freqs, "Word.frequency.txt", " - ");
addToFreqsDict(freqs, "tnc_freq.txt", "\t");
addToFreqsDict(freqs, "ttc_freq.txt", "\t");

function importWordlist(filename) {
    console.log("Reading in " + filename + "...");
    var data = fs.readFileSync(filename, F8).split('\n');
    var ret = new Set();
    for (const word of data) {
        if (isValidThaiWord(word)) {
            ret.add(word);
        }
    }
    return [...ret];
}
var official_words = importWordlist("thai.dict");
var bigwordlist = importWordlist("words_th.txt");
bigwordlist = bigwordlist.concat(
    official_words.filter(w => !bigwordlist.includes(w))
);
var freq_keys = Object.keys(freqs);

// CONSTRUCTION TIME

console.log("Building final word lists...");
var wordlist = official_words.filter(w => freqs[w]>=WLIST_MIN_FREQ && !BLACKLIST.includes(w))
  .concat(WHITELIST)
  .concat(freq_keys.filter(w => !official_words.includes(w)&&freqs[w]>=OVERRIDE_DICT_FREQ));
var validGuesses = bigwordlist.concat(
    freq_keys.filter(
        w => !bigwordlist.includes(w)
    ).filter(
        w => freqs[w]>=GUESS_MIN_FREQ
    )
);

var examples = validGuesses.filter(w => !wordlist.includes(w) && w in freqs && !['แอล', 'ปรา'].includes(w)).sort((a, b) => freqs[b]-freqs[a]).slice(0, 6);
// Ensure examples[1][0] is not โใเแไ
for (var i=0; i<examples.length; i++) {
  if (!"โใเแไ".includes(examples[i][0])) {
    [examples[i], examples[1]] = [examples[1], examples[i]];
    break;
  }
}

console.log("Done!\n");
console.log("About to write to file:");
console.log("   worldlist.ts: " + wordlist.length);
console.log("   valideGuesses.ts: " + validGuesses.length);
console.log("With InfoModal examples:");
for (const w of examples) {
console.log("   " + w);
}
console.log("Type y+Enter to continue...");
function getChar() {
  let buffer = Buffer.alloc(2)
  fs.readSync(0, buffer, 0, 2)
  return buffer.toString('utf8')
}
if (getChar() != "y\n") {
  console.log("Exiting without writing changes");
  process.exit(1);
}

console.log("Optimizing storage...");
validGuesses = [...new Set(validGuesses)];
wordlist = new Set(wordlist);
validGuesses = validGuesses.filter(w => !wordlist.has(w));
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;
  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}
wordlist = shuffle([...wordlist]);

var epoch = (new Date()).setHours(0, 0, 0, 0);

console.log("Writing changes...");
fs.writeFileSync(
    OUTPATH + "validGuesses" + OUTEXT,
    "export const VALIDGUESSES = " + JSON.stringify(validGuesses) + ";"
);
fs.writeFileSync(
    OUTPATH + "wordlist" + OUTEXT,
    "export const WORDS = " + JSON.stringify(wordlist) + ";\nexport const EPOCH = " + epoch + ";\nexport const EXAMPLES = " + JSON.stringify(examples) + ";\nexport const WORDLEN = " + WORDLEN + ";\n"
);

