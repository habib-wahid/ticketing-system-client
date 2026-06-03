# Ticketing Client

A modern, full-featured ticket management frontend built with React 19, TypeScript, and Tailwind CSS. Designed to work with the [`ticketing-app`](../ticketing-app) Spring Boot backend.

## Features

- **Authentication** — JWT-based login and registration with automatic token refresh and session persistence via `localStorage`. Role-aware UI (`CUSTOMER`, `AGENT`, `ADMIN`).
- **Dashboard** — Ticket overview cards (Open, New, In-Process, Closed) with per-section date range filters. Pie charts for priority and complaint-category distribution. **Daily Tickets Volume** grouped bar chart with month/year selector, fed by `/api/dashboard/daily-stats`.
- **My Tickets** — Paginated, filterable list of the authenticated user's own tickets.
- **Assigned Tickets** — List of tickets currently assigned to the logged-in agent/admin.
- **All Tickets** _(Admin only)_ — Global ticket view with full filtering capabilities.
- **Ticket Detail** — Deep-dive view showing description, metadata, SLA status, comments (internal/external), attachments, and full status history with actor and reason.
- **Create / Edit Ticket** — Form for submitting new tickets or editing existing ones, including priority, category, and description fields.
- **Category Management** _(Admin only)_ — CRUD interface for complaint categories at `/management/all-categories`.
- **Role-based Access Control** — `ProtectedRoute` component guards all authenticated routes; `adminOnly` flag restricts admin-exclusive views.
- **SLA Tracking** — Visual indicators for response deadlines, breach status, and escalation timers.
- **Toast Notifications** — App-wide toast provider for user-facing feedback.

## Tech Stack

| Layer | Library / Tool |
|---|---|
| Framework | [React 19](https://react.dev/) |
| Language | TypeScript 5.9 |
| Build tool | [Vite 8](https://vitejs.dev/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Routing | [React Router v7](https://reactrouter.com/) |
| Charts | [Recharts 3](https://recharts.org/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Testing | [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) |

## Project Structure

```
src/
├── components/
│   ├── FilterSidebar.tsx       # Reusable filter panel
│   ├── Header.tsx              # Top navigation bar
│   ├── MainLayout.tsx          # Shell with sidebar + header
│   ├── ProtectedRoute.tsx      # Auth & role guard wrapper
│   ├── Sidebar.tsx             # Nav sidebar (role-aware menu)
│   ├── TicketForm.tsx          # Shared create/edit form
│   ├── TicketItem.tsx          # Single ticket row/card
│   ├── TicketList.tsx          # Paginated ticket list
│   ├── ToastProvider.tsx       # App-wide toast context
│   └── __tests__/
├── context/
│   ├── AuthContext.tsx         # Auth state, login, register, logout
│   └── __tests__/
├── pages/
│   ├── AllCategory.tsx         # Category management (Admin)
│   ├── AllTickets.tsx          # All tickets view (Admin)
│   ├── AssignedTickets.tsx     # Tickets assigned to current user
│   ├── AuthLayout.tsx          # Wrapper for login/register pages
│   ├── CreateTicket.tsx        # New ticket form page
│   ├── Dashboard.tsx           # Analytics dashboard with charts
│   ├── EditTicket.tsx          # Edit existing ticket page
│   ├── Home.tsx                # My Tickets page
│   ├── Login.tsx               # Login page
│   ├── Register.tsx            # Registration page
│   └── TicketDetail.tsx        # Full ticket detail page
├── services/
│   └── api.ts                  # Generic apiClient + authApi, ticketApi, categoryApi, userApi
├── types/
│   ├── auth.ts                 # AuthUser, AuthResponse, LoginRequest, RegisterRequest
│   ├── category.ts             # ComplaintCategory request/response types
│   └── ticket.ts               # Ticket, TicketDetail, SLA, comments, attachments, history
└── test/
    └── setup.ts
```

## Routes

| Path | Component | Access |
|---|---|---|
| `/login` | `Login` | Public |
| `/register` | `Register` | Public |
| `/dashboard` | `Dashboard` | Authenticated |
| `/` | `Home` (My Tickets) | Authenticated |
| `/assigned` | `AssignedTickets` | Authenticated |
| `/all-tickets` | `AllTickets` | Admin only |
| `/new` | `CreateTicket` | Authenticated |
| `/edit/:id` | `EditTicket` | Authenticated |
| `/tickets/:ticketId` | `TicketDetailPage` | Authenticated |
| `/management/all-categories` | `AllCategory` | Authenticated |

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm

### Installation

```bash
# From the ticketing-client directory
npm install
```

### Environment

The API base URL defaults to `http://localhost:8080`. To override it, change `BASE_URL` in `src/services/api.ts` or add an environment variable mechanism via Vite's `import.meta.env`.

### Development

```bash
npm run dev        # Start Vite dev server (http://localhost:5173)
```

### Build

```bash
npm run build      # Type-check + production build → dist/
npm run preview    # Preview the production build locally
```

### Lint & Test

```bash
npm run lint       # ESLint
npm run test       # Vitest (run once)
```

## Backend Integration

This client is designed to work with the `ticketing-app` Spring Boot backend. The following API groups are consumed:

| Prefix | Purpose |
|---|---|
| `/api/auth` | Login, register, token refresh |
| `/api/tickets` | CRUD, user tickets, detail |
| `/api/dashboard` | Stats, priority, category, daily volume |
| `/api/complaint-categories` | Category CRUD |
| `/api/users` | User search |

Ensure the backend is running at `http://localhost:8080` before starting the dev server.

## Authentication Flow

1. On login/register, `accessToken` and `refreshToken` are stored in `localStorage`.
2. Every request through `apiClient` attaches `Authorization: Bearer <accessToken>`.
3. On a `401` response, the client automatically attempts a single token refresh via `/api/auth/refresh` and retries the original request.
4. If the refresh fails, tokens are cleared and the user is redirected to `/login`.
