import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider } from "@/context/AuthProvider";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/ProtectedRoute.tsx";

// Public pages
import GalleryPage from "@/components/pages/GalleryPage";
import ArtworkDetailPage from "@/components/pages/ArtworkDetailPage";
import ContactPage from "@/components/pages/ContactPage";
import LoginPage from "@/components/pages/LoginPage";
import UnauthorizedPage from "@/components/pages/UnauthorizedPage";
import AboutPage from "@/components/pages/AboutPage";
import NewsPage from "@/components/pages/NewsPage";
import NewsDetailPage from "@/components/pages/NewsDetailPage";


// Admin pages
import AdminDashboardPage from "@/components/pages/admin/AdminDashboardPage";
import ArtworksAdminPage from "@/components/pages/admin/ArtworksAdminPage";
import ArtworkFormPage from "@/components/pages/admin/ArtworkFormPage";
import CategoriesAdminPage from "@/components/pages/admin/CategoriesAdminPage";
import MessagesPage from "@/components/pages/admin/MessagesPage";
import {ThemeProvider} from "@/context/ThemeProvider.tsx";
import NewsAdminPage from "@/components/pages/admin/NewsAdminPage";

function App() {
  return (
      <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              {/* Public routes */}
              <Route index element={<GalleryPage />} />
              <Route path="artwork/:id" element={<ArtworkDetailPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="news" element={<NewsPage />} />
              <Route path="news/:id" element={<NewsDetailPage />} />
              <Route path="unauthorized" element={<UnauthorizedPage />} />

              {/* Admin only routes */}
              <Route element={<ProtectedRoute requireAdmin />}>
                <Route path="admin" element={<AdminDashboardPage />} />
                <Route path="admin/artworks" element={<ArtworksAdminPage />} />
                <Route path="admin/artworks/new" element={<ArtworkFormPage />} />
                <Route path="admin/artworks/:id" element={<ArtworkFormPage />} />
                <Route path="admin/categories" element={<CategoriesAdminPage />} />
                <Route path="admin/news" element={<NewsAdminPage />} />
                <Route path="admin/messages" element={<MessagesPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      </ThemeProvider>
  );
}

export default App;