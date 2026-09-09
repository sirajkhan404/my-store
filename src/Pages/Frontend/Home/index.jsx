import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AboutSection from './AboutSection';
import ContactSection from './ContactSection';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${window.api}/api/products/public-all`);
            setProducts(data.products || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Show only latest 8 products on home page
    const recentProducts = [...products].reverse().slice(0, 8);

    return (
        <main className="flex-grow-1" style={{ background: '#f8f9fa' }}>
            
            {/* ── Custom CSS for Hover Effects ── */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

                * { box-sizing: border-box; }

                /* ── Hero ── */
                .hero-banner {
                    background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #3b82f6 100%);
                    color: white;
                    padding: 80px 0 70px;
                    position: relative;
                    overflow: hidden;
                    font-family: 'Inter', sans-serif;
                }
                .hero-banner::before {
                    content: '';
                    position: absolute;
                    width: 500px; height: 500px;
                    background: radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%);
                    top: -100px; right: -100px;
                    border-radius: 50%;
                }
                .hero-badge {
                    background: rgba(255,255,255,0.12);
                    border: 1px solid rgba(255,255,255,0.2);
                    backdrop-filter: blur(4px);
                    color: white;
                    font-size: 13px;
                }
                .hero-title {
                    font-size: clamp(1.8rem, 5vw, 3rem);
                    font-weight: 800;
                    line-height: 1.2;
                    letter-spacing: -0.5px;
                }
                .hero-emoji {
                    font-size: clamp(4rem, 12vw, 8rem);
                    filter: drop-shadow(0 10px 20px rgba(0,0,0,0.25));
                    line-height: 1;
                }

                /* ── Product Cards ── */
                .product-card {
                    background: white;
                    border-radius: 16px;
                    border: 1px solid #edf2f7;
                    transition: all 0.3s ease;
                    height: 100%;
                    overflow: hidden;
                    font-family: 'Inter', sans-serif;
                }
                .product-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 16px 32px rgba(0,0,0,0.1);
                    border-color: #c7d2fe;
                }
                .product-img-wrapper {
                    height: 200px;
                    background: #f1f5f9;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    position: relative;
                }
                .product-img {
                    width: 100%; height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }
                .product-card:hover .product-img { transform: scale(1.08); }

                .stock-badge {
                    position: absolute; top: 10px; right: 10px; z-index: 2;
                    font-size: 10px; padding: 3px 8px; border-radius: 20px;
                    font-weight: 700; box-shadow: 0 2px 6px rgba(0,0,0,0.12);
                }
                .cat-badge {
                    position: absolute; top: 10px; left: 10px; z-index: 2;
                    font-size: 10px; padding: 3px 8px; border-radius: 20px;
                    font-weight: 600; background: rgba(255,255,255,0.92);
                    color: #475569; box-shadow: 0 2px 4px rgba(0,0,0,0.06);
                    max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
                }
                .shop-btn {
                    background: linear-gradient(135deg,#6366f1,#3b82f6);
                    color: white; border: none;
                    transition: all 0.2s;
                    box-shadow: 0 3px 8px rgba(99,102,241,0.3);
                }
                .shop-btn:hover {
                    background: linear-gradient(135deg,#4f46e5,#2563eb);
                    color: white; transform: scale(1.08);
                }

                /* ── Features ── */
                .features-section {
                    background: white;
                    border-top: 1px solid #edf2f7;
                    border-bottom: 1px solid #edf2f7;
                }
                .feature-box { text-align: center; padding: 20px 12px; }
                .feature-icon {
                    width: 56px; height: 56px;
                    background: linear-gradient(135deg,#ede9fe,#dbeafe);
                    border-radius: 16px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 22px; margin: 0 auto 12px;
                }
                .feature-box h6 { font-size: 14px; font-weight: 700; }
                .feature-box p  { font-size: 12px; }

                /* ── CTA Section ── */
                .cta-section {
                    background: linear-gradient(135deg,#f8fafc,#ede9fe);
                    border-top: 1px solid #e2e8f0;
                }

                /* ── Responsive ── */
                @media (max-width: 575px) {
                    .hero-banner { padding: 48px 0 40px; }
                    .product-img-wrapper { height: 150px; }
                    .product-card .p-3 { padding: 10px !important; }
                    .product-card h6 { font-size: 13px; }
                    .product-card .fs-5 { font-size: 14px !important; }
                    .feature-icon { width: 44px; height: 44px; font-size: 18px; }
                    .feature-box { padding: 14px 8px; }
                }
                @media (max-width: 767px) {
                    .hero-banner { padding: 56px 0 48px; text-align: center; }
                    .hero-banner .lead { font-size: 14px; }
                    .hero-banner .btn { font-size: 14px; padding: 10px 24px; }
                    .product-img-wrapper { height: 170px; }
                }
                @media (min-width: 576px) and (max-width: 991px) {
                    .product-img-wrapper { height: 190px; }
                }
            `}</style>


            <section className="hero-banner">
                <div className="container position-relative z-1">
                    <div className="row align-items-center">
                        <div className="col-lg-7 text-center text-lg-start">
                            <span className="badge hero-badge rounded-pill px-3 py-2 mb-3 d-inline-block">
                                🌟 Welcome to My Store
                            </span>
                            <h1 className="hero-title fw-bold mb-3">
                                Shop the Latest{' '}
                                <span style={{ color: '#93c5fd' }}>Trending Products</span>
                            </h1>
                            <p className="lead mb-4 opacity-75 pe-lg-5">
                                Browse through our exclusive collection of high-quality products. We offer the best prices and fast delivery directly to your doorstep.
                            </p>
                            <Link to="/products" className="btn btn-light btn-lg rounded-pill px-5 fw-bold text-primary shadow">
                                Shop All Products →
                            </Link>
                        </div>
                        <div className="col-lg-5 d-none d-lg-flex justify-content-center align-items-center">
                            <span className="hero-emoji">🛍️</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── About Section ── */}
            <AboutSection />

            {/* ── Features List ── */}
            <section className="features-section py-5">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-md-3 col-6">
                            <div className="feature-box">
                                <div className="feature-icon">🚚</div>
                                <h6 className="fw-bold mb-1">Fast Delivery</h6>
                                <p className="text-muted small mb-0">Nationwide shipping</p>
                            </div>
                        </div>
                        <div className="col-md-3 col-6">
                            <div className="feature-box">
                                <div className="feature-icon">🛡️</div>
                                <h6 className="fw-bold mb-1">Secure Payment</h6>
                                <p className="text-muted small mb-0">100% safe checkout</p>
                            </div>
                        </div>
                        <div className="col-md-3 col-6">
                            <div className="feature-box">
                                <div className="feature-icon">⭐</div>
                                <h6 className="fw-bold mb-1">Best Quality</h6>
                                <p className="text-muted small mb-0">Top products guaranteed</p>
                            </div>
                        </div>
                        <div className="col-md-3 col-6">
                            <div className="feature-box">
                                <div className="feature-icon">🎧</div>
                                <h6 className="fw-bold mb-1">24/7 Support</h6>
                                <p className="text-muted small mb-0">Always here for you</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Trending Products Section ── */}
            <section className="py-5 my-3">
                <div className="container">
                    
                    <div className="d-flex justify-content-between align-items-end mb-4 pb-2 border-bottom">
                        <div>
                            <h2 className="fw-bold mb-1">Trending Products</h2>
                            <p className="text-muted mb-0">Explore our most recently added items</p>
                        </div>
                        <Link to="/products" className="btn btn-outline-primary rounded-pill d-none d-md-block">
                            View All
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-5 my-5">
                            <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }} />
                            <h5 className="text-muted">Loading products...</h5>
                        </div>
                    ) : recentProducts.length === 0 ? (
                        <div className="text-center py-5 my-5 bg-white rounded-4 border">
                            <div className="display-1 mb-3">📭</div>
                            <h4>No products available right now</h4>
                            <p className="text-muted">Please check back later!</p>
                        </div>
                    ) : (
                        <div className="row g-3 g-md-4">
                            {recentProducts.map(product => (
                                <div key={product.id} className="col-12 col-sm-6 col-md-4 col-xl-3">
                                    <div className="product-card d-flex flex-column">
                                        
                                        {/* Image Section */}
                                        <div className="product-img-wrapper">
                                            {/* Category Tag */}
                                            {product.category && (
                                                <span className="cat-badge">
                                                    {product.category}
                                                </span>
                                            )}
                                            
                                            {/* Stock Status Tag */}
                                            {product.stock <= 0 ? (
                                                <span className="stock-badge bg-danger text-white">Out of Stock</span>
                                            ) : product.stock <= 5 ? (
                                                <span className="stock-badge bg-warning text-dark">Low Stock ({product.stock})</span>
                                            ) : (
                                                <span className="stock-badge bg-success text-white">In Stock</span>
                                            )}
                                            
                                            <img
                                                src={product.imageURL || 'https://via.placeholder.com/300'}
                                                alt={product.name}
                                                className="product-img"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/300?text=No+Image';
                                                }}
                                            />
                                        </div>

                                        {/* Details Section */}
                                        <div className="p-3 d-flex flex-column flex-grow-1">
                                            <h6 className="fw-bold text-dark mb-1 text-truncate" title={product.name}>
                                                {product.name}
                                            </h6>
                                            <p className="text-muted small mb-2 text-truncate" title={product.description}>
                                                {product.description}
                                            </p>
                                            
                                            <div className="mt-auto d-flex justify-content-between align-items-center pt-2">
                                                <span className="fs-5 fw-bold text-primary">
                                                    Rs. {Number(product.price).toLocaleString()}
                                                </span>
                                                <Link 
                                                    to="/products" 
                                                    className="btn btn-sm rounded-circle shop-btn"
                                                    style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                    title="View in Products"
                                                >
                                                    🛒
                                                </Link>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <div className="text-center mt-5 d-md-none">
                        <Link to="/products" className="btn btn-outline-primary rounded-pill w-100">
                            View All Products
                        </Link>
                    </div>

                </div>
            </section>
            
            {/* ── Call to Action ── */}
            <section className="cta-section py-5">
                <div className="container py-3 text-center">
                    <h3 className="fw-bold mb-3" style={{ fontSize:'clamp(1.2rem,4vw,1.6rem)' }}>Didn't find what you're looking for?</h3>
                    <p className="text-muted mb-4" style={{ fontSize:'clamp(13px,2.5vw,16px)' }}>We have hundreds of products across multiple categories waiting for you.</p>
                    <Link to="/products" className="btn btn-primary btn-lg rounded-pill px-5 shadow-sm">
                        Explore Full Store 🛍️
                    </Link>
                </div>
            </section>

            {/* ── Contact Section ── */}
            <ContactSection />

        </main>
    );
};

export default Home;