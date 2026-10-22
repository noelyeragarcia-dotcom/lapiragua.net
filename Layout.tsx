import Header from './Header'
import Footer from './Footer'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="container-shell py-6 sm:py-10">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
