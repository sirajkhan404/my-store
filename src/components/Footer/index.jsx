import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
    const year = new Date().getFullYear()

    return (
        <footer className="footer-area">
            {/* Custom Styles for Footer */}
            <style>{`
                .footer-area {
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    color: #94a3b8;
                    padding-top: 80px;
                    font-size: 15px;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }
                .footer-brand {
                    font-size: 28px;
                    font-weight: 800;
                    color: #ffffff;
                    text-decoration: none;
                    margin-bottom: 20px;
                    display: inline-block;
                    letter-spacing: -0.5px;
                }
                .footer-heading {
                    color: #ffffff;
                    font-size: 18px;
                    font-weight: 700;
                    margin-bottom: 24px;
                    position: relative;
                    padding-bottom: 12px;
                }
                .footer-heading::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    width: 40px;
                    height: 3px;
                    background: #3b82f6;
                    border-radius: 2px;
                }
                .footer-links {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                .footer-links li {
                    margin-bottom: 12px;
                }
                .footer-links a {
                    color: #94a3b8;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                }
                .footer-links a::before {
                    content: '→';
                    margin-right: 8px;
                    font-size: 12px;
                    color: #3b82f6;
                    opacity: 0;
                    transform: translateX(-10px);
                    transition: all 0.3s ease;
                }
                .footer-links a:hover {
                    color: #ffffff;
                    transform: translateX(5px);
                }
                .footer-links a:hover::before {
                    opacity: 1;
                    transform: translateX(0);
                }
                .contact-item {
                    display: flex;
                    align-items: flex-start;
                    margin-bottom: 16px;
                }
                .contact-icon {
                    color: #3b82f6;
                    margin-right: 12px;
                    font-size: 20px;
                    line-height: 1;
                    margin-top: 2px;
                }
                .social-icons {
                    display: flex;
                    gap: 12px;
                    margin-top: 24px;
                }
                .social-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.05);
                    color: #ffffff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .social-btn:hover {
                    background: #3b82f6;
                    border-color: #3b82f6;
                    transform: translateY(-3px);
                }
                .footer-bottom {
                    background: rgba(0, 0, 0, 0.2);
                    padding: 24px 0;
                    margin-top: 60px;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                }
                .newsletter-input {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: white;
                    padding: 12px 20px;
                    border-radius: 12px;
                }
                .newsletter-input:focus {
                    background: rgba(255,255,255,0.1);
                    border-color: #3b82f6;
                    color: white;
                    box-shadow: none;
                }
            `}</style>

            <div className="container">
                <div className="row g-5">

                    {/* Brand & About */}
                    <div className="col-lg-4 col-md-6">
                        <Link to="/" className="footer-brand">
                            <span className="text-primary">My</span>Store
                        </Link>
                        <p className="mb-4 pe-lg-4">
                            We are dedicated to providing the best online shopping experience. Premium quality products, fast delivery, and exceptional customer support right at your fingertips.
                        </p>
                        <div className="social-icons">
                            <a href="#" className="social-btn">📱</a>
                            <a href="#" className="social-btn">📘</a>
                            <a href="#" className="social-btn">📸</a>
                            <a href="#" className="social-btn">🐦</a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-lg-2 col-md-6">
                        <h4 className="footer-heading">Quick Links</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/products">Shop Products</Link></li>
                            <li><Link to="/auth/login">Login</Link></li>
                            <li><Link to="/auth/register">Sign Up</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="col-lg-3 col-md-6">
                        <h4 className="footer-heading">Contact Us</h4>
                        <div className="contact-item">
                            <span className="contact-icon">📍</span>
                            <span>123 Store Street, Main Boulevard,<br />City Name, Country</span>
                        </div>
                        <div className="contact-item">
                            <span className="contact-icon">📞</span>
                            <span>+92 3466407536<br />+92 3466407536</span>
                        </div>
                        <div className="contact-item">
                            <span className="contact-icon">✉️</span>
                            <span>sirajkhank819@gmail.com<br />siraj07536@gmail.com</span>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className="col-lg-3 col-md-6">
                        <h4 className="footer-heading">Newsletter</h4>
                        <p className="mb-4">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
                        <form className="d-flex flex-column gap-3" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                className="form-control newsletter-input"
                                placeholder="Enter your email"
                                required
                            />
                            <button className="btn btn-primary rounded-3 py-2 fw-semibold w-100">
                                Subscribe Now
                            </button>
                        </form>
                    </div>

                </div>
            </div>

            {/* Copyright Bottom */}
            <div className="footer-bottom mt-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                            &copy; {year} <span className="text-white fw-semibold">MyStore</span>. All Rights Reserved.
                        </div>
                        <div className="col-md-6 text-center text-md-end">
                            <span className="small">
                                Made with ❤️ by <a href="#" className="text-primary text-decoration-none fw-semibold">CoDev</a>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer