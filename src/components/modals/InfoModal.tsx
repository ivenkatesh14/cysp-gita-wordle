import { Cell } from '../grid/Cell'
import { BaseModal } from './BaseModal'
import { EXAMPLES, WORDLEN } from '../../constants/wordlist'
import { splitWord } from '../../lib/words'

const SAMPLES = EXAMPLES.map(splitWord);

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const InfoModal = ({ isOpen, handleClose }: Props) => {
  var firstrow = Array(WORDLEN).fill('');
  firstrow[1] = "correct";
  var secondrow = Array(WORDLEN).fill('');
  secondrow[Math.floor(WORDLEN/2)] = "mismarked";
  var thirdrow = Array(WORDLEN).fill('');
  thirdrow[WORDLEN-1] = 'present';
  var fourthrow = Array(WORDLEN).fill('');
  fourthrow[0] = 'absent';
  return (
    <BaseModal title="How to Play" isOpen={isOpen} handleClose={handleClose}>
        <p className="text-sm text-gray-900">
        Every day we have a new Pali term and you have six tries to guess it. Type a guess and hit enter (⏎) to submit.     
        </p>
        <div className="flex justify-center mb-1 mt-4">
          {firstrow.map((s,i) => (
            <Cell value={SAMPLES[0][i]} status={s} />
          ))}
        </div>
        <p className="text-sm text-gray-700">
          Once you submit, we'll reveal how close you are. Green means this letter is in the right spot and has exactly the correct form.
        </p>

        <div className="flex justify-center mb-1 mt-4">
          {secondrow.map((s,i) => (
            <Cell value={SAMPLES[1][i]} status={s} />
          ))}
        </div>
        <p className="text-sm text-gray-700">
           Blue means that you have the wrong form of the letter, but it's in the correct spot. For example, maybe it shouldn't be retroflex (ṭ) or maybe it needs to be long (ā). Type accented characters by hitting the period, hyphen, or tilde key after the letter.
        </p>
        
        <div className="flex justify-center mb-1 mt-4">
          {thirdrow.map((s,i) => (
            <Cell value={SAMPLES[2][i]} status={s} />
          ))}
        </div>
        <p className="text-sm text-gray-700">
          Yellow means this letter is in the word, but not in this location. It ignores diacritics, so "ā" will turn yellow if "a" is in the word. Likewise, "t" will if "ṭh" is.
        </p>

        <div className="flex justify-center mb-1 mt-4">
          {fourthrow.map((s,i) => (
            <Cell value={SAMPLES[3][i]} status={s} />
          ))}
        </div>
        <p className="text-sm text-gray-700">
          Gray means that this letter is not in the word in any form.
        </p>

    </BaseModal>
  )
}
