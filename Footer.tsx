import { Link } from 'react-router-dom'

const footerLinks = [
  { to: '/privacidad', label: 'Privacidad' },
  { to: '/terminos', label: 'Términos' },
  { to: '/cookies', label: 'Cookies' },
  { to: '/marco-legal', label: 'Marco legal' },
  { to: '/contacto', label: 'Contacto' },
]

function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-slate-900 text-slate-200">
      <div className="container-shell py-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xl font-bold text-white">La Piragua</p>
          </div>

          <nav aria-label="Navegación legal del pie de página" className="flex flex-wrap items-center gap-3 text-sm">
            {footerLinks.map((link) => (
              <Link key={link.to} to={link.to} className="transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-400">
          <span>La Piragua</span>
          <span>•</span>
          <span>Privacidad</span>
          <span>|</span>
          <span>Términos</span>
          <span>|</span>
          <span>Cookies</span>
          <span>|</span>
          <span>Marco legal</span>
          <span>|</span>
          <span>Contacto</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
