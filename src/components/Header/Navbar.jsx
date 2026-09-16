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
        if (sidebarOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none';
        } else {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        };
    }, [sidebarOpen]);

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { to: '/', label: 'Home', icon: '🏠' },
        { to: '/about', label: 'About Us', icon: '✨' },
        { to: '/products', label: 'Products', icon: '🛍️', badge: 'Hot' },
        { to: '/contact', label: 'Contact', icon: '📞' },
    ];

    return (
        <>
            {/* ── Fixed Header Wrapper ── */}
            <header className="fixed-top w-100" style={{ zIndex: 1040, transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                {/* ── Top Announcement Banner ── */}
                {showTopBar && (
                    <div
                        className="py-1 px-2 px-sm-3 d-flex align-items-center justify-content-between text-white position-relative"
                        style={{
                            background: 'linear-gradient(90deg, #042f2e 0%, #0d9488 50%, #042f2e 100%)',
                            fontSize: '11.5px',
                            borderBottom: '1px solid rgba(94,234,212,0.15)',
                            letterSpacing: '0.2px',
                        }}
                    >
                        <div className="container-fluid container-lg d-flex align-items-center justify-content-between text-center px-2">
                            <div className="d-flex align-items-center gap-1.5 gap-sm-2 mx-auto mx-md-0 text-truncate">
                                <span className="badge rounded-pill bg-warning text-dark fw-bold px-1.5 py-0.5 d-none d-sm-inline-block" style={{ fontSize: '9.5px' }}>
                                    OFFER
                                </span>
                                <span className="fw-medium text-truncate">
                                    ⚡ Free Delivery over <strong className="text-warning">$50</strong> | Code: <span className="badge bg-white bg-opacity-20 text-white font-monospace px-1">STORE20</span>
                                </span>
                            </div>
                            <div className="d-none d-md-flex align-items-center gap-3">
                                <span className="text-white-50">✨ 24/7 Dedicated Support</span>
                                <button
                                    onClick={() => setShowTopBar(false)}
                                    className="btn btn-link p-0 text-white text-opacity-75 hover-text-white text-decoration-none border-0 shadow-none"
                                    style={{ fontSize: '13px', lineHeight: 1 }}
                                    title="Close banner"
                                >
                                    ✕
                                </button>
                            </div>
                            <button
                                onClick={() => setShowTopBar(false)}
                                className="btn btn-link p-0 text-white text-opacity-75 hover-text-white text-decoration-none border-0 shadow-none d-md-none ms-1"
                                style={{ fontSize: '13px', lineHeight: 1 }}
                                title="Close banner"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Main Responsive Navbar ── */}
                <nav
                    className="transition-all"
                    style={{
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        background: scrolled
                            ? 'rgba(4, 47, 46, 0.95)'
                            : 'rgba(255, 255, 255, 0.96)',
                        borderBottom: scrolled
                            ? '1px solid rgba(94, 234, 212, 0.2)'
                            : '1px solid rgba(13, 148, 136, 0.12)',
                        boxShadow: scrolled
                            ? '0 10px 30px -10px rgba(0, 0, 0, 0.35)'
                            : '0 4px 20px -2px rgba(13, 148, 136, 0.08)',
                        padding: scrolled ? '8px 0' : '12px 0',
                        transition: 'all 0.35s ease',
                    }}
                >
                    <div className="container-fluid container-lg px-3 px-sm-4 d-flex align-items-center justify-content-between">
                        {/* ── Brand Logo ── */}
                        <Link
                            to="/"
                            className="d-flex align-items-center gap-2 text-decoration-none flex-shrink-0"
                            style={{ transition: 'transform 0.2s ease' }}
                        >
                            <div
                                className="rounded-3 d-flex align-items-center justify-content-center shadow-sm"
                                style={{
                                    width: '38px',
                                    height: '38px',
                                    background: 'linear-gradient(135deg, #0d9488 0%, #042f2e 100%)',
                                    border: '1.5px solid rgba(94, 234, 212, 0.4)',
                                    fontSize: '18px',
                                }}
                            >
                                🛍️
                            </div>
                            <div className="d-flex flex-column">
                                <span
                                    className="fw-bold fs-4 lh-1 tracking-tight"
                                    style={{
                                        fontFamily: "'Inter', sans-serif",
                                        letterSpacing: '-0.5px',
                                        color: scrolled ? '#ffffff' : '#042f2e',
                                    }}
                                >
                                    My<span style={{ color: scrolled ? '#5eead4' : '#0d9488' }}>Store</span>
                                </span>
                                <span
                                    style={{
                                        fontSize: '9px',
                                        letterSpacing: '1.2px',
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

                        {/* ── Desktop Center Nav Links ── */}
                        <div
                            className="d-none d-lg-flex align-items-center gap-1 p-1 rounded-pill"
                            style={{
                                background: scrolled
                                    ? 'rgba(255, 255, 255, 0.08)'
                                    : 'rgba(13, 148, 136, 0.05)',
                                border: scrolled
                                    ? '1px solid rgba(255, 255, 255, 0.12)'
                                    : '1px solid rgba(13, 148, 136, 0.1)',
                            }}
                        >
                            {navLinks.map((l) => {
                                const active = isActive(l.to);
                                return (
                                    <Link
                                        key={l.to}
                                        to={l.to}
                                        className="position-relative px-3 py-1.5 rounded-pill text-decoration-none d-flex align-items-center gap-1.5 transition-all"
                                        style={{
                                            fontSize: '14px',
                                            fontWeight: active ? 700 : 500,
                                            color: active
                                                ? (scrolled ? '#ffffff' : '#042f2e')
                                                : (scrolled ? 'rgba(255, 255, 255, 0.75)' : '#4b5563'),
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

                        {/* ── Desktop Right Actions ── */}
                        <div className="d-none d-lg-flex align-items-center gap-2.5">
                            {/* 🛒 Cart Button */}
                            <button
                                onClick={() => setCartOpen(true)}
                                className="btn position-relative rounded-pill d-flex align-items-center gap-2 fw-semibold border-0"
                                style={{
                                    background: scrolled
                                        ? 'rgba(13, 148, 136, 0.3)'
                                        : 'rgba(13, 148, 136, 0.09)',
                                    color: scrolled ? '#5eead4' : '#0d9488',
                                    border: scrolled
                                        ? '1px solid rgba(94, 234, 212, 0.35)'
                                        : '1px solid rgba(13, 148, 136, 0.22)',
                                    padding: '7px 18px',
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

                            {/* ── User Profile Dropdown or Auth ── */}
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
                                                width: '34px',
                                                height: '34px',
                                                background: 'linear-gradient(135deg, #0d9488 0%, #042f2e 100%)',
                                                border: '1.5px solid #5eead4',
                                                fontSize: '13.5px',
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

                        {/* ── Mobile / Tablet Actions ── */}
                        <div className="d-flex d-lg-none align-items-center gap-2">
                            {/* Mobile Cart Button */}
                            <button
                                onClick={() => setCartOpen(true)}
                                className="btn position-relative rounded-pill d-flex align-items-center justify-content-center p-0 border-0"
                                style={{
                                    background: scrolled ? 'rgba(13, 148, 136, 0.3)' : 'rgba(13, 148, 136, 0.1)',
                                    color: scrolled ? '#5eead4' : '#0d9488',
                                    border: scrolled ? '1px solid rgba(94, 234, 212, 0.4)' : '1px solid rgba(13, 148, 136, 0.2)',
                                    width: '38px',
                                    height: '38px',
                                }}
                                aria-label="Open Cart"
                            >
                                <span style={{ fontSize: '18px' }}>🛒</span>
                                {totalItems > 0 && (
                                    <span
                                        className="badge rounded-pill bg-danger position-absolute top-0 start-100 translate-middle"
                                        style={{ fontSize: '9.5px', padding: '2px 5.5px' }}
                                    >
                                        {totalItems}
                                    </span>
                                )}
                            </button>

                            {/* Mobile Animated Hamburger Button */}
                            <button
                                className="btn p-0 rounded-3 border-0 d-flex flex-column justify-content-center align-items-center gap-1"
                                style={{
                                    width: '38px',
                                    height: '38px',
                                    background: scrolled ? 'rgba(255, 255, 255, 0.12)' : 'rgba(13, 148, 136, 0.08)',
                                    border: scrolled ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(13, 148, 136, 0.15)',
                                }}
                                onClick={() => setSidebarOpen(o => !o)}
                                aria-label="Toggle navigation menu"
                            >
                                <span
                                    style={{
                                        width: '18px',
                                        height: '2px',
                                        background: scrolled ? '#5eead4' : '#042f2e',
                                        borderRadius: '2px',
                                        transition: 'all 0.3s ease',
                                        transform: sidebarOpen ? 'rotate(45deg) translate(2.5px, 4px)' : 'none',
                                    }}
                                />
                                <span
                                    style={{
                                        width: '18px',
                                        height: '2px',
                                        background: scrolled ? '#5eead4' : '#042f2e',
                                        borderRadius: '2px',
                                        transition: 'all 0.3s ease',
                                        opacity: sidebarOpen ? 0 : 1,
                                    }}
                                />
                                <span
                                    style={{
                                        width: '18px',
                                        height: '2px',
                                        background: scrolled ? '#5eead4' : '#042f2e',
                                        borderRadius: '2px',
                                        transition: 'all 0.3s ease',
                                        transform: sidebarOpen ? 'rotate(-45deg) translate(2.5px, -4px)' : 'none',
                                    }}
                                />
                            </button>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Responsive Spacer */}
            <div
                style={{
                    height: showTopBar ? (scrolled ? '66px' : '78px') : (scrolled ? '48px' : '60px'),
                    transition: 'height 0.35s ease',
                }}
            />

            {/* ── Premium Mobile Sidebar Overlay ── */}
            <div
                className={`position-fixed top-0 start-0 w-100 h-100 transition-all ${sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                style={{
                    zIndex: 9998,
                    background: 'rgba(4, 47, 46, 0.72)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    transition: 'all 0.35s ease',
                }}
                onClick={() => setSidebarOpen(false)}
            />

            {/* ── Luxury Mobile Sidebar Drawer ── */}
            <div
                className="position-fixed top-0 h-100 bg-white d-flex flex-column"
                style={{
                    width: '320px',
                    maxWidth: '85vw',
                    left: sidebarOpen ? '0' : '-100%',
                    zIndex: 9999,
                    transition: 'left 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: sidebarOpen ? '10px 0 50px rgba(0, 0, 0, 0.4)' : 'none',
                }}
            >
                {/* 1. Header with Gradient & Brand */}
                <div
                    className="p-3.5 px-4 text-white d-flex align-items-center justify-content-between position-relative overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, #042f2e 0%, #0d9488 100%)',
                        borderBottom: '1px solid rgba(94, 234, 212, 0.25)',
                    }}
                >
                    <Link to="/" className="d-flex align-items-center gap-2.5 text-decoration-none" onClick={() => setSidebarOpen(false)}>
                        <div
                            className="rounded-3 d-flex align-items-center justify-content-center shadow-sm"
                            style={{
                                width: '38px',
                                height: '38px',
                                background: 'rgba(255, 255, 255, 0.18)',
                                border: '1px solid rgba(94, 234, 212, 0.4)',
                                fontSize: '19px',
                            }}
                        >
                            🛍️
                        </div>
                        <div className="d-flex flex-column">
                            <span className="fw-bold fs-4 lh-1 text-white tracking-tight">
                                My<span style={{ color: '#5eead4' }}>Store</span>
                            </span>
                            <span style={{ fontSize: '9px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#5eead4', fontWeight: 600, marginTop: '2px' }}>
                                Navigation Menu
                            </span>
                        </div>
                    </Link>

                    <button
                        className="btn btn-sm text-white rounded-circle p-0 d-flex align-items-center justify-content-center border-0 shadow-none"
                        style={{
                            width: '34px',
                            height: '34px',
                            background: 'rgba(255, 255, 255, 0.15)',
                            transition: 'background 0.2s',
                        }}
                        onClick={() => setSidebarOpen(false)}
                        aria-label="Close sidebar"
                    >
                        ✕
                    </button>
                </div>

                {/* 2. User Profile Card if logged in */}
                {isAuth && (
                    <div className="p-3 mx-3 mt-3 rounded-4 shadow-sm" style={{ background: 'linear-gradient(135deg, #f0fdfa 0%, #e6fffa 100%)', border: '1px solid #99f6e4' }}>
                        <div className="d-flex align-items-center gap-3">
                            <div
                                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold overflow-hidden shadow-sm flex-shrink-0"
                                style={{
                                    width: '44px',
                                    height: '44px',
                                    background: 'linear-gradient(135deg, #0d9488, #042f2e)',
                                    border: '2px solid #5eead4',
                                }}
                            >
                                {user?.profilePicture ? (
                                    <img src={user.profilePicture} alt="DP" className="w-100 h-100 object-fit-cover" />
                                ) : (
                                    user?.fullName?.charAt(0)?.toUpperCase() || 'U'
                                )}
                            </div>
                            <div className="min-width-0 flex-grow-1">
                                <div className="fw-bold text-dark text-truncate" style={{ fontSize: '14px' }}>
                                    {user?.fullName || 'User'}
                                </div>
                                <div className="text-muted text-truncate" style={{ fontSize: '11px' }}>
                                    {user?.email}
                                </div>
                                <div className="mt-1">
                                    <span
                                        className="badge rounded-pill fw-bold"
                                        style={{
                                            fontSize: '9.5px',
                                            background: user?.role === 'superAdmin' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #0d9488, #0f766e)',
                                            color: '#ffffff',
                                            padding: '2px 7px',
                                        }}
                                    >
                                        {user?.role === 'superAdmin' ? '👑 Super Admin' : '🛍 Member'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. Navigation Links List */}
                <div className="flex-grow-1 py-3 px-3 overflow-auto">
                    <div className="text-muted fw-bold text-uppercase px-2 mb-2 d-flex align-items-center justify-content-between" style={{ fontSize: '10.5px', letterSpacing: '1px' }}>
                        <span>Explore</span>
                        <span className="badge bg-light text-muted border rounded-pill">4 Pages</span>
                    </div>

                    <div className="d-flex flex-column gap-1.5">
                        {navLinks.map((l) => {
                            const active = isActive(l.to);
                            return (
                                <Link
                                    key={l.to}
                                    to={l.to}
                                    className="d-flex align-items-center justify-content-between px-3 py-2.5 rounded-3 text-decoration-none fw-semibold transition-all"
                                    style={{
                                        fontSize: '14.5px',
                                        background: active
                                            ? 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)'
                                            : 'transparent',
                                        color: active ? '#ffffff' : '#1f2937',
                                        boxShadow: active ? '0 4px 12px rgba(13, 148, 136, 0.3)' : 'none',
                                    }}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <div className="d-flex align-items-center gap-3">
                                        <span style={{ fontSize: '18px' }}>{l.icon}</span>
                                        <span>{l.label}</span>
                                    </div>
                                    {l.badge && (
                                        <span
                                            className="badge rounded-pill fw-bold"
                                            style={{
                                                fontSize: '9.5px',
                                                background: active ? '#ffffff' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                                                color: active ? '#0d9488' : '#ffffff',
                                            }}
                                        >
                                            {l.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* My Account Links if Authenticated */}
                    {isAuth && (
                        <>
                            <div className="text-muted fw-bold text-uppercase px-2 mt-4 mb-2" style={{ fontSize: '10.5px', letterSpacing: '1px' }}>
                                My Account
                            </div>
                            <div className="d-flex flex-column gap-1">
                                <Link
                                    to="/dashboard"
                                    className="d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none text-dark fw-semibold transition-all hover-nav-item"
                                    style={{ fontSize: '14px' }}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <span style={{ fontSize: '16px' }}>📊</span>
                                    <span>Dashboard Overview</span>
                                </Link>
                                <Link
                                    to="/dashboard/profile"
                                    className="d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none text-dark fw-semibold transition-all hover-nav-item"
                                    style={{ fontSize: '14px' }}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <span style={{ fontSize: '16px' }}>👤</span>
                                    <span>Profile Settings</span>
                                </Link>
                                <Link
                                    to="/dashboard/orders"
                                    className="d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none text-dark fw-semibold transition-all hover-nav-item"
                                    style={{ fontSize: '14px' }}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <span style={{ fontSize: '16px' }}>📋</span>
                                    <span>My Orders</span>
                                </Link>
                                {user?.role === 'superAdmin' && (
                                    <Link
                                        to="/dashboard/messages"
                                        className="d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none text-dark fw-semibold transition-all hover-nav-item"
                                        style={{ fontSize: '14px' }}
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <span style={{ fontSize: '16px' }}>💬</span>
                                        <span>Customer Messages</span>
                                    </Link>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* 4. Bottom Footer Actions (Cart CTA + Auth buttons) */}
                <div className="p-3 border-top" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
                    {/* Cart Trigger */}
                    <button
                        className="btn w-100 rounded-pill py-2.5 fw-bold mb-2.5 d-flex align-items-center justify-content-between px-3.5 border-0 shadow-sm"
                        style={{
                            background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                            color: '#ffffff',
                            boxShadow: '0 4px 14px rgba(13, 148, 136, 0.35)',
                            fontSize: '14px',
                        }}
                        onClick={() => {
                            setSidebarOpen(false);
                            setCartOpen(true);
                        }}
                    >
                        <div className="d-flex align-items-center gap-2">
                            <span>🛒</span>
                            <span>View Shopping Cart</span>
                        </div>
                        <span className="badge rounded-pill bg-warning text-dark px-2 py-0.5 fw-bold" style={{ fontSize: '10.5px' }}>
                            {totalItems} items
                        </span>
                    </button>

                    {isAuth ? (
                        <button
                            className="btn btn-outline-danger w-100 rounded-pill py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
                            style={{ fontSize: '13.5px' }}
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
                                style={{ fontSize: '13.5px' }}
                                onClick={() => setSidebarOpen(false)}
                            >
                                Log In
                            </Link>
                            <Link
                                to="/auth/register"
                                className="btn w-100 rounded-pill py-2 fw-semibold text-white shadow-sm border-0"
                                style={{ background: 'linear-gradient(135deg, #042f2e, #0d9488)', fontSize: '13.5px' }}
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

            {/* Custom Scoped CSS */}
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
                    transform: translateX(3px);
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