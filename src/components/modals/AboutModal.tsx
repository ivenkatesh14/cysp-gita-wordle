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
          href="https://github.com/obu-labs/wordle-pali"
          className="underline font-bold"
        >
          open source
        </a>{' '}
        clone of{' '}
        <a
          href="https://www.powerlanguage.co.uk/wordle/"
          className="underline font-bold"
        >
          the popular, original game by Josh Wardle
        </a>{' '}
        based on the Pali Dictionaries on{' '}
        <a href="https://suttacentral.net/" className="underline font-bold">
          SuttaCentral
        </a>
        . This webpage is not endorsed by either.
      </p>
    </BaseModal>
  )
}
