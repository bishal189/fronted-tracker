import { Header } from './Header'
import { Footer } from './Footer'

export function MainLayout({ children }) {
  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-emerald-50/40 via-slate-50 to-slate-50 text-slate-900">
      <Header />
      <div className="flex flex-1 flex-col">
        <main className="flex flex-1 flex-col px-4 py-6 sm:px-6">{children}</main>
        <Footer />
      </div>
    </div>
  )
}
