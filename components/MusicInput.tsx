'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, Plus, Dice5, Music, AlertCircle } from 'lucide-react'
import { samplePrompts, mockTracks } from '@/lib/mock-data'
import { useAppStore, usePlayerStore, Track } from '@/lib/store'
import { generateMusic, pollForCompletion, sunoTrackToTrack } from '@/lib/suno'

// Set to true to use mock data instead of real API (for development)
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

export function MusicInput() {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string>('')

  const { isGenerating, setIsGenerating, setGenerationProgress, addTrack } = useAppStore()
  const { setCurrentTrack, setIsPlaying, addToQueue } = usePlayerStore()

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

  const handleCreateMock = async () => {
    // Simulate generation progress
    let currentProgress = 0
    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 15
      if (currentProgress >= 100) {
        currentProgress = 100
        clearInterval(progressInterval)
      }
      setGenerationProgress(currentProgress)
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

    return [newTrack]
  }

  const handleCreateReal = async (): Promise<Track[]> => {
    setStatusMessage('Submitting request...')
    setGenerationProgress(10)

    // Call the API to generate music
    const response = await generateMusic({
      prompt,
      style: style || 'Pop',
      title: prompt.slice(0, 50),
      instrumental: false,
    })

    if (response.code !== 200 && response.code !== 0) {
      throw new Error(response.msg || 'Failed to generate music')
    }

    const taskId = response.data.taskId
    setStatusMessage('Generating music...')
    setGenerationProgress(30)

    // Poll for completion
    const tracks = await pollForCompletion(
      taskId,
      (status) => {
        if (status === 'processing') {
          setStatusMessage('AI is composing your music...')
          setGenerationProgress((prev) => Math.min(prev + 5, 90))
        }
      },
      60, // max attempts
      5000 // 5 second intervals
    )

    setGenerationProgress(100)
    setStatusMessage('Done!')

    // Convert to our Track format
    return tracks.map((track) => sunoTrackToTrack(track, prompt, style || 'AI Music'))
  }

  const handleCreate = async () => {
    if (!prompt.trim() || isGenerating) return

    setIsGenerating(true)
    setGenerationProgress(0)
    setError(null)
    setStatusMessage('')

    try {
      let newTracks: Track[]

      if (USE_MOCK) {
        newTracks = await handleCreateMock()
      } else {
        newTracks = await handleCreateReal()
      }

      // Add tracks to library and queue
      newTracks.forEach((track) => {
        addTrack(track)
        addToQueue(track)
      })

      // Play the first track
      if (newTracks.length > 0) {
        setCurrentTrack(newTracks[0])
        setIsPlaying(true)
      }

      setPrompt('')
      setStyle('')
    } catch (err) {
      console.error('Generation error:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate music')
    } finally {
      setIsGenerating(false)
      setGenerationProgress(0)
      setStatusMessage('')
    }
  }

  return (
    <div className="w-full max-w-3xl">
      <div className="relative rounded-2xl bg-black/30 backdrop-blur-xl border border-white/10 p-2">
        {/* Style input (optional) */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5">
          <Music className="h-4 w-4 text-white/40" />
          <input
            type="text"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            placeholder="Style (e.g., Pop, Jazz, Electronic)"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
            disabled={isGenerating}
          />
        </div>

        {/* Main prompt input */}
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

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-2 text-red-400 text-sm">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Status message */}
        {statusMessage && !error && (
          <div className="px-4 py-1 text-white/60 text-sm">
            {statusMessage}
          </div>
        )}

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
            {USE_MOCK && (
              <span className="text-xs text-yellow-500/60 px-2">Demo Mode</span>
            )}
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
