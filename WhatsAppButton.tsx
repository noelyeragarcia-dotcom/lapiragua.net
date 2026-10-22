import { generateWhatsAppLink, validateWhatsApp } from '../../services/contact'
import { useAuth } from '../../context/AuthContext'

interface WhatsAppButtonProps {
  phone: string
  itemTitle?: string
  className?: string
}

function WhatsAppButton({ phone, itemTitle, className = '' }: WhatsAppButtonProps) {
  const { user } = useAuth()

  if (!user) {
    return (
      <button
        type="button"
        disabled
        title="Inicia sesión para contactar"
        className={`inline-flex items-center gap-2 rounded-xl bg-green-100 px-4 py-2 text-sm font-medium text-green-700 opacity-50 cursor-not-allowed ${className}`}
      >
        📱 Mensaje WhatsApp
      </button>
    )
  }

  if (!validateWhatsApp(phone)) {
    return null
  }

  const link = generateWhatsAppLink(phone, itemTitle)

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 ${className}`}
    >
      📱 Mensaje WhatsApp
    </a>
  )
}

export default WhatsAppButton
