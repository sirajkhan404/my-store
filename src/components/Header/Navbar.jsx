import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/Auth';

const Navbar = () => {
    const { isAuth, handleLogout, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // Add scroll effect for transparent to solid navbar
    const [scrolled, setScrolled] = useState(false);
    
    // Search state
    const [searchInput, setSearchInput] = useState('');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchInput.trim())}`);
            setSearchInput('');
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => {
        return location.pathname === path ? 'active fw-bold text-primary' : '';
    };

    return (
        <>
            <style>{`
                .premium-navbar {
                    transition: all 0.3s ease-in-out;
                    background-color: ${scrolled ? 'rgba(255, 255, 255, 0.95)' : 'white'};
                    backdrop-filter: ${scrolled ? 'blur(10px)' : 'none'};
                    box-shadow: ${scrolled ? '0 4px 20px rgba(0, 0, 0, 0.05)' : 'none'};
                    border-bottom: ${scrolled ? 'none' : '1px solid #f1f5f9'};
                    padding: ${scrolled ? '0.8rem 0' : '1.2rem 0'};
                }
                .nav-link-custom {
                    color: #475569;
                    font-weight: 500;
                    position: relative;
                    padding: 0.5rem 1rem;
                    transition: color 0.2s;
                }
                .nav-link-custom:hover {
                    color: #3b82f6;
                }
                .nav-link-custom::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    width: 0;
                    height: 2px;
                    background: #3b82f6;
                    transition: all 0.3s ease;
                    transform: translateX(-50%);
                }
                .nav-link-custom:hover::after,
                .nav-link-custom.active::after {
                    width: 80%;
                }
                .brand-logo {
                    font-weight: 800;
                    font-size: 1.5rem;
                    background: linear-gradient(135deg, #0f172a 0%, #3b82f6 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    letter-spacing: -0.5px;
                }
                .btn-login {
                    border: 2px solid #e2e8f0;
                    color: #475569;
                    font-weight: 600;
                    transition: all 0.2s;
                }
                .btn-login:hover {
                    border-color: #cbd5e1;
                    background: #f8fafc;
                    color: #0f172a;
                }
                .btn-signup {
                    background: #3b82f6;
                    color: white;
                    font-weight: 600;
                    border: none;
                    box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
                    transition: all 0.2s;
                }
                .btn-signup:hover {
                    background: #2563eb;
                    color: white;
                    transform: translateY(-1px);
                    box-shadow: 0 6px 15px rgba(59, 130, 246, 0.4);
                }
                .user-avatar {
                    width: 38px;
                    height: 38px;
                    background: #3b82f6;
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    cursor: pointer;
                }
            `}</style>

            <nav className={`navbar navbar-expand-lg fixed-top premium-navbar`}>
                <div className="container">

                    {/* Brand Logo */}
                    <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
                        <span className="fs-3" style={{ lineHeight: 1 }}>🛍️</span>
                        <span className="brand-logo">MyStore</span>
                    </Link>

                    {/* Mobile Toggle Button */}
                    <button
                        className="navbar-toggler border-0 shadow-none"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#mainNavbar"
                        aria-controls="mainNavbar"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Navbar Links & Actions */}
                    <div className="collapse navbar-collapse" id="mainNavbar">

                        {/* Center Links & Search */}
                        <div className="mx-auto d-flex flex-column flex-lg-row align-items-center gap-3 mt-3 mt-lg-0">
                            <ul className="navbar-nav mb-2 mb-lg-0 gap-1 gap-lg-3 text-center">
                                <li className="nav-item">
                                    <Link to="/" className={`nav-link nav-link-custom ${isActive('/')}`}>Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/about" className={`nav-link nav-link-custom ${isActive('/about')}`}>About Us</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/products" className={`nav-link nav-link-custom ${isActive('/products')}`}>Products</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/contact" className={`nav-link nav-link-custom ${isActive('/contact')}`}>Contact Us</Link>
                                </li>
                            </ul>

                            <form className="d-flex position-relative" onSubmit={handleSearchSubmit}>
                                <input 
                                    type="text" 
                                    className="form-control rounded-pill pe-5" 
                                    placeholder="Search products..." 
                                    style={{ width: '220px', background: '#f8fafc', border: '1px solid #e2e8f0' }}
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                />
                                <button 
                                    type="submit" 
                                    className="btn position-absolute end-0 top-50 translate-middle-y border-0 text-muted hover-primary"
                                    style={{ background: 'transparent' }}
                                >
                                    🔍
                                </button>
                            </form>
                        </div>

                        {/* Right Side Actions */}
                        <div className="d-flex flex-column flex-lg-row align-items-center gap-3 mt-3 mt-lg-0 pb-3 pb-lg-0 pt-3 pt-lg-0">
                            {isAuth ? (
                                <div className="d-flex align-items-center gap-3 w-100 justify-content-center justify-content-lg-end">
                                    <Link to="/dashboard" className="btn btn-primary btn-sm rounded-pill px-3 fw-semibold shadow-sm d-none d-lg-block">
                                        Dashboard
                                    </Link>
                                    <div className="text-decoration-none d-flex align-items-center gap-2">
                                        <div className="text-end d-none d-lg-block">
                                            <div className="fw-semibold text-dark small lh-1">{user?.fullName || 'User'}</div>
                                        </div>
                                        <div className="user-avatar shadow-sm" style={{ overflow: 'hidden' }}>
                                            {user?.profilePicture ? (
                                                <img src={user.profilePicture} alt="DP" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                user?.fullName?.charAt(0)?.toUpperCase() || 'U'
                                            )}
                                        </div>
                                    </div>
                                    <button className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-semibold" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="d-flex gap-2 w-100 justify-content-center justify-content-lg-end">
                                    <Link to="/auth/login" className="btn btn-login rounded-pill px-4">
                                        Log In
                                    </Link>
                                    <Link to="/auth/register" className="btn btn-signup rounded-pill px-4">
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Spacer for fixed navbar */}
            <div style={{ height: scrolled ? '76px' : '90px', transition: 'height 0.3s ease' }}></div>
        </>
    );
}

export default Navbar;