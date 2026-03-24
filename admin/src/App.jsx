import { Route, Routes } from "react-router-dom";
import { AdminLayout } from "./components/layout/AdminLayout";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { BannersPage } from "./pages/BannersPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { ContactsPage } from "./pages/ContactsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { PagesPage } from "./pages/PagesPage";
import { ProductsPage } from "./pages/ProductsPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { SettingsPage } from "./pages/SettingsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/banners" element={<BannersPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/pages" element={<PagesPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
