import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/Auth';

const Navbar = () => {
    const { isAuth, handleLogout, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [scrolled, setScrolled] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchInput.trim())}`);
            setSearchInput('');
            setSidebarOpen(false);
        }
    };

    // Close sidebar on route change
    useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
            setScrolled(scrollY > 600);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        document.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Lock body scroll when sidebar open
    useEffect(() => {
        document.body.style.overflow = sidebarOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [sidebarOpen]);

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { to: '/', label: 'Home', icon: '🏠' },
        { to: '/about', label: 'About ', icon: 'ℹ️' },
        { to: '/products', label: 'Products', icon: '🛍️' },
        { to: '/contact', label: 'Contact ', icon: '📞' },
    ];

    const nbg = scrolled
        ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
        : '#ffffff';

    return (
        <>
            <style>{`
                /* ── Navbar ── */
                .premium-navbar {
                    transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
                    background: ${nbg};
                    backdrop-filter: ${scrolled ? 'blur(16px)' : 'none'};
                    box-shadow: ${scrolled ? '0 8px 32px rgba(0,0,0,0.25)' : '0 1px 0 #f1f5f9'};
                    border-bottom: ${scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid #f1f5f9'};
                    padding: ${scrolled ? '0.6rem 0' : '1.1rem 0'};
                }
                .nav-link-custom {
                    color: ${scrolled ? 'rgba(255,255,255,0.8)' : '#475569'};
                    font-weight: 500;
                    position: relative;
                    padding: 0.5rem 1rem;
                    transition: color 0.2s;
                    text-decoration: none;
                    font-size: 15px;
                }
                .nav-link-custom:hover { color: ${scrolled ? '#fff' : '#3b82f6'}; }
                .nav-link-custom::after {
                    content: '';
                    position: absolute;
                    bottom: 0; left: 50%;
                    width: 0; height: 2px;
                    background: ${scrolled ? '#6366f1' : '#3b82f6'};
                    transition: all 0.3s ease;
                    transform: translateX(-50%);
                }
                .nav-link-custom:hover::after,
                .nav-link-custom.nav-active::after { width: 80%; }
                .nav-link-custom.nav-active { color: ${scrolled ? '#fff' : '#3b82f6'}; font-weight: 700; }

                .brand-logo {
                    font-weight: 800;
                    font-size: 1.5rem;
                    background: ${scrolled
                    ? 'linear-gradient(135deg,#ffffff 0%,#a5b4fc 100%)'
                    : 'linear-gradient(135deg,#0f172a 0%,#3b82f6 100%)'
                };
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    letter-spacing: -0.5px;
                    transition: all 0.4s;
                }
                .btn-login {
                    border: 2px solid ${scrolled ? 'rgba(255,255,255,0.25)' : '#e2e8f0'};
                    color: ${scrolled ? 'rgba(255,255,255,0.85)' : '#475569'};
                    font-weight: 600;
                    transition: all 0.2s;
                    background: transparent;
                }
                .btn-login:hover {
                    border-color: ${scrolled ? 'rgba(255,255,255,0.55)' : '#cbd5e1'};
                    background: ${scrolled ? 'rgba(255,255,255,0.1)' : '#f8fafc'};
                    color: ${scrolled ? '#fff' : '#0f172a'};
                }
                .btn-signup {
                    background: ${scrolled ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#3b82f6'};
                    color: #fff; font-weight: 600; border: none;
                    box-shadow: ${scrolled ? '0 4px 14px rgba(99,102,241,0.4)' : '0 4px 10px rgba(59,130,246,0.3)'};
                    transition: all 0.2s;
                }
                .btn-signup:hover {
                    background: ${scrolled ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : '#2563eb'};
                    color: #fff; transform: translateY(-1px);
                    box-shadow: ${scrolled ? '0 8px 20px rgba(99,102,241,0.5)' : '0 6px 15px rgba(59,130,246,0.4)'};
                }
                .user-avatar {
                    width: 38px; height: 38px;
                    background: ${scrolled ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#3b82f6'};
                    color: #fff; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-weight: bold; cursor: pointer; overflow: hidden;
                    transition: background 0.4s;
                    border: ${scrolled ? '2px solid rgba(255,255,255,0.2)' : 'none'};
                }

                /* ── Hamburger ── */
                .mob-toggle {
                    display: none;
                    flex-direction: column;
                    justify-content: center;
                    gap: 5px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 6px;
                    border-radius: 8px;
                    transition: background 0.2s;
                }
                .mob-toggle:hover { background: rgba(0,0,0,0.06); }
                .mob-toggle span {
                    display: block;
                    width: 24px; height: 2.5px;
                    background: ${scrolled ? '#fff' : '#334155'};
                    border-radius: 4px;
                    transition: all 0.3s;
                }
                .mob-toggle.open span:nth-child(1) { transform: translateY(7.5px) rotate(45deg); }
                .mob-toggle.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
                .mob-toggle.open span:nth-child(3) { transform: translateY(-7.5px) rotate(-45deg); }

                /* desktop-nav: hidden by default on mobile, flex on lg+ */
                .desktop-nav {
                    display: none;
                }
                @media (min-width: 992px) {
                    .desktop-nav { display: flex !important; }
                    .mob-toggle { display: none !important; }
                }
                @media (max-width: 991px) {
                    .mob-toggle { display: flex; }
                }
                /* Navbar container always flex row */
                .premium-navbar .container {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: nowrap;
                    gap: 0;
                }

                /* ── Sidebar Overlay ── */
                .sidebar-overlay {
                    position: fixed; inset: 0;
                    background: rgba(0,0,0,0.5);
                    z-index: 1200;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s;
                    backdrop-filter: blur(2px);
                }
                .sidebar-overlay.open { opacity: 1; visibility: visible; }

                /* ── Sidebar Drawer ── */
                .mob-sidebar {
                    position: fixed;
                    top: 0; right: -100%;
                    width: 300px; height: 100%;
                    background: #ffffff;
                    z-index: 1300;
                    transition: right 0.35s cubic-bezier(0.4,0,0.2,1);
                    display: flex; flex-direction: column;
                    box-shadow: -8px 0 40px rgba(0,0,0,0.15);
                    overflow-y: auto;
                }
                .mob-sidebar.open { right: 0; }

                .sb-header {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 20px 20px 16px;
                    border-bottom: 1px solid #f1f5f9;
                    background: linear-gradient(135deg,#0f172a,#1e293b);
                }
                .sb-close-btn {
                    width: 36px; height: 36px; border-radius: 10px;
                    border: 1.5px solid rgba(255,255,255,0.15);
                    background: rgba(255,255,255,0.1);
                    color: #fff; font-size: 18px; cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    transition: background 0.2s;
                }
                .sb-close-btn:hover { background: rgba(255,255,255,0.2); }

                .sb-search {
                    padding: 16px 20px;
                    border-bottom: 1px solid #f1f5f9;
                }
                .sb-search input {
                    width: 100%; padding: 10px 14px;
                    border-radius: 10px; border: 1.5px solid #e2e8f0;
                    background: #f8fafc; font-size: 14px; color: #0f172a;
                    outline: none; box-sizing: border-box;
                }
                .sb-search input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }

                .sb-nav { flex: 1; padding: 12px 0; }
                .sb-link {
                    display: flex; align-items: center; gap: 14px;
                    padding: 14px 24px; text-decoration: none;
                    color: #334155; font-size: 15px; font-weight: 600;
                    transition: all 0.18s; border-left: 3px solid transparent;
                }
                .sb-link:hover { background: #f1f5f9; color: #6366f1; }
                .sb-link.sb-active { background: #ede9fe; color: #6366f1; border-left-color: #6366f1; }
                .sb-link-icon { font-size: 19px; width: 26px; text-align: center; }

                .sb-footer {
                    padding: 16px 20px 24px;
                    border-top: 1px solid #f1f5f9;
                }
                .sb-user-card {
                    display: flex; align-items: center; gap: 12px;
                    background: #f8fafc; border-radius: 14px;
                    padding: 12px 14px; margin-bottom: 12px;
                    border: 1px solid #e2e8f0;
                }
                .sb-avatar {
                    width: 42px; height: 42px; border-radius: 12px;
                    background: linear-gradient(135deg,#6366f1,#8b5cf6);
                    display: flex; align-items: center; justify-content: center;
                    color: #fff; font-weight: 700; font-size: 17px;
                    overflow: hidden; flex-shrink: 0;
                }
                .sb-btn {
                    display: block; width: 100%; padding: 12px;
                    border-radius: 12px; font-size: 14px; font-weight: 700;
                    text-align: center; text-decoration: none; cursor: pointer;
                    transition: all 0.2s; margin-bottom: 8px; border: none;
                }
                .sb-btn-primary {
                    background: linear-gradient(135deg,#6366f1,#8b5cf6);
                    color: #fff; box-shadow: 0 4px 12px rgba(99,102,241,0.3);
                }
                .sb-btn-primary:hover { transform: translateY(-1px); }
                .sb-btn-outline {
                    background: transparent; color: #ef4444;
                    border: 2px solid #fecaca !important;
                }
                .sb-btn-outline:hover { background: #fef2f2; }
                .sb-btn-login {
                    background: #f8fafc; color: #475569;
                    border: 2px solid #e2e8f0 !important;
                }
                .sb-btn-login:hover { background: #f1f5f9; }
                .sb-btn-signup {
                    background: linear-gradient(135deg,#3b82f6,#6366f1);
                    color: #fff; box-shadow: 0 4px 12px rgba(59,130,246,0.3);
                }
            `}</style>

            {/* ── Top Navbar ── */}
            <nav className="navbar fixed-top premium-navbar" style={{ padding: 21 }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap', gap: 0, padding: '0 16px' }}>

                    {/* Brand — always visible */}
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
                        <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>🛍️</span>
                        <span className="brand-logo">MyStore</span>
                    </Link>

                    {/* Desktop center nav links */}
                    <div className="desktop-nav" style={{ alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center' }}>
                        {navLinks.map(l => (
                            <Link key={l.to} to={l.to} className={`nav-link-custom ${isActive(l.to) ? 'nav-active' : ''}`}>
                                {l.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop right: search + auth */}
                    <div className="desktop-nav" style={{ alignItems: 'center', gap: 12, flexShrink: 0 }}>
                        <form style={{ display: 'flex', position: 'relative' }} onSubmit={handleSearchSubmit}>
                            <input type="text" className="form-control rounded-pill pe-5"
                                placeholder="Search products..."
                                style={{ width: 190, background: scrolled ? 'rgba(255,255,255,0.1)' : '#f8fafc', border: scrolled ? '1px solid rgba(255,255,255,0.15)' : '1px solid #e2e8f0', color: scrolled ? '#fff' : '#0f172a' }}
                                value={searchInput} onChange={e => setSearchInput(e.target.value)} />
                            <button type="submit" className="btn position-absolute end-0 top-50 translate-middle-y border-0" style={{ background: 'transparent' }}>🔍</button>
                        </form>
                        {isAuth ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Link to="/dashboard" className="btn btn-primary btn-sm rounded-pill px-3 fw-semibold">Dashboard</Link>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: scrolled ? 'rgba(255,255,255,0.8)' : '#475569', whiteSpace: 'nowrap' }}>{user?.fullName || 'User'}</span>
                                    <div className="user-avatar">
                                        {user?.profilePicture
                                            ? <img src={user.profilePicture} alt="DP" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            : user?.fullName?.charAt(0)?.toUpperCase() || 'U'
                                        }
                                    </div>
                                </div>
                                <button className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-semibold" onClick={handleLogout}>Logout</button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', gap: 8 }}>
                                <Link to="/auth/login" className="btn btn-login rounded-pill px-4">Log In</Link>
                                <Link to="/auth/register" className="btn btn-signup rounded-pill px-4">Sign Up</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile hamburger — only on small screens */}
                    <button className={`mob-toggle ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(o => !o)} aria-label="Menu" style={{ marginLeft: 'auto' }}>
                        <span /><span /><span />
                    </button>
                </div>
            </nav>

            {/* Spacer */}
            <div style={{ height: scrolled ? '70px' : '84px', transition: 'height 0.3s ease' }} />

            {/* ── Mobile Sidebar Overlay ── */}
            <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

            {/* ── Mobile Sidebar Drawer ── */}
            <div className={`mob-sidebar ${sidebarOpen ? 'open' : ''}`}>

                {/* Sidebar Header */}
                <div className="sb-header">
                    <Link to="/" className="d-flex align-items-center gap-2" onClick={() => setSidebarOpen(false)}>
                        <span style={{ fontSize: '1.4rem' }}>🛍️</span>
                        <span style={{ fontWeight: 800, fontSize: '1.2rem', background: 'linear-gradient(135deg,#fff,#a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MyStore</span>
                    </Link>
                    <button className="sb-close-btn" onClick={() => setSidebarOpen(false)}>✕</button>
                </div>

                {/* Search */}
                <div className="sb-search">
                    <form onSubmit={handleSearchSubmit}>
                        <input type="text" placeholder="🔍  Search products…"
                            value={searchInput} onChange={e => setSearchInput(e.target.value)} />
                    </form>
                </div>

                {/* Nav Links */}
                <nav className="sb-nav">
                    {navLinks.map(l => (
                        <Link key={l.to} to={l.to} className={`sb-link ${isActive(l.to) ? 'sb-active' : ''}`}>
                            <span className="sb-link-icon">{l.icon}</span>
                            {l.label}
                        </Link>
                    ))}
                </nav>

                {/* Footer / Auth */}
                <div className="sb-footer">
                    {isAuth ? (
                        <>
                            <div className="sb-user-card">
                                <div className="sb-avatar">
                                    {user?.profilePicture
                                        ? <img src={user.profilePicture} alt="DP" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        : user?.fullName?.charAt(0)?.toUpperCase() || 'U'
                                    }
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{user?.fullName || 'User'}</div>
                                    <div style={{ fontSize: 12, color: '#94a3b8' }}>{user?.role === 'superAdmin' ? '👑 Super Admin' : '🛍 Customer'}</div>
                                </div>
                            </div>
                            <Link to="/dashboard" className="sb-btn sb-btn-primary" onClick={() => setSidebarOpen(false)}>
                                📊 Dashboard
                            </Link>
                            <button className="sb-btn sb-btn-outline" onClick={() => { handleLogout(); setSidebarOpen(false); }}>
                                🚪 Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/auth/login" className="sb-btn sb-btn-login" onClick={() => setSidebarOpen(false)}>Log In</Link>
                            <Link to="/auth/register" className="sb-btn sb-btn-signup" onClick={() => setSidebarOpen(false)}>Sign Up →</Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Navbar;