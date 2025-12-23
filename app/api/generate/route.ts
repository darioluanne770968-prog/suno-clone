import { NextRequest, NextResponse } from 'next/server'

const SUNO_API_BASE = 'https://api.sunoapi.org/api/v1'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, style, title, instrumental = false } = body

    const apiKey = process.env.SUNO_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Suno API key not configured' },
        { status: 500 }
      )
    }

    // Call Suno API to generate music
    const response = await fetch(`${SUNO_API_BASE}/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customMode: true,
        instrumental,
        model: 'V4_5ALL',
        prompt: instrumental ? undefined : prompt,
        style: style || 'Pop',
        title: title || prompt.slice(0, 50),
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Suno API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to generate music', details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Generate API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
