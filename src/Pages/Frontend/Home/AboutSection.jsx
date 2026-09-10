import React from 'react';
import { Link } from 'react-router-dom';

const AboutSection = () => {
    return (
        <section className="py-5 bg-white overflow-hidden">
            <div className="container py-3 py-md-4">
                <div className="row align-items-center g-4 g-lg-5">

                    {/* ── Left Side: Images & Badge ── */}
                    <div className="col-12 col-lg-6 mb-4 mb-lg-0">
                        <div className="position-relative mx-auto ms-lg-3 me-lg-4" style={{ maxWidth: '500px' }}>
                            
                            {/* Main Image */}
                            <div className="rounded-4 overflow-hidden shadow-lg border border-light-subtle">
                                <img
                                    src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop"
                                    alt="Shopping Experience"
                                    className="w-100 object-fit-cover display-block"
                                    style={{ height: '360px' }}
                                />
                            </div>

                            {/* Floating Top-Left Image (Store/Open Sign) */}
                            <div className="position-absolute" style={{ top: '-25px', left: '-20px', zIndex: 3 }}>
                                <img
                                    src="https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=300&auto=format&fit=crop"
                                    alt="Open Shop"
                                    className="rounded-4 border border-4 border-white shadow object-fit-cover d-block"
                                    style={{ width: '120px', height: '120px' }}
                                />
                            </div>

                            {/* Floating Bottom-Right Badge */}
                            <div className="position-absolute text-white p-3 rounded-4 text-center border border-4 border-white shadow-lg"
                                style={{ bottom: '-25px', right: '15px', zIndex: 3, background: '#1e293b', width: '115px' }}>
                                <h3 className="fw-extrabold mb-0 text-white fs-2 lh-1">10+</h3>
                                <div className="fw-semibold text-white-50 mt-1" style={{ fontSize: '11px', lineHeight: '1.2' }}>
                                    Years of<br />Trust
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* ── Right Side: Content ── */}
                    <div className="col-12 col-lg-6 ps-lg-4">
                        <span className="text-uppercase fw-bold text-primary mb-2 d-block" style={{ fontSize: '12px', letterSpacing: '1.5px' }}>
                            KNOW MORE ABOUT US
                        </span>
                        
                        <h2 className="fw-extrabold fs-2 fs-md-1 text-dark mb-3 lh-sm">
                            We bring the store to your door.
                        </h2>
                        
                        <p className="text-secondary mb-4 lh-base" style={{ fontSize: '15px' }}>
                            MyStore is committed to providing a seamless, secure, and hassle-free online shopping experience. We carefully curate our products to ensure premium quality and customer satisfaction.
                        </p>

                        {/* Checklist */}
                        <div className="row g-3 mb-4 pb-2">
                            {[
                                'Premium Quality',
                                'Fast Delivery',
                                'Secure Payments',
                                '24/7 Support'
                            ].map((text, index) => (
                                <div key={index} className="col-12 col-sm-6">
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="d-flex align-items-center justify-content-center bg-secondary-subtle text-secondary rounded-circle fw-bold flex-shrink-0"
                                            style={{ width: '24px', height: '24px', fontSize: '12px' }}>
                                            ✓
                                        </div>
                                        <span className="fw-bold text-dark fs-6">{text}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="d-flex flex-wrap gap-3">
                            <Link to="/about" className="btn btn-dark rounded-pill px-4 py-2.5 fw-bold shadow-sm text-decoration-none" style={{ background: '#1e293b', border: 'none' }}>
                                Discover More
                            </Link>
                            <Link to="/products" className="btn btn-outline-dark rounded-pill px-4 py-2.5 fw-semibold text-decoration-none">
                                View Products
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AboutSection;