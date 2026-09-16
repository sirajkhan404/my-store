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
    const [showTopBar, setShowTopBar] = useState(true);
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
            setScrolled(scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when sidebar open
    useEffect(() => {
        document.body.style.overflow = sidebarOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [sidebarOpen]);

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { to: '/', label: 'Home', icon: '✨' },
        { to: '/about', label: 'About', icon: '🏛️' },
        { to: '/products', label: 'Products', icon: '🛍️', badge: 'Hot' },
        { to: '/contact', label: 'Contact', icon: '💬' },
    ];

    return (
        <>
            <header className="fixed-top w-100" style={{ zIndex: 1100, transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                {/* ── Top Announcement Banner ── */}
                {showTopBar && (
                    <div
                        className="py-1 px-3 d-flex align-items-center justify-content-between text-white position-relative"
                        style={{
                            background: 'linear-gradient(90deg, #042f2e 0%, #0d9488 50%, #042f2e 100%)',
                            fontSize: '12px',
                            borderBottom: '1px solid rgba(94,234,212,0.15)',
                            letterSpacing: '0.3px',
                        }}
                    >
                        <div className="container d-flex align-items-center justify-content-center justify-content-md-between text-center">
                            <div className="d-flex align-items-center gap-2 mx-auto mx-md-0">
                                <span className="badge rounded-pill bg-warning text-dark fw-bold px-2 py-0.5" style={{ fontSize: '10px' }}>
                                    LIMITED OFFER
                                </span>
                                <span className="fw-medium text-truncate">
                                    ⚡ Free Shipping on orders over <strong className="text-warning">$50</strong> | Use Code: <span className="badge bg-white bg-opacity-20 text-white font-monospace px-1">STORE20</span>
                                </span>
                            </div>
                            <div className="d-none d-md-flex align-items-center gap-3">
                                <span className="text-white-50">✨ 24/7 Dedicated Support</span>
                                <button
                                    onClick={() => setShowTopBar(false)}
                                    className="btn btn-link p-0 text-white text-opacity-75 hover-text-white text-decoration-none"
                                    style={{ fontSize: '14px', lineHeight: 1 }}
                                    title="Close banner"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Main Glassmorphic Navigation Bar ── */}
                <nav
                    className="transition-all"
                    style={{
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        background: scrolled
                            ? 'rgba(4, 47, 46, 0.92)'
                            : 'rgba(255, 255, 255, 0.94)',
                        borderBottom: scrolled
                            ? '1px solid rgba(94, 234, 212, 0.2)'
                            : '1px solid rgba(13, 148, 136, 0.12)',
                        boxShadow: scrolled
                            ? '0 12px 36px -10px rgba(0, 0, 0, 0.35)'
                            : '0 4px 20px -2px rgba(13, 148, 136, 0.08)',
                        padding: scrolled ? '12px 0' : '16px 0',
                        transition: 'all 0.35s ease',
                    }}
                >
                    <div className="container d-flex align-items-center justify-content-between">
                        {/* ── Brand Logo ── */}
                        <Link
                            to="/"
                            className="d-flex align-items-center gap-2 text-decoration-none"
                            style={{ transition: 'transform 0.2s ease' }}
                        >
                            <div
                                className="rounded-3 d-flex align-items-center justify-content-center shadow-sm"
                                style={{
                                    width: '42px',
                                    height: '42px',
                                    background: 'linear-gradient(135deg, #0d9488 0%, #042f2e 100%)',
                                    border: '1.5px solid rgba(94, 234, 212, 0.4)',
                                    fontSize: '20px',
                                }}
                            >
                                🛍️
                            </div>
                            <div className="d-flex flex-column">
                                <span
                                    className="fw-black fs-4 lh-1 tracking-tight"
                                    style={{
                                        fontFamily: "'Inter', sans-serif",
                                        fontWeight: 800,
                                        background: scrolled
                                            ? 'linear-gradient(135deg, #ffffff 30%, #5eead4 100%)'
                                            : 'linear-gradient(135deg, #042f2e 30%, #0d9488 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        letterSpacing: '-0.5px',
                                    }}
                                >
                                    My<span style={{ color: '#0d9488' }}>Store</span>
                                </span>
                                <span
                                    style={{
                                        fontSize: '9.5px',
                                        letterSpacing: '1.5px',
                                        textTransform: 'uppercase',
                                        fontWeight: 700,
                                        color: scrolled ? '#5eead4' : '#0f766e',
                                        marginTop: '1px',
                                    }}
                                >
                                    Premium Shop
                                </span>
                            </div>
                        </Link>

                        {/* ── Desktop Center Navigation Links (Floating Pill Style) ── */}
                        <div
                            className="d-none d-lg-flex align-items-center gap-1 p-1 rounded-pill"
                            style={{
                                background: scrolled
                                    ? 'rgba(255, 255, 255, 0.06)'
                                    : 'rgba(13, 148, 136, 0.05)',
                                border: scrolled
                                    ? '1px solid rgba(255, 255, 255, 0.08)'
                                    : '1px solid rgba(13, 148, 136, 0.1)',
                            }}
                        >
                            {navLinks.map((l) => {
                                const active = isActive(l.to);
                                return (
                                    <Link
                                        key={l.to}
                                        to={l.to}
                                        className="position-relative px-3 py-2 rounded-pill text-decoration-none d-flex align-items-center gap-1.5 transition-all"
                                        style={{
                                            fontSize: '14.5px',
                                            fontWeight: active ? 700 : 500,
                                            color: active
                                                ? (scrolled ? '#ffffff' : '#042f2e')
                                                : (scrolled ? 'rgba(255, 255, 255, 0.72)' : '#4b5563'),
                                            background: active
                                                ? (scrolled
                                                    ? 'linear-gradient(135deg, #0d9488, #0f766e)'
                                                    : '#ffffff')
                                                : 'transparent',
                                            boxShadow: active
                                                ? (scrolled
                                                    ? '0 4px 14px rgba(13, 148, 136, 0.4)'
                                                    : '0 2px 8px rgba(0, 0, 0, 0.08)')
                                                : 'none',
                                            transition: 'all 0.22s ease',
                                        }}
                                    >
                                        <span style={{ fontSize: '13px' }}>{l.icon}</span>
                                        <span>{l.label}</span>
                                        {l.badge && (
                                            <span
                                                className="badge rounded-pill fw-bold"
                                                style={{
                                                    fontSize: '9px',
                                                    padding: '2px 5px',
                                                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                                    color: '#ffffff',
                                                }}
                                            >
                                                {l.badge}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* ── Desktop Right Actions (Cart + Account / Auth CTA) ── */}
                        <div className="d-none d-lg-flex align-items-center gap-2.5">
                            {/* 🛒 Cart Button with Animated Counter Badge */}
                            <button
                                onClick={() => setCartOpen(true)}
                                className="btn position-relative rounded-pill d-flex align-items-center gap-2 fw-semibold"
                                style={{
                                    background: scrolled
                                        ? 'rgba(13, 148, 136, 0.25)'
                                        : 'rgba(13, 148, 136, 0.08)',
                                    color: scrolled ? '#5eead4' : '#0d9488',
                                    border: scrolled
                                        ? '1px solid rgba(94, 234, 212, 0.35)'
                                        : '1px solid rgba(13, 148, 136, 0.22)',
                                    padding: '8px 18px',
                                    fontSize: '14px',
                                    transition: 'all 0.2s ease',
                                    boxShadow: totalItems > 0 ? '0 0 16px rgba(13, 148, 136, 0.3)' : 'none',
                                }}
                            >
                                <span style={{ fontSize: '16px' }}>🛒</span>
                                <span>Cart</span>
                                {totalItems > 0 && (
                                    <span
                                        className="badge rounded-pill fw-bold animate-pulse"
                                        style={{
                                            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                            color: '#ffffff',
                                            fontSize: '10.5px',
                                            minWidth: '20px',
                                            padding: '2px 6px',
                                            boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)',
                                        }}
                                    >
                                        {totalItems}
                                    </span>
                                )}
                            </button>

                            {/* ── User Profile Dropdown or Login / Sign Up ── */}
                            {isAuth ? (
                                <div className="position-relative" ref={dropdownRef}>
                                    <button
                                        type="button"
                                        className="btn d-flex align-items-center gap-2 p-1 pe-3 rounded-pill transition-all"
                                        style={{
                                            background: scrolled ? 'rgba(255, 255, 255, 0.1)' : '#f8fafc',
                                            border: scrolled ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #e2e8f0',
                                            color: scrolled ? '#ffffff' : '#042f2e',
                                            transition: 'all 0.2s ease',
                                        }}
                                        onClick={() => setDropdownOpen(prev => !prev)}
                                        aria-expanded={dropdownOpen}
                                    >
                                        <div
                                            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold overflow-hidden flex-shrink-0 shadow-sm"
                                            style={{
                                                width: '36px',
                                                height: '36px',
                                                background: 'linear-gradient(135deg, #0d9488 0%, #042f2e 100%)',
                                                border: '1.5px solid #5eead4',
                                                fontSize: '14px',
                                            }}
                                        >
                                            {user?.profilePicture ? (
                                                <img src={user.profilePicture} alt="DP" className="w-100 h-100 object-fit-cover" />
                                            ) : (
                                                user?.fullName?.charAt(0)?.toUpperCase() || 'U'
                                            )}
                                        </div>
                                        <div className="d-flex flex-column text-start lh-1">
                                            <span className="fw-bold text-truncate" style={{ maxWidth: '105px', fontSize: '13.5px' }}>
                                                {user?.fullName || 'My Account'}
                                            </span>
                                            <span style={{ fontSize: '10px', color: scrolled ? '#5eead4' : '#0d9488', fontWeight: 600 }}>
                                                {user?.role === 'superAdmin' ? '👑 Admin' : '✨ Member'}
                                            </span>
                                        </div>
                                        <span
                                            style={{
                                                fontSize: '10px',
                                                opacity: 0.6,
                                                transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                                transition: 'transform 0.2s ease',
                                                marginLeft: '2px',
                                            }}
                                        >
                                            ▼
                                        </span>
                                    </button>

                                    {/* Glassmorphic Dropdown Menu */}
                                    {dropdownOpen && (
                                        <div
                                            className="position-absolute end-0 mt-2 bg-white rounded-4 shadow-xl border overflow-hidden py-2"
                                            style={{
                                                width: '240px',
                                                zIndex: 1200,
                                                borderColor: 'rgba(13, 148, 136, 0.15)',
                                                boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15)',
                                                animation: 'navFadeDown 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                                            }}
                                        >
                                            {/* User Header */}
                                            <div className="px-3 py-2.5 mb-1" style={{ background: 'linear-gradient(135deg, #f0fdfa, #e6fffa)', borderBottom: '1px solid #ccfbf1' }}>
                                                <div className="fw-bold text-dark text-truncate" style={{ fontSize: '14px' }}>
                                                    {user?.fullName || 'User'}
                                                </div>
                                                <div className="text-muted text-truncate" style={{ fontSize: '11px' }}>
                                                    {user?.email || ''}
                                                </div>
                                                <div className="mt-1.5">
                                                    <span
                                                        className="badge rounded-pill fw-bold"
                                                        style={{
                                                            fontSize: '10px',
                                                            background: user?.role === 'superAdmin' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #0d9488, #0f766e)',
                                                            color: '#ffffff',
                                                            padding: '3px 8px',
                                                        }}
                                                    >
                                                        {user?.role === 'superAdmin' ? '👑 Super Admin' : '🛍 Customer'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Menu items */}
                                            <div className="px-1 py-1">
                                                <Link
                                                    to="/dashboard"
                                                    className="d-flex align-items-center gap-2.5 px-3 py-2 rounded-3 text-decoration-none text-dark fw-semibold transition-all hover-nav-item"
                                                    style={{ fontSize: '13.5px' }}
                                                    onClick={() => setDropdownOpen(false)}
                                                >
                                                    <span style={{ fontSize: '16px' }}>📊</span>
                                                    <span>Dashboard</span>
                                                </Link>

                                                <Link
                                                    to="/dashboard/profile"
                                                    className="d-flex align-items-center gap-2.5 px-3 py-2 rounded-3 text-decoration-none text-dark fw-semibold transition-all hover-nav-item"
                                                    style={{ fontSize: '13.5px' }}
                                                    onClick={() => setDropdownOpen(false)}
                                                >
                                                    <span style={{ fontSize: '16px' }}>👤</span>
                                                    <span>My Profile</span>
                                                </Link>

                                                <Link
                                                    to="/dashboard/orders"
                                                    className="d-flex align-items-center gap-2.5 px-3 py-2 rounded-3 text-decoration-none text-dark fw-semibold transition-all hover-nav-item"
                                                    style={{ fontSize: '13.5px' }}
                                                    onClick={() => setDropdownOpen(false)}
                                                >
                                                    <span style={{ fontSize: '16px' }}>📋</span>
                                                    <span>My Orders</span>
                                                </Link>

                                                {user?.role === 'superAdmin' && (
                                                    <Link
                                                        to="/dashboard/messages"
                                                        className="d-flex align-items-center gap-2.5 px-3 py-2 rounded-3 text-decoration-none text-dark fw-semibold transition-all hover-nav-item"
                                                        style={{ fontSize: '13.5px' }}
                                                        onClick={() => setDropdownOpen(false)}
                                                    >
                                                        <span style={{ fontSize: '16px' }}>💬</span>
                                                        <span>Contact Messages</span>
                                                    </Link>
                                                )}
                                            </div>

                                            <div className="border-top my-1" style={{ borderColor: '#f1f5f9' }} />

                                            {/* Logout Button */}
                                            <div className="px-1">
                                                <button
                                                    type="button"
                                                    className="btn w-100 text-start px-3 py-2 rounded-3 d-flex align-items-center gap-2.5 text-decoration-none text-danger fw-bold border-0 bg-transparent transition-all"
                                                    style={{ fontSize: '13.5px' }}
                                                    onClick={() => {
                                                        setDropdownOpen(false);
                                                        handleLogout();
                                                    }}
                                                >
                                                    <span style={{ fontSize: '16px' }}>🚪</span>
                                                    <span>Sign Out</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="d-flex align-items-center gap-2">
                                    <Link
                                        to="/auth/login"
                                        className="btn rounded-pill px-3.5 py-1.5 fw-semibold transition-all"
                                        style={{
                                            border: scrolled ? '1px solid rgba(94, 234, 212, 0.4)' : '1px solid rgba(13, 148, 136, 0.3)',
                                            color: scrolled ? '#5eead4' : '#0d9488',
                                            background: scrolled ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                                            fontSize: '14px',
                                        }}
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        to="/auth/register"
                                        className="btn rounded-pill px-4 py-1.5 fw-semibold shadow-sm text-white transition-all"
                                        style={{
                                            background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                                            border: 'none',
                                            fontSize: '14px',
                                            boxShadow: '0 4px 14px rgba(13, 148, 136, 0.35)',
                                        }}
                                    >
                                        Get Started →
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* ── Mobile Action Buttons (Cart + Hamburger) ── */}
                        <div className="d-flex d-lg-none align-items-center gap-2">
                            {/* Mobile Cart Button */}
                            <button
                                onClick={() => setCartOpen(true)}
                                className="btn position-relative rounded-pill d-flex align-items-center justify-content-center p-2"
                                style={{
                                    background: scrolled ? 'rgba(13, 148, 136, 0.3)' : 'rgba(13, 148, 136, 0.1)',
                                    color: scrolled ? '#5eead4' : '#0d9488',
                                    border: scrolled ? '1px solid rgba(94, 234, 212, 0.4)' : '1px solid rgba(13, 148, 136, 0.2)',
                                    width: '38px',
                                    height: '38px',
                                }}
                            >
                                <span style={{ fontSize: '17px' }}>🛒</span>
                                {totalItems > 0 && (
                                    <span
                                        className="badge rounded-pill bg-danger position-absolute top-0 start-100 translate-middle"
                                        style={{ fontSize: '9px', padding: '2px 5px' }}
                                    >
                                        {totalItems}
                                    </span>
                                )}
                            </button>

                            {/* Animated Hamburger Button */}
                            <button
                                className="btn p-2 rounded-3 border-0 d-flex flex-column justify-content-center align-items-center gap-1.5"
                                style={{
                                    width: '38px',
                                    height: '38px',
                                    background: scrolled ? 'rgba(255, 255, 255, 0.12)' : 'rgba(13, 148, 136, 0.08)',
                                    border: scrolled ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(13, 148, 136, 0.15)',
                                }}
                                onClick={() => setSidebarOpen(o => !o)}
                                aria-label="Toggle navigation"
                            >
                                <span
                                    style={{
                                        width: '20px',
                                        height: '2px',
                                        background: scrolled ? '#5eead4' : '#042f2e',
                                        borderRadius: '2px',
                                        transition: 'all 0.3s ease',
                                        transform: sidebarOpen ? 'rotate(45deg) translate(3px, 5px)' : 'none',
                                    }}
                                />
                                <span
                                    style={{
                                        width: '20px',
                                        height: '2px',
                                        background: scrolled ? '#5eead4' : '#042f2e',
                                        borderRadius: '2px',
                                        transition: 'all 0.3s ease',
                                        opacity: sidebarOpen ? 0 : 1,
                                    }}
                                />
                                <span
                                    style={{
                                        width: '20px',
                                        height: '2px',
                                        background: scrolled ? '#5eead4' : '#042f2e',
                                        borderRadius: '2px',
                                        transition: 'all 0.3s ease',
                                        transform: sidebarOpen ? 'rotate(-45deg) translate(3px, -5px)' : 'none',
                                    }}
                                />
                            </button>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Spacer so page content never goes underneath navbar */}
            <div
                style={{
                    height: showTopBar ? (scrolled ? '72px' : '88px') : (scrolled ? '54px' : '70px'),
                    transition: 'height 0.35s ease',
                }}
            />

            {/* ── Mobile Sidebar Drawer Overlay ── */}
            <div
                className={`position-fixed top-0 start-0 w-100 h-100 transition-all ${sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                style={{
                    zIndex: 1250,
                    background: 'rgba(4, 47, 46, 0.65)',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                    transition: 'all 0.3s ease',
                }}
                onClick={() => setSidebarOpen(false)}
            />

            {/* ── Mobile Sidebar Drawer Content ── */}
            <div
                className="position-fixed top-0 h-100 bg-white shadow-2xl d-flex flex-column"
                style={{
                    width: '310px',
                    maxWidth: '85vw',
                    left: sidebarOpen ? '0' : '-100%',
                    zIndex: 1300,
                    transition: 'left 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
            >
                {/* Header in Drawer */}
                <div
                    className="p-4 text-white d-flex align-items-center justify-content-between"
                    style={{
                        background: 'linear-gradient(135deg, #042f2e 0%, #0d9488 100%)',
                        borderBottom: '1px solid rgba(94, 234, 212, 0.2)',
                    }}
                >
                    <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none" onClick={() => setSidebarOpen(false)}>
                        <div
                            className="rounded-3 d-flex align-items-center justify-content-center shadow-sm"
                            style={{
                                width: '38px',
                                height: '38px',
                                background: 'rgba(255, 255, 255, 0.15)',
                                border: '1px solid rgba(94, 234, 212, 0.4)',
                                fontSize: '18px',
                            }}
                        >
                            🛍️
                        </div>
                        <span className="fw-black fs-4 text-white tracking-tight">
                            My<span style={{ color: '#5eead4' }}>Store</span>
                        </span>
                    </Link>
                    <button
                        className="btn btn-sm text-white rounded-circle p-1 d-flex align-items-center justify-content-center"
                        style={{ width: '32px', height: '32px', background: 'rgba(255, 255, 255, 0.15)' }}
                        onClick={() => setSidebarOpen(false)}
                    >
                        ✕
                    </button>
                </div>

                {/* User Info Card if Authenticated */}
                {isAuth && (
                    <div className="p-3 mx-3 mt-3 rounded-4" style={{ background: 'linear-gradient(135deg, #f0fdfa, #e6fffa)', border: '1px solid #ccfbf1' }}>
                        <div className="d-flex align-items-center gap-2.5">
                            <div
                                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold overflow-hidden shadow-sm flex-shrink-0"
                                style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #0d9488, #042f2e)' }}
                            >
                                {user?.profilePicture ? (
                                    <img src={user.profilePicture} alt="DP" className="w-100 h-100 object-fit-cover" />
                                ) : (
                                    user?.fullName?.charAt(0)?.toUpperCase() || 'U'
                                )}
                            </div>
                            <div className="min-width-0">
                                <div className="fw-bold text-dark text-truncate" style={{ fontSize: '14px' }}>
                                    {user?.fullName || 'User'}
                                </div>
                                <div className="text-muted text-truncate" style={{ fontSize: '11px' }}>
                                    {user?.email}
                                </div>
                                <span className="badge rounded-pill mt-1" style={{ fontSize: '9.5px', background: user?.role === 'superAdmin' ? '#f59e0b' : '#0d9488', color: '#ffffff' }}>
                                    {user?.role === 'superAdmin' ? '👑 Super Admin' : '🛍 Member'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Nav Links */}
                <div className="flex-grow-1 py-3 px-3 overflow-auto">
                    <div className="text-muted fw-bold text-uppercase px-2 mb-2" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                        Navigation
                    </div>
                    <div className="d-flex flex-column gap-1">
                        {navLinks.map((l) => {
                            const active = isActive(l.to);
                            return (
                                <Link
                                    key={l.to}
                                    to={l.to}
                                    className="d-flex align-items-center justify-content-between px-3 py-2.5 rounded-3 text-decoration-none fw-semibold transition-all"
                                    style={{
                                        fontSize: '15px',
                                        background: active ? 'linear-gradient(135deg, #0d9488, #0f766e)' : 'transparent',
                                        color: active ? '#ffffff' : '#374151',
                                    }}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <div className="d-flex align-items-center gap-3">
                                        <span style={{ fontSize: '18px' }}>{l.icon}</span>
                                        <span>{l.label}</span>
                                    </div>
                                    {l.badge && (
                                        <span className="badge bg-warning text-dark rounded-pill fw-bold" style={{ fontSize: '10px' }}>
                                            {l.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {isAuth && (
                        <>
                            <div className="text-muted fw-bold text-uppercase px-2 mt-4 mb-2" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                                My Account
                            </div>
                            <div className="d-flex flex-column gap-1">
                                <Link
                                    to="/dashboard"
                                    className="d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 text-decoration-none text-dark fw-semibold"
                                    style={{ fontSize: '14.5px' }}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <span>📊</span>
                                    <span>Dashboard</span>
                                </Link>
                                <Link
                                    to="/dashboard/profile"
                                    className="d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 text-decoration-none text-dark fw-semibold"
                                    style={{ fontSize: '14.5px' }}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <span>👤</span>
                                    <span>Profile</span>
                                </Link>
                                <Link
                                    to="/dashboard/orders"
                                    className="d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 text-decoration-none text-dark fw-semibold"
                                    style={{ fontSize: '14.5px' }}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <span>📋</span>
                                    <span>Orders</span>
                                </Link>
                                {user?.role === 'superAdmin' && (
                                    <Link
                                        to="/dashboard/messages"
                                        className="d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 text-decoration-none text-dark fw-semibold"
                                        style={{ fontSize: '14.5px' }}
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <span>💬</span>
                                        <span>Messages</span>
                                    </Link>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="p-3 border-top bg-light">
                    {/* Cart Trigger */}
                    <button
                        className="btn w-100 rounded-pill py-2.5 fw-bold mb-2.5 d-flex align-items-center justify-content-center gap-2"
                        style={{
                            background: 'linear-gradient(135deg, #0d9488, #0f766e)',
                            color: '#ffffff',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)',
                        }}
                        onClick={() => {
                            setSidebarOpen(false);
                            setCartOpen(true);
                        }}
                    >
                        <span>🛒 View Cart</span>
                        {totalItems > 0 && (
                            <span className="badge rounded-pill bg-warning text-dark px-2 py-1" style={{ fontSize: '11px' }}>
                                {totalItems} items
                            </span>
                        )}
                    </button>

                    {isAuth ? (
                        <button
                            className="btn btn-outline-danger w-100 rounded-pill py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
                            onClick={() => {
                                handleLogout();
                                setSidebarOpen(false);
                            }}
                        >
                            <span>🚪</span> Sign Out
                        </button>
                    ) : (
                        <div className="d-flex flex-column gap-2">
                            <Link
                                to="/auth/login"
                                className="btn btn-outline-secondary w-100 rounded-pill py-2 fw-semibold"
                                onClick={() => setSidebarOpen(false)}
                            >
                                Log In
                            </Link>
                            <Link
                                to="/auth/register"
                                className="btn w-100 rounded-pill py-2 fw-semibold text-white shadow-sm"
                                style={{ background: 'linear-gradient(135deg, #042f2e, #0d9488)', border: 'none' }}
                                onClick={() => setSidebarOpen(false)}
                            >
                                Create Free Account →
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Cart Drawer (Global) ── */}
            <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />

            {/* Custom Embedded CSS for Hover & Animations */}
            <style>{`
                @keyframes navFadeDown {
                    from {
                        opacity: 0;
                        transform: translateY(-8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .hover-nav-item:hover {
                    background: #f0fdfa !important;
                    color: #0d9488 !important;
                }
                .animate-pulse {
                    animation: cartPulse 1.8s infinite;
                }
                @keyframes cartPulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.15); }
                    100% { transform: scale(1); }
                }
            `}</style>
        </>
    );
};

export default Navbar;