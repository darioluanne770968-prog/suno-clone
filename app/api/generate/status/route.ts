import { NextRequest, NextResponse } from 'next/server'

const SUNO_API_BASE = 'https://api.sunoapi.org/api/v1'

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

    const apiKey = process.env.SUNO_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Suno API key not configured' },
        { status: 500 }
      )
    }

    // Check generation status
    const response = await fetch(
      `${SUNO_API_BASE}/generate/record-info?taskId=${taskId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Suno status API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to get status', details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Status API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
