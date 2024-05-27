import { useModal } from '../hooks/useModal'
import { Modal } from '../Modals/Modal'
import cn from 'clsx'

interface buttonProps {
  label: string
  className?: string
  modal?: JSX.Element
}

export const QueryButton = ({ label, className, modal }: buttonProps) => {
  const { open, handleClose, handleOpen } = useModal()
  return (
    <>
      { modal &&
        <Modal
          closeModal={handleClose}
          open={open}
        >
          {modal}
        </Modal>
      }
      <button
        className={cn('rounded-md hover:scale-105 bg-blue-800 w-48 text-white font-semibold text-center',
          className)}
          onClick={handleOpen}
      >
        {label}
      </button>
    </>
  )
}
