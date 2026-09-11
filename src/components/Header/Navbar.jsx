import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/Auth';

const Navbar = () => {
    const { isAuth, handleLogout, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [scrolled, setScrolled] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
        { to: '/about', label: 'About', icon: 'ℹ️' },
        { to: '/products', label: 'Products', icon: '🛍️' },
        { to: '/contact', label: 'Contact', icon: '📞' },
    ];

    return (
        <>
            {/* ── Top Navbar ── */}
            <nav className={`navbar fixed-top transition-all py-4 ${scrolled
                ? 'bg-dark text-white shadow-lg border-bottom border-secondary border-opacity-25'
                : 'bg-white text-dark shadow-sm border-bottom border-light'
                }`} style={{ backdropFilter: scrolled ? 'blur(16px)' : 'none', background: scrolled ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : '#ffffff' }}>
                <div className="container d-flex align-items-center justify-content-between">

                    {/* Brand */}
                    <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
                        <span className="fs-3 lh-1">🛍️</span>
                        <span className={`fw-extrabold fs-4 tracking-tight ${scrolled ? 'text-white' : 'text-dark'}`}>
                            MyStore
                        </span>
                    </Link>

                    {/* Desktop center nav links */}
                    <div className="d-none d-lg-flex align-items-center gap-1">
                        {navLinks.map(l => (
                            <Link
                                key={l.to}
                                to={l.to}
                                className={`nav-link px-3 py-2 fw-medium position-relative text-decoration-none ${isActive(l.to)
                                    ? (scrolled ? 'text-white fw-bold' : 'text-primary fw-bold')
                                    : (scrolled ? 'text-white-50' : 'text-secondary')
                                    }`}
                                style={{ fontSize: '15px' }}
                            >
                                {l.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop right: auth */}
                    <div className="d-none d-lg-flex align-items-center gap-3">
                        {isAuth ? (
                            <div className="d-flex align-items-center gap-3">
                                <Link to="/dashboard" className="btn btn-primary btn-sm rounded-pill px-3 fw-semibold shadow-sm">Dashboard</Link>
                                <div className="d-flex align-items-center gap-2">
                                    <span className={`small fw-semibold text-truncate ${scrolled ? 'text-white-50' : 'text-secondary'}`} style={{ maxWidth: '100px' }}>
                                        {user?.fullName || 'User'}
                                    </span>
                                    <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold overflow-hidden shadow-sm"
                                        style={{
                                            width: '38px',
                                            height: '38px',
                                            background: scrolled ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#3b82f6',
                                            border: scrolled ? '2px solid rgba(255,255,255,0.2)' : 'none'
                                        }}>
                                        {user?.profilePicture
                                            ? <img src={user.profilePicture} alt="DP" className="w-100 h-100 object-fit-cover" />
                                            : user?.fullName?.charAt(0)?.toUpperCase() || 'U'
                                        }
                                    </div>
                                </div>
                                <button className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-semibold" onClick={handleLogout}>Logout</button>
                            </div>
                        ) : (
                            <div className="d-flex gap-2">
                                <Link to="/auth/login" className={`btn rounded-pill px-4 fw-semibold ${scrolled ? 'btn-outline-light text-white' : 'btn-outline-secondary text-secondary'}`}>Log In</Link>
                                <Link to="/auth/register" className="btn btn-primary rounded-pill px-4 fw-semibold shadow-sm" style={{ background: scrolled ? 'linear-gradient(135deg,#3b82f6,#6366f1)' : '#3b82f6', border: 'none' }}>Sign Up</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className={`navbar-toggler border-0 p-2 rounded-3 d-lg-none ${sidebarOpen ? 'collapsed' : ''}`}
                        type="button"
                        onClick={() => setSidebarOpen(o => !o)}
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon" style={{ filter: scrolled ? 'invert(1)' : 'none' }}></span>
                    </button>
                </div>
            </nav>

            {/* Spacer */}
            <div style={{ height: scrolled ? '70px' : '84px', transition: 'height 0.3s ease' }} />

            {/* ── Mobile Sidebar Overlay ── */}
            <div
                className={`position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 transition-all ${sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                style={{ zIndex: 1200, backdropFilter: 'blur(2px)' }}
                onClick={() => setSidebarOpen(false)}
            />

            {/* ── Mobile Sidebar Drawer ── */}
            <div className={`position-fixed top-0 h-100 bg-white shadow-lg transition-all d-flex flex-column ${sidebarOpen ? 'start-0' : ''}`}
                style={{ width: '300px', left: sidebarOpen ? '0' : '-100%', zIndex: 1300, transition: 'left 0.35s cubic-bezier(0.4,0,0.2,1)' }}>

                {/* Sidebar Header */}
                <div className="d-flex align-items-center justify-content-between p-3 bg-dark text-white border-bottom border-secondary border-opacity-25"
                    style={{ background: 'linear-gradient(135deg,#0f172a,#1e293b)' }}>
                    <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none" onClick={() => setSidebarOpen(false)}>
                        <span className="fs-4">🛍️</span>
                        <span className="fw-extrabold fs-5 text-white">MyStore</span>
                    </Link>
                    <button className="btn btn-sm btn-outline-light rounded-3 border-opacity-25 p-1 px-2" onClick={() => setSidebarOpen(false)}>✕</button>
                </div>

                {/* Nav Links */}
                <div className="flex-grow-1 py-2 overflow-auto">
                    {navLinks.map(l => (
                        <Link
                            key={l.to}
                            to={l.to}
                            className={`d-flex align-items-center gap-3 px-4 py-3 text-decoration-none fw-semibold border-start border-4 ${isActive(l.to)
                                ? 'bg-indigo-subtle text-primary border-primary bg-light'
                                : 'text-secondary border-transparent'
                                }`}
                            style={{ fontSize: '15px' }}
                        >
                            <span className="fs-5 text-center" style={{ width: '24px' }}>{l.icon}</span>
                            <span>{l.label}</span>
                        </Link>
                    ))}
                </div>

                {/* Footer / Auth */}
                <div className="p-3 border-top bg-light">
                    {isAuth ? (
                        <>
                            <div className="d-flex align-items-center gap-3 p-2 bg-white rounded-3 border border-light-subtle mb-3 shadow-sm">
                                <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold overflow-hidden flex-shrink-0"
                                    style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                                    {user?.profilePicture
                                        ? <img src={user.profilePicture} alt="DP" className="w-100 h-100 object-fit-cover" />
                                        : user?.fullName?.charAt(0)?.toUpperCase() || 'U'
                                    }
                                </div>
                                <div className="min-width-0">
                                    <div className="fw-bold text-dark text-truncate" style={{ fontSize: '14px' }}>{user?.fullName || 'User'}</div>
                                    <div className="text-muted" style={{ fontSize: '11px' }}>{user?.role === 'superAdmin' ? '👑 Super Admin' : '🛍 Customer'}</div>
                                </div>
                            </div>
                            <Link to="/dashboard" className="btn btn-primary w-100 rounded-3 py-2 fw-bold shadow-sm mb-2" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none' }} onClick={() => setSidebarOpen(false)}>
                                📊 Dashboard
                            </Link>
                            <button className="btn btn-outline-danger w-100 rounded-3 py-2 fw-bold" onClick={() => { handleLogout(); setSidebarOpen(false); }}>
                                🚪 Logout
                            </button>
                        </>
                    ) : (
                        <div className="d-flex flex-column gap-2">
                            <Link to="/auth/login" className="btn btn-light border border-light-subtle w-100 rounded-3 py-2 fw-semibold text-secondary" onClick={() => setSidebarOpen(false)}>Log In</Link>
                            <Link to="/auth/register" className="btn btn-primary w-100 rounded-3 py-2 fw-semibold shadow-sm" style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)', border: 'none' }} onClick={() => setSidebarOpen(false)}>Sign Up →</Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Navbar;