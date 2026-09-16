import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/Auth";
import Routes from "./Routes";

const navItems = [
    { key: "dashboard", label: "Dashboard",  icon: "⊞",  path: "/dashboard",            roles: null },
    { key: "analytics", label: "Analytics",  icon: "📊",  path: "/dashboard/analytics",  roles: ["superAdmin"] },
    { key: "products",  label: "Products",   icon: "🛍",  path: "/dashboard/products",   roles: ["superAdmin"] },
    { key: "orders",    label: "Orders",     icon: "📋",  path: "/dashboard/orders",     roles: null },
    { key: "users",     label: "Users",      icon: "👥",  path: "/dashboard/users",      roles: ["superAdmin"] },
    { key: "messages",  label: "Messages",   icon: "💬",  path: "/dashboard/messages",   roles: null },
    { key: "profile",   label: "Profile",    icon: "👤",  path: "/dashboard/profile",    roles: null },
];

const Dashboard = () => {
    const { handleLogout, user } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const filtered = navItems.filter(
        item => !item.roles || item.roles.includes(user?.role)
    );

    const isActive = (path) =>
        path === "/dashboard"
            ? location.pathname === "/dashboard"
            : location.pathname.startsWith(path);

    const currentPage = filtered.find(i => isActive(i.path));

    return (
        <>
            {/* ── Global Theme Styles ─────────────────────────────── */}
            <style>{`
                :root {
                    --dsh-bg: #f8fafc;
                    --dsh-sidebar: #ffffff;
                    --dsh-sidebar-hover: #f1f5f9;
                    --dsh-accent: #4f46e5;
                    --dsh-accent-light: #e0e7ff;
                    --dsh-accent-border: #4f46e5;
                    --dsh-text-muted: #64748b;
                    --dsh-text-dark: #0f172a;
                    --dsh-white: #ffffff;
                    --dsh-card: #ffffff;
                    --dsh-border: #e2e8f0;
                    --dsh-nav-h: 70px;
                }
                body { background: var(--dsh-bg); }

                /* Sidebar link hover */
                .dsh-nav-link:hover {
                    background: var(--dsh-sidebar-hover) !important;
                    color: var(--dsh-text-dark) !important;
                }
                .dsh-nav-link.active-link {
                    background: var(--dsh-accent-light) !important;
                    color: var(--dsh-accent) !important;
                    font-weight: 700;
                }

                /* Card hover */
                .dsh-stat-card { transition: transform 0.2s, box-shadow 0.2s; }
                .dsh-stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.10) !important; }

                /* Sidebar scroll */
                .dsh-sidebar-nav { scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
                .dsh-sidebar-nav::-webkit-scrollbar { width: 4px; }
                .dsh-sidebar-nav::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }

                /* Badge overrides */
                .badge-processing { background:#f59e0b; color:#000; }
                .badge-shipped    { background:#06b6d4; color:#fff; }
                .badge-delivered  { background:#10b981; color:#fff; }
                .badge-cancelled  { background:#ef4444; color:#fff; }
                .badge-pending    { background:#6366f1; color:#fff; }
                .badge-paid       { background:#10b981; color:#fff; }
                .badge-failed     { background:#ef4444; color:#fff; }

                /* Table overrides */
                .dsh-table thead th { background:#1a1f36; color:#fff; font-weight:600; font-size:13px; border:none; }
                .dsh-table tbody tr:hover { background:#f5f7ff; }
                .dsh-table td, .dsh-table th { vertical-align: middle; }

                /* Mobile sidebar */
                @media (max-width: 991px) {
                    .dsh-sidebar-fixed {
                        position: fixed !important;
                        top: 0; left: 0; bottom: 0;
                        z-index: 1050;
                        transform: translateX(-100%);
                        transition: transform 0.28s ease;
                        width: 250px !important;
                    }
                    .dsh-sidebar-fixed.open { transform: translateX(0); }
                    .dsh-sidebar-desktop { display: none !important; }
                }
                @media (min-width: 992px) {
                    .dsh-sidebar-fixed { display: none !important; }
                }
            `}</style>

            <div style={{ display: "flex", minHeight: "100vh" }}>

                {/* ── Mobile Overlay ─────────────────────────────────── */}
                {sidebarOpen && (
                    <div
                        onClick={() => setSidebarOpen(false)}
                        style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:1049 }}
                    />
                )}

                {/* ── Mobile Sidebar ─────────────────────────────────── */}
                <div className={`dsh-sidebar-fixed d-flex flex-column ${sidebarOpen ? "open" : ""}`}
                    style={{ background: "var(--dsh-sidebar)", width: 250, borderRight: "1px solid var(--dsh-border)" }}>
                    <SidebarContent user={user} filtered={filtered} isActive={isActive} handleLogout={handleLogout} onClose={() => setSidebarOpen(false)} />
                </div>

                {/* ── Desktop Sidebar ─────────────────────────────────── */}
                <div className="dsh-sidebar-desktop d-none d-lg-flex flex-column"
                    style={{ width: 250, minHeight: "100vh", background: "var(--dsh-sidebar)", borderRight: "1px solid var(--dsh-border)", flexShrink: 0, position: "sticky", top: 0, height: "100vh" }}>
                    <SidebarContent user={user} filtered={filtered} isActive={isActive} handleLogout={handleLogout} onClose={() => {}} />
                </div>

                {/* ── Main Area ──────────────────────────────────────── */}
                <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0, background: "var(--dsh-bg)" }}>

                    {/* ── Top Navbar ─────────────────────────────────── */}
                    <header className="bg-white d-flex align-items-center justify-content-between px-3 px-md-4"
                        style={{ height: 70, position: "sticky", top: 0, zIndex: 900, borderBottom: "1px solid var(--dsh-border)" }}>

                        {/* Hamburger */}
                        <button className="btn border-0 p-1 d-lg-none"
                            style={{ fontSize: 22, color: "#1a1f36" }}
                            onClick={() => setSidebarOpen(true)}>
                            ☰
                        </button>

                        {/* Breadcrumb */}
                        <div className="d-none d-lg-flex align-items-center gap-2">
                            <span className="text-muted small">Dashboard</span>
                            {currentPage && currentPage.path !== "/dashboard" && (
                                <>
                                    <span className="text-muted small">/</span>
                                    <span className="fw-semibold small" style={{ color: "var(--dsh-accent)" }}>
                                        {currentPage.label}
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Right */}
                        <div className="d-flex align-items-center gap-2 gap-md-3 ms-auto">
                            <div className="d-none d-md-block text-end">
                                <div className="fw-semibold small lh-1">{user?.fullName}</div>
                                <div className="text-capitalize lh-1 mt-1" style={{ fontSize: 11, color: "#8b97b0" }}>{user?.role}</div>
                            </div>
                            <div className="d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
                                style={{ width: 36, height: 36, background: "var(--dsh-accent)", fontSize: 15, borderRadius: '50%', overflow: 'hidden' }}>
                                {user?.profilePicture ? (
                                    <img src={user.profilePicture} alt="DP" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    user?.fullName?.charAt(0)?.toUpperCase() || "A"
                                )}
                            </div>
                            <button className="btn btn-sm d-none d-md-flex align-items-center gap-1 fw-semibold"
                                style={{ background: "#fff0f0", color: "#ef4444", border: "1px solid #fecaca", borderRadius: 8 }}
                                onClick={handleLogout}>
                                🚪 Logout
                            </button>
                        </div>
                    </header>

                    {/* ── Page Content ──────────────────────────────── */}
                    <main className="flex-grow-1">
                        <Routes />
                    </main>

                    {/* ── Footer ────────────────────────────────────── */}
                    <footer className="text-center py-3 bg-white border-top"
                        style={{ fontSize: 12, color: "#8b97b0" }}>
                        My Store ©{new Date().getFullYear()} — Made with ❤️ by{" "}
                        <a href="http://codevpk.com" target="_blank" rel="noopener noreferrer"
                            className="fw-semibold text-decoration-none" style={{ color: "var(--dsh-accent)" }}>
                            CoDev
                        </a>
                    </footer>
                </div>
            </div>
        </>
    );
};

