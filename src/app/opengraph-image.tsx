import { ImageResponse } from 'next/og'
import { staticHeroContent } from '@/i18n/onwalk'

export const runtime = 'nodejs'

export const alt = `Onwalk — ${staticHeroContent.titleEn}`
export const size = {
    width: 1200,
    height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'white',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '20px',
                    }}
                >
                    {/* Logo or Title */}
                    <div
                        style={{
                            fontSize: 80,
                            fontWeight: 900,
                            color: 'black',
                            letterSpacing: '-0.05em',
                        }}
                    >
                        Onwalk
                    </div>

                    {/* Subtitle */}
                    <div
                        style={{
                            fontSize: 32,
                            fontWeight: 400,
                            color: '#666',
                            maxWidth: '800px',
                            textAlign: 'center',
                        }}
                    >
                        {staticHeroContent.titleEn}
                    </div>

                    {/* Tagline */}
                    <div
                        style={{
                            marginTop: 40,
                            fontSize: 24,
                            color: '#999',
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'center',
                        }}
                    >
                        <span>Photography</span>
                        <span>•</span>
                        <span>Videography</span>
                        <span>•</span>
                        <span>Walking</span>
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
