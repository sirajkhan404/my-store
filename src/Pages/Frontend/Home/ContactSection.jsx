import React, { useState } from 'react';

const ContactSection = () => {
    const [state, setState] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            window.toastify("Message sent successfully! We'll get back to you soon.", "success");
            setState({ name: '', email: '', message: '' });
        }, 1500);
    };

    return (
        <section className="py-5" style={{ background: '#f8fafc' }}>
            <style>{`
                .home-contact-box {
                    background: white;
                    border-radius: 20px;
                    border: 1px solid #edf2f7;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.03);
                    overflow: hidden;
                }
                .home-contact-info {
                    background: linear-gradient(135deg, #1e293b 0%, #3b82f6 100%);
                    color: white;
                    padding: 40px;
                    height: 100%;
                }
                .home-form-control {
                    border-radius: 12px;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    padding: 12px 16px;
                    font-size: 15px;
                }
                .home-form-control:focus {
                    background: white;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
                }
                .home-submit-btn {
                    background: #3b82f6;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    padding: 12px 24px;
                    font-weight: 700;
                    transition: all 0.3s;
                }
                .home-submit-btn:hover {
                    background: #2563eb;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
                }
            `}</style>
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="fw-bold mb-2">Have a Question?</h2>
                    <p className="text-muted">Feel free to reach out to us at any time.</p>
                </div>

                <div className="home-contact-box mx-auto" style={{ maxWidth: 900 }}>
                    <div className="row g-0">
                        {/* Info Side */}
                        <div className="col-md-5 d-none d-md-block">
                            <div className="home-contact-info d-flex flex-column justify-content-center">
                                <h4 className="fw-bold mb-4">Contact Info</h4>
                                <div className="d-flex align-items-center gap-3 mb-4">
                                    <div className="fs-4">📍</div>
                                    <div>
                                        <div className="fw-semibold">Location</div>
                                        <div className="small opacity-75">123 Business Ave, Tech City</div>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-3 mb-4">
                                    <div className="fs-4">📞</div>
                                    <div>
                                        <div className="fw-semibold">Phone</div>
                                        <div className="small opacity-75">+92 300 1234567</div>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="fs-4">✉️</div>
                                    <div>
                                        <div className="fw-semibold">Email</div>
                                        <div className="small opacity-75">support@mystore.com</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Side */}
                        <div className="col-md-7 p-4 p-lg-5">
                            <h4 className="fw-bold mb-4">Send a Message</h4>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold text-muted small ms-1">Full Name</label>
                                    <input
                                        type="text"
                                        className="form-control home-form-control"
                                        placeholder="John Doe"
                                        name="name"
                                        value={state.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold text-muted small ms-1">Email Address</label>
                                    <input
                                        type="email"
                                        className="form-control home-form-control"
                                        placeholder="hello@example.com"
                                        name="email"
                                        value={state.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-semibold text-muted small ms-1">Message</label>
                                    <textarea
                                        className="form-control home-form-control"
                                        rows={4}
                                        placeholder="How can we help you?"
                                        name="message"
                                        value={state.message}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="home-submit-btn w-100" disabled={isSubmitting}>
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
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
