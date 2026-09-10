import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <>
      {/* ── Hero Section (Gradient & Glassmorphism) ── */}
      <section className="text-white pt-5 pb-5 pb-lg-0 min-vh-100 d-flex align-items-center position-relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}>

        {/* Background glow shape */}
        <div className="position-absolute rounded-circle pointer-event-none"
          style={{ width: '500px', height: '500px', background: 'rgba(255, 255, 255, 0.1)', filter: 'blur(80px)', top: '-20%', right: '-10%', zIndex: 0 }}></div>

        <div className="container py-5 position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-6">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-4 border border-light border-opacity-25" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <span className="badge bg-warning text-dark rounded-pill">NEW</span>
                <span className="small fw-semibold">Discover our latest summer collection</span>
              </div>
              <h1 className="display-4 display-md-3 fw-bold mb-4 lh-sm">
                Elevate Your <br />
                Shopping <span style={{ color: '#fbbf24' }}>Experience</span>
              </h1>
              <p className="lead mb-5 opacity-75 fs-6 fs-md-5" style={{ maxWidth: '540px' }}>
                Explore a curated selection of premium products. Fast shipping, secure payments, and a seamless shopping journey tailored just for you.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/products" className="btn btn-lg px-4 px-md-5 rounded-pill fw-bold text-white shadow"
                  style={{ background: 'linear-gradient(45deg, #f59e0b, #ef4444)', border: 'none' }}>
                  Shop Now <span className="ms-1">→</span>
                </Link>
                <Link to="/about" className="btn btn-lg px-4 px-md-5 rounded-pill fw-semibold text-white border border-light border-opacity-25" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  Explore Features
                </Link>
              </div>

              <div className="d-flex align-items-center gap-3 gap-md-4 mt-5 pt-3">
                <div>
                  <h3 className="fw-bold fs-4 fs-md-3 mb-0">10k+</h3>
                  <p className="small opacity-75 mb-0">Active Users</p>
                </div>
                <div className="bg-white opacity-25" style={{ width: '1px', height: '40px' }}></div>
                <div>
                  <h3 className="fw-bold fs-4 fs-md-3 mb-0">5k+</h3>
                  <p className="small opacity-75 mb-0">Products</p>
                </div>
                <div className="bg-white opacity-25" style={{ width: '1px', height: '40px' }}></div>
                <div>
                  <div className="d-flex text-warning fs-6 fs-md-5">★★★★★</div>
                  <p className="small opacity-75 mb-0">4.9/5 Rating</p>
                </div>
              </div>
            </div>

            <div className="col-lg-6 position-relative d-none d-lg-block">
              {/* Abstract Hero Image/Card representation */}
              <div className="rounded-4 p-5 text-center mx-auto shadow-lg border border-light border-opacity-25"
                style={{ maxWidth: '400px', transform: 'rotate(5deg)', background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
                <div className="mb-4">
                  <div className="d-inline-flex align-items-center justify-content-center bg-white rounded-circle shadow" style={{ width: '80px', height: '80px', fontSize: '35px' }}>
                    🛍️
                  </div>
                </div>
                <h3 className="fw-bold mb-2 text-white">Premium Quality</h3>
                <p className="text-white opacity-75 mb-4">Handpicked items for your daily lifestyle.</p>
                <div className="p-3 rounded-3 text-start d-flex align-items-center gap-3 mt-4 border border-light border-opacity-25 shadow-sm"
                  style={{ transform: 'rotate(-5deg) translateX(-30px)', background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(10px)' }}>
                  <div className="bg-success rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0" style={{ width: '40px', height: '40px' }}>✓</div>
                  <div>
                    <div className="fw-bold small text-white">Order Delivered</div>
                    <div className="text-white" style={{ fontSize: '10px', opacity: 0.7 }}>Just now</div>
                  </div>
                </div>
                <div className="p-3 rounded-3 text-start d-flex align-items-center gap-3 mt-3 border border-light border-opacity-25 shadow-sm"
                  style={{ transform: 'rotate(2deg) translateX(30px)', background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(10px)' }}>
                  <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0" style={{ width: '40px', height: '40px' }}>★</div>
                  <div>
                    <div className="fw-bold small text-white">Special Discount</div>
                    <div className="text-white" style={{ fontSize: '10px', opacity: 0.7 }}>Applied to cart</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories Section (Clean & Modern) ── */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="text-primary fw-bold small text-uppercase" style={{ letterSpacing: '1px' }}>Top Collections</span>
            <h2 className="display-6 fw-bold mt-2 text-dark">Shop by Category</h2>
          </div>
          <div className="row g-4 justify-content-center">
            {[
              { icon: '📱', name: 'Electronics', count: '120+ Items' },
              { icon: '👕', name: 'Fashion', count: '300+ Items' },
              { icon: '🏠', name: 'Home & Living', count: '85+ Items' },
              { icon: '👟', name: 'Footwear', count: '150+ Items' },
              { icon: '⌚', name: 'Accessories', count: '200+ Items' },
              { icon: '🎮', name: 'Gaming', count: '45+ Items' },
            ].map((cat, i) => (
              <div key={i} className="col-6 col-md-4 col-lg-2">
                <Link to="/products" className="text-decoration-none">
                  <div className="p-4 text-center bg-white h-100 rounded-4 border border-light-subtle shadow-sm transition-all">
                    <div className="display-4 mb-3" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>{cat.icon}</div>
                    <h6 className="fw-bold text-dark mb-1 fs-6">{cat.name}</h6>
                    <small className="text-muted" style={{ fontSize: '12px' }}>{cat.count}</small>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section (Cards with hover effects) ── */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-5 text-center text-lg-start">
              <h2 className="display-5 fw-bold mb-4 text-dark">
                Why we are the <span className="fw-bold" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #c026d3 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>best choice</span> for you
              </h2>
              <p className="lead text-muted mb-4 fs-6">We provide a seamless shopping experience with top-notch services, ensuring you get exactly what you need without any hassle.</p>
              <Link to="/about" className="btn btn-outline-dark btn-lg rounded-pill px-4">Learn more about us</Link>
            </div>
            <div className="col-12 col-lg-7">
              <div className="row g-4">
                {[
                  { icon: '🚀', title: 'Fast Delivery', desc: 'Get your orders delivered within 2-3 business days nationwide.' },
                  { icon: '🛡️', title: 'Secure Checkout', desc: 'Your payment information is encrypted and 100% safe with us.' },
                  { icon: '💸', title: 'Best Prices', desc: 'We offer highly competitive prices and regular discount deals.' },
                  { icon: '🎧', title: '24/7 Support', desc: 'Our dedicated team is always ready to assist you anytime.' },
                ].map((feat, i) => (
                  <div key={i} className="col-12 col-md-6">
                    <div className="card bg-white border border-light-subtle p-4 h-100 rounded-4 shadow-sm">
                      <div className="d-flex align-items-center justify-content-center shadow-sm rounded-3 mb-4"
                        style={{ width: '60px', height: '60px', fontSize: '28px', background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)' }}>
                        {feat.icon}
                      </div>
                      <h5 className="fw-bold mb-2 text-dark fs-5">{feat.title}</h5>
                      <p className="text-muted small mb-0 lh-base">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Newsletter CTA ── */}
      <section className="py-5 bg-light">
        <div className="container pb-4">
          <div className="rounded-4 p-4 p-md-5 position-relative overflow-hidden shadow-lg" style={{ background: 'linear-gradient(45deg, #1e293b, #0f172a)' }}>
            {/* Background shapes */}
            <div className="position-absolute rounded-circle pointer-event-none" style={{ width: '300px', height: '300px', background: 'rgba(99,102,241,0.2)', filter: 'blur(50px)', top: '-10%', right: '-5%' }}></div>
            <div className="position-absolute rounded-circle pointer-event-none" style={{ width: '200px', height: '200px', background: 'rgba(236,72,153,0.2)', filter: 'blur(50px)', bottom: '-10%', left: '-5%' }}></div>

            <div className="row justify-content-center position-relative z-1 text-center">
              <div className="col-12 col-lg-8">
                <h2 className="display-6 fw-bold text-white mb-3">Join our Newsletter</h2>
                <p className="text-white-50 mb-4 lead fs-6">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
                <div className="input-group input-group-lg mx-auto shadow flex-column flex-sm-row gap-2 gap-sm-0" style={{ maxWidth: '500px' }}>
                  <input type="email" className="form-control border-0 px-4 rounded-pill rounded-sm-end-0 py-3" placeholder="Enter your email address" />
                  <button className="btn text-white px-4 fw-bold rounded-pill rounded-sm-start-0 py-3" style={{ background: '#4f46e5' }}>Subscribe</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;