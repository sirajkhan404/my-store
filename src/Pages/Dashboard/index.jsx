import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/Auth";
import Routes from "./Routes";
import {
    DashboardOutlined,
    BarChartOutlined,
    ShoppingOutlined,
    PlayCircleOutlined,
    FileTextOutlined,
    TeamOutlined,
    MessageOutlined,
    UserOutlined,
    LogoutOutlined,
    ShopOutlined,
    CloseOutlined,
    MenuOutlined,
    CrownOutlined,
    ThunderboltFilled
} from "@ant-design/icons";

const navSections = [
    {
        title: "OVERVIEW",
        items: [
            { key: "dashboard", label: "Dashboard", icon: <DashboardOutlined />, path: "/dashboard", roles: null },
            { key: "analytics", label: "Analytics", icon: <BarChartOutlined />, path: "/dashboard/analytics", roles: ["superAdmin"] },
        ]
    },
    {
        title: "STORE MANAGEMENT",
        items: [
            { key: "products", label: "Products", icon: <ShoppingOutlined />, path: "/dashboard/products", roles: ["superAdmin"] },
            {
                key: "stories",
                label: "Product Stories",
                icon: <PlayCircleOutlined />,
                path: "/dashboard/stories",
                roles: ["superAdmin"],
                badge: "NEW"
            },
            { key: "orders", label: "Orders", icon: <FileTextOutlined />, path: "/dashboard/orders", roles: null },
        ]
    },
    {
        title: "USER & COMMUNITY",
        items: [
            { key: "users", label: "Users", icon: <TeamOutlined />, path: "/dashboard/users", roles: ["superAdmin"] },
            { key: "messages", label: "Messages", icon: <MessageOutlined />, path: "/dashboard/messages", roles: null },
            { key: "profile", label: "Profile", icon: <UserOutlined />, path: "/dashboard/profile", roles: null },
        ]
    }
];

