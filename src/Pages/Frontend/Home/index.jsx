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
                .hero-banner {
                    background: linear-gradient(135deg, #0f172a 0%, #3b82f6 100%);
                    color: white;
                    padding: 80px 0;
                    position: relative;
                    overflow: hidden;
                }
                .hero-badge {
                    background: rgba(255,255,255,0.15);
                    border: 1px solid rgba(255,255,255,0.2);
                    backdrop-filter: blur(4px);
                    color: white;
                }
                .product-card {
                    background: white;
                    border-radius: 16px;
                    border: 1px solid #edf2f7;
                    transition: all 0.3s ease;
                    height: 100%;
                    overflow: hidden;
                }
                .product-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 12px 24px rgba(0,0,0,0.08);
                    border-color: #cbd5e1;
                }
                .product-img-wrapper {
                    height: 220px;
                    background: #f1f5f9;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    position: relative;
                }
                .product-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }
                .product-card:hover .product-img {
                    transform: scale(1.08);
                }
                .stock-badge {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    z-index: 2;
                    font-size: 11px;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-weight: 600;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .cat-badge {
                    position: absolute;
                    top: 12px;
                    left: 12px;
                    z-index: 2;
                    font-size: 11px;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-weight: 600;
                    background: rgba(255,255,255,0.9);
                    color: #475569;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                .shop-btn {
                    background: #3b82f6;
                    color: white;
                    border: none;
                    transition: background 0.2s;
                }
                .shop-btn:hover {
                    background: #2563eb;
                    color: white;
                }
                .features-section {
                    background: white;
                    border-top: 1px solid #edf2f7;
                    border-bottom: 1px solid #edf2f7;
                }
                .feature-box {
                    text-align: center;
                    padding: 24px;
                }
                .feature-icon {
                    width: 60px;
                    height: 60px;
                    background: #eff6ff;
                    color: #3b82f6;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    margin: 0 auto 16px;
                }
            `}</style>

            {/* ── Hero Banner ── */}
            <section className="hero-banner">
                <div className="container position-relative z-1">
                    <div className="row align-items-center">
                        <div className="col-lg-7 text-center text-lg-start">
                            <span className="badge hero-badge rounded-pill px-3 py-2 mb-3">
                                🌟 Welcome to My Store
                            </span>
                            <h1 className="display-4 fw-bold mb-3 lh-sm">
                                Shop the Latest <br />
                                <span style={{ color: '#93c5fd' }}>Trending Products</span>
                            </h1>
                            <p className="lead mb-4 opacity-75 pe-lg-5">
                                Browse through our exclusive collection of high-quality products. We offer the best prices and fast delivery directly to your doorstep.
                            </p>
                            <Link to="/products" className="btn btn-light btn-lg rounded-pill px-4 fw-bold text-primary shadow">
                                Shop All Products →
                            </Link>
                        </div>
                        <div className="col-lg-5 d-none d-lg-block text-center">
                            <div className="display-1" style={{ fontSize: '8rem', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))' }}>
                                🛍️
                            </div>
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
                        <div className="row g-4">
                            {recentProducts.map(product => (
                                <div key={product.id} className="col-6 col-md-4 col-xl-3">
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
            <section className="py-5 bg-white border-top">
                <div className="container py-4 text-center">
                    <h3 className="fw-bold mb-3">Didn't find what you're looking for?</h3>
                    <p className="text-muted mb-4">We have hundreds of products across multiple categories waiting for you.</p>
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