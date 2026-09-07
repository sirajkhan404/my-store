import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <main className="flex-grow-1">
            <style>{`
                .about-hero {
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    color: white;
                    padding: 100px 0 80px;
                    position: relative;
                    overflow: hidden;
                }
                .about-hero::before {
                    content: '';
                    position: absolute;
                    width: 400px;
                    height: 400px;
                    background: rgba(59, 130, 246, 0.2);
                    border-radius: 50%;
                    filter: blur(60px);
                    top: -100px;
                    left: -100px;
                }
                .mission-card {
                    background: white;
                    border: 1px solid #edf2f7;
                    border-radius: 20px;
                    padding: 40px 30px;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    height: 100%;
                }
                .mission-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.08);
                }
                .mission-icon {
                    width: 70px;
                    height: 70px;
                    background: #eff6ff;
                    color: #3b82f6;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 32px;
                    margin-bottom: 24px;
                }
                .team-card {
                    background: white;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                    transition: transform 0.3s ease;
                }
                .team-card:hover {
                    transform: translateY(-8px);
                }
                .team-img-wrapper {
                    height: 250px;
                    background: #f1f5f9;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 80px;
                }
                .stats-container {
                    background: #3b82f6;
                    color: white;
                    border-radius: 24px;
                    padding: 40px;
                    transform: translateY(-50px);
                    box-shadow: 0 20px 40px rgba(59, 130, 246, 0.3);
                }
                .stat-divider {
                    width: 2px;
                    height: 60px;
                    background: rgba(255,255,255,0.2);
                }
                @media (max-width: 768px) {
                    .stats-container {
                        transform: translateY(0);
                        margin-top: -30px;
                        margin-bottom: 40px;
                    }
                    .stat-divider {
                        width: 100%;
                        height: 2px;
                        margin: 20px 0;
                    }
                }
            `}</style>

            {/* ── Hero Section ── */}
            <section className="about-hero text-center">
                <div className="container position-relative z-1">
                    <span className="badge bg-primary text-white rounded-pill px-3 py-2 mb-3 fw-semibold">
                        Our Story
                    </span>
                    <h1 className="display-4 fw-bold mb-4">
                        Redefining the <span style={{ color: '#93c5fd' }}>Shopping Experience</span>
                    </h1>
                    <p className="lead mb-0 opacity-75 mx-auto" style={{ maxWidth: '700px' }}>
                        MyStore started with a simple idea: bringing high-quality products directly to your doorstep with zero hassle and maximum trust.
                    </p>
                </div>
            </section>

            {/* ── Stats Section ── */}
            <div className="container position-relative z-2">
                <div className="stats-container">
                    <div className="row align-items-center text-center">
                        <div className="col-md-3 mb-4 mb-md-0">
                            <h2 className="display-5 fw-bold mb-1">10k+</h2>
                            <p className="mb-0 opacity-75">Happy Customers</p>
                        </div>
                        <div className="col-md-1 d-flex justify-content-center">
                            <div className="stat-divider"></div>
                        </div>
                        <div className="col-md-4 mb-4 mb-md-0">
                            <h2 className="display-5 fw-bold mb-1">500+</h2>
                            <p className="mb-0 opacity-75">Premium Products</p>
                        </div>
                        <div className="col-md-1 d-flex justify-content-center">
                            <div className="stat-divider"></div>
                        </div>
                        <div className="col-md-3">
                            <h2 className="display-5 fw-bold mb-1">99%</h2>
                            <p className="mb-0 opacity-75">Positive Reviews</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Core Values Section ── */}
            <section className="py-5 bg-light" style={{ marginTop: '-80px', paddingTop: '120px !important' }}>
                <div className="container mt-5 pt-4">
                    <div className="text-center mb-5">
                        <span className="text-primary fw-bold text-uppercase tracking-wider small">Our Values</span>
                        <h2 className="display-6 fw-bold mt-2 text-dark">Why choose MyStore?</h2>
                    </div>

                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="mission-card text-center">
                                <div className="mission-icon mx-auto">🎯</div>
                                <h4 className="fw-bold mb-3">Our Mission</h4>
                                <p className="text-muted mb-0">
                                    To provide a seamless, secure, and highly reliable e-commerce platform that connects customers with their favorite products effortlessly.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="mission-card text-center">
                                <div className="mission-icon mx-auto">💎</div>
                                <h4 className="fw-bold mb-3">Premium Quality</h4>
                                <p className="text-muted mb-0">
                                    We do not compromise on quality. Every product available on our store is strictly vetted for durability and standard.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="mission-card text-center">
                                <div className="mission-icon mx-auto">🤝</div>
                                <h4 className="fw-bold mb-3">Customer First</h4>
                                <p className="text-muted mb-0">
                                    Our 24/7 dedicated support team ensures that you get exactly what you ordered and are 100% satisfied with your purchase.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Meet the Team ── */}
            <section className="py-5 bg-white">
                <div className="container py-4">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold">Behind the Magic</h2>
                        <p className="text-muted">The dedicated people working hard to bring you the best.</p>
                    </div>

                    <div className="row g-4 justify-content-center">
                        <div className="col-md-6 col-lg-3">
                            <div className="team-card text-center">
                                <div className="team-img-wrapper bg-primary bg-opacity-10">👨‍💻</div>
                                <div className="p-4">
                                    <h5 className="fw-bold mb-1">Siraj Khan</h5>
                                    <p className="text-primary small mb-3">Founder & CEO</p>
                                    <p className="text-muted small mb-0">Leading the vision and building the future of e-commerce in Pakistan.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="team-card text-center">
                                <div className="team-img-wrapper bg-success bg-opacity-10">👩‍💼</div>
                                <div className="p-4">
                                    <h5 className="fw-bold mb-1">Ayesha Ali</h5>
                                    <p className="text-primary small mb-3">Operations Head</p>
                                    <p className="text-muted small mb-0">Ensuring every order is processed and delivered on time without fail.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="team-card text-center">
                                <div className="team-img-wrapper bg-warning bg-opacity-10">🧑‍🔧</div>
                                <div className="p-4">
                                    <h5 className="fw-bold mb-1">Ahmed Raza</h5>
                                    <p className="text-primary small mb-3">Support Lead</p>
                                    <p className="text-muted small mb-0">Always ready to solve your problems and answer your questions 24/7.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA Section ── */}
            <section className="py-5" style={{ background: '#f8fafc' }}>
                <div className="container py-4">
                    <div className="bg-white rounded-4 shadow-sm border p-5 text-center">
                        <h3 className="fw-bold mb-3">Ready to experience the difference?</h3>
                        <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '600px' }}>
                            Join thousands of happy customers who have made MyStore their go-to destination for online shopping.
                        </p>
                        <Link to="/products" className="btn btn-primary btn-lg rounded-pill px-5 fw-semibold shadow-sm">
                            Start Shopping Now
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default About;