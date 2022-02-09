import { WORDS, EPOCH } from '../constants/wordlist'
import { GLOSSES } from '../constants/glosses'
import { VALIDGUESSES } from '../constants/validGuesses'

export const ASPIRABLES = 'tdckgjḍṭpb'

export const splitWord = (word: string): string[] => {
  var ret = word.normalize().split('')
  var i = 1
  while (i < ret.length) {
    if (ret[i] === 'h' && ASPIRABLES.includes(ret[i - 1])) {
      ret[i - 1] += 'h'
      ret.splice(i, 1)
    } else if (ret[i - 1] === 'a' && 'iu'.includes(ret[i])) {
      ret[i - 1] += ret[i]
      ret.splice(i, 1)
    } else {
      i++
    }
  }
  return ret
}

export const isWordInWordList = (word: string): boolean => {
  return (
    WORDS.includes(word) ||
    VALIDGUESSES.includes(word) ||
    GLOSSES.hasOwnProperty(word)
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
