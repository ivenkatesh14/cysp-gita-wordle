import { getGuessStatuses } from './statuses'
import { solutionIndex, splitWord } from './words'
import copy from 'copy-to-clipboard'

export const shareStatus = (guesses: string[], lost: boolean) => {
  const text =
    'Pali Wordle ' +
      (solutionIndex+1) +
      ' ' +
      (lost?'X':guesses.length) +
      '/6\n\n' +
      generateEmojiGrid(guesses)
  return copy(text, { format: 'text/plain' })
}

export const generateEmojiGrid = (guesses: string[]) => {
  return guesses
    .map((guess) => {
      const status = getGuessStatuses(guess)
      return splitWord(guess)
        .map((letter, i) => {
          switch (status[i]) {
            case 'correct':
              return '🟩'
            case 'mismarked':
              return '🟦'
            case 'present':
              return '🟨'
            default:
              return '⬜'
          }
        })
        .join('')
    })
    .join('\n')
}
