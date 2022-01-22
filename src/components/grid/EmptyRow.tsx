import { Cell } from './Cell'
import { WORDLEN } from '../../constants/wordlist'

export const EmptyRow = () => {
  const emptyCells = Array.from(Array(WORDLEN))

  return (
    <div className="flex justify-center mb-1">
      {emptyCells.map((_, i) => (
        <Cell key={i} />
      ))}
    </div>
  )
}
