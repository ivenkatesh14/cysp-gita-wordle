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
  secondrow[0] = "mismarked";
  var thirdrow = Array(WORDLEN).fill('');
  thirdrow[WORDLEN-1] = 'present';
  var fourthrow = Array(WORDLEN).fill('');
  fourthrow[Math.floor(WORDLEN/2)] = 'absent';
  return (
    <BaseModal title="วิธีการเล่น" isOpen={isOpen} handleClose={handleClose}>
        <p className="text-sm text-gray-500">
        เราเลือกคำใหม่ให้คุฌทุกวัน คุณมีโอกาส 6 ครั้งที่จะเดาคำศัพท์ กด ⏎ เพื่อส่ง แต่ละสีของช่องสี่เหลี่ยมมีความหมายดังนี้
        
       
        </p>
        <div className="flex justify-center mb-1 mt-4">
          {firstrow.map((s,i) => (
            <Cell value={SAMPLES[0][i]} status={s} />
          ))}
        </div>
        <p className="text-sm text-gray-500">
          สีเขียวหมายถึงมีตัวอักษรนี้อยู่ในคำและอยู่ในตำแหน่งนั้น
        </p>

        <div className="flex justify-center mb-1 mt-4">
          {secondrow.map((s,i) => (
            <Cell value={SAMPLES[1][i]} status={s} />
          ))}
        </div>
        <p className="text-sm text-gray-500">
           สีฟ้าหมายถึงมีตัวอักษรนี้อยู่ในตำแหน่งนั้น แต่สระหรือวรรณยุกต์ยังไม่ถูกต้อง
        </p>
        
        <div className="flex justify-center mb-1 mt-4">
          {thirdrow.map((s,i) => (
            <Cell value={SAMPLES[2][i]} status={s} />
          ))}
        </div>
        <p className="text-sm text-gray-500">
          สีเหลืองหมายถึงมีตัวอักษรนี้อยู่ แต่ไม่ได้อยู่ในตำแหน่งนี้ และมีความเป็นไปได้ที่จะมีสระและวรรณยุกต์อื่นปนอยู่ด้วย
        </p>

        <div className="flex justify-center mb-1 mt-4">
          {fourthrow.map((s,i) => (
            <Cell value={SAMPLES[3][i]} status={s} />
          ))}
        </div>
        <p className="text-sm text-gray-500">
          สีเทาหมายถึงไม่มีตัวอักษรนี้อยู่ในคำศัพท์นี้
        </p>

    </BaseModal>
  )
}
