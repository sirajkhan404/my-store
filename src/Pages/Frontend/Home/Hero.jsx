import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <>
      <style>{`
        .hero-section {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          position: relative;
          overflow: hidden;
        }
        .hero-shape {
          position: absolute;
          width: 500px;
          height: 500px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          filter: blur(80px);
          top: -20%;
          right: -10%;
          z-index: 0;
        }
        .hero-content {
          position: relative;
          z-index: 1;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .glass-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .feature-card {
          background: #ffffff;
          border-radius: 1rem;
          border: none;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .feature-icon-wrapper {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
        }
        .text-gradient {
          background: linear-gradient(135deg, #4f46e5 0%, #c026d3 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .btn-glow {
          background: linear-gradient(45deg, #f59e0b, #ef4444);
          border: none;
          color: white;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
          transition: all 0.3s;
        }
        .btn-glow:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.6);
          color: white;
        }
        .cat-card {
          transition: transform 0.3s ease;
          border: 1px solid #f3f4f6;
          border-radius: 16px;
        }
        .cat-card:hover {
          transform: translateY(-8px);
          border-color: #c7d2fe;
          background: #f8fafc;
        }
      `}</style>

      {/* ── Hero Section (Gradient & Glassmorphism) ── */}
      <section className="hero-section text-white pt-5 pb-5 pb-lg-0 min-vh-100 d-flex align-items-center">
        <div className="hero-shape"></div>
        <div className="container hero-content py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-4" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <span className="badge bg-warning text-dark rounded-pill">NEW</span>
                <span className="small fw-semibold">Discover our latest summer collection</span>
              </div>
              <h1 className="display-3 fw-bold mb-4" style={{ lineHeight: 1.2 }}>
                Elevate Your <br />
                Shopping <span style={{ color: '#fbbf24' }}>Experience</span>
              </h1>
              <p className="lead mb-5 opacity-75 pe-lg-5" style={{ fontSize: '1.1rem' }}>
                Explore a curated selection of premium products. Fast shipping, secure payments, and a seamless shopping journey tailored just for you.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/products" className="btn btn-glow btn-lg px-5 rounded-pill fw-bold">
                  Shop Now <i className="ms-2">→</i>
                </Link>
                <Link to="/about" className="btn btn-lg px-5 rounded-pill fw-semibold" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}>
                  Explore Features
                </Link>
              </div>
              
              <div className="d-flex align-items-center gap-4 mt-5 pt-3">
                <div>
                  <h3 className="fw-bold mb-0">10k+</h3>
                  <p className="small opacity-75 mb-0">Active Users</p>
                </div>
                <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.2)' }}></div>
                <div>
                  <h3 className="fw-bold mb-0">5k+</h3>
                  <p className="small opacity-75 mb-0">Products</p>
                </div>
                <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.2)' }}></div>
                <div>
                  <div className="d-flex text-warning fs-5">★★★★★</div>
                  <p className="small opacity-75 mb-0">4.9/5 Rating</p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6 position-relative d-none d-lg-block">
              {/* Abstract Hero Image/Card representation */}
              <div className="glass-card rounded-4 p-5 text-center mx-auto" style={{ maxWidth: '400px', transform: 'rotate(5deg)' }}>
                <div className="mb-4">
                  <div className="d-inline-flex align-items-center justify-content-center bg-white rounded-circle shadow" style={{ width: 80, height: 80, fontSize: 35 }}>
                    🛍️
                  </div>
                </div>
                <h3 className="fw-bold mb-2">Premium Quality</h3>
                <p className="opacity-75 mb-4">Handpicked items for your daily lifestyle.</p>
                <div className="glass-card p-3 rounded-3 text-start d-flex align-items-center gap-3 mt-4" style={{ transform: 'rotate(-5deg) translateX(-30px)' }}>
                  <div className="bg-success rounded-circle d-flex align-items-center justify-content-center text-white" style={{ width: 40, height: 40 }}>✓</div>
                  <div>
                    <div className="fw-bold small">Order Delivered</div>
                    <div style={{ fontSize: '10px', opacity: 0.7 }}>Just now</div>
                  </div>
                </div>
                <div className="glass-card p-3 rounded-3 text-start d-flex align-items-center gap-3 mt-3" style={{ transform: 'rotate(2deg) translateX(30px)' }}>
                  <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center text-white" style={{ width: 40, height: 40 }}>★</div>
                  <div>
                    <div className="fw-bold small">Special Discount</div>
                    <div style={{ fontSize: '10px', opacity: 0.7 }}>Applied to cart</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories Section (Clean & Modern) ── */}
      <section className="py-5" style={{ background: '#f8fafc' }}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <span className="text-primary fw-bold small text-uppercase tracking-wider">Top Collections</span>
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
                  <div className="cat-card p-4 text-center bg-white h-100">
                    <div className="display-4 mb-3" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>{cat.icon}</div>
                    <h6 className="fw-bold text-dark mb-1">{cat.name}</h6>
                    <small className="text-muted">{cat.count}</small>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section (Cards with hover effects) ── */}
      <section className="py-5">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-5">
              <h2 className="display-5 fw-bold mb-4">Why we are the <span className="text-gradient">best choice</span> for you</h2>
              <p className="lead text-muted mb-4">We provide a seamless shopping experience with top-notch services, ensuring you get exactly what you need without any hassle.</p>
              <Link to="/about" className="btn btn-outline-dark btn-lg rounded-pill px-4">Learn more about us</Link>
            </div>
            <div className="col-lg-7">
              <div className="row g-4">
                {[
                  { icon: '🚀', title: 'Fast Delivery', desc: 'Get your orders delivered within 2-3 business days nationwide.' },
                  { icon: '🛡️', title: 'Secure Checkout', desc: 'Your payment information is encrypted and 100% safe with us.' },
                  { icon: '💸', title: 'Best Prices', desc: 'We offer highly competitive prices and regular discount deals.' },
                  { icon: '🎧', title: '24/7 Support', desc: 'Our dedicated team is always ready to assist you anytime.' },
                ].map((feat, i) => (
                  <div key={i} className="col-md-6">
                    <div className="feature-card p-4 h-100">
                      <div className="feature-icon-wrapper shadow-sm">
                        {feat.icon}
                      </div>
                      <h5 className="fw-bold mb-2">{feat.title}</h5>
                      <p className="text-muted small mb-0">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Newsletter CTA ── */}
      <section className="py-5">
        <div className="container pb-5">
          <div className="rounded-4 p-5 position-relative overflow-hidden shadow-lg" style={{ background: 'linear-gradient(45deg, #1e293b, #0f172a)' }}>
            {/* Background shapes */}
            <div className="position-absolute rounded-circle" style={{ width: 300, height: 300, background: 'rgba(99,102,241,0.2)', filter: 'blur(50px)', top: '-10%', right: '-5%' }}></div>
            <div className="position-absolute rounded-circle" style={{ width: 200, height: 200, background: 'rgba(236,72,153,0.2)', filter: 'blur(50px)', bottom: '-10%', left: '-5%' }}></div>
            
            <div className="row justify-content-center position-relative z-1 text-center">
              <div className="col-lg-8">
                <h2 className="display-6 fw-bold text-white mb-3">Join our Newsletter</h2>
                <p className="text-white-50 mb-4 lead">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
                <div className="input-group input-group-lg mx-auto shadow" style={{ maxWidth: '500px' }}>
                  <input type="email" className="form-control border-0 px-4" placeholder="Enter your email address" style={{ borderTopLeftRadius: '50px', borderBottomLeftRadius: '50px' }} />
                  <button className="btn text-white px-4 fw-bold" style={{ background: '#4f46e5', borderTopRightRadius: '50px', borderBottomRightRadius: '50px' }}>Subscribe</button>
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