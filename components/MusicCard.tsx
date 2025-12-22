'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Play, Pause, Heart, Info } from 'lucide-react'
import { Track, usePlayerStore, useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

interface MusicCardProps {
  track: Track
  size?: 'sm' | 'md' | 'lg'
  showLike?: boolean
}

export function MusicCard({ track, size = 'md', showLike = true }: MusicCardProps) {
  const { currentTrack, isPlaying, setCurrentTrack, setIsPlaying } = usePlayerStore()
  const { likedTrackIds, toggleLike } = useAppStore()

  const isCurrentTrack = currentTrack?.id === track.id
  const isCurrentlyPlaying = isCurrentTrack && isPlaying
  const isLiked = likedTrackIds.includes(track.id)

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isCurrentTrack) {
      setIsPlaying(!isPlaying)
    } else {
      setCurrentTrack(track)
      setIsPlaying(true)
    }
  }

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleLike(track.id)
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
            onClick={handlePlay}
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

        {/* Like button */}
        {showLike && (
          <button
            onClick={handleLike}
            className={cn(
              'absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-all',
              isLiked ? 'text-pink-500' : 'text-white/60 opacity-0 group-hover:opacity-100 hover:text-white'
            )}
          >
            <Heart className={cn('h-4 w-4', isLiked && 'fill-current')} />
          </button>
        )}

        {/* Info button */}
        <Link
          href={`/track/${track.id}`}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2 left-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm text-white/60 opacity-0 group-hover:opacity-100 hover:text-white transition-all"
        >
          <Info className="h-4 w-4" />
        </Link>

        {/* Genre badge */}
        <div className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
          {track.genre}
        </div>
      </div>

      <Link href={`/track/${track.id}`} className="block mt-2 px-1">
        <div className="flex items-center justify-between">
          <h3 className="truncate text-sm font-medium text-white hover:underline">{track.title}</h3>
          {isLiked && (
            <Heart className="h-3 w-3 fill-current text-pink-500 flex-shrink-0 ml-1" />
          )}
        </div>
        <p className="truncate text-xs text-white/60">{track.artist}</p>
      </Link>
    </div>
  )
}
