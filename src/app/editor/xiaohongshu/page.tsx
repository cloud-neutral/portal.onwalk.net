import { Toaster, XiaohongshuMarkdownEditor } from '@modules/markdown-editor'

export default function XiaohongshuPage() {
  return (
    <main className="h-full bg-background flex flex-col">
      <div className="flex-1 relative">
        <XiaohongshuMarkdownEditor />
      </div>

      <Toaster />
    </main>
  )
}
