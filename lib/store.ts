import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Track {
  id: string
  title: string
  artist: string
  cover: string
  audioUrl: string
  duration: number
  genre: string
  prompt?: string
  createdAt: Date
}

interface PlayerState {
  currentTrack: Track | null
  isPlaying: boolean
  volume: number
  progress: number
  duration: number
  queue: Track[]
  shuffle: boolean
  repeat: 'off' | 'all' | 'one'

  setCurrentTrack: (track: Track | null) => void
  setIsPlaying: (playing: boolean) => void
  setVolume: (volume: number) => void
  setProgress: (progress: number) => void
  setDuration: (duration: number) => void
  addToQueue: (track: Track) => void
  removeFromQueue: (trackId: string) => void
  clearQueue: () => void
  playNext: () => void
  playPrevious: () => void
  toggleShuffle: () => void
  toggleRepeat: () => void
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 0.8,
  progress: 0,
  duration: 0,
  queue: [],
  shuffle: false,
  repeat: 'off',

  setCurrentTrack: (track) => set({ currentTrack: track, progress: 0 }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setVolume: (volume) => set({ volume }),
  setProgress: (progress) => set({ progress }),
  setDuration: (duration) => set({ duration }),

  addToQueue: (track) => set((state) => ({ queue: [...state.queue, track] })),
  removeFromQueue: (trackId) => set((state) => ({
    queue: state.queue.filter(t => t.id !== trackId)
  })),
  clearQueue: () => set({ queue: [] }),

  toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
  toggleRepeat: () => set((state) => {
    const modes: ('off' | 'all' | 'one')[] = ['off', 'all', 'one']
    const currentIndex = modes.indexOf(state.repeat)
    return { repeat: modes[(currentIndex + 1) % modes.length] }
  }),

  playNext: () => {
    const { queue, currentTrack, shuffle, repeat } = get()
    if (queue.length === 0) return

    const currentIndex = queue.findIndex(t => t.id === currentTrack?.id)

    let nextTrack: Track
    if (shuffle) {
      const availableIndices = queue
        .map((_, i) => i)
        .filter(i => i !== currentIndex)
      const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)]
      nextTrack = queue[randomIndex] || queue[0]
    } else if (repeat === 'one') {
      nextTrack = currentTrack || queue[0]
    } else {
      const nextIndex = currentIndex + 1
      if (nextIndex >= queue.length) {
        if (repeat === 'all') {
          nextTrack = queue[0]
        } else {
          set({ isPlaying: false })
          return
        }
      } else {
        nextTrack = queue[nextIndex]
      }
    }

    set({ currentTrack: nextTrack, progress: 0 })
  },

  playPrevious: () => {
    const { queue, currentTrack, progress } = get()
    if (queue.length === 0) return

    // If more than 3 seconds into the song, restart it
    if (progress > 3) {
      set({ progress: 0 })
      return
    }

    const currentIndex = queue.findIndex(t => t.id === currentTrack?.id)
    const prevTrack = queue[currentIndex - 1] || queue[queue.length - 1]
    set({ currentTrack: prevTrack, progress: 0 })
  },
}))

// App store with persistence for liked songs
interface AppState {
  tracks: Track[]
  likedTrackIds: string[]
  isGenerating: boolean
  generationProgress: number

  setTracks: (tracks: Track[]) => void
  addTrack: (track: Track) => void
  setIsGenerating: (generating: boolean) => void
  setGenerationProgress: (progress: number) => void
  toggleLike: (trackId: string) => void
  isLiked: (trackId: string) => boolean
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      tracks: [],
      likedTrackIds: [],
      isGenerating: false,
      generationProgress: 0,

      setTracks: (tracks) => set({ tracks }),
      addTrack: (track) => set((state) => ({ tracks: [track, ...state.tracks] })),
      setIsGenerating: (generating) => set({ isGenerating: generating }),
      setGenerationProgress: (progress) => set({ generationProgress: progress }),
      toggleLike: (trackId) => set((state) => ({
        likedTrackIds: state.likedTrackIds.includes(trackId)
          ? state.likedTrackIds.filter(id => id !== trackId)
          : [...state.likedTrackIds, trackId]
      })),
      isLiked: (trackId) => get().likedTrackIds.includes(trackId),
    }),
    {
      name: 'suno-clone-storage',
      partialize: (state) => ({
        tracks: state.tracks,
        likedTrackIds: state.likedTrackIds
      }),
    }
  )
)

// Settings store with persistence
interface SettingsState {
  audioQuality: 'low' | 'medium' | 'high'
  autoPlay: boolean
  notifications: boolean
  theme: 'dark' | 'light' | 'system'

  setAudioQuality: (quality: 'low' | 'medium' | 'high') => void
  setAutoPlay: (autoPlay: boolean) => void
  setNotifications: (notifications: boolean) => void
  setTheme: (theme: 'dark' | 'light' | 'system') => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      audioQuality: 'high',
      autoPlay: true,
      notifications: true,
      theme: 'dark',

      setAudioQuality: (quality) => set({ audioQuality: quality }),
      setAutoPlay: (autoPlay) => set({ autoPlay }),
      setNotifications: (notifications) => set({ notifications }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'suno-clone-settings',
    }
  )
)
