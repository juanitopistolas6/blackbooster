import * as OutlineIcons from '@heroicons/react/24/outline'

export type IconName = keyof typeof OutlineIcons

interface HeroIconsProps {
  name: IconName
  className: string
}

export const HeroIcons = ({ name, className }: HeroIconsProps) => {
  const Icon = OutlineIcons[name]
  return (
    <Icon className={className ?? 'w-6 h-6'}/>
  )
}
