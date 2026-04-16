# Modern Ticketing System - Client

A premium, high-performance ticket management dashboard built with React, TypeScript, and Tailwind CSS. This application provides a seamless interface for users to create, track, and manage support tickets with real-time SLA monitoring.

## ✨ Features

- **Dynamic Dashboard**: View and filter tickets by status (Pending, Resolved).
- **Comprehensive Ticket Details**: Deep-dive into ticket descriptions, category, priority, and metadata.
- **SLA Tracking**: Visual indicators for response deadlines and SLA breach status.
- **Interaction System**: Add and view internal/external comments on tickets.
- **Audit Trail**: Complete status history tracking with reason and actor details.
- **Modern UI/UX**: Premium design using Tailwind CSS with glassmorphism effects and smooth transitions.
- **Type-Safe Development**: Full TypeScript integration for robust development and maintenance.

## 🚀 Tech Stack

- **Framework**: [React 18](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **Routing**: [React Router v6](https://reactrouter.com/)

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (optional, defaults to `http://localhost:8080`)
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📂 Project Structure

- `src/components`: Reusable UI components (TicketList, TicketItem, etc.)
- `src/pages`: Main application pages (Home, TicketDetail, CreateTicket, etc.)
- `src/types`: TypeScript interfaces and type definitions
- `src/assets`: Static assets and global styles

## 🔧 backend Integration

The client is designed to work with the `ticketing-app` Spring Boot backend. Ensure the backend is running at `http://localhost:8080` or update the `BASE_URL` in the source files.

---

Built with ❤️ for efficient support workflows.
