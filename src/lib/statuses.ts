import { solution, splitWord } from './words'
import { WORDLEN } from '../constants/wordlist'

export type CharStatus = 'absent' | 'present' | 'mismarked' | 'correct'

export type CharValue =
  | 'a'
  | 'i'
  | 'u'
  | 'e'
  | 'o'
  | 'm'
  | 'k'
  | 'g'
  | 'n'
  | 'c'
  | 'j'
  | 't'
  | 'd'
  | 'p'
  | 'b'
  | 'y'
  | 'r'
  | 'l'
  | 'v'
  | 's'
  | 'h'
  | 'ñ'
  | '~'
  | '.'
  | '-'
  | '’'

function denormSplit(word: string) {
  return splitWord(word).map((w) => w.normalize('NFD'))
}

export const statusForLetter = (
  letter: string,
  position: number,
  split_solution: string[]
): CharStatus => {
  if (split_solution[position] === letter) return 'correct'
  if (split_solution[position][0] === letter[0]) return 'mismarked'
  if (split_solution.map((l) => l[0]).includes(letter[0])) return 'present'
  return 'absent'
}

export const getStatuses = (
  guesses: string[]
): { [key: string]: CharStatus } => {
  const split_solution = denormSplit(solution)
  const charObj: { [key: string]: CharStatus } = {}
  for (const guess of guesses) {
    if (!guess) break
    const word = denormSplit(guess)
    for (var i = 0; i < word.length; i++) {
      const letter = word[i]
      const status = statusForLetter(letter, i, split_solution)
      switch (status) {
        case 'absent':
          charObj[letter[0]] = 'absent'
          continue
        case 'correct':
          charObj[letter[0]] = 'correct'
          continue
        case 'mismarked':
          if (charObj[letter[0]] !== 'correct') {
            charObj[letter[0]] = 'mismarked'
          }
          continue
        case 'present':
          if (!charObj[letter[0]]) {
            charObj[letter[0]] = 'present'
          }
      }
    }
  }

  return charObj
}

export const getGuessStatuses = (guess: string): CharStatus[] => {
  var answer = denormSplit(solution)
  const splitguess = denormSplit(guess)
  var placed = splitguess.map((letter, i) => statusForLetter(letter, i, answer))
  for (var i = 0; i < answer.length; i++) {
    if (placed[i] === 'mismarked' || placed[i] === 'correct') {
      answer[i] = 'q'
    }
  }
  var statuses = splitguess.map((letter, i) => {
    var ret = statusForLetter(letter, i, answer)
    if (ret === 'present') {
      answer[answer.findIndex((l) => l[0] === letter[0])] = 'z'
    }
    return ret
  })
  for (i = 0; i < statuses.length; i++) {
    if (answer[i] === 'q') {
      statuses[i] = placed[i]
    }
  }
  return statuses
}

export const generateRedundancyWarning = (
  current_guess: string,
  past_guesses: string[]
): string => {
  var ret = ''
  const splitguess = denormSplit(current_guess)
  const answer = denormSplit(solution)
  const denormsol = answer.map((l) => l[0])
  for (const past_guess of past_guesses) {
    const splitpast = denormSplit(past_guess)
    for (var i = WORDLEN - 1; i >= 0; i--) {
      if (
        !denormsol.includes(splitpast[i][0]) &&
        splitguess.map((l) => l[0]).includes(splitpast[i][0])
      ) {
        ret =
          'You know already that "' + splitpast[i][0] + '" isn\'t in the word.'
      }
      if (
        denormsol.includes(splitpast[i][0]) &&
        answer[i][0] !== splitpast[i][0] &&
        splitguess[i][0] === splitpast[i][0]
      ) {
        ret = '"' + splitguess[i][0] + '" goes elsewhere in the secret word.'
      }
      // Hard Mode Checks
      if (!ret && answer[i] === splitpast[i] && splitguess[i] !== answer[i]) {
        ret = 'Letter ' + (i + 1) + ' is "' + answer[i] + '"'
      }
      if (
        !ret &&
        answer[i][0] === splitpast[i][0] &&
        splitguess[i][0] !== answer[i][0]
      ) {
        ret =
          'Letter ' + (i + 1) + ' should be some form of "' + answer[i][0] + '"'
      }
      if (
        !ret &&
        denormsol.includes(splitpast[i][0]) &&
        !splitguess.map((l) => l[0]).includes(splitpast[i][0])
      ) {
        ret =
          'The secret word has some version of "' + splitpast[i][0] + '" in it.'
      }
    }
  }
  if (!ret) return ''
  return (
    'Warning! ' +
    ret +
    ' Press ⏎ again to submit this guess anyway. Hit backspace to delete.'
  )
}
