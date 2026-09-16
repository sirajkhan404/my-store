import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
    const year = new Date().getFullYear()
    const [newsletterEmail, setNewsletterEmail] = useState('')
    const [subscribed, setSubscribed] = useState(false)

    const handleSubscribe = (e) => {
        e.preventDefault()
        if (newsletterEmail) {
            setSubscribed(true)
            if (window.toastify) {
                window.toastify('Subscribed successfully! Thank you.', 'success')
            }
            setNewsletterEmail('')
            setTimeout(() => setSubscribed(false), 5000)
        }
    }

    return (
        <footer className="text-light position-relative overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #042f2e 0%, #021a19 100%)', fontFamily: "'Inter', sans-serif" }}>

            {/* ── Top Highlights Banner ── */}
            <div className="border-bottom border-secondary border-opacity-15 py-4"
                style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                <div className="container py-2">
                    <div className="row g-4 text-center text-md-start">
                        {[
                            { icon: '🚀', title: 'Free & Fast Shipping', desc: 'On all orders nationwide' },
                            { icon: '🔒', title: '100% Secure Checkout', desc: 'Protected by SSL encryption' },
                            { icon: '🔄', title: 'Easy 30-Day Returns', desc: 'Hassle-free money back' },
                            { icon: '🎧', title: '24/7 Dedicated Support', desc: 'Always ready to help' },
                        ].map((item, idx) => (
                            <div key={idx} className="col-12 col-sm-6 col-lg-3">
                                <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-3 p-2">
                                    <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0 border border-light border-opacity-10 shadow-sm"
                                        style={{ width: '48px', height: '48px', fontSize: '22px', background: 'rgba(255, 255, 255, 0.05)' }}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-0 text-white fs-6">{item.title}</h6>
                                        <p className="text-secondary small mb-0" style={{ fontSize: '12px' }}>{item.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Main Footer Grid ── */}
            <div className="container py-5">
                <div className="row g-4 g-lg-5 pt-2">

                    {/* Column 1: Brand & About */}
                    <div className="col-12 col-md-6 col-lg-4">
                        <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none mb-3">
                            <span className="fs-3 lh-1">🛍️</span>
                            <span className="fw-extrabold fs-3 text-white tracking-tight">MyStore</span>
                        </Link>
                        <p className="text-secondary small mb-4 pe-lg-3 lh-base" style={{ fontSize: '14px' }}>
                            Your one-stop destination for high-quality products at unbeatable prices. Fast shipping, guaranteed security, and exceptional service every time.
                        </p>

                        {/* Social Buttons */}
                        <div className="d-flex gap-2">
                            {[
                                { icon: '💬', name: 'WhatsApp', href: '#whatsapp' },
                                { icon: '📘', name: 'Facebook', href: '#facebook' },
                                { icon: '📸', name: 'Instagram', href: '#instagram' },
                                { icon: '🌐', name: 'Website', href: '#website' },
                            ].map((s, idx) => (
                                <a key={idx} href={s.href} onClick={(e) => e.preventDefault()}
                                    title={s.name}
                                    className="d-inline-flex align-items-center justify-content-center text-white text-decoration-none rounded-3 border border-light border-opacity-10 transition-all"
                                    style={{ width: '42px', height: '42px', background: 'rgba(255, 255, 255, 0.05)', fontSize: '18px' }}>
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="col-6 col-md-3 col-lg-2">
                        <h6 className="text-white fw-bold mb-3 pb-2 d-inline-block" style={{ fontSize: '14px', letterSpacing: '0.8px', borderBottom: '2px solid #0d9488' }}>
                            Quick Links
                        </h6>
                        <ul className="list-unstyled m-0 d-flex flex-column gap-2.5">
                            {[
                                { to: '/', label: 'Home Page' },
                                { to: '/about', label: 'About Us' },
                                { to: '/products', label: 'All Products' },
                                { to: '/contact', label: 'Contact Us' },
                                { to: '/auth/login', label: 'Account Login' },
                            ].map((link, idx) => (
                                <li key={idx}>
                                    <Link to={link.to} className="text-secondary text-decoration-none small transition-all d-inline-block hover-white" style={{ fontSize: '14px' }}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Customer Care */}
                    <div className="col-6 col-md-3 col-lg-2">
                        <h6 className="text-white fw-bold mb-3 pb-2 d-inline-block" style={{ fontSize: '14px', letterSpacing: '0.8px', borderBottom: '2px solid #0d9488' }}>
                            Support & Contact
                        </h6>
                        <ul className="list-unstyled m-0 d-flex flex-column gap-2.5">
                            <li className="d-flex align-items-center gap-2 text-secondary small" style={{ fontSize: '13px' }}>
                                <span>📍</span> Tech City, Pakistan
                            </li>
                            <li className="d-flex align-items-center gap-2 text-secondary small" style={{ fontSize: '13px' }}>
                                <span>📞</span> +92 300 1234567
                            </li>
                            <li className="d-flex align-items-center gap-2 text-secondary small" style={{ fontSize: '13px' }}>
                                <span>✉️</span> support@mystore.com
                            </li>
                            <li className="d-flex align-items-center gap-2 text-secondary small" style={{ fontSize: '13px' }}>
                                <span>🕐</span> Mon-Sat: 9am - 6pm
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter Subscription Card */}
                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="p-4 rounded-4 border border-light border-opacity-10 shadow-lg"
                            style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)' }}>
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <span className="fs-5">💌</span>
                                <h6 className="text-white fw-bold mb-0" style={{ fontSize: '15px' }}>Subscribe Newsletter</h6>
                            </div>
                            <p className="text-secondary small mb-3 lh-sm" style={{ fontSize: '12px' }}>
                                Get early access to new product releases, weekly sales, and exclusive discounts.
                            </p>

                            {subscribed ? (
                                <div className="alert alert-success bg-success bg-opacity-25 border-success text-white small p-2 text-center rounded-3 mb-0">
                                    ✓ Subscribed! Thank you.
                                </div>
                            ) : (
                                <form onSubmit={handleSubscribe} className="d-flex flex-column gap-2">
                                    <input
                                        type="email"
                                        className="form-control bg-dark bg-opacity-50 border border-light border-opacity-15 text-white rounded-3 px-3 py-2 shadow-none small"
                                        placeholder="Enter your email address..."
                                        value={newsletterEmail}
                                        onChange={e => setNewsletterEmail(e.target.value)}
                                        required
                                        style={{ fontSize: '13px' }}
                                    />
                                    <button type="submit"
                                        className="btn rounded-3 py-2 fw-bold small text-dark shadow-sm"
                                        style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none' }}>
                                        Subscribe Now →
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* ── Bottom Bar ── */}
            <div className="py-3 border-top border-secondary border-opacity-15"
                style={{ background: 'rgba(0, 0, 0, 0.4)' }}>
                <div className="container">
                    <div className="row align-items-center g-3 text-center text-md-start">
                        <div className="col-12 col-md-6 text-secondary small" style={{ fontSize: '13px' }}>
                            © {year} <span className="text-white fw-bold">MyStore</span>. All rights reserved.
                        </div>
                        <div className="col-12 col-md-6 text-md-end">
                            <div className="d-inline-flex align-items-center gap-2">
                                <span className="badge bg-secondary bg-opacity-25 text-white border border-light border-opacity-10 px-2 py-1" style={{ fontSize: '11px' }}>💳 Cash on Delivery</span>
                                <span className="badge bg-secondary bg-opacity-25 text-white border border-light border-opacity-10 px-2 py-1" style={{ fontSize: '11px' }}>🔒 Secure SSL</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </footer>
    )
}

export default Footer