import { Shield, Activity, Radio, Menu, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useState } from 'react'

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Detection', path: '/detection' },
  { label: 'Analytics', path: '/analytics' },
  { label: 'Threats', path: '/threats' },
  { label: 'Audit', path: '/audit' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <NavLink to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/30">
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <span className="font-mono text-sm font-bold tracking-wider text-foreground">
            AEGIS<span className="text-primary">SHIELD</span>
          </span>
        </NavLink>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 font-mono text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-full bg-safe/10 px-3 py-1.5 ring-1 ring-safe/20 sm:flex">
            <Radio className="h-3 w-3 animate-pulse text-safe" />
            <span className="font-mono text-[10px] font-semibold text-safe">LIVE</span>
          </div>
          <Activity className="hidden h-4 w-4 text-muted-foreground sm:block" />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-secondary md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2.5 font-mono text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
