import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const AboutModal = ({ isOpen, handleClose }: Props) => {
  return (
    <BaseModal title="เกี่ยวกับ" isOpen={isOpen} handleClose={handleClose}>
        <p className="text-gray-500">
          เกมนี้เป็น
          <a
            href="https://github.com/buddhist-uni/wordle-thai"
            className="underline font-bold"
          >
            โอเพ่นซอร์ส
          </a>
          ถูกสร้างขึ้นจาก
          <a
            href="https://github.com/hannahcode/wordle"
            className="underline font-bold"
          >
            โค้ดของ Hannah Park
          </a>{' '}
          และ
          <a
            href="https://www.powerlanguage.co.uk/wordle/"
            className="underline font-bold"
          >
            เกมต้นฉบับภาษาอังกฤษของ Josh Wardle
          </a>{' '}
          แต่เกมนี้ไม่เกี่ยวข้องกับพวกเขา
        </p>
    </BaseModal>
  )
}
