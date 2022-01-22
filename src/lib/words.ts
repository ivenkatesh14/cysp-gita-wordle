import { WORDS, EPOCH, WORDLEN } from '../constants/wordlist'
import { VALIDGUESSES } from '../constants/validGuesses'

export const splitWord = (
  word: string
): string[] => {
    var ret = Array(WORDLEN).fill('');
    var i = -1;
    const proper = word.split('');
    for(const j of proper) {
        if (/[\u0e47-\u0e4c\u0e31\u0e34-\u0e3a]/.test(j)) {
            ret[i] += j;
        } else {
            ret[++i] = j;
        }
    }
    return ret;
}

export const isWordInWordList = (word: string): boolean => {
  return (
    WORDS.includes(word) ||
    VALIDGUESSES.includes(word)
  )
}

export const isWinningWord = (word: string) => {
  return solution === word
}

export const getWordOfDay = () => {
  const now = Date.now()
  const msInDay = 86400000
  var index = Math.floor((now - EPOCH) / msInDay)
  const nextday = (index + 1) * msInDay + EPOCH
  index %= WORDS.length

  return {
    solution: WORDS[index],
    solutionIndex: index,
    tomorrow: nextday,
  }
}

export const { solution, solutionIndex, tomorrow } = getWordOfDay()
