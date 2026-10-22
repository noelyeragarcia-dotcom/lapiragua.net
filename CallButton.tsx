import { generatePhoneLink, validateCubanPhone } from '../../services/contact'
import { useAuth } from '../../context/AuthContext'

interface CallButtonProps {
  phone: string
  className?: string
}

function CallButton({ phone, className = '' }: CallButtonProps) {
  const { user } = useAuth()

  if (!user) {
    return (
      <button
        type="button"
        disabled
        title="Inicia sesión para llamar"
        className={`inline-flex items-center gap-2 rounded-xl bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 opacity-50 cursor-not-allowed ${className}`}
      >
        ☎️ Llamar
      </button>
    )
  }

  if (!validateCubanPhone(phone)) {
    return null
  }

  const link = generatePhoneLink(phone)

  return (
    <a
      href={link}
      className={`inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${className}`}
    >
      ☎️ Llamar
    </a>
  )
}

export default CallButton
