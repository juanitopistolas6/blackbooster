import { useResult } from '../contexts/result-context'
import { HeroIcons } from '../utils/heroicons'
import cn from 'clsx'

interface closeButton {
  className?: string
}

export const CloseButton = ({ className }: closeButton) => {
  const { handleClose } = useResult()

  return (
    <button onClick={handleClose}>
      <HeroIcons
        name='XMarkIcon'
        className={cn('',
          className ?? 'rounded-full w-8 h-8 p-1 flex justify-center items-center hover:bg-gray-200'
        )}
      />
    </button>
  )
}
