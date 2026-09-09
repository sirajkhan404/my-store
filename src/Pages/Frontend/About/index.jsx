import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <main className="flex-grow-1" style={{ fontFamily: "'Inter', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

                /* ── Hero ── */
                .ab-hero {
                    background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #3b82f6 100%);
                    color: white;
                    padding: clamp(56px, 10vw, 100px) 0 clamp(48px, 8vw, 80px);
                    position: relative;
                    overflow: hidden;
                    text-align: center;
                }
                .ab-hero::before {
                    content: '';
                    position: absolute;
                    width: 420px; height: 420px;
                    background: radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%);
                    border-radius: 50%;
                    top: -120px; left: -80px;
                }
                .ab-hero::after {
                    content: '';
                    position: absolute;
                    width: 300px; height: 300px;
                    background: radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%);
                    border-radius: 50%;
                    bottom: -80px; right: -60px;
                }
                .ab-hero h1 {
                    font-size: clamp(1.8rem, 5vw, 3rem);
                    font-weight: 800;
                    line-height: 1.2;
                    letter-spacing: -0.5px;
                }
                .ab-hero p.lead {
                    font-size: clamp(14px, 2vw, 17px);
                }

                /* ── Stats ── */
                .ab-stats {
                    background: linear-gradient(135deg, #6366f1, #3b82f6);
                    border-radius: 24px;
                    padding: clamp(24px, 5vw, 40px) clamp(16px, 4vw, 40px);
                    box-shadow: 0 20px 48px rgba(99,102,241,0.3);
                    transform: translateY(-40px);
                    margin-bottom: -16px;
                }
                .ab-stat-val {
                    font-size: clamp(1.6rem, 4vw, 2.5rem);
                    font-weight: 800;
                    line-height: 1.1;
                }
                .ab-stat-label { font-size: clamp(12px, 1.8vw, 15px); opacity: 0.8; }
                .ab-stat-div {
                    width: 1.5px; height: 50px;
                    background: rgba(255,255,255,0.2);
                }

                /* ── Mission Cards ── */
                .ab-mission-card {
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 20px;
                    padding: clamp(24px, 4vw, 40px) clamp(18px, 3vw, 30px);
                    transition: all 0.3s ease;
                    height: 100%;
                }
                .ab-mission-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px rgba(99,102,241,0.1);
                    border-color: #c7d2fe;
                }
                .ab-mission-icon {
                    width: 64px; height: 64px;
                    border-radius: 18px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 28px;
                    margin: 0 auto 20px;
                }

                /* ── Team Cards ── */
                .ab-team-card {
                    background: white;
                    border-radius: 20px;
                    overflow: hidden;
                    border: 1px solid #e2e8f0;
                    transition: all 0.3s ease;
                    height: 100%;
                }
                .ab-team-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.09);
                    border-color: #c7d2fe;
                }
                .ab-team-img {
                    height: clamp(140px, 20vw, 220px);
                    display: flex; align-items: center; justify-content: center;
                    font-size: clamp(48px, 8vw, 72px);
                }

                /* ── CTA ── */
                .ab-cta {
                    background: linear-gradient(135deg, #ede9fe, #dbeafe);
                    border-radius: 24px;
                    padding: clamp(32px, 6vw, 56px) clamp(20px, 5vw, 48px);
                    text-align: center;
                    border: 1px solid #c7d2fe;
                }
                .ab-cta h3 { font-size: clamp(1.2rem, 3.5vw, 1.8rem); font-weight: 800; }
                .ab-cta p  { font-size: clamp(13px, 2vw, 16px); }

                /* ── Responsive ── */
                @media (max-width: 767px) {
                    .ab-stats { transform: translateY(0); margin-top: 24px; margin-bottom: 0; }
                    .ab-stat-div { width: 80%; height: 1.5px; margin: 12px auto; }
                    .ab-mission-card { padding: 22px 18px; }
                }
                @media (max-width: 575px) {
                    .ab-mission-icon { width: 52px; height: 52px; font-size: 22px; }
                }
            `}</style>

            {/* ── Hero ── */}
            <section className="ab-hero">
                <div className="container position-relative" style={{ zIndex: 1 }}>
                    <span className="badge rounded-pill px-3 py-2 mb-3 d-inline-block fw-semibold"
                        style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: 12, backdropFilter: 'blur(4px)' }}>
                        ✨ Our Story
                    </span>
                    <h1 className="fw-bold mb-4">
                        Redefining the{' '}
                        <span style={{ color: '#93c5fd' }}>Shopping Experience</span>
                    </h1>
                    <p className="lead mb-0 mx-auto opacity-75" style={{ maxWidth: 640 }}>
                        MyStore started with a simple idea — bringing high-quality products directly to your doorstep with zero hassle and maximum trust.
                    </p>
                </div>
            </section>

            {/* ── Stats ── */}
            <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                <div className="ab-stats">
                    <div className="row align-items-center text-center text-white g-0">
                        <div className="col-12 col-md">
                            <div className="ab-stat-val">10k+</div>
                            <div className="ab-stat-label mt-1">Happy Customers</div>
                        </div>
                        <div className="col-12 col-md-auto d-flex justify-content-center">
                            <div className="ab-stat-div" />
                        </div>
                        <div className="col-12 col-md">
                            <div className="ab-stat-val">500+</div>
                            <div className="ab-stat-label mt-1">Premium Products</div>
                        </div>
                        <div className="col-12 col-md-auto d-flex justify-content-center">
                            <div className="ab-stat-div" />
                        </div>
                        <div className="col-12 col-md">
                            <div className="ab-stat-val">99%</div>
                            <div className="ab-stat-label mt-1">Positive Reviews</div>
                        </div>
                        <div className="col-12 col-md-auto d-flex justify-content-center">
                            <div className="ab-stat-div" />
                        </div>
                        <div className="col-12 col-md">
                            <div className="ab-stat-val">5★</div>
                            <div className="ab-stat-label mt-1">Avg. Rating</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Core Values ── */}
            <section style={{ background: '#f8fafc', paddingTop: 'clamp(48px,8vw,100px)', paddingBottom: 'clamp(40px,6vw,72px)' }}>
                <div className="container">
                    <div className="text-center mb-5">
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: 1.5 }}>Our Values</span>
                        <h2 className="fw-bold mt-2" style={{ fontSize: 'clamp(1.4rem,4vw,2rem)', color: '#0f172a' }}>Why choose MyStore?</h2>
                    </div>
                    <div className="row g-4">
                        {[
                            { icon: '🎯', bg: 'linear-gradient(135deg,#ede9fe,#ddd6fe)', title: 'Our Mission',
                              text: 'To provide a seamless, secure, and highly reliable e-commerce platform that connects customers with their favorite products effortlessly.' },
                            { icon: '💎', bg: 'linear-gradient(135deg,#dbeafe,#bfdbfe)', title: 'Premium Quality',
                              text: 'We do not compromise on quality. Every product available on our store is strictly vetted for durability and standard.' },
                            { icon: '🤝', bg: 'linear-gradient(135deg,#d1fae5,#a7f3d0)', title: 'Customer First',
                              text: 'Our 24/7 dedicated support team ensures that you get exactly what you ordered and are 100% satisfied with your purchase.' },
                        ].map((v, i) => (
                            <div key={i} className="col-12 col-md-4">
                                <div className="ab-mission-card text-center">
                                    <div className="ab-mission-icon" style={{ background: v.bg }}>{v.icon}</div>
                                    <h4 className="fw-bold mb-3" style={{ fontSize: 'clamp(16px,2.5vw,20px)' }}>{v.title}</h4>
                                    <p className="text-muted mb-0" style={{ fontSize: 'clamp(13px,1.8vw,15px)', lineHeight: 1.7 }}>{v.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Team ── */}
            <section style={{ background: '#ffffff', padding: 'clamp(40px,6vw,72px) 0' }}>
                <div className="container">
                    <div className="text-center mb-5">
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: 1.5 }}>The People</span>
                        <h2 className="fw-bold mt-2" style={{ fontSize: 'clamp(1.4rem,4vw,2rem)', color: '#0f172a' }}>Behind the Magic</h2>
                        <p className="text-muted mt-2" style={{ fontSize: 'clamp(13px,1.8vw,15px)' }}>The dedicated people working hard to bring you the best.</p>
                    </div>
                    <div className="row g-4 justify-content-center">
                        {[
                            { emoji: '👨‍💻', bg: 'linear-gradient(135deg,#ede9fe,#ddd6fe)', name: 'Siraj Khan',   role: 'Founder & CEO',      desc: 'Leading the vision and building the future of e-commerce in Pakistan.' },
                            { emoji: '👩‍💼', bg: 'linear-gradient(135deg,#d1fae5,#a7f3d0)', name: 'Ayesha Ali',   role: 'Operations Head',    desc: 'Ensuring every order is processed and delivered on time without fail.' },
                            { emoji: '🧑‍🔧', bg: 'linear-gradient(135deg,#fef9c3,#fde68a)', name: 'Ahmed Raza',   role: 'Support Lead',       desc: 'Always ready to solve your problems and answer your questions 24/7.' },
                        ].map((m, i) => (
                            <div key={i} className="col-12 col-sm-6 col-lg-4">
                                <div className="ab-team-card">
                                    <div className="ab-team-img" style={{ background: m.bg }}>{m.emoji}</div>
                                    <div style={{ padding: 'clamp(16px,3vw,28px)' }}>
                                        <h5 className="fw-bold mb-1" style={{ fontSize: 'clamp(15px,2vw,18px)' }}>{m.name}</h5>
                                        <p style={{ color: '#6366f1', fontSize: 13, fontWeight: 600, marginBottom: 10 }}>{m.role}</p>
                                        <p className="text-muted mb-0" style={{ fontSize: 'clamp(12px,1.6vw,14px)', lineHeight: 1.6 }}>{m.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section style={{ background: '#f8fafc', padding: 'clamp(32px,5vw,64px) 0' }}>
                <div className="container">
                    <div className="ab-cta">
                        <div style={{ fontSize: 'clamp(2rem,5vw,3rem)', marginBottom: 16 }}>🚀</div>
                        <h3 className="mb-3">Ready to experience the difference?</h3>
                        <p className="text-muted mb-4 mx-auto" style={{ maxWidth: 520 }}>
                            Join thousands of happy customers who have made MyStore their go-to destination for online shopping.
                        </p>
                        <Link to="/products"
                            className="btn btn-primary btn-lg rounded-pill fw-semibold"
                            style={{ padding: 'clamp(10px,2vw,14px) clamp(28px,4vw,48px)', fontSize: 'clamp(14px,1.8vw,16px)', background: 'linear-gradient(135deg,#6366f1,#3b82f6)', border: 'none', boxShadow: '0 8px 24px rgba(99,102,241,0.35)' }}>
                            Start Shopping Now →
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default About;