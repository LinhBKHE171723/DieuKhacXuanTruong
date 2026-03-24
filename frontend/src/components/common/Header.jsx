import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Trang chủ" },
  { to: "/gioi-thieu", label: "Giới thiệu" },
  { to: "/san-pham", label: "Sản phẩm" },
  { to: "/cong-trinh", label: "Công trình" },
  { to: "/lien-he", label: "Liên hệ" }
];

export function Header({ settings = {} }) {
  const [open, setOpen] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const closeMenu = () => setOpen(false);
    window.addEventListener("resize", closeMenu);
    return () => window.removeEventListener("resize", closeMenu);
  }, []);

  useEffect(() => {
    const headerElement = headerRef.current;
    if (!headerElement) {
      return undefined;
    }

    const syncHeaderOffset = () => {
      document.documentElement.style.setProperty("--header-offset", `${headerElement.offsetHeight}px`);
    };

    syncHeaderOffset();
    window.addEventListener("resize", syncHeaderOffset);

    if (typeof ResizeObserver === "undefined") {
      return () => window.removeEventListener("resize", syncHeaderOffset);
    }

    const resizeObserver = new ResizeObserver(syncHeaderOffset);
    resizeObserver.observe(headerElement);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", syncHeaderOffset);
    };
  }, [open, settings.companyName, settings.logoUrl, settings.tagline]);

  return (
    <header ref={headerRef} className="site-header">
      <div className="container site-header__main">
        <Link className="site-logo" to="/">
          {settings.logoUrl ? (
            <span className="site-logo__image">
              <img src={settings.logoUrl} alt={settings.companyName || "Logo"} loading="eager" />
            </span>
          ) : (
            <span className="site-logo__mark">DK</span>
          )}
          <span>
            <strong>{settings.companyName || "Điêu Khắc Tân Cổ Điển"}</strong>
            <small>{settings.tagline || "Hoa văn, phù điêu, bê tông mỹ thuật"}</small>
          </span>
        </Link>

        <nav className={`site-nav ${open ? "is-open" : ""}`}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          <a className="button button--primary site-nav__cta" href={`tel:${settings.hotline || ""}`}>
            Gọi tư vấn
          </a>
        </nav>

        <button
          className="mobile-toggle"
          type="button"
          aria-label={open ? "Đóng menu điều hướng" : "Mở menu điều hướng"}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
