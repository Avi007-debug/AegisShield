import { Shield, Menu, X, Cpu } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'

const navItems = [
  { label: 'Home',      path: '/' },
  { label: 'Detection', path: '/detection' },
  { label: 'Analytics', path: '/analytics' },
  { label: 'Threats',   path: '/threats' },
  { label: 'Audit',     path: '/audit' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      className={`sticky top-0 z-50 bg-background/90 backdrop-blur-xl transition-shadow duration-300 ${
        scrolled ? 'navbar-scrolled' : ''
      }`}
    >
      {/* Top gradient accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <NavLink to="/" className="glitch-text group flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/30 transition-all group-hover:ring-primary/60 group-hover:shadow-lg group-hover:shadow-primary/20">
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="glitch-target font-mono text-[13px] font-bold tracking-widest text-foreground">
              AEGIS<span className="text-primary">SHIELD</span>
            </span>
            <span className="font-mono text-[9px] tracking-widest text-muted-foreground/60">DEFENSE PLATFORM</span>
          </div>
        </NavLink>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-0.5 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `relative rounded-lg px-4 py-2 font-mono text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0.5 left-1/2 h-px w-4 -translate-x-1/2 rounded-full bg-primary" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-safe/20 bg-safe/5 px-3 py-1.5 sm:flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-safe opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-safe" />
            </span>
            <span className="font-mono text-[10px] font-semibold tracking-widest text-safe">LIVE</span>
          </div>

          <div className="hidden h-4 w-px bg-border sm:block" />

          <div className="hidden items-center gap-1.5 sm:flex">
            <Cpu className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-mono text-[10px] text-muted-foreground">v2.1</span>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Bottom border */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-b border-border bg-background/95 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-0.5">
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
