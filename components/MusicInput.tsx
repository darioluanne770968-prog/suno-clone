'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, Plus, Dice5 } from 'lucide-react'
import { samplePrompts } from '@/lib/mock-data'
import { useAppStore, usePlayerStore, Track } from '@/lib/store'
import { mockTracks } from '@/lib/mock-data'

export function MusicInput() {
  const [prompt, setPrompt] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('')
  const { isGenerating, setIsGenerating, setGenerationProgress, addTrack } = useAppStore()
  const { setCurrentTrack, setIsPlaying } = usePlayerStore()

  // Typewriter effect for placeholder
  useEffect(() => {
    const currentPrompt = samplePrompts[placeholderIndex]
    let charIndex = 0
    setDisplayedPlaceholder('')

    const typeInterval = setInterval(() => {
      if (charIndex <= currentPrompt.length) {
        setDisplayedPlaceholder(currentPrompt.slice(0, charIndex))
        charIndex++
      } else {
        clearInterval(typeInterval)
        setTimeout(() => {
          setPlaceholderIndex((prev) => (prev + 1) % samplePrompts.length)
        }, 2000)
      }
    }, 50)

    return () => clearInterval(typeInterval)
  }, [placeholderIndex])

  const handleRandomPrompt = () => {
    const randomPrompt = samplePrompts[Math.floor(Math.random() * samplePrompts.length)]
    setPrompt(randomPrompt)
  }

  const handleCreate = async () => {
    if (!prompt.trim() || isGenerating) return

    setIsGenerating(true)
    setGenerationProgress(0)

    // Simulate generation progress
    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 300)

    // Simulate AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    clearInterval(progressInterval)
    setGenerationProgress(100)

    // Create a new mock track
    const randomTrack = mockTracks[Math.floor(Math.random() * mockTracks.length)]
    const newTrack: Track = {
      ...randomTrack,
      id: Date.now().toString(),
      title: prompt.slice(0, 30) + (prompt.length > 30 ? '...' : ''),
      prompt: prompt,
      createdAt: new Date(),
    }

    addTrack(newTrack)
    setCurrentTrack(newTrack)
    setIsPlaying(true)

    setIsGenerating(false)
    setGenerationProgress(0)
    setPrompt('')
  }

  return (
    <div className="w-full max-w-3xl">
      <div className="relative rounded-2xl bg-black/30 backdrop-blur-xl border border-white/10 p-2">
        <div className="flex items-start gap-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={displayedPlaceholder || 'Type any idea you have into a song'}
            className="flex-1 min-h-[60px] max-h-[120px] resize-none bg-transparent px-4 py-3 text-white placeholder:text-white/40 focus:outline-none"
            disabled={isGenerating}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleCreate()
              }
            }}
          />
        </div>

        <div className="flex items-center justify-between px-2 pb-1">
          <div className="flex items-center gap-2">
            <button
              onClick={handleRandomPrompt}
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              disabled={isGenerating}
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              onClick={handleRandomPrompt}
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              disabled={isGenerating}
            >
              <Dice5 className="h-4 w-4" />
              <span className="hidden sm:inline">Random</span>
            </button>
          </div>

          <Button
            onClick={handleCreate}
            disabled={!prompt.trim() || isGenerating}
            className="rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-2 text-white hover:from-orange-600 hover:to-pink-600 disabled:opacity-50"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {isGenerating ? 'Creating...' : 'Create'}
          </Button>
        </div>

        {/* Generation progress bar */}
        {isGenerating && (
          <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-2xl">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all duration-300"
              style={{ width: `${useAppStore.getState().generationProgress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
