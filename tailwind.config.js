/**
 * Tailwind CSS 配置文件
 * 使用 ES Module 格式 - 统一现代标准
 * 
 * 参考: https://tailwindcss.com/docs/configuration
 */

import typography from '@tailwindcss/typography'

export default {
  // 扫描的源文件路径
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  // 主题扩展配置
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        brand: {
          DEFAULT: '#3366FF',      // 主色
          light: '#4D7AFF',        // 浅色
          dark: '#254EDB',         // 深色
          surface: '#F5F8FF',      // 表面色
          border: '#D6E0FF',       // 边框色
          navy: '#1E2E55',         // 海军蓝
          heading: '#2E3A59',      // 标题色
        },
      },

      // 字体配置
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },

      // 自定义阴影
      boxShadow: {
        soft: '0 35px 80px -45px rgba(37, 78, 219, 0.35), 0 25px 60px -40px rgba(15, 23, 42, 0.25)',
      },
    },
  },

  // 插件
  plugins: [
    typography,
  ],
}
