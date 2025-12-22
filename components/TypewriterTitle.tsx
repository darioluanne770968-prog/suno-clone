'use client'

import { useState, useEffect } from 'react'
import { samplePrompts } from '@/lib/mock-data'

export function TypewriterTitle() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentPrompt = samplePrompts[currentIndex]
    const typingSpeed = isDeleting ? 30 : 80
    const pauseTime = 2000

    if (!isDeleting && displayedText === currentPrompt) {
      // Pause before deleting
      const timeout = setTimeout(() => setIsDeleting(true), pauseTime)
      return () => clearTimeout(timeout)
    }

    if (isDeleting && displayedText === '') {
      // Move to next prompt
      setIsDeleting(false)
      setCurrentIndex((prev) => (prev + 1) % samplePrompts.length)
      return
    }

    const timeout = setTimeout(() => {
      if (isDeleting) {
        setDisplayedText(currentPrompt.slice(0, displayedText.length - 1))
      } else {
        setDisplayedText(currentPrompt.slice(0, displayedText.length + 1))
      }
    }, typingSpeed)

    return () => clearTimeout(timeout)
  }, [displayedText, isDeleting, currentIndex])

  return (
    <h1 className="text-center font-serif text-4xl font-light leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
      {displayedText}
      <span className="animate-pulse text-orange-400">|</span>
    </h1>
  )
}
