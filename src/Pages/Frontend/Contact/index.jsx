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

    return (
        <main className="d-flex flex-column flex-grow-1 bg-light" style={{ fontFamily: "'Inter', sans-serif" }}>

            {/* ── Hero ── */}
            <section className="text-white text-center position-relative overflow-hidden py-5 py-md-6 py-lg-7"
                style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #3b82f6 100%)' }}>

                {/* Background glow effects */}
                <div className="position-absolute rounded-circle pointer-event-none"
                    style={{ width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', top: '-120px', left: '-80px', zIndex: 0 }}></div>
                <div className="position-absolute rounded-circle pointer-event-none"
                    style={{ width: '280px', height: '280px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', bottom: '-60px', right: '-40px', zIndex: 0 }}></div>

                <div className="container position-relative py-4" style={{ zIndex: 1 }}>
                    <span className="badge rounded-pill px-3 py-2 mb-3 fw-bold"
                        style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', fontSize: '12px' }}>
                        💬 We're here to help
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
                            style={{ background: 'linear-gradient(160deg, #4f46e5 0%, #3b82f6 60%, #06b6d4 100%)' }}>

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
                                        📞
                                    </div>
                                    <div>
                                        <h6 className="fw-bold small opacity-85 mb-1">Phone Number</h6>
                                        <p className="small opacity-75 mb-0">+92 300 1234567</p>
                                    </div>
                                </div>

                                <div className="d-flex align-items-start gap-3">
                                    <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0 border border-light border-opacity-25"
                                        style={{ width: '46px', height: '46px', background: 'rgba(255,255,255,0.15)', fontSize: '20px' }}>
                                        ✉️
                                    </div>
                                    <div>
                                        <h6 className="fw-bold small opacity-85 mb-1">Email Address</h6>
                                        <p className="small opacity-75 mb-0">support@mystore.com</p>
                                    </div>
                                </div>

                                <div className="d-flex align-items-start gap-3">
                                    <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0 border border-light border-opacity-25"
                                        style={{ width: '46px', height: '46px', background: 'rgba(255,255,255,0.15)', fontSize: '20px' }}>
                                        📍
                                    </div>
                                    <div>
                                        <h6 className="fw-bold small opacity-85 mb-1">Location</h6>
                                        <p className="small opacity-75 mb-0 lh-sm">123 Business Avenue,<br />Tech City, Pakistan</p>
                                    </div>
                                </div>

                                <div className="d-flex align-items-start gap-3">
                                    <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0 border border-light border-opacity-25"
                                        style={{ width: '46px', height: '46px', background: 'rgba(255,255,255,0.15)', fontSize: '20px' }}>
                                        🕐
                                    </div>
                                    <div>
                                        <h6 className="fw-bold small opacity-85 mb-1">Business Hours</h6>
                                        <p className="small opacity-75 mb-0 lh-sm">Mon – Sat: 9am – 6pm<br />Sun: Closed</p>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex gap-2 mt-5 pt-4 border-top border-light border-opacity-25 position-relative" style={{ zIndex: 1 }}>
                                {['📱', '💬', '🌐', '📸'].map((icon, idx) => (
                                    <a key={idx} href="#link" onClick={(e) => e.preventDefault()}
                                        className="d-inline-flex align-items-center justify-content-center text-white text-decoration-none rounded-3 border border-light border-opacity-25 transition-all"
                                        style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.12)', fontSize: '18px' }}>
                                        {icon}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* ── Right: Form Panel ── */}
                        <div className="col-12 col-lg-7 p-4 p-md-5 bg-white">
                            <h3 className="fw-bold fs-4 text-dark mb-1">Send us a Message</h3>
                            <p className="text-muted small mb-4">We typically reply within a few hours.</p>

                            <form onSubmit={handleSubmit}>
                                <div className="row g-3 mb-3">
                                    <div className="col-12 col-md-6">
                                        <label className="form-label fw-bold text-secondary text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.8px' }}>Your Name</label>
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
                                        <label className="form-label fw-bold text-secondary text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.8px' }}>Email Address</label>
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
                                    <label className="form-label fw-bold text-secondary text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.8px' }}>Subject</label>
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
                                    <label className="form-label fw-bold text-secondary text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.8px' }}>Message</label>
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
                                    className="btn btn-primary w-100 rounded-3 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                                    style={{ background: 'linear-gradient(135deg, #6366f1, #3b82f6)', border: 'none' }}
                                    disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                            <span>Sending...</span>
                                        </>
                                    ) : 'Send Message 🚀'}
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