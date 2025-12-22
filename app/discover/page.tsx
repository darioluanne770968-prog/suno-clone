'use client'

import { useState } from 'react'
import { MusicCard } from '@/components/MusicCard'
import { mockTracks } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const genres = ['All', 'Pop', 'Electronic', 'Jazz', 'Hip Hop', 'Lo-Fi', 'Cinematic', 'Rock', 'Acoustic']

export default function DiscoverPage() {
  const [selectedGenre, setSelectedGenre] = useState('All')

  const filteredTracks = selectedGenre === 'All'
    ? mockTracks
    : mockTracks.filter(track => track.genre === selectedGenre)

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Discover</h1>
        <p className="mt-2 text-white/60">Explore music created by our community</p>
      </div>

      {/* Genre filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-all',
              selectedGenre === genre
                ? 'bg-white text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            )}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Trending section */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-white">Trending Now</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filteredTracks.slice(0, 6).map((track) => (
            <MusicCard key={track.id} track={track} size="md" />
          ))}
        </div>
      </section>

      {/* New releases */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-white">New Releases</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filteredTracks.slice(2, 8).map((track) => (
            <MusicCard key={track.id + '-new'} track={track} size="md" />
          ))}
        </div>
      </section>

      {/* By genre */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-white">Popular in {selectedGenre === 'All' ? 'All Genres' : selectedGenre}</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filteredTracks.map((track) => (
            <MusicCard key={track.id + '-genre'} track={track} size="md" />
          ))}
        </div>
      </section>

      {/* Empty state */}
      {filteredTracks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 text-6xl">No results</div>
          <p className="text-white/60">No tracks found in {selectedGenre}</p>
        </div>
      )}
    </div>
  )
}
