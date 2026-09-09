import React, { useState } from 'react';
import axios from 'axios';

const Contact = () => {
    const [state, setState] = useState({ name: '', email: '', subject: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const { data } = await axios.post(`${window.api || 'http://localhost:8000'}/api/contact/send`, state);
            window.toastify(data.message || 'Message sent successfully!', 'success');
            setState({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error(error);
            window.toastify(error?.response?.data?.message || 'Failed to send message. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputStyle = {
        width: '100%', padding: 'clamp(11px,1.5vw,14px) 14px',
        borderRadius: 12, border: '1.5px solid #e2e8f0',
        background: '#f8fafc', fontSize: 'clamp(13px,1.6vw,15px)',
        color: '#0f172a', transition: 'all 0.2s', boxSizing: 'border-box',
        fontFamily: 'Inter, sans-serif', outline: 'none',
    };

    return (
        <main className="flex-grow-1" style={{ backgroundColor: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

                /* ── Hero ── */
                .ct-hero {
                    background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #3b82f6 100%);
                    color: white;
                    padding: clamp(52px, 10vw, 96px) 0 clamp(48px, 9vw, 88px);
                    position: relative;
                    overflow: hidden;
                    text-align: center;
                }
                .ct-hero::before {
                    content: '';
                    position: absolute;
                    width: 400px; height: 400px;
                    background: radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%);
                    border-radius: 50%;
                    top: -120px; left: -80px;
                }
                .ct-hero::after {
                    content: '';
                    position: absolute;
                    width: 280px; height: 280px;
                    background: radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%);
                    border-radius: 50%;
                    bottom: -60px; right: -40px;
                }
                .ct-hero h1 { font-size: clamp(1.8rem, 5vw, 3rem); font-weight: 800; letter-spacing: -0.5px; }
                .ct-hero p  { font-size: clamp(13px, 2vw, 17px); }

                /* ── Main Card ── */
                .ct-card {
                    background: white;
                    border-radius: 24px;
                    box-shadow: 0 24px 60px rgba(0,0,0,0.1);
                    margin-top: -52px;
                    position: relative;
                    z-index: 10;
                    overflow: hidden;
                }

                /* ── Info Panel (left) ── */
                .ct-info {
                    background: linear-gradient(160deg, #4f46e5 0%, #3b82f6 60%, #06b6d4 100%);
                    color: white;
                    padding: clamp(28px, 5vw, 48px);
                    border-radius: 24px 0 0 24px;
                    position: relative;
                    overflow: hidden;
                    min-height: 100%;
                }
                .ct-info::before {
                    content: '';
                    position: absolute;
                    width: 200px; height: 200px;
                    background: rgba(255,255,255,0.06);
                    border-radius: 50%;
                    bottom: -60px; right: -60px;
                }
                .ct-info-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 14px;
                    margin-bottom: clamp(20px, 3vw, 32px);
                }
                .ct-info-icon {
                    width: 46px; height: 46px; flex-shrink: 0;
                    background: rgba(255,255,255,0.15);
                    border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 20px;
                    border: 1px solid rgba(255,255,255,0.2);
                }
                .ct-info h6  { font-size: 13px; font-weight: 700; margin-bottom: 4px; opacity: 0.85; }
                .ct-info p   { font-size: clamp(12px, 1.6vw, 14px); opacity: 0.75; margin: 0; line-height: 1.5; }

                /* ── Form Panel (right) ── */
                .ct-form-wrap {
                    padding: clamp(24px, 5vw, 48px);
                }
                .ct-label {
                    display: block;
                    font-size: 11px; font-weight: 700;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    margin-bottom: 7px;
                }
                .ct-input:focus {
                    border-color: #6366f1 !important;
                    background: white !important;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.15) !important;
                }
                .ct-submit {
                    width: 100%;
                    padding: clamp(12px, 1.8vw, 15px) 28px;
                    border-radius: 14px;
                    border: none;
                    background: linear-gradient(135deg, #6366f1, #3b82f6);
                    color: white;
                    font-size: clamp(14px, 1.8vw, 16px);
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 6px 20px rgba(99,102,241,0.35);
                    display: flex; align-items: center; justify-content: center; gap: 8px;
                }
                .ct-submit:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 28px rgba(99,102,241,0.45);
                }
                .ct-submit:disabled { background: #c7d2fe; cursor: not-allowed; box-shadow: none; }

                /* ── Social Badges ── */
                .ct-social a {
                    width: 40px; height: 40px;
                    border-radius: 10px;
                    background: rgba(255,255,255,0.12);
                    border: 1px solid rgba(255,255,255,0.2);
                    display: inline-flex; align-items: center; justify-content: center;
                    font-size: 18px; text-decoration: none;
                    transition: background 0.2s;
                }
                .ct-social a:hover { background: rgba(255,255,255,0.22); }

                /* ── Responsive ── */
                @media (max-width: 991px) {
                    .ct-info { border-radius: 24px 24px 0 0; }
                    .ct-card  { border-radius: 20px; margin-top: -36px; }
                }
                @media (max-width: 575px) {
                    .ct-card  { border-radius: 16px; margin-top: -24px; }
                    .ct-info  { border-radius: 16px 16px 0 0; }
                    .ct-form-wrap { padding: 20px 16px 28px; }
                }

                /* ── Spin animation for loader ── */
                @keyframes ct-spin { to { transform: rotate(360deg); } }
            `}</style>

            {/* ── Hero ── */}
            <section className="ct-hero">
                <div className="container position-relative" style={{ zIndex: 1 }}>
                    <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', color: 'white', padding: '5px 16px', borderRadius: 999, fontSize: 12, fontWeight: 700, marginBottom: 16 }}>
                        💬 We're here to help
                    </span>
                    <h1 className="mb-3">Get in Touch</h1>
                    <p className="opacity-75 mx-auto mb-0" style={{ maxWidth: 560 }}>
                        Have questions about our products, orders, or anything else? Reach out to us and we'll respond within 24 hours.
                    </p>
                </div>
            </section>

            {/* ── Main Content ── */}
            <section className="container pb-5 mb-4">
                <div className="ct-card">
                    <div className="row g-0">

                        {/* ── Left: Info Panel ── */}
                        <div className="col-lg-5">
                            <div className="ct-info">
                                <div style={{ marginBottom: 'clamp(20px,4vw,36px)' }}>
                                    <div style={{ fontSize: 'clamp(18px,3vw,24px)', fontWeight: 800, marginBottom: 8 }}>Contact Information</div>
                                    <p style={{ fontSize: 'clamp(12px,1.6vw,14px)', opacity: 0.75, margin: 0, lineHeight: 1.6 }}>
                                        Fill up the form and our team will get back to you within 24 hours.
                                    </p>
                                </div>

                                <div className="ct-info-item">
                                    <div className="ct-info-icon">📞</div>
                                    <div>
                                        <h6>Phone Number</h6>
                                        <p>+92 300 1234567</p>
                                    </div>
                                </div>
                                <div className="ct-info-item">
                                    <div className="ct-info-icon">✉️</div>
                                    <div>
                                        <h6>Email Address</h6>
                                        <p>support@mystore.com</p>
                                    </div>
                                </div>
                                <div className="ct-info-item">
                                    <div className="ct-info-icon">📍</div>
                                    <div>
                                        <h6>Location</h6>
                                        <p>123 Business Avenue,<br />Tech City, Pakistan</p>
                                    </div>
                                </div>
                                <div className="ct-info-item">
                                    <div className="ct-info-icon">🕐</div>
                                    <div>
                                        <h6>Business Hours</h6>
                                        <p>Mon – Sat: 9am – 6pm<br />Sun: Closed</p>
                                    </div>
                                </div>

                                <div className="ct-social" style={{ display: 'flex', gap: 10, marginTop: 'clamp(16px,3vw,32px)', paddingTop: 'clamp(16px,3vw,24px)', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                                    <a href="#" title="WhatsApp">📱</a>
                                    <a href="#" title="Messenger">💬</a>
                                    <a href="#" title="Website">🌐</a>
                                    <a href="#" title="Instagram">📸</a>
                                </div>
                            </div>
                        </div>

                        {/* ── Right: Form Panel ── */}
                        <div className="col-lg-7">
                            <div className="ct-form-wrap">
                                <div style={{ fontSize: 'clamp(18px,3vw,24px)', fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Send us a Message</div>
                                <p style={{ fontSize: 'clamp(12px,1.6vw,14px)', color: '#94a3b8', marginBottom: 'clamp(20px,4vw,32px)' }}>
                                    We typically reply within a few hours.
                                </p>

                                <form onSubmit={handleSubmit}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(12px,2vw,20px)', marginBottom: 'clamp(12px,2vw,20px)' }}>

                                        {/* Name */}
                                        <div>
                                            <label className="ct-label">Your Name</label>
                                            <input className="ct-input" type="text" name="name"
                                                placeholder="John Doe" value={state.name}
                                                onChange={handleChange} required
                                                style={inputStyle} />
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="ct-label">Email Address</label>
                                            <input className="ct-input" type="email" name="email"
                                                placeholder="hello@example.com" value={state.email}
                                                onChange={handleChange} required
                                                style={inputStyle} />
                                        </div>

                                        {/* Subject — full width */}
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <label className="ct-label">Subject</label>
                                            <input className="ct-input" type="text" name="subject"
                                                placeholder="How can we help you?" value={state.subject}
                                                onChange={handleChange} required
                                                style={inputStyle} />
                                        </div>

                                        {/* Message — full width */}
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <label className="ct-label">Message</label>
                                            <textarea className="ct-input" name="message" rows={5}
                                                placeholder="Write your message here..." value={state.message}
                                                onChange={handleChange} required
                                                style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }} />
                                        </div>
                                    </div>

                                    <button type="submit" className="ct-submit" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <span style={{ width: 18, height: 18, border: '2.5px solid rgba(255,255,255,0.35)', borderTop: '2.5px solid white', borderRadius: '50%', animation: 'ct-spin 0.8s linear infinite', display: 'inline-block' }} />
                                                Sending...
                                            </>
                                        ) : 'Send Message 🚀'}
                                    </button>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
};

export default Contact;
