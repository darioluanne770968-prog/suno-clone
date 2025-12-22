'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Howl } from 'howler'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Repeat1,
  Shuffle,
  Heart,
} from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { usePlayerStore, useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function MusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    volume,
    progress,
    duration,
    shuffle,
    repeat,
    setIsPlaying,
    setVolume,
    setProgress,
    setDuration,
    playNext,
    playPrevious,
    toggleShuffle,
    toggleRepeat,
  } = usePlayerStore()

  const { likedTrackIds, toggleLike } = useAppStore()

  const soundRef = useRef<Howl | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [prevVolume, setPrevVolume] = useState(volume)

  const isLiked = currentTrack ? likedTrackIds.includes(currentTrack.id) : false

  useEffect(() => {
    if (!currentTrack) return

    // Clean up previous sound
    if (soundRef.current) {
      soundRef.current.unload()
    }

    // Create new Howl instance
    soundRef.current = new Howl({
      src: [currentTrack.audioUrl],
      html5: true,
      volume: volume,
      onload: () => {
        setDuration(soundRef.current?.duration() || 0)
      },
      onend: () => {
        if (repeat === 'one') {
          soundRef.current?.seek(0)
          soundRef.current?.play()
        } else {
          playNext()
        }
      },
    })

    if (isPlaying) {
      soundRef.current.play()
    }

    return () => {
      soundRef.current?.unload()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?.id])

  useEffect(() => {
    if (!soundRef.current) return

    if (isPlaying) {
      soundRef.current.play()
    } else {
      soundRef.current.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    if (!soundRef.current) return
    soundRef.current.volume(isMuted ? 0 : volume)
  }, [volume, isMuted])

  // Update progress
  useEffect(() => {
    if (!soundRef.current || !isPlaying) return

    const interval = setInterval(() => {
      const seek = soundRef.current?.seek() || 0
      setProgress(seek)
    }, 1000)

    return () => clearInterval(interval)
  }, [isPlaying, setProgress])

  // Handle seek when progress is changed externally (for repeat one restart)
  useEffect(() => {
    if (soundRef.current && progress === 0 && repeat === 'one') {
      soundRef.current.seek(0)
    }
  }, [progress, repeat])

  const handleSeek = (value: number[]) => {
    const newProgress = value[0]
    setProgress(newProgress)
    soundRef.current?.seek(newProgress)
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
    setIsMuted(false)
  }

  const toggleMute = () => {
    if (isMuted) {
      setVolume(prevVolume)
      setIsMuted(false)
    } else {
      setPrevVolume(volume)
      setIsMuted(true)
    }
  }

  if (!currentTrack) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-screen-2xl items-center justify-between px-4">
        {/* Track info */}
        <div className="flex items-center gap-3 w-1/4">
          <div className="relative h-12 w-12 overflow-hidden rounded-lg">
            <Image
              src={currentTrack.cover}
              alt={currentTrack.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <h4 className="truncate text-sm font-medium text-white">
              {currentTrack.title}
            </h4>
            <p className="truncate text-xs text-white/60">{currentTrack.artist}</p>
          </div>
          <button
            onClick={() => toggleLike(currentTrack.id)}
            className={cn(
              'ml-2 transition-colors',
              isLiked ? 'text-pink-500' : 'text-white/40 hover:text-white'
            )}
          >
            <Heart className={cn('h-4 w-4', isLiked && 'fill-current')} />
          </button>
        </div>

        {/* Player controls */}
        <div className="flex flex-1 flex-col items-center gap-1 max-w-xl">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleShuffle}
              className={cn(
                'transition-colors',
                shuffle ? 'text-orange-500' : 'text-white/60 hover:text-white'
              )}
              title={shuffle ? 'Shuffle on' : 'Shuffle off'}
            >
              <Shuffle className="h-4 w-4" />
            </button>
            <button
              onClick={playPrevious}
              className="text-white/60 hover:text-white transition-colors"
            >
              <SkipBack className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </button>
            <button
              onClick={playNext}
              className="text-white/60 hover:text-white transition-colors"
            >
              <SkipForward className="h-5 w-5" />
            </button>
            <button
              onClick={toggleRepeat}
              className={cn(
                'transition-colors relative',
                repeat !== 'off' ? 'text-orange-500' : 'text-white/60 hover:text-white'
              )}
              title={
                repeat === 'off'
                  ? 'Repeat off'
                  : repeat === 'all'
                  ? 'Repeat all'
                  : 'Repeat one'
              }
            >
              {repeat === 'one' ? (
                <Repeat1 className="h-4 w-4" />
              ) : (
                <Repeat className="h-4 w-4" />
              )}
              {repeat === 'all' && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2 items-center justify-center rounded-full bg-orange-500" />
              )}
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex w-full items-center gap-2">
            <span className="text-xs text-white/60 w-10 text-right">
              {formatTime(progress)}
            </span>
            <Slider
              value={[progress]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="flex-1"
            />
            <span className="text-xs text-white/60 w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume control */}
        <div className="flex items-center gap-2 w-1/4 justify-end">
          <button onClick={toggleMute} className="text-white/60 hover:text-white transition-colors">
            {isMuted || volume === 0 ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </button>
          <Slider
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-24"
          />
        </div>
      </div>
    </div>
  )
}
