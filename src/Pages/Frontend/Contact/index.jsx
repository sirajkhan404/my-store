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
            window.toastify(data.message || "Message sent successfully!", "success");
            setState({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error(error);
            window.toastify(error?.response?.data?.message || "Failed to send message. Please try again.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="flex-grow-1" style={{ backgroundColor: '#f8fafc' }}>
            <style>{`
                .contact-hero {
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    color: white;
                    padding: 80px 0;
                    position: relative;
                    overflow: hidden;
                }
                .contact-card {
                    background: white;
                    border-radius: 20px;
                    border: none;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.08);
                    position: relative;
                    margin-top: -60px;
                    z-index: 10;
                }
                .contact-info-box {
                    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                    color: white;
                    border-radius: 20px;
                    padding: 40px;
                    height: 100%;
                }
                .info-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 16px;
                    margin-bottom: 30px;
                }
                .info-icon {
                    font-size: 24px;
                    background: rgba(255,255,255,0.2);
                    width: 50px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                }
                .form-control-custom {
                    border-radius: 12px;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    padding: 14px 16px;
                    font-size: 15px;
                    transition: all 0.3s;
                }
                .form-control-custom:focus {
                    background: white;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
                }
                .submit-btn {
                    background: #3b82f6;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    padding: 14px 30px;
                    font-weight: 700;
                    font-size: 16px;
                    transition: all 0.3s;
                }
                .submit-btn:hover {
                    background: #2563eb;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
                }
                .floating-circle {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.05);
                }
            `}</style>

            <section className="contact-hero text-center">
                <div className="floating-circle" style={{ width: 300, height: 300, top: -100, left: -50 }}></div>
                <div className="floating-circle" style={{ width: 200, height: 200, bottom: -50, right: 100 }}></div>

                <div className="container position-relative z-1">
                    <h1 className="display-4 fw-bold mb-3">Get in Touch</h1>
                    <p className="lead opacity-75 mx-auto" style={{ maxWidth: 600 }}>
                        Have questions about our products, orders, or anything else? We're here to help. Reach out to us and we'll respond as soon as we can.
                    </p>
                </div>
            </section>

            <section className="container pb-5 mb-5">
                <div className="contact-card p-3 p-md-4 p-lg-5">
                    <div className="row g-5">

                        {/* Contact Information */}
                        <div className="col-lg-5">
                            <div className="contact-info-box">
                                <h3 className="fw-bold mb-4">Contact Information</h3>
                                <p className="mb-5 opacity-75">Fill up the form and our team will get back to you within 24 hours.</p>

                                <div className="info-item">
                                    <div className="info-icon">📞</div>
                                    <div>
                                        <h6 className="fw-bold mb-1">Phone Number</h6>
                                        <p className="mb-0 opacity-75">+92 300 1234567</p>
                                    </div>
                                </div>

                                <div className="info-item">
                                    <div className="info-icon">✉️</div>
                                    <div>
                                        <h6 className="fw-bold mb-1">Email Address</h6>
                                        <p className="mb-0 opacity-75">support@mystore.com</p>
                                    </div>
                                </div>

                                <div className="info-item">
                                    <div className="info-icon">📍</div>
                                    <div>
                                        <h6 className="fw-bold mb-1">Location</h6>
                                        <p className="mb-0 opacity-75">123 Business Avenue,<br />Tech City, Pakistan</p>
                                    </div>
                                </div>

                                <div className="mt-5 pt-4 border-top border-light border-opacity-25 d-flex gap-3">
                                    <a href="#" className="text-white text-decoration-none fs-4 hover-opacity">📱</a>
                                    <a href="#" className="text-white text-decoration-none fs-4 hover-opacity">💬</a>
                                    <a href="#" className="text-white text-decoration-none fs-4 hover-opacity">🌐</a>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="col-lg-7 py-3">
                            <h3 className="fw-bold mb-4">Send us a Message</h3>

                            <form onSubmit={handleSubmit}>
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold text-muted small ms-1">Your Name</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-custom"
                                            placeholder="John Doe"
                                            name="name"
                                            value={state.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold text-muted small ms-1">Email Address</label>
                                        <input
                                            type="email"
                                            className="form-control form-control-custom"
                                            placeholder="hello@example.com"
                                            name="email"
                                            value={state.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label fw-semibold text-muted small ms-1">Subject</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-custom"
                                            placeholder="How can we help you?"
                                            name="subject"
                                            value={state.subject}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label fw-semibold text-muted small ms-1">Message</label>
                                        <textarea
                                            className="form-control form-control-custom"
                                            rows={5}
                                            placeholder="Write your message here..."
                                            name="message"
                                            value={state.message}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-12 mt-4 text-end">
                                        <button type="submit" className="submit-btn" disabled={isSubmitting}>
                                            {isSubmitting ? 'Sending...' : 'Send Message 🚀'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
};

export default Contact;
