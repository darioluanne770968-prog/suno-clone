import { Track } from './store'

export interface SunoGenerateRequest {
  prompt: string
  style?: string
  title?: string
  instrumental?: boolean
}

export interface SunoTrackData {
  id: string
  title: string
  audioUrl: string
  streamUrl?: string
  imageUrl: string
  duration: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
}

export interface SunoGenerateResponse {
  code: number
  msg: string
  data: {
    taskId: string
    tracks?: SunoTrackData[]
  }
}

export interface SunoStatusResponse {
  code: number
  msg: string
  data: {
    taskId: string
    status: 'pending' | 'processing' | 'completed' | 'failed'
    tracks?: SunoTrackData[]
  }
}

// Generate music using our API route
export async function generateMusic(request: SunoGenerateRequest): Promise<SunoGenerateResponse> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to generate music')
  }

  return response.json()
}

// Check generation status
export async function checkGenerationStatus(taskId: string): Promise<SunoStatusResponse> {
  const response = await fetch(`/api/generate/status?taskId=${taskId}`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to check status')
  }

  return response.json()
}

// Poll for completion
export async function pollForCompletion(
  taskId: string,
  onProgress?: (status: string) => void,
  maxAttempts = 60,
  intervalMs = 5000
): Promise<SunoTrackData[]> {
  let attempts = 0

  while (attempts < maxAttempts) {
    const statusResponse = await checkGenerationStatus(taskId)

    if (statusResponse.data.status === 'completed' && statusResponse.data.tracks) {
      return statusResponse.data.tracks
    }

    if (statusResponse.data.status === 'failed') {
      throw new Error('Music generation failed')
    }

    onProgress?.(statusResponse.data.status)
    attempts++
    await new Promise(resolve => setTimeout(resolve, intervalMs))
  }

  throw new Error('Generation timed out')
}

// Convert Suno track data to our Track format
export function sunoTrackToTrack(sunoTrack: SunoTrackData, prompt: string, style: string): Track {
  return {
    id: sunoTrack.id,
    title: sunoTrack.title,
    artist: 'AI Generated',
    cover: sunoTrack.imageUrl || `https://picsum.photos/seed/${sunoTrack.id}/400/400`,
    audioUrl: sunoTrack.audioUrl || sunoTrack.streamUrl || '',
    duration: sunoTrack.duration || 180,
    genre: style || 'AI Music',
    prompt: prompt,
    createdAt: new Date(),
  }
}
