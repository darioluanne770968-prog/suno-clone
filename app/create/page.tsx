'use client'

import { GradientBackground } from '@/components/GradientBackground'
import { MusicInput } from '@/components/MusicInput'
import { useAppStore } from '@/lib/store'

export default function CreatePage() {
  const { isGenerating, generationProgress } = useAppStore()

  return (
    <>
      <GradientBackground />

      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-20">
        <div className="flex flex-col items-center gap-8 text-center max-w-3xl">
          <h1 className="font-serif text-4xl font-light text-white sm:text-5xl md:text-6xl">
            Create Your Song
          </h1>

          <p className="text-lg text-white/70">
            Describe the music you want to create. Be specific about genre, mood, instruments, and theme.
          </p>

          <MusicInput />

          {/* Tips */}
          <div className="mt-8 w-full rounded-2xl bg-black/30 p-6 backdrop-blur-xl border border-white/10">
            <h3 className="mb-4 text-lg font-medium text-white">Tips for better results</h3>
            <ul className="space-y-2 text-left text-sm text-white/60">
              <li>Specify a genre: &ldquo;a jazz song&rdquo;, &ldquo;an EDM track&rdquo;, &ldquo;a country ballad&rdquo;</li>
              <li>Describe the mood: &ldquo;upbeat and energetic&rdquo;, &ldquo;melancholic and slow&rdquo;</li>
              <li>Include instruments: &ldquo;with piano and strings&rdquo;, &ldquo;featuring electric guitar&rdquo;</li>
              <li>Add a theme: &ldquo;about summer love&rdquo;, &ldquo;celebrating freedom&rdquo;</li>
            </ul>
          </div>

          {/* Generation status */}
          {isGenerating && (
            <div className="w-full rounded-2xl bg-black/30 p-6 backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-orange-500" />
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-white">Creating your song...</h3>
                  <p className="text-sm text-white/60">
                    {generationProgress < 30 && 'Analyzing your prompt...'}
                    {generationProgress >= 30 && generationProgress < 60 && 'Generating melody...'}
                    {generationProgress >= 60 && generationProgress < 90 && 'Adding vocals and mixing...'}
                    {generationProgress >= 90 && 'Finalizing...'}
                  </p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all duration-300"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
