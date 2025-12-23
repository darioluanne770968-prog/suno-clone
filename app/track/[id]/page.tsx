'use client'

import { useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Play, Pause, Heart, Share2, ListPlus, Clock, Calendar, Music2, Sparkles, Download } from 'lucide-react'
import { usePlayerStore, useAppStore } from '@/lib/store'
import { mockTracks } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { MusicCard } from '@/components/MusicCard'

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

export default function TrackPage() {
  const params = useParams()
  const router = useRouter()

  const { tracks } = useAppStore()
  const { currentTrack, isPlaying, setCurrentTrack, setIsPlaying, addToQueue } = usePlayerStore()
  const { likedTrackIds, toggleLike } = useAppStore()

  // Find the track using useMemo instead of useEffect+useState
  const track = useMemo(() => {
    const allTracks = [...tracks, ...mockTracks]
    return allTracks.find(t => t.id === params.id) || null
  }, [params.id, tracks])

  const isCurrentTrack = track && currentTrack?.id === track.id
  const isCurrentlyPlaying = isCurrentTrack && isPlaying
  const isLiked = track ? likedTrackIds.includes(track.id) : false

  // Get related tracks (same genre)
  const relatedTracks = useMemo(() => {
    if (!track) return []
    return [...tracks, ...mockTracks]
      .filter(t => t.genre === track.genre && t.id !== track.id)
      .slice(0, 4)
  }, [track, tracks])

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

  const handleDownload = async () => {
    if (!track) return
    try {
      const response = await fetch(track.audioUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${track.title}.mp3`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
      // Fallback: open in new tab
      window.open(track.audioUrl, '_blank')
    }
  }

  if (!track) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-black via-zinc-900 to-black">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-white">Track not found</h1>
          <Link
            href="/discover"
            className="text-orange-500 hover:text-orange-400"
          >
            Back to Discover
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black pb-24">
      {/* Header */}
      <div className="relative">
        {/* Background image */}
        <div className="absolute inset-0 h-96">
          <Image
            src={track.cover}
            alt={track.title}
            fill
            className="object-cover opacity-30 blur-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-900/80 to-zinc-900" />
        </div>

        {/* Content */}
        <div className="relative px-6 pt-8">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="mb-8 flex items-center gap-2 text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>

          {/* Track info */}
          <div className="flex flex-col gap-8 md:flex-row">
            {/* Cover */}
            <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src={track.cover}
                alt={track.title}
                fill
                className="object-cover"
              />
              {/* Play overlay */}
              <div
                className={cn(
                  'absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 transition-opacity',
                  isCurrentlyPlaying ? 'opacity-100' : 'opacity-0 hover:opacity-100'
                )}
                onClick={handlePlay}
              >
                <button
                  className={cn(
                    'flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition-transform hover:scale-110',
                    isCurrentlyPlaying && 'animate-pulse'
                  )}
                >
                  {isCurrentlyPlaying ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="h-8 w-8 ml-1" />
                  )}
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col justify-end">
              <span className="mb-2 flex items-center gap-2 text-sm text-white/60">
                <Sparkles className="h-4 w-4 text-orange-500" />
                AI Generated Track
              </span>
              <h1 className="mb-2 text-4xl font-bold text-white md:text-5xl">{track.title}</h1>
              <p className="mb-4 text-xl text-white/60">{track.artist}</p>

              {/* Metadata badges */}
              <div className="mb-6 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
                  <Music2 className="h-4 w-4 text-orange-500" />
                  <span className="text-white">{track.genre}</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
                  <Clock className="h-4 w-4 text-pink-500" />
                  <span className="text-white">{formatDuration(track.duration)}</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
                  <Calendar className="h-4 w-4 text-purple-500" />
                  <span className="text-white">{formatDate(track.createdAt)}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handlePlay}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-8 py-3 font-medium text-white transition-transform hover:scale-105"
                >
                  {isCurrentlyPlaying ? (
                    <>
                      <Pause className="h-5 w-5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5" />
                      Play
                    </>
                  )}
                </button>
                <button
                  onClick={() => toggleLike(track.id)}
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full transition-colors',
                    isLiked
                      ? 'bg-pink-500/20 text-pink-500'
                      : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                  )}
                >
                  <Heart className={cn('h-5 w-5', isLiked && 'fill-current')} />
                </button>
                <button
                  onClick={handleAddToQueue}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
                  title="Add to queue"
                >
                  <ListPlus className="h-5 w-5" />
                </button>
                <button
                  onClick={handleShare}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
                  title="Share"
                >
                  <Share2 className="h-5 w-5" />
                </button>
                <button
                  onClick={handleDownload}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
                  title="Download"
                >
                  <Download className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prompt section */}
      {track.prompt && (
        <div className="mt-12 px-6">
          <h2 className="mb-4 text-xl font-semibold text-white">Generation Prompt</h2>
          <div className="rounded-2xl bg-white/5 p-6">
            <p className="text-lg text-white/80">&ldquo;{track.prompt}&rdquo;</p>
          </div>
        </div>
      )}

      {/* Related tracks */}
      {relatedTracks.length > 0 && (
        <div className="mt-12 px-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            More in {track.genre}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {relatedTracks.map((relatedTrack) => (
              <MusicCard key={relatedTrack.id} track={relatedTrack} size="md" />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
