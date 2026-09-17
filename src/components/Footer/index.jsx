import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    ShoppingFilled,
    RocketFilled,
    SafetyCertificateFilled,
    SyncOutlined,
    CustomerServiceFilled,
    WhatsAppOutlined,
    FacebookFilled,
    InstagramFilled,
    GlobalOutlined,
    EnvironmentFilled,
    PhoneFilled,
    MailFilled,
    ClockCircleFilled,
    SendOutlined,
    RightOutlined,
    LockFilled,
    CreditCardFilled,
    CheckCircleFilled
} from '@ant-design/icons'

const Footer = () => {
    const year = new Date().getFullYear()
    const [newsletterEmail, setNewsletterEmail] = useState('')
    const [subscribed, setSubscribed] = useState(false)

    const handleSubscribe = (e) => {
        e.preventDefault()
        if (newsletterEmail) {
            setSubscribed(true)
            if (window.toastify) {
                window.toastify('Subscribed to MyStore newsletter successfully! 🎉', 'success')
            }
            setNewsletterEmail('')
            setTimeout(() => setSubscribed(false), 5000)
        }
    }

    return (
        <footer
            className="text-light position-relative overflow-hidden"
            style={{
                background: 'linear-gradient(180deg, #042f2e 0%, #032221 50%, #021a19 100%)',
                fontFamily: "'Inter', sans-serif",
                borderTop: '1px solid rgba(255, 255, 255, 0.08)'
            }}
        >
            {/* ── Top Highlights Banner ── */}
            <div
                className="border-bottom border-secondary border-opacity-15 py-4"
                style={{ background: 'rgba(255, 255, 255, 0.02)' }}
            >
                <div className="container py-2">
                    <div className="row g-4 text-center text-md-start">
                        {[
                            {
                                icon: <RocketFilled style={{ color: '#5eead4', fontSize: '22px' }} />,
                                title: 'Free & Fast Shipping',
                                desc: 'On all orders nationwide'
                            },
                            {
                                icon: <SafetyCertificateFilled style={{ color: '#38bdf8', fontSize: '22px' }} />,
                                title: '100% Secure Checkout',
                                desc: 'Protected by SSL encryption'
                            },
                            {
                                icon: <SyncOutlined style={{ color: '#fbbf24', fontSize: '20px' }} />,
                                title: 'Easy 30-Day Returns',
                                desc: 'Hassle-free money back'
                            },
                            {
                                icon: <CustomerServiceFilled style={{ color: '#34d399', fontSize: '22px' }} />,
                                title: '24/7 Dedicated Support',
                                desc: 'Always ready to assist you'
                            },
                        ].map((item, idx) => (
                            <div key={idx} className="col-12 col-sm-6 col-lg-3">
                                <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-3 p-2">
                                    <div
                                        className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0 border border-light border-opacity-10 shadow-sm"
                                        style={{
                                            width: '48px',
                                            height: '48px',
                                            background: 'rgba(255, 255, 255, 0.06)',
                                            backdropFilter: 'blur(6px)'
                                        }}
                                    >
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
                            <div
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#ffffff',
                                    fontSize: '20px',
                                    boxShadow: '0 4px 12px rgba(13, 148, 136, 0.4)'
                                }}
                            >
                                <ShoppingFilled />
                            </div>
                            <span className="fw-extrabold fs-3 text-white tracking-tight">
                                MyStore<span style={{ color: '#5eead4' }}>.</span>
                            </span>
                        </Link>
                        <p className="text-secondary small mb-4 pe-lg-3 lh-base" style={{ fontSize: '14px', color: '#94a3b8' }}>
                            Your one-stop destination for high-quality products at unbeatable prices. Fast shipping, guaranteed security, and exceptional service every time.
                        </p>

                        {/* Social Buttons */}
                        <div className="d-flex gap-2">
                            {[
                                {
                                    icon: <WhatsAppOutlined />,
                                    name: 'WhatsApp',
                                    href: 'https://wa.me/923466407536',
                                    hoverBg: '#25D366'
                                },
                                {
                                    icon: <FacebookFilled />,
                                    name: 'Facebook',
                                    href: 'https://www.facebook.com/profile.php?id=61587514156324',
                                    hoverBg: '#1877F2'
                                },
                                {
                                    icon: <InstagramFilled />,
                                    name: 'Instagram',
                                    href: 'https://www.facebook.com/profile.php?id=61587514156324',
                                    hoverBg: '#E4405F'
                                },
                                {
                                    icon: <GlobalOutlined />,
                                    name: 'Website',
                                    href: 'https://my-store-eta-ten.vercel.app',
                                    hoverBg: '#0d9488'
                                },
                            ].map((s, idx) => (
                                <a
                                    key={idx}
                                    href={s.href}
                                    target={s.href.startsWith('http') ? '_blank' : '_self'}
                                    rel="noreferrer"
                                    onClick={s.href === '#facebook' || s.href === '#instagram' || s.href === '#website' ? (e) => e.preventDefault() : undefined}
                                    title={s.name}
                                    className="d-inline-flex align-items-center justify-content-center text-white text-decoration-none rounded-3 border border-light border-opacity-10"
                                    style={{
                                        width: '42px',
                                        height: '42px',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        fontSize: '19px',
                                        transition: 'all 0.25s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = s.hoverBg
                                        e.currentTarget.style.transform = 'translateY(-3px)'
                                        e.currentTarget.style.boxShadow = `0 6px 15px ${s.hoverBg}40`
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                                        e.currentTarget.style.transform = 'translateY(0)'
                                        e.currentTarget.style.boxShadow = 'none'
                                    }}
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="col-6 col-md-3 col-lg-2">
                        <h6
                            className="text-white fw-bold mb-3 pb-2 d-inline-block"
                            style={{ fontSize: '14px', letterSpacing: '0.8px', borderBottom: '2px solid #0d9488' }}
                        >
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
                                    <Link
                                        to={link.to}
                                        className="text-decoration-none small d-inline-flex align-items-center gap-1.5"
                                        style={{ fontSize: '14px', color: '#94a3b8', transition: 'all 0.2s ease' }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = '#5eead4'
                                            e.currentTarget.style.transform = 'translateX(4px)'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = '#94a3b8'
                                            e.currentTarget.style.transform = 'translateX(0)'
                                        }}
                                    >
                                        <RightOutlined style={{ fontSize: '10px', color: '#0d9488' }} />
                                        <span>{link.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Customer Care & Contact Info */}
                    <div className="col-6 col-md-3 col-lg-2">
                        <h6
                            className="text-white fw-bold mb-3 pb-2 d-inline-block"
                            style={{ fontSize: '14px', letterSpacing: '0.8px', borderBottom: '2px solid #0d9488' }}
                        >
                            Support & Contact
                        </h6>
                        <ul className="list-unstyled m-0 d-flex flex-column gap-3">
                            <li className="d-flex align-items-center gap-2 small" style={{ fontSize: '13px', color: '#cbd5e1' }}>
                                <EnvironmentFilled style={{ color: '#5eead4', fontSize: '15px' }} />
                                <span>Tech City, Pakistan</span>
                            </li>
                            <li className="d-flex align-items-center gap-2 small" style={{ fontSize: '13px', color: '#cbd5e1' }}>
                                <PhoneFilled style={{ color: '#38bdf8', fontSize: '14px' }} />
                                <span>+92 3466407536</span>
                            </li>
                            <li className="d-flex align-items-center gap-2 small" style={{ fontSize: '13px', color: '#cbd5e1' }}>
                                <MailFilled style={{ color: '#fbbf24', fontSize: '14px' }} />
                                <span style={{ wordBreak: 'break-all' }}>sirajkhank819@gmail.com</span>
                            </li>
                            <li className="d-flex align-items-center gap-2 small" style={{ fontSize: '13px', color: '#cbd5e1' }}>
                                <ClockCircleFilled style={{ color: '#34d399', fontSize: '14px' }} />
                                <span>Mon-Sat: 9am - 6pm</span>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter Subscription Card */}
                    <div className="col-12 col-md-6 col-lg-4">
                        <div
                            className="p-4 rounded-4 border border-light border-opacity-10 shadow-lg"
                            style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)' }}
                        >
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <div
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '8px',
                                        background: 'rgba(13, 148, 136, 0.25)',
                                        color: '#5eead4',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '15px'
                                    }}
                                >
                                    <MailFilled />
                                </div>
                                <h6 className="text-white fw-bold mb-0" style={{ fontSize: '15px' }}>Subscribe Newsletter</h6>
                            </div>
                            <p className="text-secondary small mb-3 lh-sm" style={{ fontSize: '12px', color: '#94a3b8' }}>
                                Get early access to new product releases, weekly sales, and exclusive discounts.
                            </p>

                            {subscribed ? (
                                <div
                                    className="d-flex align-items-center justify-content-center gap-2 small p-2.5 text-center rounded-3 mb-0"
                                    style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(52, 211, 153, 0.3)', color: '#34d399' }}
                                >
                                    <CheckCircleFilled />
                                    <span>Subscribed! Thank you.</span>
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
                                    <button
                                        type="submit"
                                        className="btn rounded-3 py-2 fw-bold small text-white shadow-sm d-flex align-items-center justify-content-center gap-2"
                                        style={{
                                            background: 'linear-gradient(135deg, #0d9488, #0f766e)',
                                            border: 'none',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.opacity = '0.9'
                                            e.currentTarget.style.transform = 'translateY(-1px)'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.opacity = '1'
                                            e.currentTarget.style.transform = 'translateY(0)'
                                        }}
                                    >
                                        <span>Subscribe Now</span>
                                        <SendOutlined />
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* ── Bottom Bar ── */}
            <div
                className="py-3 border-top border-secondary border-opacity-15"
                style={{ background: 'rgba(0, 0, 0, 0.35)' }}
            >
                <div className="container">
                    <div className="row align-items-center g-3 text-center text-md-start">
                        <div className="col-12 col-md-6 text-secondary small" style={{ fontSize: '13px', color: '#94a3b8' }}>
                            © {year} <span className="text-white fw-bold">MyStore</span>. All rights reserved.
                        </div>
                        <div className="col-12 col-md-6 text-md-end">
                            <div className="d-inline-flex align-items-center gap-2 flex-wrap justify-content-center justify-content-md-end">
                                <span
                                    className="badge d-inline-flex align-items-center gap-1.5 text-white px-2.5 py-1.5"
                                    style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '11px' }}
                                >
                                    <CreditCardFilled style={{ color: '#38bdf8' }} />
                                    <span>Cash on Delivery</span>
                                </span>
                                <span
                                    className="badge d-inline-flex align-items-center gap-1.5 text-white px-2.5 py-1.5"
                                    style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '11px' }}
                                >
                                    <LockFilled style={{ color: '#34d399' }} />
                                    <span>Secure SSL 256-Bit</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </footer>
    )
}

export default Footer