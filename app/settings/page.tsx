'use client'

import { useSettingsStore } from '@/lib/store'
import { Volume2, Bell, Palette, Music, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const {
    audioQuality,
    autoPlay,
    notifications,
    theme,
    setAudioQuality,
    setAutoPlay,
    setNotifications,
    setTheme,
  } = useSettingsStore()

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="mt-2 text-white/60">Customize your experience</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Audio Settings */}
        <section className="rounded-2xl bg-white/5 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-500">
              <Volume2 className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Audio</h2>
          </div>

          <div className="space-y-4">
            {/* Audio Quality */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Audio Quality</p>
                <p className="text-sm text-white/60">Higher quality uses more data</p>
              </div>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map((quality) => (
                  <button
                    key={quality}
                    onClick={() => setAudioQuality(quality)}
                    className={cn(
                      'rounded-lg px-4 py-2 text-sm font-medium transition-all',
                      audioQuality === quality
                        ? 'bg-white text-black'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    )}
                  >
                    {quality.charAt(0).toUpperCase() + quality.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Auto Play */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Auto Play</p>
                <p className="text-sm text-white/60">Automatically play next track</p>
              </div>
              <button
                onClick={() => setAutoPlay(!autoPlay)}
                className={cn(
                  'relative h-7 w-12 rounded-full transition-colors',
                  autoPlay ? 'bg-gradient-to-r from-orange-500 to-pink-500' : 'bg-white/20'
                )}
              >
                <span
                  className={cn(
                    'absolute top-1 h-5 w-5 rounded-full bg-white transition-all',
                    autoPlay ? 'left-6' : 'left-1'
                  )}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="rounded-2xl bg-white/5 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-500">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Push Notifications</p>
              <p className="text-sm text-white/60">Get notified when your song is ready</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={cn(
                'relative h-7 w-12 rounded-full transition-colors',
                notifications ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-white/20'
              )}
            >
              <span
                className={cn(
                  'absolute top-1 h-5 w-5 rounded-full bg-white transition-all',
                  notifications ? 'left-6' : 'left-1'
                )}
              />
            </button>
          </div>
        </section>

        {/* Appearance */}
        <section className="rounded-2xl bg-white/5 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-teal-500">
              <Palette className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Appearance</h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Theme</p>
              <p className="text-sm text-white/60">Choose your preferred theme</p>
            </div>
            <div className="flex gap-2">
              {(['dark', 'light', 'system'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={cn(
                    'rounded-lg px-4 py-2 text-sm font-medium transition-all',
                    theme === t
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  )}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section className="rounded-2xl bg-white/5 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-500">
              <Music className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">About</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <p className="text-white/60">Version</p>
              <p className="text-white">1.0.0</p>
            </div>
            <div className="flex items-center justify-between py-2">
              <p className="text-white/60">Built with</p>
              <p className="text-white">Next.js + Tailwind CSS</p>
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-2 text-white/60 hover:text-white transition-colors"
            >
              <span>View on GitHub</span>
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
