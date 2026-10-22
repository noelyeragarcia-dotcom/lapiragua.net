import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'
import LegalPage from './pages/LegalPage'

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/privacidad" element={<LegalPage title="Privacidad" />} />
          <Route path="/terminos" element={<LegalPage title="Términos" />} />
          <Route path="/cookies" element={<LegalPage title="Cookies" />} />
          <Route path="/marco-legal" element={<LegalPage title="Marco legal" />} />
          <Route path="/solicitud-datos" element={<LegalPage title="Solicitud de datos" />} />
          <Route path="/reportar" element={<LegalPage title="Reportar" />} />
          <Route path="/contacto" element={<LegalPage title="Contacto" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </AuthProvider>
  )
}

export default App
