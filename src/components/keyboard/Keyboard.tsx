import { KeyValue } from '../../lib/keyboard'
import { getStatuses } from '../../lib/statuses'
import { Key } from './Key'
import { useEffect } from 'react'

type Props = {
  onChar: (value: string) => void
  onDelete: () => void
  onEnter: () => void
  onShift: () => void
  guesses: string[]
  isShifted: boolean
}

export const Keyboard = ({ onChar, onDelete, onEnter, onShift, guesses, isShifted }: Props) => {
  const charStatuses = getStatuses(guesses)

  const onClick = (value: KeyValue) => {
    if (value === 'ENTER') {
      onEnter()
    } else if (value === 'SHIFT') {
      onShift()
    } else if (value === 'DELETE') {
      onDelete()
    } else {
      onChar(value)
      if (isShifted) onShift();
    }
  }

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.code === 'Enter') {
        onEnter()
      } else if (e.code === 'Backspace') {
        onDelete()
      } else {
        if (e.key.length === 1 && e.key >= '\u0e01' && e.key <= '\u0e4c' && !(e.key >= '\u0e3a' && e.key <= '\u0e3f') && e.key !== '\u0e45' && e.key !== '\u0e46' && e.key !== '\u0e2f') {
          onChar(e.key)
        }
      }
    }
    window.addEventListener('keyup', listener)
    return () => {
      window.removeEventListener('keyup', listener)
    }
  }, [onEnter, onDelete, onChar])

  if (isShifted) {
      return (
        <div>
          <div className="flex justify-center mb-1">
            <Key value="ฎ" onClick={onClick} status={charStatuses['ฎ']} />
            <Key value="ฑ" onClick={onClick} status={charStatuses['ฑ']} />
            <Key value="ธ" onClick={onClick} status={charStatuses['ธ']} />
            <Key value="ู" onClick={onClick} status={charStatuses['ู']} />
            <Key value="๊" onClick={onClick} status={charStatuses['๊']} />
            <Key value="ณ" onClick={onClick} status={charStatuses['ณ']} />
            <Key value="ญ" onClick={onClick} status={charStatuses['ญ']} />
            <Key value="ฐ" onClick={onClick} status={charStatuses['ฐ']} />
            <Key width={65.4} value="DELETE" onClick={onClick}>
              ⌫
            </Key>
          </div>
          <div className="flex justify-center mb-1">
            <Key value="ฤ" onClick={onClick} status={charStatuses['ฤ']} />
            <Key value="ฆ" onClick={onClick} status={charStatuses['ฆ']} />
            <Key value="ฏ" onClick={onClick} status={charStatuses['ฏ']} />
            <Key value="โ" onClick={onClick} status={charStatuses['โ']} />
            <Key value="ฌ" onClick={onClick} status={charStatuses['ฌ']} />
            <Key value="็" onClick={onClick} status={charStatuses['็']} />
            <Key value="๋" onClick={onClick} status={charStatuses['๋']} />
            <Key value="ษ" onClick={onClick} status={charStatuses['ษ']} />
            <Key value="ศ" onClick={onClick} status={charStatuses['ศ']} />
            <Key value="ซ" onClick={onClick} status={charStatuses['ซ']} />
            <Key value="ฅ" onClick={onClick} status={charStatuses['ฅ']} />
            <Key width={65.4} value="ENTER" onClick={onClick}>
              ⏎
            </Key>
          </div>
          <div className="flex justify-center">
            <Key width={65.4} value="SHIFT" onClick={onClick} status="absent" >
              ⇧
            </Key>
            <Key value="ฉ" onClick={onClick} status={charStatuses['ฉ']} />
            <Key value="ฮ" onClick={onClick} status={charStatuses['ฮ']} />
            <Key value="์" onClick={onClick} status={charStatuses['์']} />
            <Key value="ฒ" onClick={onClick} status={charStatuses['ฒ']} />
            <Key value="ฬ" onClick={onClick} status={charStatuses['ฬ']} />
            <Key value="ฦ" onClick={onClick} status={charStatuses['ฦ']} />
          </div>
        </div>
      )
  } else {
      return (
        <div>
          <div className="flex justify-center mb-1">
            <Key value="ภ" onClick={onClick} status={charStatuses['ภ']} />
            <Key value="ถ" onClick={onClick} status={charStatuses['ถ']} />
            <Key value="ุ" onClick={onClick} status={charStatuses['ุ']} />
            <Key value="ึ" onClick={onClick} status={charStatuses['ึ']} />
            <Key value="ค" onClick={onClick} status={charStatuses['ค']} />
            <Key value="ต" onClick={onClick} status={charStatuses['ต']} />
            <Key value="จ" onClick={onClick} status={charStatuses['จ']} />
            <Key value="ข" onClick={onClick} status={charStatuses['ข']} />
            <Key value="ช" onClick={onClick} status={charStatuses['ช']} />
            <Key width={65.4} value="DELETE" onClick={onClick}>
              ⌫
            </Key>
          </div>
          <div className="flex justify-center mb-1">
            <Key value="ไ" onClick={onClick} status={charStatuses['ไ']} />
            <Key value="ำ" onClick={onClick} status={charStatuses['ำ']} />
            <Key value="พ" onClick={onClick} status={charStatuses['พ']} />
            <Key value="ะ" onClick={onClick} status={charStatuses['ะ']} />
            <Key value="ั" onClick={onClick} status={charStatuses['ั']} />
            <Key value="ี" onClick={onClick} status={charStatuses['ี']} />
            <Key value="ร" onClick={onClick} status={charStatuses['ร']} />
            <Key value="น" onClick={onClick} status={charStatuses['น']} />
            <Key value="ย" onClick={onClick} status={charStatuses['ย']} />
            <Key value="บ" onClick={onClick} status={charStatuses['บ']} />
            <Key value="ล" onClick={onClick} status={charStatuses['ล']} />
          </div>
          <div className="flex justify-center mb-1">
            <Key value="ฟ" onClick={onClick} status={charStatuses['ฟ']} />
            <Key value="ห" onClick={onClick} status={charStatuses['ห']} />
            <Key value="ก" onClick={onClick} status={charStatuses['ก']} />
            <Key value="ด" onClick={onClick} status={charStatuses['ด']} />
            <Key value="เ" onClick={onClick} status={charStatuses['เ']} />
            <Key value="้" onClick={onClick} status={charStatuses['้']} />
            <Key value="่" onClick={onClick} status={charStatuses['่']} />
            <Key value="า" onClick={onClick} status={charStatuses['า']} />
            <Key value="ส" onClick={onClick} status={charStatuses['ส']} />
            <Key value="ว" onClick={onClick} status={charStatuses['ว']} />
            <Key value="ง" onClick={onClick} status={charStatuses['ง']} />
            <Key value="ฃ" onClick={onClick} status={charStatuses['ฃ']} />
            <Key width={65.4} value="ENTER" onClick={onClick}>
              ⏎
            </Key>
          </div>
          <div className="flex justify-center">
            <Key width={65.4} value="SHIFT" onClick={onClick}>
              ⇧
            </Key>
            <Key value="ผ" onClick={onClick} status={charStatuses['ผ']} />
            <Key value="ป" onClick={onClick} status={charStatuses['ป']} />
            <Key value="แ" onClick={onClick} status={charStatuses['แ']} />
            <Key value="อ" onClick={onClick} status={charStatuses['อ']} />
            <Key value="ิ" onClick={onClick} status={charStatuses['ิ']} />
            <Key value="ื" onClick={onClick} status={charStatuses['ื']} />
            <Key value="ท" onClick={onClick} status={charStatuses['ท']} />
            <Key value="ม" onClick={onClick} status={charStatuses['ม']} />
            <Key value="ใ" onClick={onClick} status={charStatuses['ใ']} />
            <Key value="ฝ" onClick={onClick} status={charStatuses['ฝ']} />
          </div>
        </div>
      )
  }
}
