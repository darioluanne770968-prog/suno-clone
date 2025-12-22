'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, Library, Plus, Settings, Music2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/create', icon: Plus, label: 'Create' },
  { href: '/discover', icon: Compass, label: 'Discover' },
  { href: '/library', icon: Library, label: 'Library' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-full w-16 flex-col items-center bg-black/40 backdrop-blur-xl py-6 lg:w-64 lg:items-start lg:px-4">
      {/* Logo */}
      <Link href="/" className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-500">
          <Music2 className="h-6 w-6 text-white" />
        </div>
        <span className="hidden text-xl font-bold text-white lg:block">SunoClone</span>
      </Link>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-2 w-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all',
                'hover:bg-white/10 lg:justify-start justify-center',
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-white/60 hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="hidden lg:block">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Settings at bottom */}
      <Link
        href="/settings"
        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-white/60 transition-all hover:bg-white/10 hover:text-white lg:w-full lg:justify-start justify-center"
      >
        <Settings className="h-5 w-5" />
        <span className="hidden lg:block">Settings</span>
      </Link>
    </aside>
  )
}
