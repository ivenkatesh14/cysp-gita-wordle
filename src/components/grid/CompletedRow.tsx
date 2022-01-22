import { getGuessStatuses } from '../../lib/statuses'
import { Cell } from './Cell'
import { splitWord } from '../../lib/words'

type Props = {
  guess: string
}

export const CompletedRow = ({ guess }: Props) => {
  const statuses = getGuessStatuses(guess)
  var display = splitWord(guess)
  return (
    <div className="flex justify-center mb-1">
      {display.map((letter, i) => (
        <Cell key={i} value={letter} status={statuses[i]} />
      ))}
    </div>
  )
}
