import { useEffect, useRef, useState } from 'react'

export function useTypewriter(text: string, speed = 55, startDelay = 600) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    let i = 0

    const timer = setTimeout(() => {
      interval = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) {
          clearInterval(interval)
          setDone(true)
        }
      }, speed)
    }, startDelay)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [text, speed, startDelay])

  return { displayed, done }
}
