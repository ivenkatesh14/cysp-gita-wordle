#!/usr/bin/env node

///////////////////////////////////////////
//
// This script converts the various Pali dictionaries in this directory to the Wordle dicts:
//   - wordlist.ts: The big list of day-by-day hidden words.
//   - validGuesses.ts: A big list of acceptable words.
//   - glosses.ts: short definitions of words to teach Pali
//
// The dictionaries are from github.com/suttacentral/sc-data
//
// The strategy is to include a word in the wordlist if at least two dictionaries agree
// that its a real word. validGuesses includes all the words in just one dictionary.
//
////////////////////////////////////////////

const fs = require('fs')
const F8 = 'utf-8'
const WORDLEN = 5
const OUTPATH = '../src/constants/'
const OUTEXT = '.ts'
const ASPIRABLES = 'tdkcgjḍṭpb'
const FORMABLES = ASPIRABLES + 'aiun'

function splitWord(word) {
  if (!word) return []
  var ret = word.normalize().split('')
  var i = 1
  while (i < ret.length) {
    if (ret[i] === 'h' && ASPIRABLES.includes(ret[i - 1])) {
      ret[i - 1] += 'h'
      ret.splice(i, 1)
    } else {
      i++
    }
  }
  return ret
}

function isValidWord(word) {
  return splitWord(word).length === WORDLEN
}

function importDict(filename) {
  const raw = JSON.parse(fs.readFileSync(filename, F8))
  console.log('Reading in ' + raw.length + ' entries from ' + filename + '...')
  var k = 'entry'
  if (raw[0].hasOwnProperty('word')) k = 'word'
  var v = k
  if (raw[0].hasOwnProperty('definition')) v = 'definition'
  if (raw[0].hasOwnProperty('gloss')) v = 'gloss'
  return Object.fromEntries(
    raw
      .filter((e) => isValidWord(e[k]))
      .map((e) => {
        var d = e[v]
        if (Array.isArray(d))
          d = d.reduce((a, b) => (a.length < b.length ? a : b))
        return [e[k], d]
      })
  )
}

const glossary = importDict('pli2en_glossary.json')
const cpd = importDict('pli2en_ncped.json')
const ped = importDict('pli2en_pts.json')

// CONSTRUCTION TIME

console.log('Building word lists...')
let allglosses = { ...cpd }
Object.entries(glossary).forEach(([k, v]) => (allglosses[k] = v))
var glosswords = Object.keys(allglosses)
var wordlist = Object.keys(cpd)
var validGuesses = Object.keys(ped)
  .concat(glosswords.filter((w) => !ped.hasOwnProperty(w)))
  .concat(
    wordlist.filter(
      (w) => !ped.hasOwnProperty(w) && !glossary.hasOwnProperty(w)
    )
  )
wordlist = wordlist.filter(
  (w) => ped.hasOwnProperty(w) || glossary.hasOwnProperty(w)
)
wordlist.concat(
  Object.keys(glossary).filter(
    (w) => !wordlist.includes(w) && ped.hasOwnProperty(w)
  )
)

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex
  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    ;[array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ]
  }
  return array
}
wordlist = shuffle(wordlist)
var examples = wordlist.splice(wordlist.length - 4)
const formletter = Math.floor(WORDLEN / 2)
for (var i = 0; i < 4; i++) {
  if (
    FORMABLES.includes(splitWord(examples[i])[formletter].normalize('NFD')[0])
  ) {
    ;[examples[1], examples[i]] = [examples[i], examples[1]]
    break
  }
}

console.log('Done!\n')
console.log('About to write to file:')
console.log('   worldlist.ts: ' + wordlist.length)
console.log('   valideGuesses.ts: ' + validGuesses.length)
console.log('   glosses.ts: ' + glosswords.length)
console.log('With InfoModal examples:')
for (const w of examples) {
  console.log('   ' + w)
}
console.log('Type y+Enter to continue...')
function getChar() {
  let buffer = Buffer.alloc(2)
  fs.readSync(0, buffer, 0, 2)
  return buffer.toString('utf8')
}
if (getChar() != 'y\n') {
  console.log('Exiting without writing changes')
  process.exit(1)
}

console.log('Optimizing storage...')

validGuesses = [...new Set(validGuesses)]
wordlist = new Set(wordlist)
validGuesses = validGuesses.filter(
  (w) => !wordlist.has(w) && !allglosses.hasOwnProperty(w)
)
var wordlist = [...wordlist]

var epoch = new Date().setHours(0, 0, 0, 0)

console.log('Writing changes...')
fs.writeFileSync(
  OUTPATH + 'validGuesses' + OUTEXT,
  'export const VALIDGUESSES = ' + JSON.stringify(validGuesses) + ';'
)
fs.writeFileSync(
  OUTPATH + 'wordlist' + OUTEXT,
  'export const WORDS = ' +
    JSON.stringify(wordlist) +
    ';\nexport const EPOCH = ' +
    epoch +
    ';\nexport const EXAMPLES = ' +
    JSON.stringify(examples) +
    ';\nexport const WORDLEN = ' +
    WORDLEN +
    ';\n'
)
fs.writeFileSync(
  OUTPATH + 'glosses' + OUTEXT,
  'export const GLOSSES: Record<string, string> = ' +
    JSON.stringify(allglosses) +
    ';'
)
