import type { ReactNode, CSSProperties } from 'react'
import { useIntersection } from '@/hooks/useIntersection'

interface Props {
  children: ReactNode
  delay?: number
  className?: string
  style?: CSSProperties
  direction?: 'up' | 'right'
  distance?: number
}

export function RevealOnScroll({
  children,
  delay = 0,
  className = '',
  style,
  direction = 'up',
  distance = 22,
}: Props) {
  const { ref, isVisible } = useIntersection()
  const initial =
    direction === 'up' ? `translateY(${distance}px)` : `translateX(${distance}px)`

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      style={{
        ...style,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : initial,
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}
