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
        <section className="py-5" style={{ background: '#f0fdfa' }}>
            <div className="container py-4">
                <div className="text-center mb-5">
                    <h2 className="fw-bold mb-2 text-dark">Have a Question?</h2>
                    <p className="text-muted">Feel free to reach out to us at any time.</p>
                </div>

                <div className="card mx-auto border border-light-subtle rounded-4 shadow-sm overflow-hidden" style={{ maxWidth: '900px' }}>
                    <div className="row g-0">
                        {/* Info Side (Visible on medium screens and up) */}
                        <div className="col-12 col-md-5 d-none d-md-flex flex-column justify-content-center text-white p-4 p-lg-5"
                            style={{ background: 'linear-gradient(135deg, #042f2e 0%, #0d9488 100%)' }}>
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

                        {/* Form Side */}
                        <div className="col-12 col-md-7 p-4 p-lg-5 bg-white">
                            <h4 className="fw-bold mb-4 text-dark">Send a Message</h4>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold text-muted small ms-1">Full Name</label>
                                    <input
                                        type="text"
                                        className="form-control rounded-3 bg-light border-light-subtle px-3 py-2"
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
                                        className="form-control rounded-3 bg-light border-light-subtle px-3 py-2"
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
                                        className="form-control rounded-3 bg-light border-light-subtle px-3 py-2"
                                        rows={4}
                                        placeholder="How can we help you?"
                                        name="message"
                                        value={state.message}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn w-100 rounded-3 py-3 fw-bold shadow-sm text-white" disabled={isSubmitting}
                                    style={{ background: 'linear-gradient(135deg, #0d9488, #0f766e)', border: 'none' }}>
                                    {isSubmitting ? 'Sending...' : 'Send Message →'}
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