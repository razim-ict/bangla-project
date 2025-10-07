### Project Features

- **Bangla-first UI**: Primary copy and page metadata in Bengali for local users.

### Core User Flow

- **Public login page (`/`)**
  - Simple form collects `username` and `password` and stores each attempt in the `login_users` table via a server action.
  - Inline success/error messaging with loading state.
  - GEMS login CTA placeholder button.
  - Branded visuals with background and logo images.

### Admin Authentication & Session

- **Admin login (`/admin/login`)**
  - Email/password-based login against `admins` table where `is_enabled = true`.
  - On success, sets `admin_session` cookie containing `{ id, email, role }`.

- **Route protection**
  - Middleware protects all `/admin/*` routes except `/admin/login`; redirects unauthenticated users to `/admin/login`.

- **Session utilities**
  - Get/set/delete admin session cookie from server actions.
  - Cookie is `httpOnly`, `sameSite=lax`, and `secure` in production.

### Admin Dashboard (`/admin`)

- **Access control**
  - Requires authenticated admin session; server redirects otherwise.

- **Login Users view**
  - Lists rows from `login_users` (username, password, created date).

- **Admin Management (super-admin only)**
  - Create admin (email, password, role: `admin`/`super-admin`).
  - Edit admin (email, password).
  - Enable/disable admin.
  - Delete admin (non–super-admin accounts only).
  - Live refresh after mutations via `revalidatePath` and client reload.

### Data & Backend

- **Supabase integration**
  - Server client with Next.js cookies adapter.
  - Browser client for potential client-side usage.
  - Environment-driven configuration with validation for required public keys.

- **Database schema (SQL in `scripts/`)**
  - `admins` table: email (unique), password, role (`super-admin` | `admin`), `is_enabled`, timestamps.
  - `login_users` table: username, password, created_at; duplicates allowed (no unique constraint).
  - Row Level Security enabled with permissive policies for anon/auth (for prototyping).
  - Seed super-admin record.

### UI/UX

- **Design system & Components**
  - Tailwind CSS v4 with custom CSS variables for light/dark themes.
  - Extensive UI primitives in `components/ui` (buttons, inputs, dialogs, tables, menus, etc.).
  - Theme provider via `next-themes`.

- **Pages & Layout**
  - Global fonts (Geist Sans/Mono), Vercel Analytics, and Suspense wrapper.
  - Global styles in `app/globals.css` and `styles/globals.css` (tailwind + animations).

### Dev & Tooling

- **Next.js 15 / React 19** app router project.
- TypeScript with strict, readable utilities (e.g., `cn`).
- Scripts: `dev`, `build`, `start`, `lint`.

### Environment

- Required env vars:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Optional (not used in runtime clients): `SUPABASE_SERVICE_ROLE_KEY` in config object.

### Notes & Security Considerations

- Credentials (both `login_users` and `admins`) are stored as plaintext in the database and displayed in the dashboard. Hashing and proper auth flows are recommended for production.
- Admin authentication is a direct table lookup; consider migrating to Supabase Auth or secure password hashing with role-based checks.
- RLS policies are permissive for prototyping; tighten before production.
- Session cookie is not signed/validated beyond presence; consider JWT or signed cookies.

### Tech Stack

- Next.js (App Router), React, TypeScript
- Supabase (`@supabase/ssr`, `@supabase/supabase-js`)
- Tailwind CSS v4, `tailwindcss-animate`, `tw-animate-css`
- UI: Radix primitives, custom components


