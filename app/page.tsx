'use client'

import { GradientBackground } from '@/components/GradientBackground'
import { MusicInput } from '@/components/MusicInput'
import { TypewriterTitle } from '@/components/TypewriterTitle'
import { MusicCard } from '@/components/MusicCard'
import { mockTracks } from '@/lib/mock-data'
import { useAppStore } from '@/lib/store'

export default function Home() {
  const { tracks } = useAppStore()
  const displayTracks = tracks.length > 0 ? tracks : mockTracks.slice(0, 4)

  return (
    <>
      <GradientBackground />

      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-20">
        {/* Hero Section */}
        <div className="flex flex-col items-center gap-8 text-center">
          <TypewriterTitle />

          <p className="max-w-xl text-lg text-white/70">
            Start with a simple prompt or dive into our pro editing tools, your next track is just a step away.
          </p>

          <MusicInput />
        </div>

        {/* Recent tracks */}
        {displayTracks.length > 0 && (
          <div className="mt-20 w-full max-w-5xl">
            <h2 className="mb-6 text-xl font-semibold text-white/80">Recent Creations</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {displayTracks.slice(0, 4).map((track) => (
                <MusicCard key={track.id} track={track} size="md" />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
