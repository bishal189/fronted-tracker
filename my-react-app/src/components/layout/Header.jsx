import schoolLogo from '../../assets/school-logo.svg'

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-emerald-200/40 bg-white/40 px-4 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] backdrop-blur-xl backdrop-saturate-150 md:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <a
          href="/"
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
        </a>
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold tracking-tight text-emerald-950 md:text-lg">
            Student Dashboard
          </h1>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 pl-2">
        <span className="hidden text-sm text-emerald-800/80 sm:inline">Admin</span>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-200/70 bg-emerald-50/80 text-xs font-semibold text-emerald-900 shadow-sm backdrop-blur-sm"
          title="Profile"
          role="img"
          aria-label="User profile placeholder"
        >
          AD
        </div>
      </div>
    </header>
  )
}
