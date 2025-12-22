import { create } from 'zustand'

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
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 0.8,
  progress: 0,
  duration: 0,
  queue: [],

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

  playNext: () => {
    const { queue, currentTrack } = get()
    if (queue.length === 0) return

    const currentIndex = queue.findIndex(t => t.id === currentTrack?.id)
    const nextTrack = queue[currentIndex + 1] || queue[0]
    set({ currentTrack: nextTrack, progress: 0 })
  },

  playPrevious: () => {
    const { queue, currentTrack } = get()
    if (queue.length === 0) return

    const currentIndex = queue.findIndex(t => t.id === currentTrack?.id)
    const prevTrack = queue[currentIndex - 1] || queue[queue.length - 1]
    set({ currentTrack: prevTrack, progress: 0 })
  },
}))

// Mock data store
interface AppState {
  tracks: Track[]
  isGenerating: boolean
  generationProgress: number

  setTracks: (tracks: Track[]) => void
  addTrack: (track: Track) => void
  setIsGenerating: (generating: boolean) => void
  setGenerationProgress: (progress: number) => void
}

export const useAppStore = create<AppState>((set) => ({
  tracks: [],
  isGenerating: false,
  generationProgress: 0,

  setTracks: (tracks) => set({ tracks }),
  addTrack: (track) => set((state) => ({ tracks: [track, ...state.tracks] })),
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  setGenerationProgress: (progress) => set({ generationProgress: progress }),
}))
