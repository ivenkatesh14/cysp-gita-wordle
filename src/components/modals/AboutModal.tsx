import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const AboutModal = ({ isOpen, handleClose }: Props) => {
  return (
    <BaseModal title="About" isOpen={isOpen} handleClose={handleClose}>
      <p className="text-sm text-gray-500">
        This is an{' '}
        <a
          href="https://github.com/skalyan91/wordle-sanskrit"
          className="underline font-bold"
        >
          open source
        </a> adapted from{' '}
        <a
          href="https://github.com/skalyan91/wordle-sanskrit"
          className="underline font-bold"
        >
          wordle-sanskrit
          </a> origninally taken from  
        <a
          href="https://www.powerlanguage.co.uk/wordle/"
          className="underline font-bold"
        >
           the popular, original game by Josh Wardle
        </a>{' '}
        based on the Sanskrit Dictionary at the{' '}
        <a href="http://www.sanskrit-linguistics.org/dcs/" className="underline font-bold">
          Digital Corpus of Sanskrit
        </a>
        . This webpage is not endorsed by either.
      </p>
    </BaseModal>
  )
}
