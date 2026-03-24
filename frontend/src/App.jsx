import { useEffect, useLayoutEffect } from "react";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Header } from "./components/common/Header";
import { Footer } from "./components/common/Footer";
import { LoadingScreen } from "./components/common/LoadingScreen";
import { useProductCategories, useSiteSettings } from "./hooks/useSiteData";
import { AboutPage } from "./pages/AboutPage";
import { AboutStoryPage } from "./pages/AboutStoryPage";
import { ContactPage } from "./pages/ContactPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { ProductsPage } from "./pages/ProductsPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { ProjectsPage } from "./pages/ProjectsPage";

function Layout() {
  const settingsQuery = useSiteSettings();
  const categoriesQuery = useProductCategories();
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const html = document.documentElement;
    const previousScrollBehavior = html.style.scrollBehavior;

    html.style.scrollBehavior = "auto";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    html.scrollTop = 0;
    document.body.scrollTop = 0;

    return () => {
      html.style.scrollBehavior = previousScrollBehavior;
    };
  }, [pathname]);

  useEffect(() => {
    const faviconUrl = settingsQuery.data?.faviconUrl;
    if (!faviconUrl) {
      return;
    }

    let link = document.querySelector("link[rel='icon']");
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "icon");
      document.head.appendChild(link);
    }

    link.setAttribute("href", faviconUrl);
  }, [settingsQuery.data?.faviconUrl]);

  if (settingsQuery.isLoading || categoriesQuery.isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="app-shell">
      <Header settings={settingsQuery.data} />
      <main>
        <Outlet />
      </main>
      <Footer settings={settingsQuery.data} categories={categoriesQuery.data?.items || []} />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/gioi-thieu" element={<AboutPage />} />
        <Route path="/gioi-thieu/:storySlug" element={<AboutStoryPage />} />
        <Route path="/san-pham" element={<ProductsPage />} />
        <Route path="/san-pham/:slug" element={<ProductDetailPage />} />
        <Route path="/cong-trinh" element={<ProjectsPage />} />
        <Route path="/cong-trinh/:slug" element={<ProjectDetailPage />} />
        <Route path="/lien-he" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
