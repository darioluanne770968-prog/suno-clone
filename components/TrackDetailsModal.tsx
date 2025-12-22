'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { X, Play, Pause, Heart, Share2, Download, Clock, Calendar, Music2 } from 'lucide-react'
import { Track, usePlayerStore, useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

interface TrackDetailsModalProps {
  track: Track | null
  isOpen: boolean
  onClose: () => void
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function TrackDetailsModal({ track, isOpen, onClose }: TrackDetailsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const { currentTrack, isPlaying, setCurrentTrack, setIsPlaying, addToQueue } = usePlayerStore()
  const { likedTrackIds, toggleLike } = useAppStore()

  const isCurrentTrack = track && currentTrack?.id === track.id
  const isCurrentlyPlaying = isCurrentTrack && isPlaying
  const isLiked = track ? likedTrackIds.includes(track.id) : false

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Close modal on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      onClose()
    }
  }

  const handlePlay = () => {
    if (!track) return
    if (isCurrentTrack) {
      setIsPlaying(!isPlaying)
    } else {
      setCurrentTrack(track)
      setIsPlaying(true)
    }
  }

  const handleAddToQueue = () => {
    if (track) {
      addToQueue(track)
    }
  }

  const handleShare = async () => {
    if (track && navigator.share) {
      try {
        await navigator.share({
          title: track.title,
          text: `Check out "${track.title}" by ${track.artist}`,
          url: window.location.href,
        })
      } catch {
        // User cancelled or share failed
      }
    }
  }

  if (!isOpen || !track) return null

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-zinc-900 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white/60 transition-colors hover:bg-black/70 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Cover image */}
        <div className="relative aspect-video w-full">
          <Image
            src={track.cover}
            alt={track.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={handlePlay}
              className={cn(
                'flex h-20 w-20 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition-transform hover:scale-110',
                isCurrentlyPlaying && 'animate-pulse'
              )}
            >
              {isCurrentlyPlaying ? (
                <Pause className="h-10 w-10" />
              ) : (
                <Play className="h-10 w-10 ml-1" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title and actions */}
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">{track.title}</h2>
              <p className="text-white/60">{track.artist}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toggleLike(track.id)}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
                  isLiked
                    ? 'bg-pink-500/20 text-pink-500'
                    : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                )}
              >
                <Heart className={cn('h-5 w-5', isLiked && 'fill-current')} />
              </button>
              <button
                onClick={handleShare}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
              >
                <Share2 className="h-5 w-5" />
              </button>
              <button
                onClick={handleAddToQueue}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
                title="Add to queue"
              >
                <Download className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Metadata */}
          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-white/5 p-4">
              <div className="mb-1 flex items-center gap-2 text-white/40">
                <Music2 className="h-4 w-4" />
                <span className="text-xs">Genre</span>
              </div>
              <p className="font-medium text-white">{track.genre}</p>
            </div>
            <div className="rounded-xl bg-white/5 p-4">
              <div className="mb-1 flex items-center gap-2 text-white/40">
                <Clock className="h-4 w-4" />
                <span className="text-xs">Duration</span>
              </div>
              <p className="font-medium text-white">{formatDuration(track.duration)}</p>
            </div>
            <div className="rounded-xl bg-white/5 p-4">
              <div className="mb-1 flex items-center gap-2 text-white/40">
                <Calendar className="h-4 w-4" />
                <span className="text-xs">Created</span>
              </div>
              <p className="font-medium text-white">{formatDate(track.createdAt)}</p>
            </div>
          </div>

          {/* Prompt */}
          {track.prompt && (
            <div className="rounded-xl bg-white/5 p-4">
              <h3 className="mb-2 text-sm font-medium text-white/60">Prompt</h3>
              <p className="text-white">{track.prompt}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={handlePlay}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 py-3 font-medium text-white transition-transform hover:scale-[1.02]"
            >
              {isCurrentlyPlaying ? (
                <>
                  <Pause className="h-5 w-5" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-5 w-5" />
                  Play Now
                </>
              )}
            </button>
            <button
              onClick={handleAddToQueue}
              className="flex-1 rounded-full bg-white/10 py-3 font-medium text-white transition-colors hover:bg-white/20"
            >
              Add to Queue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
