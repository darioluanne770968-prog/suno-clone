'use client'

import { useState, useEffect, useCallback } from 'react'
import { samplePrompts } from '@/lib/mock-data'

export function TypewriterTitle() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting'>('typing')

  const currentPrompt = samplePrompts[currentIndex]

  const handleTyping = useCallback(() => {
    if (displayedText.length < currentPrompt.length) {
      setDisplayedText(currentPrompt.slice(0, displayedText.length + 1))
    } else {
      setPhase('pausing')
    }
  }, [displayedText, currentPrompt])

  const handleDeleting = useCallback(() => {
    if (displayedText.length > 0) {
      setDisplayedText(displayedText.slice(0, -1))
    } else {
      setCurrentIndex((prev) => (prev + 1) % samplePrompts.length)
      setPhase('typing')
    }
  }, [displayedText])

  useEffect(() => {
    let timeout: NodeJS.Timeout

    switch (phase) {
      case 'typing':
        timeout = setTimeout(handleTyping, 80)
        break
      case 'pausing':
        timeout = setTimeout(() => setPhase('deleting'), 2000)
        break
      case 'deleting':
        timeout = setTimeout(handleDeleting, 30)
        break
    }

    return () => clearTimeout(timeout)
  }, [phase, handleTyping, handleDeleting])

  return (
    <h1 className="text-center font-serif text-4xl font-light leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
      {displayedText}
      <span className="animate-pulse text-orange-400">|</span>
    </h1>
  )
}
