import { NextResponse } from 'next/server'
import { getImageItems } from '@/app/images/image-data'
import { getPublicVideos } from '@/lib/video'
import {
    SYSTEM_PROMPT_TEMPLATE,
} from '@/lib/theme-constants'
import { getRandomThemeLogic, getRandomMediaSubset } from '@/lib/inspiration-logic'

export const runtime = 'nodejs'

export async function GET() {
    // Config: Forces local mode by ignoring API Key for now
    const ENABLE_AI = false
    const apiKey = ENABLE_AI ? process.env.OPENAI_API_KEY : null

    // 1. Fetch and randomize media (Server-side)
    const [allImages, allVideos] = await Promise.all([
        getImageItems(),
        getPublicVideos(),
    ])

    const randomImages = getRandomMediaSubset(allImages, 5)
    // Filter videos that have posters for better theatre experience if possible, or just shuffle all
    const randomVideos = getRandomMediaSubset(allVideos, 6)

    // 2. Select Theme (Advanced Logic)
    // For this API (triggered by button), we want serendipity (randomness)
    const selectedTheme = getRandomThemeLogic()

    let content: any = {
        title_cn: selectedTheme.cn,
        sub_cn: selectedTheme.desc_cn ? `${selectedTheme.desc_cn}。` : '... ...',
        title_en: selectedTheme.en,
        sub_en: '', // Static fallback doesn't have poetic translation ready, AI will fill this
    }

    // 3. AI Generation
    if (apiKey) {
        try {
            const prompt = SYSTEM_PROMPT_TEMPLATE
                .replace('{{THEME}}', selectedTheme.cn)
                .replace('{{THEME_EN}}', selectedTheme.en)
                .replace('{{THEME_DESC}}', selectedTheme.desc_cn || '')

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    messages: [{ role: 'system', content: prompt }],
                    response_format: { type: "json_object" },
                    temperature: 0.8,
                }),
            })

            if (response.ok) {
                const data = await response.json()
                content = JSON.parse(data.choices[0].message.content)
            } else {
                console.error('OpenAI API Error:', await response.text())
            }
        } catch (error) {
            console.error('Inspiration API Error:', error)
        }
    } else {
        // Enhance fallback content if no API key
        // We can just return the static definition, but maybe format sub_cn a bit if it came from desc
        if (!content.sub_en) {
            content.sub_en = `About ${selectedTheme.en.toLowerCase()} and the flow of time.`
        }
    }

    // Attach media to the response
    return NextResponse.json({
        ...content,
        images: randomImages,
        videos: randomVideos
    })
}
