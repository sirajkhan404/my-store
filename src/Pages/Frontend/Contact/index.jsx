import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/Auth';
import {
    PhoneFilled,
    MailFilled,
    EnvironmentFilled,
    ClockCircleFilled,
    WhatsAppOutlined,
    FacebookFilled,
    InstagramFilled,
    GlobalOutlined,
    SendOutlined,
    MessageFilled,
    UserOutlined,
    MailOutlined,
    FormOutlined,
    MessageOutlined
} from '@ant-design/icons';

const Contact = () => {
    const { user } = useAuth();
    const [state, setState] = useState({ name: '', email: '', subject: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setState(prev => ({
                ...prev,
                name: prev.name || user.fullName || '',
                email: prev.email || user.email || ''
            }));
        }
    }, [user]);

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                ...state,
                uid: user?._id || user?.uid || ""
            };
            const apiUrl = window.api || 'http://localhost:5000';
            const { data } = await axios.post(`${apiUrl}/api/contact/send`, payload);
            window.toastify(data.message || 'Message sent successfully!', 'success');
            setState({ name: user?.fullName || '', email: user?.email || '', subject: '', message: '' });
        } catch (error) {
            console.error(error);
            window.toastify(error?.response?.data?.message || 'Failed to send message. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const socialLinks = [
        {
            icon: <WhatsAppOutlined style={{ fontSize: '18px' }} />,
            href: 'https://wa.me/923466407536',
            label: 'WhatsApp',
            hoverColor: '#25D366'
        },
        {
            icon: <FacebookFilled style={{ fontSize: '18px' }} />,
            href: 'https://www.facebook.com/profile.php?id=61587514156324',
            label: 'Facebook',
            hoverColor: '#1877F2'
        },
        {
            icon: <InstagramFilled style={{ fontSize: '18px' }} />,
            href: 'https://www.facebook.com/profile.php?id=61587514156324',
            label: 'Instagram',
            hoverColor: '#E4405F'
        },
        {
            icon: <GlobalOutlined style={{ fontSize: '18px' }} />,
            href: 'https://my-store-eta-ten.vercel.app',
            label: 'Website',
            hoverColor: '#0d9488'
        }
    ];

    return (
        <main className="d-flex flex-column flex-grow-1" style={{ fontFamily: "'Inter', sans-serif", background: '#f0fdfa' }}>

            {/* ── Hero ── */}
            <section className="text-white text-center position-relative overflow-hidden py-5 py-md-6 py-lg-7"
                style={{ background: 'linear-gradient(135deg, #042f2e 0%, #134e4a 55%, #0d9488 100%)' }}>

                {/* Background glow effects */}
                <div className="position-absolute rounded-circle pointer-event-none"
                    style={{ width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(13,148,136,0.25) 0%, transparent 70%)', top: '-120px', left: '-80px', zIndex: 0 }}></div>
                <div className="position-absolute rounded-circle pointer-event-none"
                    style={{ width: '280px', height: '280px', background: 'radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 70%)', bottom: '-60px', right: '-40px', zIndex: 0 }}></div>

                <div className="container position-relative py-4" style={{ zIndex: 1 }}>
                    <span className="badge rounded-pill px-3 py-2 mb-3 fw-bold d-inline-flex align-items-center gap-2"
                        style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', fontSize: '12px' }}>
                        <MessageFilled style={{ color: '#2dd4bf' }} /> We're here to help
                    </span>
                    <h1 className="fw-extrabold display-5 display-md-4 mb-3" style={{ letterSpacing: '-0.5px' }}>Get in Touch</h1>
                    <p className="opacity-75 mx-auto mb-0 lead fs-6 fs-md-5" style={{ maxWidth: '560px' }}>
                        Have questions about our products, orders, or anything else? Reach out to us and we'll respond within 24 hours.
                    </p>
                </div>
            </section>

            {/* ── Main Content ── */}
            <section className="container pb-5 mb-4 position-relative" style={{ marginTop: '-45px', zIndex: 10 }}>
                <div className="card bg-white border border-light-subtle rounded-4 shadow-lg overflow-hidden">
                    <div className="row g-0">

                        {/* ── Left: Info Panel ── */}
                        <div className="col-12 col-lg-5 text-white p-4 p-md-5 d-flex flex-column justify-content-between position-relative overflow-hidden"
                            style={{ background: 'linear-gradient(160deg, #042f2e 0%, #0d9488 70%, #0891b2 100%)' }}>

                            <div className="position-absolute rounded-circle pointer-event-none"
                                style={{ width: '200px', height: '200px', background: 'rgba(255,255,255,0.06)', bottom: '-60px', right: '-60px' }}></div>

                            <div className="mb-4 mb-lg-5 position-relative" style={{ zIndex: 1 }}>
                                <h3 className="fw-bold fs-4 mb-2">Contact Information</h3>
                                <p className="small opacity-75 mb-0 lh-base">
                                    Fill up the form and our team will get back to you within 24 hours.
                                </p>
                            </div>

                            <div className="d-flex flex-column gap-4 position-relative" style={{ zIndex: 1 }}>
                                <div className="d-flex align-items-start gap-3">
                                    <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0 border border-light border-opacity-25"
                                        style={{ width: '46px', height: '46px', background: 'rgba(255,255,255,0.15)', fontSize: '20px' }}>
                                        <PhoneFilled style={{ color: '#5eead4' }} />
                                    </div>
                                    <div>
                                        <h6 className="fw-bold small opacity-85 mb-1">Phone Number</h6>
                                        <a href="tel:+923466407536" className="small opacity-75 mb-0 text-white text-decoration-none d-block">+92 3466407536</a>
                                    </div>
                                </div>

                                <div className="d-flex align-items-start gap-3">
                                    <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0 border border-light border-opacity-25"
                                        style={{ width: '46px', height: '46px', background: 'rgba(255,255,255,0.15)', fontSize: '20px' }}>
                                        <MailFilled style={{ color: '#5eead4' }} />
                                    </div>
                                    <div>
                                        <h6 className="fw-bold small opacity-85 mb-1">Email Address</h6>
                                        <a href="mailto:sirajkhank819@gmail.com" className="small opacity-75 mb-0 text-white text-decoration-none d-block">sirajkhank819@gmail.com</a>
                                    </div>
                                </div>

                                <div className="d-flex align-items-start gap-3">
                                    <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0 border border-light border-opacity-25"
                                        style={{ width: '46px', height: '46px', background: 'rgba(255,255,255,0.15)', fontSize: '20px' }}>
                                        <EnvironmentFilled style={{ color: '#5eead4' }} />
                                    </div>
                                    <div>
                                        <h6 className="fw-bold small opacity-85 mb-1">Location</h6>
                                        <p className="small opacity-75 mb-0 lh-sm">CoDev, Pakistan</p>
                                    </div>
                                </div>

                                <div className="d-flex align-items-start gap-3">
                                    <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0 border border-light border-opacity-25"
                                        style={{ width: '46px', height: '46px', background: 'rgba(255,255,255,0.15)', fontSize: '20px' }}>
                                        <ClockCircleFilled style={{ color: '#5eead4' }} />
                                    </div>
                                    <div>
                                        <h6 className="fw-bold small opacity-85 mb-1">Business Hours</h6>
                                        <p className="small opacity-75 mb-0 lh-sm">Mon – Sat: 9am – 6pm<br />Sun: Closed</p>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex gap-2 mt-5 pt-4 border-top border-light border-opacity-25 position-relative" style={{ zIndex: 1 }}>
                                {socialLinks.map((item, idx) => (
                                    <a
                                        key={idx}
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={item.label}
                                        className="d-inline-flex align-items-center justify-content-center text-white text-decoration-none rounded-3 border border-light border-opacity-25 transition-all"
                                        style={{
                                            width: '42px',
                                            height: '42px',
                                            background: 'rgba(255,255,255,0.12)',
                                            transition: 'all 0.25s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-3px)';
                                            e.currentTarget.style.background = item.hoverColor;
                                            e.currentTarget.style.borderColor = item.hoverColor;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
                                        }}
                                    >
                                        {item.icon}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* ── Right: Form Panel ── */}
                        <div className="col-12 col-lg-7 p-4 p-md-5 bg-white">
                            <div className="d-flex align-items-center gap-2 mb-1">
                                <MessageFilled className="text-teal" style={{ color: '#0d9488', fontSize: '20px' }} />
                                <h3 className="fw-bold fs-4 text-dark mb-0">Send us a Message</h3>
                            </div>
                            <p className="text-muted small mb-4">We typically reply within a few hours.</p>

                            <form onSubmit={handleSubmit}>
                                <div className="row g-3 mb-3">
                                    <div className="col-12 col-md-6">
                                        <label className="form-label fw-bold text-secondary text-uppercase d-flex align-items-center gap-1" style={{ fontSize: '11px', letterSpacing: '0.8px' }}>
                                            <UserOutlined className="text-muted" /> Your Name
                                        </label>
                                        <input
                                            className="form-control rounded-3 bg-light border-light-subtle px-3 py-2 shadow-sm"
                                            type="text"
                                            name="name"
                                            placeholder="John Doe"
                                            value={state.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className="form-label fw-bold text-secondary text-uppercase d-flex align-items-center gap-1" style={{ fontSize: '11px', letterSpacing: '0.8px' }}>
                                            <MailOutlined className="text-muted" /> Email Address
                                        </label>
                                        <input
                                            className="form-control rounded-3 bg-light border-light-subtle px-3 py-2 shadow-sm"
                                            type="email"
                                            name="email"
                                            placeholder="hello@example.com"
                                            value={state.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold text-secondary text-uppercase d-flex align-items-center gap-1" style={{ fontSize: '11px', letterSpacing: '0.8px' }}>
                                        <FormOutlined className="text-muted" /> Subject
                                    </label>
                                    <input
                                        className="form-control rounded-3 bg-light border-light-subtle px-3 py-2 shadow-sm"
                                        type="text"
                                        name="subject"
                                        placeholder="How can we help you?"
                                        value={state.subject}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold text-secondary text-uppercase d-flex align-items-center gap-1" style={{ fontSize: '11px', letterSpacing: '0.8px' }}>
                                        <MessageOutlined className="text-muted" /> Message
                                    </label>
                                    <textarea
                                        className="form-control rounded-3 bg-light border-light-subtle px-3 py-2 shadow-sm"
                                        name="message"
                                        rows={5}
                                        placeholder="Write your message here..."
                                        value={state.message}
                                        onChange={handleChange}
                                        required
                                        style={{ resize: 'vertical', minHeight: '120px' }}
                                    />
                                </div>

                                <button type="submit"
                                    className="btn w-100 rounded-3 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 text-dark"
                                    style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none' }}
                                    disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <SendOutlined style={{ fontSize: '16px' }} />
                                            <span>Send Message</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
};

export default Contact;