import React from 'react';
import { Link } from 'react-router-dom';

const AboutSection = () => {
    return (
        <section className="py-5" style={{ backgroundColor: '#ffffff' }}>
            <div className="container py-4">
                
                <style>{`
                    .about-img-wrap {
                        position: relative;
                        border-radius: 24px;
                        overflow: hidden;
                        box-shadow: 0 20px 40px rgba(0,0,0,0.08);
                    }
                    .about-img {
                        width: 100%;
                        height: 400px;
                        object-fit: cover;
                        transition: transform 0.5s ease;
                    }
                    .about-img-wrap:hover .about-img {
                        transform: scale(1.05);
                    }
                    .experience-badge {
                        position: absolute;
                        bottom: -20px;
                        right: -20px;
                        background: #3b82f6;
                        color: white;
                        padding: 30px;
                        border-radius: 20px;
                        text-align: center;
                        box-shadow: 0 10px 20px rgba(59,130,246,0.3);
                        z-index: 2;
                        border: 5px solid white;
                    }
                    .floating-img {
                        position: absolute;
                        top: -30px;
                        left: -30px;
                        width: 150px;
                        height: 150px;
                        border-radius: 20px;
                        border: 5px solid white;
                        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                        z-index: 2;
                        object-fit: cover;
                    }
                    .list-icon {
                        width: 24px;
                        height: 24px;
                        background: #eff6ff;
                        color: #3b82f6;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px;
                        margin-right: 12px;
                    }
                `}</style>

                <div className="row align-items-center g-5">
                    
                    {/* ── Left Side: Images ── */}
                    <div className="col-lg-6 position-relative pe-lg-5 mb-5 mb-lg-0">
                        <div className="about-img-wrap ms-4 mt-4">
                            <img 
                                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop" 
                                alt="Shopping Experience" 
                                className="about-img"
                            />
                        </div>
                        <img 
                            src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=300&auto=format&fit=crop" 
                            alt="Happy Customer" 
                            className="floating-img d-none d-md-block"
                        />
                        <div className="experience-badge d-none d-md-block">
                            <h2 className="fw-bold mb-0 lh-1">10+</h2>
                            <span className="small fw-semibold">Years of<br/>Trust</span>
                        </div>
                    </div>

                    {/* ── Right Side: Text Content ── */}
                    <div className="col-lg-6 ps-lg-4">
                        <span className="text-primary fw-bold small text-uppercase tracking-wider">Know More About Us</span>
                        <h2 className="display-6 fw-bold mt-2 mb-4 text-dark lh-sm">
                            We bring the store to your door.
                        </h2>
                        <p className="text-muted mb-4 lead" style={{ fontSize: '1.1rem' }}>
                            MyStore is committed to providing a seamless, secure, and hassle-free online shopping experience. We carefully curate our products to ensure premium quality and customer satisfaction.
                        </p>
                        
                        <div className="row g-3 mb-4">
                            <div className="col-sm-6">
                                <div className="d-flex align-items-center">
                                    <div className="list-icon">✓</div>
                                    <span className="fw-semibold text-dark">Premium Quality</span>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="d-flex align-items-center">
                                    <div className="list-icon">✓</div>
                                    <span className="fw-semibold text-dark">Fast Delivery</span>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="d-flex align-items-center">
                                    <div className="list-icon">✓</div>
                                    <span className="fw-semibold text-dark">Secure Payments</span>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="d-flex align-items-center">
                                    <div className="list-icon">✓</div>
                                    <span className="fw-semibold text-dark">24/7 Support</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 pt-2">
                            <Link to="/about" className="btn btn-primary rounded-pill px-4 py-2 shadow-sm fw-semibold me-3">
                                Discover More
                            </Link>
                            <Link to="/products" className="btn btn-outline-dark rounded-pill px-4 py-2 fw-semibold">
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