const Dashboard = () => {
    const { handleLogout, user } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isActive = (path) =>
        path === "/dashboard"
            ? location.pathname === "/dashboard"
            : location.pathname.startsWith(path);

    // Find current active item for top breadcrumb
    let currentItem = null;
    for (const sec of navSections) {
        const found = sec.items.find(i => isActive(i.path));
        if (found) {
            currentItem = found;
            break;
        }
    }

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", width: "100%", position: "relative", overflowX: "hidden" }}>

            {/* ── Mobile Overlay Backdrop ── */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(3, 35, 34, 0.65)",
                        backdropFilter: "blur(4px)",
                        zIndex: 1040,
                        transition: "opacity 0.3s ease"
                    }}
                />
            )}

            {/* ── Mobile Sidebar Drawer ── */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: "280px",
                    zIndex: 1050,
                    transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
                    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: sidebarOpen ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)" : "none",
                    background: "linear-gradient(180deg, #042f2e 0%, #032221 60%, #021a19 100%)",
                    display: "flex",
                    flexDirection: "column"
                }}
                className="d-lg-none"
            >
                <SidebarContent
                    user={user}
                    navSections={navSections}
                    isActive={isActive}
                    handleLogout={handleLogout}
                    onClose={() => setSidebarOpen(false)}
                    isMobile={true}
                />
            </div>

            {/* ── Desktop Sidebar ── */}
            <div
                style={{
                    width: "280px",
                    minHeight: "100vh",
                    flexShrink: 0,
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                    background: "linear-gradient(180deg, #042f2e 0%, #032221 60%, #021a19 100%)",
                    borderRight: "1px solid rgba(255, 255, 255, 0.08)",
                    zIndex: 900
                }}
                className="d-none d-lg-flex flex-column"
            >
                <SidebarContent
                    user={user}
                    navSections={navSections}
                    isActive={isActive}
                    handleLogout={handleLogout}
                    onClose={() => { }}
                    isMobile={false}
                />
            </div>

            {/* ── Main Area ── */}
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", background: "#f8fafc" }}>

                {/* ── Top Navbar ── */}
                <header
                    style={{
                        height: "72px",
                        position: "sticky",
                        top: 0,
                        zIndex: 800,
                        background: "#ffffff",
                        borderBottom: "1px solid #e2e8f0",
                        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.03)",
                        padding: "0 24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}
                >
                    {/* Left: Mobile Toggle & Breadcrumb */}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="d-lg-none"
                            style={{
                                background: "#f0fdfa",
                                border: "1px solid #ccfbf1",
                                color: "#0d9488",
                                width: "40px",
                                height: "40px",
                                borderRadius: "10px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "18px",
                                cursor: "pointer"
                            }}
                        >
                            <MenuOutlined />
                        </button>

                        <div className="d-none d-sm-flex align-items-center gap-2">
                            <span style={{ color: "#64748b", fontSize: "13px", fontWeight: 500 }}>Dashboard</span>
                            {currentItem && currentItem.path !== "/dashboard" && (
                                <>
                                    <span style={{ color: "#cbd5e1" }}>/</span>
                                    <span style={{ color: "#0d9488", fontSize: "13px", fontWeight: 700 }}>
                                        {currentItem.label}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right: Quick live store button, user info & logout */}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <Link
                            to="/"
                            target="_blank"
                            style={{
                                background: "#f0fdfa",
                                border: "1px solid #99f6e4",
                                color: "#0d9488",
                                padding: "7px 14px",
                                borderRadius: "10px",
                                fontSize: "12px",
                                fontWeight: 700,
                                textDecoration: "none",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                transition: "all 0.2s ease"
                            }}
                            className="d-none d-md-flex"
                        >
                            <ShopOutlined /> View Live Store ↗
                        </Link>

                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div className="d-none d-md-block text-end">
                                <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }}>
                                    {user?.fullName || "User"}
                                </div>
                                <div style={{ fontSize: "11px", color: "#64748b", textTransform: "capitalize", marginTop: "2px" }}>
                                    {user?.role === "superAdmin" ? "👑 Super Admin" : "Customer"}
                                </div>
                            </div>

                            <div
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "12px",
                                    background: "linear-gradient(135deg, #0d9488, #042f2e)",
                                    color: "#5eead4",
                                    fontWeight: 800,
                                    fontSize: "16px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    overflow: "hidden",
                                    boxShadow: "0 4px 10px rgba(13, 148, 136, 0.25)"
                                }}
                            >
                                {user?.profilePicture ? (
                                    <img src={user.profilePicture} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                    user?.fullName?.charAt(0)?.toUpperCase() || "U"
                                )}
                            </div>

                            <button
                                onClick={handleLogout}
                                style={{
                                    background: "#fef2f2",
                                    color: "#ef4444",
                                    border: "1px solid #fee2e2",
                                    borderRadius: "10px",
                                    padding: "8px 14px",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px"
                                }}
                                className="d-none d-md-flex"
                            >
                                <LogoutOutlined /> Logout
                            </button>
                        </div>
                    </div>
                </header>

                {/* ── Page Content ── */}
                <main style={{ flex: 1, padding: "24px 20px" }}>
                    <Routes />
                </main>

                {/* ── Footer ── */}
                <footer style={{ background: "#ffffff", borderTop: "1px solid #e2e8f0", padding: "16px", textAlign: "center", fontSize: "12px", color: "#64748b" }}>
                    My Store ©{new Date().getFullYear()} — Powered by <span style={{ color: "#0d9488", fontWeight: 700 }}>CoDev</span>
                </footer>
            </div>
        </div>
    );
};

