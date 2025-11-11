import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

const stylePrompts: Record<string, string> = {
  realistic: 'highly detailed photorealistic portrait, professional photography, 8k resolution',
  anime: 'anime style illustration, manga art, clean linework, vibrant colors',
  'oil-painting': 'classical oil painting style, rich textures, painterly brushstrokes, museum quality',
  watercolor: 'soft watercolor painting, delicate washes, artistic and dreamy',
  pencil: 'detailed pencil sketch, graphite drawing, fine shading and crosshatching',
  'digital-art': 'modern digital art, polished illustration, vibrant and crisp',
  'pop-art': 'pop art style, bold colors, comic book aesthetic, Andy Warhol inspired',
  fantasy: 'fantasy character art, magical and ethereal, dramatic lighting, epic composition',
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, style } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt diperlukan' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key tidak dikonfigurasi' },
        { status: 500 }
      )
    }

    const styleModifier = stylePrompts[style] || stylePrompts.realistic
    const fullPrompt = `${prompt}, ${styleModifier}, human portrait art, suitable for Instagram, professional quality, centered composition`

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: fullPrompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
    })

    const imageUrl = response.data?.[0]?.url

    if (!imageUrl) {
      throw new Error('Tidak dapat membuat gambar')
    }

    return NextResponse.json({ imageUrl })
  } catch (error: any) {
    console.error('Error generating image:', error)

    let errorMessage = 'Terjadi kesalahan saat membuat gambar'

    if (error?.error?.message) {
      errorMessage = error.error.message
    } else if (error?.message) {
      errorMessage = error.message
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
