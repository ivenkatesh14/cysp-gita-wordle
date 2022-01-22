import { Cell } from './Cell'
import { splitWord } from '../../lib/words'
import { WORDLEN } from '../../constants/wordlist'

type Props = {
  guess: string
}

export const CurrentRow = ({ guess }: Props) => {
  const splitGuess = splitWord(guess)
  const emptyCells = Array.from(Array(WORDLEN - splitGuess.length))

  return (
    <div className="flex justify-center mb-1">
      {splitGuess.map((letter, i) => (
        <Cell key={i} value={letter} />
      ))}
      {emptyCells.map((_, i) => (
        <Cell key={i} />
      ))}
    </div>
  )
}
