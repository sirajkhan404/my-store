import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/Auth';
import { useCart } from '@/context/CartContext';
import CartSidebar from '../CartSidebar';

const Navbar = () => {
    const { isAuth, handleLogout, user } = useAuth();
    const { totalItems } = useCart();
    const location = useLocation();
    const navigate = useNavigate();

    const [scrolled, setScrolled] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close sidebar & dropdown on route change
    useEffect(() => {
        setSidebarOpen(false);
        setDropdownOpen(false);
    }, [location.pathname]);

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
                ? 'shadow-lg'
                : 'shadow-sm'
                }`} style={{ backdropFilter: scrolled ? 'blur(16px)' : 'none', background: scrolled ? 'linear-gradient(135deg, #042f2e 0%, #134e4a 100%)' : '#ffffff', borderBottom: scrolled ? '1px solid rgba(13,148,136,0.2)' : '1px solid #e5e7eb' }}>
                <div className="container d-flex align-items-center justify-content-between">

                    {/* Brand */}
                    <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
                        <span className="fs-3 lh-1">🛍️</span>
                        <span className={`fw-extrabold fs-4 tracking-tight`} style={{ color: scrolled ? '#5eead4' : '#0d9488' }}>
                            MyStore
                        </span>
                    </Link>

                    {/* Desktop center nav links */}
                    <div className="d-none d-lg-flex align-items-center gap-1">
                        {navLinks.map(l => (
                            <Link
                                key={l.to}
                                to={l.to}
                                className={`nav-link px-3 py-2 fw-medium position-relative text-decoration-none`}
                                style={{
                                    fontSize: '15px',
                                    color: isActive(l.to)
                                        ? (scrolled ? '#5eead4' : '#0d9488')
                                        : (scrolled ? 'rgba(255,255,255,0.65)' : '#6b7280'),
                                    fontWeight: isActive(l.to) ? 700 : 500,
                                }}
                            >
                                {l.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop right: cart + auth */}
                    <div className="d-none d-lg-flex align-items-center gap-3">

                        {/* Cart Button */}
                        <button
                            onClick={() => setCartOpen(true)}
                            className="btn position-relative rounded-pill d-flex align-items-center gap-2 fw-semibold"
                            style={{
                                background: scrolled ? 'rgba(13,148,136,0.2)' : '#f0fdfa',
                                color: scrolled ? '#5eead4' : '#0d9488',
                                border: scrolled ? '1px solid rgba(94,234,212,0.3)' : '1px solid #99f6e4',
                                padding: '8px 16px',
                                fontSize: '14px',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            🛒
                            {totalItems > 0 && (
                                <span className="badge rounded-pill bg-danger" style={{ fontSize: '10px', minWidth: '18px', padding: '2px 5px' }}>{totalItems}</span>
                            )}
                            <span>Cart</span>
                        </button>
                        {isAuth ? (
                            <div className="position-relative" ref={dropdownRef}>
                                {/* Dropdown Trigger Button */}
                                <button
                                    type="button"
                                    className={`btn d-flex align-items-center gap-2 p-1 pe-3 rounded-pill transition-all ${scrolled
                                        ? 'btn-outline-light border-secondary border-opacity-50 text-white'
                                        : 'btn-light border border-light-subtle text-dark shadow-sm'
                                        }`}
                                    onClick={() => setDropdownOpen(prev => !prev)}
                                    aria-expanded={dropdownOpen}
                                >
                                    <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold overflow-hidden flex-shrink-0 shadow-sm"
                                        style={{
                                            width: '36px',
                                            height: '36px',
                                            background: 'linear-gradient(135deg,#0d9488,#0f766e)',
                                        }}>
                                        {user?.profilePicture ? (
                                            <img src={user.profilePicture} alt="DP" className="w-100 h-100 object-fit-cover" />
                                        ) : (
                                            user?.fullName?.charAt(0)?.toUpperCase() || 'U'
                                        )}
                                    </div>
                                    <span className="fw-bold small text-truncate" style={{ maxWidth: '110px', fontSize: '14px' }}>
                                        {user?.fullName || 'Account'}
                                    </span>
                                    <span style={{ fontSize: '11px', opacity: 0.7, transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                                        ▼
                                    </span>
                                </button>

                                {/* Dropdown Menu Popup */}
                                {dropdownOpen && (
                                    <div className="position-absolute end-0 mt-2 bg-white rounded-4 shadow-lg border border-light-subtle overflow-hidden py-2"
                                        style={{ width: '230px', zIndex: 1100, animation: 'fadeIn 0.15s ease-out' }}>
                                        
                                        {/* User Info Header */}
                                        <div className="px-3 py-2 bg-light border-bottom border-light-subtle mb-1">
                                            <div className="fw-bold text-dark text-truncate" style={{ fontSize: '14px' }}>
                                                {user?.fullName || 'User'}
                                            </div>
                                            <div className="mt-1">
                                                <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill small fw-semibold" style={{ fontSize: '11px' }}>
                                                    {user?.role === 'superAdmin' ? '👑 Super Admin' : '🛍 Customer'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Links */}
                                        <Link
                                            to="/dashboard"
                                            className="d-flex align-items-center gap-2 px-3 py-2 text-decoration-none text-dark fw-semibold transition-all hover-bg-light"
                                            style={{ fontSize: '14px' }}
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <span style={{ fontSize: '16px' }}>📊</span>
                                            <span>Dashboard</span>
                                        </Link>

                                        <Link
                                            to="/dashboard/profile"
                                            className="d-flex align-items-center gap-2 px-3 py-2 text-decoration-none text-dark fw-semibold transition-all hover-bg-light"
                                            style={{ fontSize: '14px' }}
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <span style={{ fontSize: '16px' }}>👤</span>
                                            <span>My Profile</span>
                                        </Link>

                                        <Link
                                            to="/dashboard/orders"
                                            className="d-flex align-items-center gap-2 px-3 py-2 text-decoration-none text-dark fw-semibold transition-all hover-bg-light"
                                            style={{ fontSize: '14px' }}
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <span style={{ fontSize: '16px' }}>📋</span>
                                            <span>My Orders</span>
                                        </Link>

                                        {user?.role === 'superAdmin' && (
                                            <Link
                                                to="/dashboard/messages"
                                                className="d-flex align-items-center gap-2 px-3 py-2 text-decoration-none text-dark fw-semibold transition-all hover-bg-light"
                                                style={{ fontSize: '14px' }}
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                <span style={{ fontSize: '16px' }}>💬</span>
                                                <span>Contact Messages</span>
                                            </Link>
                                        )}

                                        <div className="border-top border-light-subtle my-1" />

                                        {/* Logout Button */}
                                        <button
                                            type="button"
                                            className="btn btn-link w-100 text-start px-3 py-2 d-flex align-items-center gap-2 text-decoration-none text-danger fw-bold border-0 bg-transparent shadow-none"
                                            style={{ fontSize: '14px' }}
                                            onClick={() => {
                                                setDropdownOpen(false);
                                                handleLogout();
                                            }}
                                        >
                                            <span style={{ fontSize: '16px' }}>🚪</span>
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="d-flex gap-2">
                                <Link to="/auth/login" className="btn rounded-pill px-4 fw-semibold" style={{ border: '1px solid #99f6e4', color: scrolled ? '#5eead4' : '#0d9488', background: 'transparent' }}>Log In</Link>
                                <Link to="/auth/register" className="btn rounded-pill px-4 fw-semibold shadow-sm text-white" style={{ background: 'linear-gradient(135deg,#0d9488,#0f766e)', border: 'none' }}>Sign Up</Link>
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
            <div className={`position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 transition-all ${sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                style={{ zIndex: 1200, backdropFilter: 'blur(2px)' }}
                onClick={() => setSidebarOpen(false)}
            />

            {/* ── Mobile Sidebar Drawer ── */}
            <div className={`position-fixed top-0 h-100 bg-white shadow-lg transition-all d-flex flex-column ${sidebarOpen ? 'start-0' : ''}`}
                style={{ width: '300px', left: sidebarOpen ? '0' : '-100%', zIndex: 1300, transition: 'left 0.35s cubic-bezier(0.4,0,0.2,1)' }}>

                <div className="d-flex align-items-center justify-content-between p-3 text-white border-bottom"
                    style={{ background: 'linear-gradient(135deg,#042f2e,#134e4a)' }}>
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
                            <Link to="/dashboard" className="btn w-100 rounded-3 py-2 fw-bold shadow-sm mb-2 text-white" style={{ background: 'linear-gradient(135deg,#0d9488,#0f766e)', border: 'none' }} onClick={() => setSidebarOpen(false)}>
                                📊 Dashboard
                            </Link>
                            {/* Mobile Cart Button */}
                            <button
                                className="btn w-100 rounded-3 py-2 fw-bold mb-2 d-flex align-items-center justify-content-center gap-2"
                                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#042f2e', border: 'none' }}
                                onClick={() => { setSidebarOpen(false); setCartOpen(true); }}
                            >
                                🛒 Cart {totalItems > 0 && <span className="badge rounded-pill" style={{ background: '#042f2e', color: '#fbbf24', fontSize: '10px' }}>{totalItems}</span>}
                            </button>
                            <button className="btn btn-outline-danger w-100 rounded-3 py-2 fw-bold" onClick={() => { handleLogout(); setSidebarOpen(false); }}>
                                🚪 Logout
                            </button>
                        </>
                    ) : (
                        <div className="d-flex flex-column gap-2">
                            <Link to="/auth/login" className="btn btn-light border w-100 rounded-3 py-2 fw-semibold" style={{ color: '#0d9488', borderColor: '#99f6e4' }} onClick={() => setSidebarOpen(false)}>Log In</Link>
                            <Link to="/auth/register" className="btn w-100 rounded-3 py-2 fw-semibold shadow-sm text-white" style={{ background: 'linear-gradient(135deg,#0d9488,#0f766e)', border: 'none' }} onClick={() => setSidebarOpen(false)}>Sign Up →</Link>
                        </div>
                    )}
                </div>
            </div>
            {/* ── Cart Sidebar (site-wide) ── */}
            <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        </>
    );
};

export default Navbar;