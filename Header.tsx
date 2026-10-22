import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/auth', label: 'Ingresar' },
  { to: '/privacidad', label: 'Privacidad' },
  { to: '/marco-legal', label: 'Marco legal' },
]

function Header() {
  const { user, signOut } = useAuth()

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="container-shell flex items-center justify-between gap-4 py-4">
        <Link to="/" className="text-lg font-bold text-slate-900">
          La Piragua
        </Link>

        <nav aria-label="Navegación principal" className="hidden items-center gap-4 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? 'text-blue-700' : 'text-slate-600 hover:text-slate-900'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link to="/perfil" className="btn-secondary">
                Perfil
              </Link>
              <button type="button" onClick={() => signOut()} className="btn-primary">
                Salir
              </button>
            </>
          ) : (
            <Link to="/auth" className="btn-primary">
              Entrar
            </Link>
          )}
        </div>
      </div>

      <nav aria-label="Navegación móvil" className="border-t border-slate-200 bg-white md:hidden">
        <div className="container-shell flex gap-2 overflow-x-auto py-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  )
}

export default Header
