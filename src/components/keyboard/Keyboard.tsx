import { KeyValue } from '../../lib/keyboard'
import { getStatuses } from '../../lib/statuses'
import { Key } from './Key'
import { useEffect } from 'react'

type Props = {
  onChar: (value: string) => void
  onDelete: () => void
  onEnter: () => void
  guesses: string[]
}

export const Keyboard = ({ onChar, onDelete, onEnter, guesses }: Props) => {
  const charStatuses = getStatuses(guesses)

  const onClick = (value: KeyValue) => {
    if (value === 'ENTER') {
      onEnter()
    } else if (value === 'DELETE') {
      onDelete()
    } else {
      onChar(value)
    }
  }

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.code === 'Enter') {
        onEnter()
      } else if (e.code === 'Backspace') {
        onDelete()
      } else {
        if (
          e.key.length === 1 &&
          '.-_~aāiīuūeoṃkgṅcjñṭḍṇtdnpbmyrlḷvsh'.includes(e.key)
        ) {
          onChar(e.key)
        }
      }
    }
    window.addEventListener('keyup', listener)
    return () => {
      window.removeEventListener('keyup', listener)
    }
  }, [onEnter, onDelete, onChar])

  return (
    <div>
      <div className="flex justify-center mb-1">
        <Key value="~" onClick={onClick} status={charStatuses['~']} />
        <Key value="e" onClick={onClick} status={charStatuses['e']} />
        <Key value="r" onClick={onClick} status={charStatuses['r']} />
        <Key value="t" onClick={onClick} status={charStatuses['t']} />
        <Key value="y" onClick={onClick} status={charStatuses['y']} />
        <Key value="u" onClick={onClick} status={charStatuses['u']} />
        <Key value="i" onClick={onClick} status={charStatuses['i']} />
        <Key value="o" onClick={onClick} status={charStatuses['o']} />
        <Key value="p" onClick={onClick} status={charStatuses['p']} />
        <Key value="-" onClick={onClick} status={charStatuses['-']} />
      </div>
      <div className="flex justify-center mb-1">
        <Key value="a" onClick={onClick} status={charStatuses['a']} />
        <Key value="s" onClick={onClick} status={charStatuses['s']} />
        <Key value="d" onClick={onClick} status={charStatuses['d']} />
        <Key value="g" onClick={onClick} status={charStatuses['g']} />
        <Key value="h" onClick={onClick} status={charStatuses['h']} />
        <Key value="j" onClick={onClick} status={charStatuses['j']} />
        <Key value="k" onClick={onClick} status={charStatuses['k']} />
        <Key value="l" onClick={onClick} status={charStatuses['l']} />
      </div>
      <div className="flex justify-center">
        <Key width={65.4} value="DELETE" onClick={onClick}>
          ⌫
        </Key>
        <Key value="c" onClick={onClick} status={charStatuses['c']} />
        <Key value="v" onClick={onClick} status={charStatuses['v']} />
        <Key value="b" onClick={onClick} status={charStatuses['b']} />
        <Key value="n" onClick={onClick} status={charStatuses['n']} />
        <Key value="m" onClick={onClick} status={charStatuses['m']} />
        <Key value="." onClick={onClick} status={charStatuses['.']} />
        <Key width={65.4} value="ENTER" onClick={onClick}>
          ⏎
        </Key>
      </div>
    </div>
  )
}
