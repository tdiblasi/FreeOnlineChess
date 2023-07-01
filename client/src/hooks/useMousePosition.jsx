import { useState, useEffect } from 'react'

export const useMousePosition = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const setFromEvent = event =>
      setPos({ x: event.clientX, y: event.clientY })
    window.addEventListener('mousemove', setFromEvent)
    return () => {
      window.removeEventListener('mousemove', setFromEvent)
    }
  })

  return pos
}
