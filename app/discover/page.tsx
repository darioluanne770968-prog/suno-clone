'use client'

import { useState, useMemo } from 'react'
import { MusicCard } from '@/components/MusicCard'
import { mockTracks } from '@/lib/mock-data'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Search, TrendingUp, Sparkles, Music } from 'lucide-react'

export default function DiscoverPage() {
  const { tracks } = useAppStore()
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Combine user tracks with mock tracks
  const allTracks = useMemo(() => {
    return [...tracks, ...mockTracks]
  }, [tracks])

  // Extract unique genres from all tracks
  const genres = useMemo(() => {
    const uniqueGenres = new Set(allTracks.map(track => track.genre))
    return ['All', ...Array.from(uniqueGenres).sort()]
  }, [allTracks])

  // Filter tracks by genre and search query
  const filteredTracks = useMemo(() => {
    return allTracks.filter(track => {
      const matchesGenre = selectedGenre === 'All' || track.genre === selectedGenre
      const matchesSearch = searchQuery === '' ||
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (track.prompt && track.prompt.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesGenre && matchesSearch
    })
  }, [allTracks, selectedGenre, searchQuery])

  // Get trending (use hash-based deterministic selection for stable renders)
  const trendingTracks = useMemo(() => {
    // Sort by a hash of track id for deterministic but varied ordering
    return [...filteredTracks]
      .sort((a, b) => {
        const hashA = a.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
        const hashB = b.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
        return hashB - hashA
      })
      .slice(0, 6)
  }, [filteredTracks])

  // Get new releases (sorted by date)
  const newReleases = useMemo(() => {
    return [...filteredTracks]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6)
  }, [filteredTracks])

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Discover</h1>
        <p className="mt-2 text-white/60">Explore music created by our community</p>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search tracks, artists, or prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl bg-white/10 py-3 pl-10 pr-4 text-white placeholder:text-white/40 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          />
        </div>
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
                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                : 'bg-white/10 text-white hover:bg-white/20'
            )}
          >
            {genre}
          </button>
        ))}
      </div>

      {filteredTracks.length > 0 ? (
        <>
          {/* Trending section */}
          {trendingTracks.length > 0 && (
            <section className="mb-12">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <h2 className="text-xl font-semibold text-white">Trending Now</h2>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {trendingTracks.map((track) => (
                  <MusicCard key={track.id + '-trending'} track={track} size="md" />
                ))}
              </div>
            </section>
          )}

          {/* New releases */}
          {newReleases.length > 0 && (
            <section className="mb-12">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-pink-500" />
                <h2 className="text-xl font-semibold text-white">New Releases</h2>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {newReleases.map((track) => (
                  <MusicCard key={track.id + '-new'} track={track} size="md" />
                ))}
              </div>
            </section>
          )}

          {/* All tracks in selected genre */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Music className="h-5 w-5 text-purple-500" />
              <h2 className="text-xl font-semibold text-white">
                {selectedGenre === 'All' ? 'All Tracks' : `${selectedGenre} Tracks`}
              </h2>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60">
                {filteredTracks.length}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {filteredTracks.map((track) => (
                <MusicCard key={track.id + '-all'} track={track} size="md" />
              ))}
            </div>
          </section>
        </>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
            <Music className="h-10 w-10 text-white/40" />
          </div>
          <h3 className="mb-2 text-xl font-medium text-white">No tracks found</h3>
          <p className="text-white/60">
            {searchQuery
              ? `No results for "${searchQuery}" in ${selectedGenre === 'All' ? 'any genre' : selectedGenre}`
              : `No tracks found in ${selectedGenre}`}
          </p>
          {(searchQuery || selectedGenre !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedGenre('All')
              }}
              className="mt-4 rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}
