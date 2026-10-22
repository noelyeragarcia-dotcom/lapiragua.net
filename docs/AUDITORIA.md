# Auditoría de repositorio: noelyeragarcia-dotcom/lapiragua.net

Nota preliminar: no existe `.github/copilot-instructions.md` en este repositorio, por lo que se audita siguiendo el alcance solicitado y la estructura visible del proyecto.

## 1) Estado general del proyecto

- Repositorio: `noelyeragarcia-dotcom/lapiragua.net`
- Descripción: `Red económica y comercial de Cuba`
- Composición de lenguajes: TypeScript 84.5%, CSS 7.9%, JavaScript 4.6%, HTML 3%
- Gestor de paquetes: no existe lockfile visible en la raíz (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock` ausentes).
- Plataforma de despliegue real: GitHub Pages, según `github/workflows/deploy.yml` (aunque el directorio correcto para GitHub Actions es `.github/workflows`, no `github/workflows`).
- `CNAME` presente en la raíz con `lapiragua.net`, indica dominio personalizado de GitHub Pages.

## 2) Hallazgos

### Críticos

| Archivo y línea | Problema | Corrección propuesta |
|---|---|---|
| `github/workflows/deploy.yml:1-38` | El flujo está en `github/workflows`, no en `.github/workflows`. GitHub Actions no lo ejecuta en repositorios estándar. | Mover el archivo a `.github/workflows/deploy.yml` y mantener `actions/deploy-pages`. |
| `package.json:2-6` | `package.json` no define `scripts`, `dependencies`, `devDependencies` ni versión real del proyecto. La app no tiene dependencias declaradas para React/Vite/Supabase. | Declarar dependencias y scripts: `dev`, `build`, `lint`, `preview`; incluir `react`, `react-dom`, `react-router-dom`, `@supabase/supabase-js`, `vite`, `@vitejs/plugin-react`, `tailwindcss`, `autoprefixer`, etc. |
| `tsconfig.json:20-21` y `index.html:13` | `tsconfig.json` solo incluye `src`, pero la app tiene `App.tsx` y `main.tsx` en la raíz y `index.html` apunta a `/src/main.tsx`; no hay `src/main.tsx`. El proyecto no compilará. | Reestructurar la app para que `src/main.tsx` exista y `tsconfig.json` incluya verdaderamente todos los archivos compilados. |
| `App.tsx:3-8` y `App.tsx:14-25` | El enrutador importa módulos que no existen en el repo (`./context/AuthContext`, `./components/layout/Layout`, `./pages/HomePage`, `./pages/AuthPage`, etc.). La app no tiene esas rutas implementadas. | Crear o restaurar los módulos faltantes o corregir las rutas a archivos reales. |
| `main.tsx:3-10` + `vite.config.ts:4-18` | Se usa `BrowserRouter` para una SPA estática, pero no hay `base` ni configuración de fallback explícita para GitHub Pages. Cuando se navega a rutas directas, GitHub Pages falla con 404. | Añadir `base` apropiado y considerar `HashRouter` o fallback `404.html` para deep links. |
| `.gitignore:1-8` | `.gitignore` ignora `.env.*` y desexcluye solo `!.env.example`, pero no existe `.env.example`; el repositorio tiene un archivo `.env.local.` sospechoso en la raíz. Esto puede dejar secretos versionados o provocar variables no documentadas. | Crear `.env.example` real, eliminar `.env.local.` del control de versiones, y mantener solo ejemplos sin secretos. |
| `src/lib/supabase.ts:3-10` | El cliente de Supabase lanza error si faltan variables de entorno, pero no hay plantilla ni documentación de variables en el repo. En CI/deploy, `npm run build` puede fallar en producción si no se configuran secrets. | Documentar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en `.env.example`, y configurar secrets en GitHub. |

### Importantes

| Archivo y línea | Problema | Corrección propuesta |
|---|---|---|
| `package.json:1-6` | No hay lockfile visible; no se puede identificar si el proyecto usa `npm`, `pnpm` o `yarn`. El flujo de CI usa `npm install`, pero el repositorio no aporta lockfile. | Añadir el lockfile correcto (`package-lock.json` con npm o el equivalente de pnpm/yarn) y usarlo en CI. |
| `index.html:8` | El manifest apunta a `/manifest.webmanifest`, pero el archivo existe en la raíz; con GitHub Pages custom domain, el uso de ruta absoluta puede romper en subrutas. | Revisar `base` y rutas relativas o absolutas según el hosting final. |
| `schema.sql:20-33` | La política `Visitantes solo ven perfiles públicos` usa `USING (false)`, lo que niega lectura pública de usuarios. Si hay páginas de directorio/perfiles públicas, estas reglas no permitirán cargarlas sin un mecanismo de acceso explícito. | Definir políticas públicas de lectura para perfiles/negocios si el producto requiere listados visibles. |
| `schema.sql:35-66` | La tabla `businesses` define `slug`, `category`, `province`, `municipality`, `phone`, `whatsapp` y `website`, pero no hay comprobación de que la app use esas columnas. Si la app intenta consultar columnas inexistentes, la interfaz fallará. | Validar schemas del backend con las consultas reales y añadir migraciones/queries con columnas existentes. |
| `schema-fase5.sql:4-49` | La tabla `public.reports` está bien definida, pero su uso en la app no está visible en el repositorio; no hay llamadas a `reports` ni RLS en frontend. | Implementar la lógica del módulo de reportes y comprobar que las consultas usen exactamente `reports`, `reported_by`, `target_type`, `target_id`, `reason`, `status` y `reviewed_by`. |
| `schema.sql:4-16`, `schema-fase5.sql:4-49` | Las SQL documentan un modelo más avanzado que el código presente; el árbol real del repo no incluye los módulos de autenticación, perfiles, ofertas, catálogos, buscador, etc. | Alinear código y schema: no dejar archivos SQL “muertos” que no correspondan a la app compilable. |

### Menores

| Archivo y línea | Problema | Corrección propuesta |
|---|---|---|
| `tailwind.config.js:1-19` | Tailwind es correcto, pero con un proyecto en la raíz y sin `src` real, no se usa realmente. | Reubicar la aplicación dentro de `src` o ajustar rutas de contenido si se preserva la estructura actual. |
| `eslint.config.js:1-18` | ESLint está deshabilitado para `no-unused-vars` y no incluye React recomendados; es muy permisivo. | Añadir reglas del proyecto y habilitar `@eslint/js` o `eslint-plugin-react-hooks`/`eslint-plugin-react-refresh`. |
| `postcss.config.js:1-6` | Configuración simple; no hay problema funcional, pero depende de que Tailwind esté instalado. | Añadir las dependencias del stack y verificar que el build generado sea correcto. |
| `vite.config.ts:6-17` | El `server` y `preview` configuran `host: '0.0.0.0'`, pero no `base` ni `build.target` específicos; esto no es un error por sí solo, pero sí un riesgo para despliegues en subruta. | Ajustar `base` según el entorno de despliegue. |
| `App.tsx:18-24` | Rutas de legales bajo dominios de contenido: `/privacidad`, `/terminos`, `/cookies`, `/marco-legal`, `/solicitud-datos`, etc. están declaradas, pero no hay componentes reales asociados. | Crear las páginas `LegalPage`/`NotFoundPage` y verificar los textos legales de cumplimiento. |

## 3) Validación de rutas relativas

De la revisión del repo disponible, las rutas importadas en los archivos presentes no coinciden con el árbol real. Se detectan inconsistencias por mayúsculas/minúsculas y existencia:

- `App.tsx:3` → `./context/AuthContext` → no existe.
- `App.tsx:4` → `./components/layout/Layout` → no existe.
- `App.tsx:5` → `./pages/HomePage` → no existe.
- `App.tsx:6` → `./pages/AuthPage` → no existe.
- `App.tsx:7` → `./pages/ProfilePage` → no existe.
- `App.tsx:8` → `./pages/LegalPage` → no existe.
- `App.tsx:7` → `./pages/NotFoundPage` → no existe.
- `index.html:13` → `/src/main.tsx` → no existe (el archivo real es `main.tsx` en la raíz). 
- `main.tsx:4` → `./App` → sí existe en la raíz.
- `main.tsx:5` → `./index.css` → sí existe en la raíz.

Observación: el proyecto parece haber sido empezado con una estructura de Vite, pero la estructura real del repositorio no coincide con la ruta usada por el código.

## 4) Supabase y variables de entorno

- Archivo principal de cliente: `src/lib/supabase.ts:1-10`.
- Código visible:
  - `import.meta.env.VITE_SUPABASE_URL`
  - `import.meta.env.VITE_SUPABASE_ANON_KEY`
  - lanza error si faltan.
- Problema: el repo no documenta estas variables; no existe `.env.example` y hay un archivo `.env.local.` en la raíz con nombre sospechoso. No se muestran valores secretos en este informe.
- Requerimiento manual: en Supabase, crear un proyecto con URL y anon key; en GitHub Actions, guardar ambos como secrets del repositorio; y en local, usar un `.env.example` real que corresponda a `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.

## 5) SQL: tablas, columnas, RLS y uso real

### `schema.sql`

Tablas declaradas:

- `public.users`
  - `id`, `email`, `full_name`, `avatar_url`, `phone`, `whatsapp`, `role`, `is_verified`, `is_suspended`, `created_at`, `updated_at`
- `public.businesses`
  - `id`, `owner_id`, `name`, `slug`, `description`, `category`, `province`, `municipality`, `phone`, `whatsapp`, `email`, `website`, `is_verified`, `is_public`, `is_suspended`, `created_at`, `updated_at`
- `public.favorites`
  - `id`, `user_id`, `business_id`, `created_at`
- `public.business_verification`
  - `id`, `business_id`, `document_type`, `document_url`, `status`, `reviewed_by`, `review_notes`, `created_at`, `updated_at`

RLS visibles:

- Los usuarios solo pueden ver su propio perfil.
- Los visitantes no pueden ver perfiles públicos (`USING (false)`).
- Los negocios gestionan su propio perfil.
- Los usuarios gestionan sus favoritos.
- Moderadores revisan verificaciones.

### `schema-fase5.sql`

Tablas declaradas:

- `public.reports`
  - `id`, `reported_by`, `target_type`, `target_id`, `reason`, `description`, `status`, `reviewed_by`, `review_notes`, `created_at`, `updated_at`

RLS visibles:

- Usuarios solo ven sus reportes.
- Usuarios pueden crear reportes.
- Moderadores/admin pueden ver y actualizar reportes.

### Verificación de consistencia con el código existente

El código fuente visible no consulta ninguna de esas tablas ni columnas. La app actual no contiene las implementaciones reales de perfiles, catálogos, ofertas, autenticación o reportes; por tanto, el schema parece estar definido como base de producto, pero no alineado con la implementación presente. Esto requiere migración y revisión de queries antes de habilitar la base en producción.

## 6) Despliegue y plataforma real

- `github/workflows/deploy.yml:1-38` define un job de GitHub Pages con `actions/deploy-pages@v4` y `environment: github-pages`.
- `CNAME:1` contiene `lapiragua.net`.
- El sitio se despliega en GitHub Pages, no en Vercel, Netlify ni otra plataforma.
- No obstante, el directorio real del workflow no es `.github/workflows` sino `github/workflows`, una configuración incorrecta para GitHub Actions. El despliegue, como está estructurado, no se ejecutará automáticamente en GitHub si la ruta no es corregida.
- `BrowserRouter` en `main.tsx:3` con `vite.config.ts` sin `base` y sin `HashRouter` presenta riesgo para deep links y rutas directas en páginas estáticas.

## 7) Clasificación funcional

| Funcionalidad | Estado | Evidencia |
|---|---|---|
| Directorio / listados | Ausente | `App.tsx:14-25` declara rutas de `HomePage`, `ProfilePage` y `NotFoundPage`, pero los módulos no existen en el árbol visible. |
| Perfiles | Ausente | `App.tsx:17` `/<perfil>` apuntado a `ProfilePage`, pero no existe un archivo `./pages/ProfilePage`. |
| Catálogos | Ausente | No hay archivos de catálogo ni rutas declaradas; el repo visible no contiene una implementación de catálogo. |
| Ofertas | Ausente | No hay módulos ni consultas de ofertas en el código disponible. |
| Búsqueda | Ausente | No hay componente de búsqueda ni rutas relativas al filtro. |
| Contacto | Solo interfaz (rutas declaradas) | `App.tsx:24` declara `/contacto` con `LegalPage`, pero `LegalPage` no existe en el repositorio visible. |
| Autenticación | Solo interfaz (rutas declaradas) | `App.tsx:16` declara `/auth` con `AuthPage`, pero no existe el módulo ni la lógica asociada. |
| Formularios | Ausente | No hay archivos de formulario ni hidden input logic. |
| Páginas legales | Solo interfaz (rutas declaradas) | `App.tsx:18-24` define rutas legales, pero `./pages/LegalPage` no existe. |

## 8) Resultados reales de comandos

Se intenta cumplir con la secuencia pedida: instalación a través del gestor del lockfile, `npx tsc --noEmit`, lint y build.

| Comando | Resultado | Detalle |
|---|---|---|
| Instalación con el gestor del lockfile | No ejecutado | No existe lockfile visible (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`) y `package.json` no declara dependencias ni scripts. |
| `npx tsc --noEmit` | No ejecutado | El entorno de ejecución no está disponible desde esta sesión; además, `tsconfig.json` apunta a `src` pero ese árbol no existe en el repositorio visible. |
| Lint | No ejecutado | No hay script de lint en `package.json` y no hay entorno disponible para ejecutar ESLint. |
| Build | No ejecutado | Sin dependencias declaradas y con la estructura del proyecto rota, la compilación no puede verificarse desde esta sesión. |

Observación: el proyecto no se puede validar de manera real en este entorno sin un árbol de archivos funcional, un lockfile correcto y un entorno Node preparado.

## 9) Plan de corrección (ordenado)

1. Corregir estructura y rutas del proyecto (riesgo: alto)
   - Reubicar `App.tsx` y `main.tsx` al lugar esperado por Vite (`src/`), o ajustar `index.html` y `tsconfig.json` para apuntar a la estructura real.
   - Crear los módulos faltantes `src/pages`, `src/components`, `src/context` o mover los archivos existentes.
   - Riesgo: puede romper la app si se cambia la estructura sin verificar imports.

2. Declarar el proyecto como npm/pnpm/yarn real (riesgo: alto)
   - Añadir `dependencies`/`devDependencies`, scripts `dev`, `build`, `lint` y el lockfile adecuado.
   - Riesgo: con dependencias faltantes, el proyecto no compilará ni se desplegará.

3. Crear `docs`/templates de entorno y configurar variables de Supabase (riesgo: alto)
   - Añadir `.env.example` con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
   - Eliminar `.env.local.` con nombre sospechoso y asegurar `.gitignore` correcto.
   - Riesgo: errores de runtime si no se establecen variables correctas en CI y local.

4. Corregir despliegue GitHub Pages (riesgo: alto)
   - Mover el workflow a `.github/workflows/deploy.yml`.
   - Configurar `base` en Vite si se despliega bajo subruta o custom domain.
   - Revisar `404.html` fallback o migrar a `HashRouter` para SPAs profundas.
   - Riesgo: el sitio puede dar 404 en rutas directas y no desplegarse en GitHub Actions.

5. Alinear schema SQL con la app (riesgo: medio)
   - Validar que cada tabla/columna usada por la interfaz exista exactamente en Supabase.
   - Ajustar políticas RLS para perfiles públicos, autenticación y reportes reales.
   - Riesgo: si se habilita schema sin comprobar queries, aparecen errores de datos o fugas de información.

6. Implementar funcionalidad real y no solo rutas (riesgo: medio)
   - Crear los módulos de página y componentes de directorio, perfiles, ofertas, buscador, contacto, legales y formularios.
   - Riesgo: aparecerá una app “vacía” o con enlaces rotos si no se completa la implementación.

7. Revalidar CI y build tras cada ajuste (riesgo: bajo)
   - Ejecutar `npm install`, `npx tsc --noEmit`, `npm run lint`, `npm run build` en la secuencia correcta.
   - Riesgo: se detectarán regresiones, pero esta validación final es esencial.

## 10) Lista de lo que requiere acción manual en Supabase o GitHub

- Supabase:
  - Crear proyecto real y obtener `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
  - Crear o confirmar tablas `public.users`, `public.businesses`, `public.favorites`, `public.business_verification`, `public.reports` con los campos exactos.
  - Definir roles/claims para `moderator`/`admin` si se usan en `auth.jwt() ->> 'role'`.
  - Revisar RLS para permitir lecturas públicas de perfiles, listados o reportes según la UX
  - Ejecutar las migraciones SQL visibles y comprobar sus permisos.

- GitHub:
  - Mover workflow a `.github/workflows/deploy.yml`.
  - Configurar secrets `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
  - Activar GitHub Pages con “GitHub Actions” como source.
  - Revisar dominio personalizado `lapiragua.net` y mantener `CNAME` correcto.
  - Crear `404.html` apropiado o rediseñar a `HashRouter` para rutas directas.

## Cierre

El repositorio visible presenta un estado de proyecto no compilable y no alineado con su schema de base de datos. Los bloqueos principales son estructurales (ruta de archivos, dependencias faltantes, workflows fuera de la ruta correcta y ausencia de `.env.example`) y funcionales (esqueleto de frontend declarado, pero módulos no implementados). Como no se debe corregir en este paso, este documento queda como auditoría y hoja de ruta de reparación.

---

Documento generado para auditoría sin tocar el código fuente salvo `docs/AUDITORIA.md`.
