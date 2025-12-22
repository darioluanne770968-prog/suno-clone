'use client'

import Image from 'next/image'
import { Play, Pause } from 'lucide-react'
import { Track, usePlayerStore } from '@/lib/store'
import { cn } from '@/lib/utils'

interface MusicCardProps {
  track: Track
  size?: 'sm' | 'md' | 'lg'
}

export function MusicCard({ track, size = 'md' }: MusicCardProps) {
  const { currentTrack, isPlaying, setCurrentTrack, setIsPlaying } = usePlayerStore()
  const isCurrentTrack = currentTrack?.id === track.id
  const isCurrentlyPlaying = isCurrentTrack && isPlaying

  const handlePlay = () => {
    if (isCurrentTrack) {
      setIsPlaying(!isPlaying)
    } else {
      setCurrentTrack(track)
      setIsPlaying(true)
    }
  }

  const sizeClasses = {
    sm: 'w-32',
    md: 'w-48',
    lg: 'w-64',
  }

  const imageSizes = {
    sm: 'h-32 w-32',
    md: 'h-48 w-48',
    lg: 'h-64 w-64',
  }

  return (
    <div
      className={cn(
        'group cursor-pointer transition-transform hover:scale-105',
        sizeClasses[size]
      )}
      onClick={handlePlay}
    >
      <div className={cn('relative overflow-hidden rounded-xl', imageSizes[size])}>
        <Image
          src={track.cover}
          alt={track.title}
          fill
          className="object-cover transition-transform group-hover:scale-110"
        />

        {/* Overlay on hover */}
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity',
            isCurrentlyPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          )}
        >
          <button
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-black transition-transform hover:scale-110',
              isCurrentlyPlaying && 'animate-pulse'
            )}
          >
            {isCurrentlyPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </button>
        </div>

        {/* Genre badge */}
        <div className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
          {track.genre}
        </div>
      </div>

      <div className="mt-2 px-1">
        <h3 className="truncate text-sm font-medium text-white">{track.title}</h3>
        <p className="truncate text-xs text-white/60">{track.artist}</p>
      </div>
    </div>
  )
}
