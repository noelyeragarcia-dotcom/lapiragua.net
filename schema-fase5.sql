-- Supabase schema - La Piragua Fase 5: Contacto y Reportes

-- Tabla de reportes de contenido
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reported_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('business', 'item')),
  target_id UUID NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('illegal', 'spam', 'fraud', 'misinformation', 'other')),
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'resolved', 'dismissed')),
  reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  review_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- RLS: Usuario ve solo sus reportes
CREATE POLICY "Usuario ve sus propios reportes"
  ON public.reports
  FOR SELECT
  USING (reported_by = auth.uid());

-- RLS: Usuario crea reporte
CREATE POLICY "Usuario crea reporte"
  ON public.reports
  FOR INSERT
  WITH CHECK (reported_by = auth.uid());

-- RLS: Moderador/Admin ven todos los reportes
CREATE POLICY "Moderadores revisan reportes"
  ON public.reports
  FOR SELECT
  USING (auth.jwt() ->> 'role' IN ('moderator', 'admin'));

-- RLS: Moderador/Admin actualiza reportes
CREATE POLICY "Moderadores actualizar reportes"
  ON public.reports
  FOR UPDATE
  USING (auth.jwt() ->> 'role' IN ('moderator', 'admin'))
  WITH CHECK (auth.jwt() ->> 'role' IN ('moderator', 'admin'));

-- Índices para búsqueda rápida
CREATE INDEX idx_reports_reported_by ON public.reports(reported_by);
CREATE INDEX idx_reports_target ON public.reports(target_type, target_id);
CREATE INDEX idx_reports_created_at ON public.reports(created_at DESC);
CREATE INDEX idx_reports_status ON public.reports(status);

-- Validación de teléfono: agregar constraint a tabla users si no existe
-- ALTER TABLE public.users ADD CONSTRAINT valid_phone CHECK (
--   phone IS NULL OR phone ~ '^(\\+53|0053|0)?\\s?[5-8]\\d{7,8}$'
-- );

-- Validación de teléfono: agregar constraint a tabla businesses si no existe
-- ALTER TABLE public.businesses ADD CONSTRAINT valid_phone CHECK (
--   phone IS NULL OR phone ~ '^(\\+53|0053|0)?\\s?[5-8]\\d{7,8}$'
-- );
-- ALTER TABLE public.businesses ADD CONSTRAINT valid_whatsapp CHECK (
--   whatsapp IS NULL OR whatsapp ~ '^(\\+53|0053|0)?\\s?[5-8]\\d{7,8}$'
-- );
