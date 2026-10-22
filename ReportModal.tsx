import { useState } from 'react'
import type { ReportType, ReportReason } from '../../services/reports'
import { createReport } from '../../services/reports'

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  targetType: ReportType
  targetId: string
  targetName?: string
}

const REASONS: Array<{ value: ReportReason; label: string }> = [
  { value: 'illegal', label: 'Contenido ilegal' },
  { value: 'spam', label: 'Spam o estafa' },
  { value: 'fraud', label: 'Fraude' },
  { value: 'misinformation', label: 'Información falsa' },
  { value: 'other', label: 'Otro' },
]

function ReportModal({ isOpen, onClose, targetType, targetId, targetName }: ReportModalProps) {
  const [reason, setReason] = useState<ReportReason>('other')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    if (!description.trim()) {
      setMessage({ type: 'error', text: 'Describe el problema.' })
      setIsSubmitting(false)
      return
    }

    const { success, error } = await createReport(targetType, targetId, reason, description)

    if (success) {
      setMessage({ type: 'success', text: 'Reporte enviado. Gracias por ayudarnos.' })
      setTimeout(() => {
        onClose()
        setDescription('')
        setReason('other')
      }, 2000)
    } else {
      setMessage({ type: 'error', text: error || 'Error al enviar reporte' })
    }

    setIsSubmitting(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="card-surface w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-slate-900">Reportar {targetType === 'business' ? 'negocio' : 'artículo'}</h2>
        {targetName && <p className="mt-1 text-sm text-slate-600">{targetName}</p>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="reason" className="mb-2 block text-sm font-medium text-slate-700">
              Motivo
            </label>
            <select
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value as ReportReason)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {REASONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-medium text-slate-700">
              Descripción (máx 500 caracteres)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 500))}
              placeholder="Explica con detalle por qué reportas esto..."
              rows={4}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <p className="mt-1 text-xs text-slate-500">{description.length}/500</p>
          </div>

          {message && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm ${
                message.type === 'success'
                  ? 'border-green-200 bg-green-50 text-green-800'
                  : 'border-red-200 bg-red-50 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancelar
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Reportar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReportModal
