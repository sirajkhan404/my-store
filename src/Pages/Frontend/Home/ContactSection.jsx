import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/Auth';
import {
    MailOutlined,
    UserOutlined,
    MessageOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    SendOutlined,
    CheckCircleFilled
} from '@ant-design/icons';

const ContactSection = () => {
    const { user } = useAuth();
    const [state, setState] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sentSuccess, setSentSuccess] = useState(false);

    // Auto fill user details if logged in
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
        const { name, email, message } = state;

        if (!name.trim() || !email.trim() || !message.trim()) {
            return window.toastify("Please fill in all fields before sending", "warning");
        }

        setIsSubmitting(true);
        try {
            const payload = {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                subject: "Question from Website Home",
                message: message.trim(),
                uid: user?._id || user?.uid || ""
            };

            const apiUrl = window.api || "http://localhost:5000";
            const { data } = await axios.post(`${apiUrl}/api/contact/send`, payload);

            window.toastify(data.message || "Your question has been received! We'll reply soon.", "success");
            setSentSuccess(true);
            setState({ name: user?.fullName || '', email: user?.email || '', message: '' });

            setTimeout(() => setSentSuccess(false), 5000);
        } catch (error) {
            console.error("Error sending message:", error);
            window.toastify(error?.response?.data?.message || "Failed to send message. Please try again.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="py-5 position-relative overflow-hidden" style={{ background: '#f0fdfa' }}>
            {/* Ambient background glow */}
            <div
                style={{
                    position: 'absolute',
                    top: '-60px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '600px',
                    height: '250px',
                    background: 'radial-gradient(ellipse, rgba(13, 148, 136, 0.12) 0%, transparent 70%)',
                    pointerEvents: 'none'
                }}
            />

            <div className="container py-4 position-relative" style={{ zIndex: 1 }}>
                <div className="text-center mb-5">
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: '#ccfbf1',
                            color: '#0f766e',
                            padding: '6px 16px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 700,
                            marginBottom: '12px'
                        }}
                    >
                        <MessageOutlined /> 24/7 Fast Customer Support
                    </div>
                    <h2 className="fw-bold mb-2 text-dark" style={{ letterSpacing: '-0.5px' }}>Have a Question?</h2>
                    <p className="text-muted mx-auto" style={{ maxWidth: '480px', fontSize: '15px' }}>
                        Need help with orders, products, or custom requests? Drop us a line and our support team will respond quickly.
                    </p>
                </div>

                <div className="card mx-auto border-0 shadow-lg rounded-4 overflow-hidden" style={{ maxWidth: '940px' }}>
                    <div className="row g-0">
                        {/* Info Side (Visible on medium screens and up) */}
                        <div
                            className="col-12 col-md-5 d-none d-md-flex flex-column justify-content-between text-white p-4 p-lg-5"
                            style={{
                                background: 'linear-gradient(150deg, #042f2e 0%, #064e3b 60%, #0d9488 100%)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '-40px',
                                    right: '-40px',
                                    width: '180px',
                                    height: '180px',
                                    borderRadius: '50%',
                                    background: 'radial-gradient(circle, rgba(94, 234, 212, 0.2) 0%, transparent 70%)',
                                    pointerEvents: 'none'
                                }}
                            />

                            <div>
                                <h4 className="fw-bold mb-3 text-white" style={{ fontSize: '20px' }}>Contact Information</h4>
                                <p className="small text-white-50 mb-4 lh-base">
                                    Our admin team reviews questions directly in the live dashboard.
                                </p>

                                <div className="d-flex flex-column gap-3">
                                    <div className="d-flex align-items-center gap-3">
                                        <div
                                            className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                                            style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', color: '#5eead4', fontSize: '17px' }}
                                        >
                                            <EnvironmentOutlined />
                                        </div>
                                        <div>
                                            <div className="fw-bold text-white small">Location</div>
                                            <div className="small text-white-50">CoDev, pakistan</div>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center gap-3">
                                        <div
                                            className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                                            style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', color: '#5eead4', fontSize: '17px' }}
                                        >
                                            <PhoneOutlined />
                                        </div>
                                        <div>
                                            <div className="fw-bold text-white small">Phone Support</div>
                                            <div className="small text-white-50">+92 3466407536</div>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center gap-3">
                                        <div
                                            className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                                            style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', color: '#5eead4', fontSize: '17px' }}
                                        >
                                            <MailOutlined />
                                        </div>
                                        <div>
                                            <div className="fw-bold text-white small">Email Inbox</div>
                                            <div className="small text-white-50">sirajkhank819@gmail.com</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-top border-white border-opacity-10 small text-white-50 d-flex align-items-center gap-2">
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                                Support Team Online & Active
                            </div>
                        </div>

                        {/* Form Side */}
                        <div className="col-12 col-md-7 p-4 p-lg-5 bg-white d-flex flex-column justify-content-center">
                            <h4 className="fw-bold mb-1 text-dark" style={{ fontSize: '20px' }}>Send a Message</h4>
                            <p className="text-muted small mb-4">We reply as soon as possible on your dashboard/email.</p>

                            {sentSuccess && (
                                <div className="alert alert-success d-flex align-items-center gap-2 p-3 mb-4 rounded-3 border-0" style={{ background: '#f0fdf4', color: '#166534' }}>
                                    <CheckCircleFilled style={{ color: '#10b981', fontSize: '18px' }} />
                                    <span className="small fw-semibold">Thank you! Your question has been delivered to the admin dashboard.</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold text-secondary text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.6px' }}>
                                        Full Name
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }}>
                                            <UserOutlined />
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control rounded-3 bg-light border-light-subtle py-2 shadow-none"
                                            placeholder="John Doe"
                                            name="name"
                                            value={state.name}
                                            onChange={handleChange}
                                            required
                                            style={{ paddingLeft: '38px', fontSize: '14px' }}
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold text-secondary text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.6px' }}>
                                        Email Address
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }}>
                                            <MailOutlined />
                                        </span>
                                        <input
                                            type="email"
                                            className="form-control rounded-3 bg-light border-light-subtle py-2 shadow-none"
                                            placeholder="hello@example.com"
                                            name="email"
                                            value={state.email}
                                            onChange={handleChange}
                                            required
                                            style={{ paddingLeft: '38px', fontSize: '14px' }}
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold text-secondary text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.6px' }}>
                                        Your Question / Message
                                    </label>
                                    <textarea
                                        className="form-control rounded-3 bg-light border-light-subtle p-3 shadow-none"
                                        rows={4}
                                        placeholder="How can we help you today? Ask about products, orders or support..."
                                        name="message"
                                        value={state.message}
                                        onChange={handleChange}
                                        required
                                        style={{ resize: 'vertical', minHeight: '100px', fontSize: '14px' }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn w-100 rounded-3 py-3 fw-bold text-white shadow-sm d-flex align-items-center justify-content-center gap-2"
                                    disabled={isSubmitting}
                                    style={{
                                        background: isSubmitting ? '#94a3b8' : 'linear-gradient(135deg, #0d9488 0%, #042f2e 100%)',
                                        border: 'none',
                                        fontSize: '14px',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                            <span>Sending Question...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Send Message</span>
                                            <SendOutlined />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;