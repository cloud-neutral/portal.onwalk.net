import { NextResponse } from 'next/server'
import { getImageItems } from '@/app/images/image-data'
import { getPublicVideos } from '@/lib/video'

export const runtime = 'nodejs'

// Weekly Themes
const THEMES = {
    0: '沉淀 (Reflection)', // Sunday
    1: '起点 (Origin)',      // Monday
    2: '观察 (Observation)', // Tuesday
    3: '途中 (On the Road)', // Wednesday
    4: '光影 (Light & Shadow)', // Thursday
    5: '喧嚣 (City/Humanity)', // Friday
    6: '归隐 (Nature/Wild)',   // Saturday
}

type ThemeKey = keyof typeof THEMES

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled
}

export async function GET() {
    const today = new Date().getDay() as ThemeKey
    const theme = THEMES[today]
    const apiKey = process.env.OPENAI_API_KEY

    // Fetch and randomize media (Server-side)
    const [allImages, allVideos] = await Promise.all([
        getImageItems(),
        getPublicVideos(),
    ])

    const randomImages = shuffleArray(allImages).slice(0, 5)
    // Filter videos that have posters for better theatre experience if possible, or just shuffle all
    const randomVideos = shuffleArray(allVideos).slice(0, 6)

    let content: any = getMockContent(today)

    if (apiKey) {
        try {
            const prompt = `Role: You are a minimalist photographer and poet. Task: Create a set of webpage headlines based on the theme: ${theme}. Format: JSON. Requirements: Main Title (CN) 2-4 chars, high-level; Subtitle (CN) 15-25 chars, narrative, two clauses; Main Title (EN) corresponding; Subtitle (EN) poetic translation. Style: Objective, deep, minimalist. JSON Keys: title_cn, sub_cn, title_en, sub_en.`

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
    }

    // Attach media to the response
    return NextResponse.json({
        ...content,
        images: randomImages,
        videos: randomVideos
    })
}

function getMockContent(day: number) {
    // Fallback content driven by logic, ensuring "Dynamic" feel even without AI
    const mocks = [
        { // Sun
            title_cn: "沉 · 淀",
            sub_cn: "让时间的尘埃落下，在静默中听见万物的回响。",
            title_en: "Inner Silence",
            sub_en: "Let the dust of time settle, hearing the echoes of all things in silence."
        },
        { // Mon
            title_cn: "启 · 程",
            sub_cn: "每一次出发都是回归，脚下的路始于内心的渴望。",
            title_en: "The Origin",
            sub_en: "Every departure is a return; the path begins with inner longing."
        },
        { // Tue
            title_cn: "凝 · 视",
            sub_cn: "在这纷繁的世界里，用专注的目光剥离出真实的纹理。",
            title_en: "Deep Gaze",
            sub_en: "In this complex world, focusing eyes strip away layers to reveal truth."
        },
        { // Wed
            title_cn: "在 · 途",
            sub_cn: "风景不只在远方，更在车窗外不断后退的瞬间。",
            title_en: "On The Way",
            sub_en: "Scenery is not just yonder, but in the moments receding continuously outside the window."
        },
        { // Thu
            title_cn: "光 · 影",
            sub_cn: "光是时间的刻刀，影是空间留下的温柔笔触。",
            title_en: "Light & Shadow",
            sub_en: "Light is time's chisel, shadow the gentle brushstroke left by space."
        },
        { // Fri
            title_cn: "众 · 生",
            sub_cn: "在喧嚣的洪流中，捕捉那一张张鲜活而具体的面孔。",
            title_en: "Humanity",
            sub_en: "Amidst the noisy torrent, capturing those vivid and specific faces."
        },
        { // Sat
            title_cn: "归 · 隐",
            sub_cn: "把自己还给山野，让呼吸与风的律动重新同频。",
            title_en: "Wild Return",
            sub_en: "Return oneself to the wild, syncing breath with the rhythm of the wind."
        }
    ]
    return mocks[day]
}
