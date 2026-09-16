import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <main className="d-flex flex-column flex-grow-1" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* ── Hero ── */}
            <section className="text-white text-center position-relative overflow-hidden py-5 py-md-6 py-lg-7"
                style={{ background: 'linear-gradient(135deg, #042f2e 0%, #134e4a 55%, #0d9488 100%)' }}>

                {/* Decorative background gradients */}
                <div className="position-absolute rounded-circle pointer-event-none"
                    style={{ width: '420px', height: '420px', background: 'radial-gradient(circle, rgba(13,148,136,0.25) 0%, transparent 70%)', top: '-120px', left: '-80px', zIndex: 0 }}></div>
                <div className="position-absolute rounded-circle pointer-event-none"
                    style={{ width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)', bottom: '-80px', right: '-60px', zIndex: 0 }}></div>

                <div className="container position-relative" style={{ zIndex: 1 }}>
                    <span className="badge rounded-pill px-3 py-2 mb-3 fw-semibold"
                        style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '12px', backdropFilter: 'blur(4px)' }}>
                        ✨ Our Story
                    </span>
                    <h1 className="fw-extrabold display-5 display-md-4 mb-4" style={{ letterSpacing: '-0.5px' }}>
                        Redefining the{' '}
                        <span style={{ background: 'linear-gradient(135deg,#f59e0b,#fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Shopping Experience</span>
                    </h1>
                    <p className="lead fs-6 fs-md-5 mb-0 mx-auto opacity-75" style={{ maxWidth: '640px' }}>
                        MyStore started with a simple idea — bringing high-quality products directly to your doorstep with zero hassle and maximum trust.
                    </p>
                </div>
            </section>

            {/* ── Stats ── */}
            <div className="container position-relative" style={{ zIndex: 2, marginTop: '-35px' }}>
                <div className="p-4 p-md-5 text-white shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #042f2e, #0d9488)', borderRadius: '24px', boxShadow: '0 20px 48px rgba(13,148,136,0.35)' }}>
                    <div className="row align-items-center text-center g-4 g-md-0">
                        <div className="col-6 col-md">
                            <div className="fs-2 fs-md-1 fw-bold lh-1">10k+</div>
                            <div className="small opacity-75 mt-1">Happy Customers</div>
                        </div>
                        <div className="d-none d-md-flex col-md-auto justify-content-center">
                            <div className="bg-white opacity-25" style={{ width: '1.5px', height: '50px' }}></div>
                        </div>
                        <div className="col-6 col-md">
                            <div className="fs-2 fs-md-1 fw-bold lh-1">500+</div>
                            <div className="small opacity-75 mt-1">Premium Products</div>
                        </div>
                        <div className="d-none d-md-flex col-md-auto justify-content-center">
                            <div className="bg-white opacity-25" style={{ width: '1.5px', height: '50px' }}></div>
                        </div>
                        <div className="col-6 col-md">
                            <div className="fs-2 fs-md-1 fw-bold lh-1">99%</div>
                            <div className="small opacity-75 mt-1">Positive Reviews</div>
                        </div>
                        <div className="d-none d-md-flex col-md-auto justify-content-center">
                            <div className="bg-white opacity-25" style={{ width: '1.5px', height: '50px' }}></div>
                        </div>
                        <div className="col-6 col-md">
                            <div className="fs-2 fs-md-1 fw-bold lh-1">5★</div>
                            <div className="small opacity-75 mt-1">Avg. Rating</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Core Values ── */}
            <section style={{ background: '#f0fdfa' }} className="py-5 py-lg-6">
                <div className="container py-4">
                    <div className="text-center mb-5">
                        <span className="small fw-bold text-uppercase" style={{ color: '#0d9488', letterSpacing: '1.5px' }}>Our Values</span>
                        <h2 className="fw-bold fs-2 fs-md-1 text-dark mt-2">Why choose MyStore?</h2>
                    </div>
                    <div className="row g-4">
                        {[
                            {
                                icon: '🎯', bg: 'linear-gradient(135deg,#ccfbf1,#99f6e4)', title: 'Our Mission',
                                text: 'To provide a seamless, secure, and highly reliable e-commerce platform that connects customers with their favorite products effortlessly.'
                            },
                            {
                                icon: '💎', bg: 'linear-gradient(135deg,#fef3c7,#fde68a)', title: 'Premium Quality',
                                text: 'We do not compromise on quality. Every product available on our store is strictly vetted for durability and standard.'
                            },
                            {
                                icon: '🤝', bg: 'linear-gradient(135deg,#d1fae5,#a7f3d0)', title: 'Customer First',
                                text: 'Our 24/7 dedicated support team ensures that you get exactly what you ordered and are 100% satisfied with your purchase.'
                            },
                        ].map((v, i) => (
                            <div key={i} className="col-12 col-md-4">
                                <div className="card bg-white border border-light-subtle h-100 p-4 p-xl-5 text-center shadow-sm rounded-4 transition-all">
                                    <div className="d-flex align-items-center justify-content-center mx-auto mb-4 rounded-4"
                                        style={{ width: '64px', height: '64px', background: v.bg, fontSize: '28px' }}>
                                        {v.icon}
                                    </div>
                                    <h4 className="fw-bold fs-5 fs-md-4 mb-3 text-dark">{v.title}</h4>
                                    <p className="text-muted small fs-6 mb-0 lh-base">{v.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Team ── */}
            <section className="bg-white py-5 py-lg-6">
                <div className="container py-4">
                    <div className="text-center mb-5">
                        <span className="small fw-bold text-uppercase" style={{ color: '#0d9488', letterSpacing: '1.5px' }}>The People</span>
                        <h2 className="fw-bold fs-2 fs-md-1 text-dark mt-2">Behind the Magic</h2>
                        <p className="text-muted small fs-6 mt-2">The dedicated people working hard to bring you the best.</p>
                    </div>
                    <div className="row g-4 justify-content-center">
                        {[
                            { emoji: '👨‍💻', bg: 'linear-gradient(135deg,#ccfbf1,#99f6e4)', name: 'Siraj Khan', role: 'Founder & CEO', desc: 'Leading the vision and building the future of e-commerce in Pakistan.' },
                            { emoji: '👩‍💼', bg: 'linear-gradient(135deg,#fef3c7,#fde68a)', name: 'Ayesha Ali', role: 'Operations Head', desc: 'Ensuring every order is processed and delivered on time without fail.' },
                            { emoji: '🧑‍🔧', bg: 'linear-gradient(135deg,#d1fae5,#a7f3d0)', name: 'Ahmed Raza', role: 'Support Lead', desc: 'Always ready to solve your problems and answer your questions 24/7.' },
                        ].map((m, i) => (
                            <div key={i} className="col-12 col-sm-6 col-lg-4">
                                <div className="card bg-white border border-light-subtle h-100 rounded-4 overflow-hidden shadow-sm">
                                    <div className="d-flex align-items-center justify-content-center py-5" style={{ background: m.bg, fontSize: '64px' }}>
                                        {m.emoji}
                                    </div>
                                    <div className="card-body p-4">
                                        <h5 className="fw-bold fs-5 mb-1 text-dark">{m.name}</h5>
                                        <p className="small fw-semibold mb-2" style={{ color: '#0d9488' }}>{m.role}</p>
                                        <p className="text-muted small mb-0 lh-base">{m.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="bg-light py-5">
                <div className="container">
                    <div className="p-4 p-md-5 text-center rounded-4" style={{ background: 'linear-gradient(135deg, #042f2e, #134e4a)', boxShadow: '0 20px 60px rgba(4,47,46,0.3)' }}>
                        <div className="fs-1 mb-3">🚀</div>
                        <h3 className="fw-bold fs-3 mb-3 text-white">Ready to experience the difference?</h3>
                        <p className="mb-4 mx-auto" style={{ maxWidth: '520px', color: 'rgba(255,255,255,0.75)', fontSize: '15px' }}>
                            Join thousands of happy customers who have made MyStore their go-to destination for online shopping.
                        </p>
                        <Link to="/products"
                            className="btn btn-lg rounded-pill fw-semibold px-4 px-md-5 py-3 shadow text-dark"
                            style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: 'none' }}>
                            Start Shopping Now →
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default About;