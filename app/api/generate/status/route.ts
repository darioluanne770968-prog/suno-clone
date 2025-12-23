import { NextRequest, NextResponse } from 'next/server'

const PIAPI_BASE = 'https://api.piapi.ai/api/suno/v1'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const taskId = searchParams.get('taskId')

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.PIAPI_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'PiAPI key not configured' },
        { status: 500 }
      )
    }

    // Check generation status from PiAPI
    const response = await fetch(`${PIAPI_BASE}/music/${taskId}`, {
      method: 'GET',
      headers: {
        'X-API-Key': apiKey,
      },
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('PiAPI status error:', errorData)
      return NextResponse.json(
        { error: 'Failed to get status', details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Map PiAPI response to our format
    // PiAPI status: pending, starting, processing, success, failed, retry
    const statusMap: Record<string, string> = {
      pending: 'pending',
      starting: 'processing',
      processing: 'processing',
      success: 'completed',
      failed: 'failed',
      retry: 'processing',
    }

    const taskData = data.data
    const clips = taskData?.clips || []

    // Convert clips to our track format
    const tracks = clips.map((clip: any) => ({
      id: clip.id || taskId,
      title: clip.title || 'Generated Track',
      audioUrl: clip.audio_url || '',
      streamUrl: clip.stream_audio_url || '',
      imageUrl: clip.image_url || clip.image_large_url || '',
      duration: clip.metadata?.duration || 180,
      status: statusMap[taskData.status] || 'processing',
    }))

    return NextResponse.json({
      code: data.code,
      msg: data.message,
      data: {
        taskId: taskData.task_id,
        status: statusMap[taskData.status] || 'processing',
        tracks: tracks.length > 0 ? tracks : undefined,
      },
    })
  } catch (error) {
    console.error('Status API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
