import { useEffect, useId, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import schoolLogo from '../../assets/school-logo.jpg'
import { useAuth } from '../../context/AuthContext'

function initialsFromEmail(email) {
  const e = (email || '').trim()
  if (!e) return '??'
  const local = e.split('@')[0] || e
  const parts = local.split(/[._-]+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  const cleaned = local.replace(/[^a-zA-Z0-9]/g, '')
  if (cleaned.length >= 2) return cleaned.slice(0, 2).toUpperCase()
  return e.slice(0, 2).toUpperCase()
}

export function Header() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const menuId = useId()

  const displayEmail = user?.email?.trim() || ''
  const initials = initialsFromEmail(displayEmail)

  useEffect(() => {
    if (!menuOpen) return undefined

    function handlePointerDown(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

  function handleLogout() {
    logout()
    setMenuOpen(false)
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-emerald-200/40 bg-white/40 px-4 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] backdrop-blur-xl backdrop-saturate-150 md:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Link
          to="/"
          className="flex shrink-0 items-center rounded-lg outline-none ring-emerald-500/0 transition focus-visible:ring-2 focus-visible:ring-emerald-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          aria-label="School home"
        >
          <img
            src={schoolLogo}
            alt=""
            width={40}
            height={40}
            className="h-9 w-9 select-none drop-shadow-sm md:h-10 md:w-10"
            decoding="async"
          />
        </Link>
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold tracking-tight text-emerald-950 md:text-lg">
            Student Dashboard
          </h1>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 pl-2 sm:gap-3">
        {displayEmail ? (
          <span
            className="hidden max-w-[10rem] truncate text-sm font-medium text-emerald-900/90 sm:inline md:max-w-[14rem]"
            title={displayEmail}
          >
            {displayEmail}
          </span>
        ) : (
          <span className="hidden text-sm text-emerald-800/80 sm:inline">Signed in</span>
        )}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            id="profile-menu-button"
            aria-expanded={menuOpen}
            aria-haspopup="true"
            aria-controls={menuId}
            onClick={() => setMenuOpen((o) => !o)}
            title={displayEmail ? `Account: ${displayEmail}` : 'Account menu'}
            aria-label={displayEmail ? `Account menu for ${displayEmail}` : 'Account menu'}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-semibold text-emerald-900 shadow-sm backdrop-blur-sm transition hover:bg-emerald-100/80 focus-visible:outline focus-visible:ring-2 focus-visible:ring-emerald-400/50 ${
              menuOpen
                ? 'border-emerald-400 bg-emerald-100/90 ring-2 ring-emerald-200/60'
                : 'border-emerald-200/70 bg-emerald-50/80'
            }`}
          >
            {initials}
          </button>
          {menuOpen ? (
            <div
              id={menuId}
              role="menu"
              aria-labelledby="profile-menu-button"
              className="absolute right-0 z-50 mt-1.5 min-w-[12rem] max-w-[min(calc(100vw-2rem),20rem)] overflow-hidden rounded-xl border border-slate-200/90 bg-white py-1 shadow-lg shadow-slate-900/10 ring-1 ring-slate-900/5"
            >
              {displayEmail ? (
                <div
                  className="border-b border-slate-100 px-3 py-2.5 text-xs leading-snug text-slate-600"
                  role="presentation"
                >
                  <span className="block font-medium text-slate-500">Signed in as</span>
                  <span className="mt-0.5 block break-all text-slate-800">{displayEmail}</span>
                </div>
              ) : null}
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <svg
                  className="h-4 w-4 shrink-0 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M18 9l3 3m0 0-3 3m3-3H9"
                  />
                </svg>
                Log out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
