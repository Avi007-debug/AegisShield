import { useEffect, useState } from 'react'

export function useCountUp(target: number, duration = 1400, active = false) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) return
    let startTime: number | null = null
    let raf: number

    const tick = (ts: number) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(parseFloat((eased * target).toFixed(1)))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, target, duration])

  return value
}
