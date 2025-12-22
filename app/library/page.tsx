'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MusicCard } from '@/components/MusicCard'
import { useAppStore } from '@/lib/store'
import { mockTracks } from '@/lib/mock-data'
import { Plus, Clock, Heart, ListMusic } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'all', label: 'All', icon: ListMusic },
  { id: 'recent', label: 'Recent', icon: Clock },
  { id: 'liked', label: 'Liked', icon: Heart },
]

export default function LibraryPage() {
  const { tracks } = useAppStore()
  const [activeTab, setActiveTab] = useState('all')

  // Combine user-created tracks with some mock data for demo
  const allTracks = tracks.length > 0 ? tracks : mockTracks.slice(0, 4)

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Your Library</h1>
          <p className="mt-2 text-white/60">All your created and saved music</p>
        </div>
        <Link
          href="/create"
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-105"
        >
          <Plus className="h-4 w-4" />
          Create New
        </Link>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-2 border-b border-white/10 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
              activeTab === tab.id
                ? 'bg-white/10 text-white'
                : 'text-white/60 hover:text-white'
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-white/5 p-4">
          <p className="text-2xl font-bold text-white">{allTracks.length}</p>
          <p className="text-sm text-white/60">Total Tracks</p>
        </div>
        <div className="rounded-xl bg-white/5 p-4">
          <p className="text-2xl font-bold text-white">{tracks.length}</p>
          <p className="text-sm text-white/60">Created by You</p>
        </div>
        <div className="rounded-xl bg-white/5 p-4">
          <p className="text-2xl font-bold text-white">0</p>
          <p className="text-sm text-white/60">Liked Songs</p>
        </div>
      </div>

      {/* Track grid */}
      {allTracks.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {allTracks.map((track) => (
            <MusicCard key={track.id} track={track} size="md" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
            <ListMusic className="h-10 w-10 text-white/40" />
          </div>
          <h3 className="mb-2 text-xl font-medium text-white">No music yet</h3>
          <p className="mb-6 text-white/60">Create your first track to get started</p>
          <Link
            href="/create"
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            Create Your First Song
          </Link>
        </div>
      )}
    </div>
  )
}
