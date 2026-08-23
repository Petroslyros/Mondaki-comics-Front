# MondakiComics — Frontend

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** (build tool)
- **React Router** (routing)
- **Tailwind CSS v4** (styling, dark/light mode)
- **shadcn/ui** (Radix UI components)
- **React Hook Form** + **Zod** (forms & validation)
- **Sonner** (toast notifications)
- **Lucide React** + **react-icons** (icons)

## Δομή
src/
├── components/
│ ├── layout/ → Header, Footer, Layout (με ThemeToggle)
│ ├── pages/ → Public σελίδες (Gallery, News, About, Contact, Login)
│ │ └── admin/ → Admin panel σελίδες (protected routes)
│ ├── ui/ → shadcn/ui components
│ ├── AuthButton.tsx
│ └── ProtectedRoute.tsx
├── context/ → AuthContext/Provider, ThemeContext/Provider
├── hooks/ → useAuth, useTheme
├── schemas/ → Zod schemas + TypeScript types (artworks, categories, contact, news, login)
├── services/ → API calls (fetch wrappers) ανά domain
└── utils/ → Cookies, auth headers helpers


## Features

- **Δημόσια Gallery** — grid artworks με category filtering, detail view με image carousel
- **Νέα** — λίστα ανακοινώσεων με προαιρετική εικόνα, detail σελίδα
- **About Me** — στατική σελίδα παρουσίασης
- **Contact Form** — comic-style speech bubble design, στέλνει μηνύματα στο backend
- **Admin Panel** (protected, JWT-based):
  - Dashboard με στατιστικά
  - Διαχείριση Artworks (CRUD, upload εικόνων, cover selection, publish toggle)
  - Διαχείριση Categories
  - Διαχείριση News (CRUD, εικόνα, publish toggle)
  - Inbox μηνυμάτων επικοινωνίας
- **Dark / Light Mode** — toggle με persistence (localStorage)
- **Πλήρως responsive** design

## Environment Variables

Δημιούργησε `.env` στο root:


Για τοπική ανάπτυξη, χρησιμοποίησε το τοπικό backend URL (π.χ. `https://localhost:5002/api`).

## Τοπική εκτέλεση

```bash
npm install
npm run dev
```

Build για production:
```bash
npm run build
```

## Deployment

Hosted στο **Vercel**. Auto-deploys από το `master` branch. Το `vercel.json` περιέχει rewrite rule ώστε το client-side routing (React Router) να δουλεύει σωστά σε direct navigation/refresh.

## Authentication

Το JWT token αποθηκεύεται σε cookie (`access_token`) μέσω `js-cookie`. Το `AuthProvider` διαχειρίζεται login/logout state, decode του token για user claims (username, role), και automatic logout σε expired tokens.

## Θέματα (Themes)

Το dark/light mode υλοποιείται με Tailwind's `dark:` variant (class-based, όχι media query), ελεγχόμενο μέσω `ThemeProvider` που προσθέτει/αφαιρεί την class `dark` στο `<html>` element.