// ── Reusable Premium Sidebar Component ─────────────────────────────────
const SidebarContent = ({ user, navSections, isActive, handleLogout, onClose, isMobile }) => {
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative", color: "#ffffff" }}>

            {/* ══ Brand / Logo Section ══ */}
            <div style={{
                padding: "24px 20px 20px 20px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
            }}>
                <Link to="/" onClick={onClose} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "14px",
                        background: "linear-gradient(135deg, #0d9488 0%, #115e59 100%)",
                        border: "1px solid rgba(94, 234, 212, 0.3)",
                        boxShadow: "0 8px 20px rgba(13, 148, 136, 0.35)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "22px",
                        flexShrink: 0
                    }}>
                        🏪
                    </div>

                    <div>
                        <div style={{
                            fontSize: "19px",
                            fontWeight: 900,
                            letterSpacing: "-0.5px",
                            background: "linear-gradient(135deg, #ffffff 0%, #ccfbf1 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            lineHeight: 1.1
                        }}>
                            My Store
                        </div>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            marginTop: "4px"
                        }}>
                            <span style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                background: "#10b981",
                                boxShadow: "0 0 8px #10b981"
                            }} />
                            <span style={{
                                fontSize: "10px",
                                fontWeight: 800,
                                letterSpacing: "1.2px",
                                color: "#5eead4",
                                textTransform: "uppercase"
                            }}>
                                Admin Pro v2.0
                            </span>
                        </div>
                    </div>
                </Link>

                {/* Mobile Close Button */}
                {isMobile && (
                    <button
                        onClick={onClose}
                        style={{
                            background: "rgba(255, 255, 255, 0.1)",
                            border: "none",
                            color: "#fff",
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <CloseOutlined />
                    </button>
                )}
            </div>

            {/* ══ User Profile Mini Glass Card ══ */}
            <div style={{ padding: "16px 16px 12px 16px" }}>
                <div style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "16px",
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px"
                }}>
                    <div style={{ position: "relative", flexShrink: 0 }}>
                        <div style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #0d9488, #5eead4)",
                            color: "#042f2e",
                            fontWeight: 900,
                            fontSize: "16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden"
                        }}>
                            {user?.profilePicture ? (
                                <img src={user.profilePicture} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                                user?.fullName?.charAt(0)?.toUpperCase() || "A"
                            )}
                        </div>
                        <span style={{
                            position: "absolute",
                            bottom: "0",
                            right: "0",
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background: "#10b981",
                            border: "2px solid #042f2e"
                        }} />
                    </div>

                    <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{
                            fontSize: "13px",
                            fontWeight: 700,
                            color: "#ffffff",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}>
                            {user?.fullName || "Super Admin"}
                        </div>
                        <div style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            background: user?.role === "superAdmin" ? "rgba(245, 158, 11, 0.18)" : "rgba(13, 148, 136, 0.25)",
                            color: user?.role === "superAdmin" ? "#fbbf24" : "#5eead4",
                            padding: "2px 7px",
                            borderRadius: "6px",
                            fontSize: "10px",
                            fontWeight: 800,
                            marginTop: "3px",
                            textTransform: "uppercase"
                        }}>
                            {user?.role === "superAdmin" && <CrownOutlined style={{ fontSize: "10px" }} />}
                            {user?.role || "User"}
                        </div>
                    </div>
                </div>
            </div>

            {/* ══ Navigation List ══ */}
            <nav style={{
                flex: 1,
                overflowY: "auto",
                padding: "8px 12px 16px 12px",
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(255,255,255,0.15) transparent"
            }}>
                {navSections.map((sec, sIdx) => {
                    // Filter items based on user role
                    const visibleItems = sec.items.filter(item => !item.roles || item.roles.includes(user?.role));
                    if (visibleItems.length === 0) return null;

                    return (
                        <div key={sIdx} style={{ marginBottom: "18px" }}>
                            {/* Section Header */}
                            <div style={{
                                padding: "0 12px 6px 12px",
                                fontSize: "10px",
                                fontWeight: 800,
                                letterSpacing: "1.2px",
                                color: "rgba(255, 255, 255, 0.4)",
                                textTransform: "uppercase"
                            }}>
                                {sec.title}
                            </div>

                            {/* Section Nav Items */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                {visibleItems.map(item => {
                                    const active = isActive(item.path);
                                    return (
                                        <Link
                                            key={item.key}
                                            to={item.path}
                                            onClick={onClose}
                                            style={{
                                                textDecoration: "none",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                padding: "11px 14px",
                                                borderRadius: "12px",
                                                fontSize: "13.5px",
                                                fontWeight: active ? 700 : 600,
                                                color: active ? "#5eead4" : "rgba(255, 255, 255, 0.7)",
                                                background: active
                                                    ? "linear-gradient(90deg, rgba(13, 148, 136, 0.35) 0%, rgba(13, 148, 136, 0.12) 100%)"
                                                    : "transparent",
                                                border: active ? "1px solid rgba(94, 234, 212, 0.3)" : "1px solid transparent",
                                                boxShadow: active ? "0 4px 14px rgba(0, 0, 0, 0.2)" : "none",
                                                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                                position: "relative",
                                                overflow: "hidden"
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!active) {
                                                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                                                    e.currentTarget.style.color = "#ffffff";
                                                    e.currentTarget.style.transform = "translateX(4px)";
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!active) {
                                                    e.currentTarget.style.background = "transparent";
                                                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                                                    e.currentTarget.style.transform = "translateX(0)";
                                                }
                                            }}
                                        >
                                            {/* Left Icon + Label */}
                                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                <span style={{
                                                    fontSize: "16px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    color: active ? "#5eead4" : "#99f6e4"
                                                }}>
                                                    {item.icon}
                                                </span>
                                                <span>{item.label}</span>
                                            </div>

                                            {/* Optional Badge */}
                                            {item.badge && (
                                                <span style={{
                                                    background: "linear-gradient(135deg, #f59e0b, #d97706)",
                                                    color: "#042f2e",
                                                    fontSize: "10px",
                                                    fontWeight: 900,
                                                    padding: "2px 7px",
                                                    borderRadius: "10px",
                                                    boxShadow: "0 2px 8px rgba(245, 158, 11, 0.4)"
                                                }}>
                                                    {item.badge}
                                                </span>
                                            )}

                                            {/* Active Left Glow Line */}
                                            {active && (
                                                <div style={{
                                                    position: "absolute",
                                                    left: 0,
                                                    top: "15%",
                                                    bottom: "15%",
                                                    width: "3px",
                                                    background: "#5eead4",
                                                    borderRadius: "0 4px 4px 0",
                                                    boxShadow: "0 0 10px #5eead4"
                                                }} />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </nav>

            {/* ══ Bottom Actions & Logout ══ */}
            <div style={{
                padding: "16px 16px 20px 16px",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                background: "rgba(0, 0, 0, 0.15)",
                display: "flex",
                flexDirection: "column",
                gap: "10px"
            }}>
                {/* View Store Quick Card */}
                <Link
                    to="/"
                    target="_blank"
                    style={{
                        textDecoration: "none",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "12px",
                        padding: "10px 14px",
                        color: "rgba(255, 255, 255, 0.85)",
                        fontSize: "12px",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(13, 148, 136, 0.2)";
                        e.currentTarget.style.borderColor = "#5eead4";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <ShopOutlined style={{ color: "#5eead4" }} />
                        <span>Visit Store</span>
                    </div>
                    <span style={{ fontSize: "11px", color: "#5eead4" }}>↗</span>
                </Link>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    style={{
                        background: "rgba(239, 68, 68, 0.12)",
                        border: "1px solid rgba(239, 68, 68, 0.25)",
                        color: "#fca5a5",
                        borderRadius: "12px",
                        padding: "10px",
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(239, 68, 68, 0.25)";
                        e.currentTarget.style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(239, 68, 68, 0.12)";
                        e.currentTarget.style.color = "#fca5a5";
                    }}
                >
                    <LogoutOutlined />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default Dashboard;