import { useState } from 'react'
import type { ReportType } from '../../services/reports'
import ReportModal from '../modals/ReportModal'
import { useAuth } from '../../context/AuthContext'

interface ReportButtonProps {
  targetType: ReportType
  targetId: string
  targetName?: string
  className?: string
}

function ReportButton({ targetType, targetId, targetName, className = '' }: ReportButtonProps) {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) {
    return (
      <button
        type="button"
        disabled
        title="Inicia sesión para reportar"
        className={`inline-flex items-center gap-2 rounded-xl bg-red-100 px-3 py-2 text-sm font-medium text-red-700 opacity-50 cursor-not-allowed ${className}`}
      >
        🚩 Reportar
      </button>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-2 rounded-xl bg-red-100 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300 ${className}`}
      >
        🚩 Reportar
      </button>

      <ReportModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        targetType={targetType}
        targetId={targetId}
        targetName={targetName}
      />
    </>
  )
}

export default ReportButton