// ── Reusable Sidebar Content ─────────────────────────────────────────
const SidebarContent = ({ user, filtered, isActive, handleLogout, onClose }) => (
    <div className="d-flex flex-column h-100">
        {/* Logo */}
        <div className="px-4 py-4" style={{ borderBottom: "1px solid var(--dsh-border)" }}>
            <Link to="/" onClick={onClose} className="text-decoration-none d-flex align-items-center gap-2">
                <div className="d-flex align-items-center justify-content-center rounded-3 shadow-sm"
                    style={{ width: 40, height: 40, background: "var(--dsh-accent)", flexShrink: 0 }}>
                    <span style={{ fontSize: 20 }}>🏪</span>
                </div>
                <div>
                    <div className="fw-bold text-dark" style={{ fontSize: 18, lineHeight: 1 }}>My Store</div>
                    <div className="fw-semibold mt-1" style={{ fontSize: 11, color: "var(--dsh-accent)", lineHeight: 1.4, letterSpacing: 1, textTransform: 'uppercase' }}>Admin Panel</div>
                </div>
            </Link>
        </div>

        {/* User Card */}
        <div className="px-3 py-3 mx-3 my-4 rounded-4 shadow-sm"
            style={{ background: "#f8fafc", border: "1px solid var(--dsh-border)" }}>
            <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
                    style={{ width: 42, height: 42, background: "var(--dsh-accent)", fontSize: 16, borderRadius: '50%', overflow: 'hidden' }}>
                    {user?.profilePicture ? (
                        <img src={user.profilePicture} alt="DP" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        user?.fullName?.charAt(0)?.toUpperCase() || "A"
                    )}
                </div>
                <div className="overflow-hidden">
                    <div className="text-dark fw-bold text-truncate" style={{ fontSize: 14 }}>{user?.fullName}</div>
                    <div className="text-capitalize fw-semibold mt-1" style={{ fontSize: 11, color: "var(--dsh-text-muted)" }}>{user?.role}</div>
                </div>
            </div>
        </div>

        {/* Nav Label */}
        <div className="px-4 mb-2" style={{ fontSize: 10, color: "var(--dsh-text-muted)", letterSpacing: 1, textTransform: "uppercase" }}>
            Navigation
        </div>

        {/* Nav Links */}
        <nav className="dsh-sidebar-nav flex-grow-1 px-3 overflow-auto">
            {filtered.map(item => (
                <Link
                    key={item.key}
                    to={item.path}
                    onClick={onClose}
                    className={`dsh-nav-link d-flex align-items-center gap-3 px-3 py-3 rounded-4 mb-2 text-decoration-none fw-semibold ${isActive(item.path) ? "active-link shadow-sm" : ""}`}
                    style={{
                        color: isActive(item.path) ? "var(--dsh-accent)" : "var(--dsh-text-muted)",
                        transition: "all 0.2s",
                        fontSize: 14,
                    }}
                >
                    <span style={{ fontSize: 18, width: 24, textAlign: "center", flexShrink: 0 }}>{item.icon}</span>
                    <span>{item.label}</span>
                </Link>
            ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4" style={{ borderTop: "1px solid var(--dsh-border)" }}>
            <button
                className="btn w-100 d-flex align-items-center justify-content-center gap-2 fw-bold"
                style={{ background: "#fef2f2", color: "#ef4444", border: "1px solid #fee2e2", borderRadius: 12, fontSize: 15, padding: "10px" }}
                onClick={handleLogout}
            >
                🚪 Logout
            </button>
        </div>
    </div>
);

export default Dashboard;
