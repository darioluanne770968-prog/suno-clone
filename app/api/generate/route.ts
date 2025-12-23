import { NextRequest, NextResponse } from 'next/server'

// PiAPI endpoint
const PIAPI_BASE = 'https://api.piapi.ai/api/suno/v1'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, style, title, instrumental = false } = body

    const apiKey = process.env.PIAPI_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'PiAPI key not configured. Get one at https://app.piapi.ai' },
        { status: 500 }
      )
    }

    // Call PiAPI to generate music
    const response = await fetch(`${PIAPI_BASE}/music`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify({
        custom_mode: true,
        mv: 'chirp-v4',  // Use Suno v4 model
        input: {
          prompt: instrumental ? '' : prompt,
          title: title || prompt.slice(0, 50),
          tags: style || 'pop',
          continue_at: 0,
          continue_clip_id: '',
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('PiAPI error:', errorData)
      return NextResponse.json(
        { error: 'Failed to generate music', details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()

    // PiAPI returns: { code: 200, data: { task_id: "..." }, message: "..." }
    return NextResponse.json({
      code: data.code,
      msg: data.message,
      data: {
        taskId: data.data?.task_id,
      },
    })
  } catch (error) {
    console.error('Generate API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
