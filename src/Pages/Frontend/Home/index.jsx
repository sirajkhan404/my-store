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
        <main className="d-flex flex-column flex-grow-1 bg-light" style={{ fontFamily: "'Inter', sans-serif" }}>

            {/* ── Hero ── */}
            <section className="text-white position-relative overflow-hidden py-5 py-md-6 py-lg-7"
                style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #3b82f6 100%)' }}>

                {/* Background glow shape */}
                <div className="position-absolute rounded-circle pointer-event-none"
                    style={{ width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', top: '-100px', right: '-100px', zIndex: 0 }}></div>

                <div className="container position-relative py-4" style={{ zIndex: 1 }}>
                    <div className="row align-items-center">
                        <div className="col-12 col-lg-7 text-center text-lg-start">
                            <span className="badge rounded-pill px-3 py-2 mb-3 d-inline-block fw-semibold"
                                style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', fontSize: '13px', backdropFilter: 'blur(4px)' }}>
                                🌟 Welcome to My Store
                            </span>
                            <h1 className="fw-extrabold display-5 display-md-3 mb-3" style={{ letterSpacing: '-0.5px' }}>
                                Shop the Latest{' '}
                                <span style={{ color: '#93c5fd' }}>Trending Products</span>
                            </h1>
                            <p className="lead mb-4 opacity-75 fs-6 fs-md-5 pe-lg-5">
                                Browse through our exclusive collection of high-quality products. We offer the best prices and fast delivery directly to your doorstep.
                            </p>
                            <Link to="/products" className="btn btn-light btn-lg rounded-pill px-5 fw-bold text-primary shadow">
                                Shop All Products →
                            </Link>
                        </div>
                        <div className="col-lg-5 d-none d-lg-flex justify-content-center align-items-center">
                            <span style={{ fontSize: '8rem', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.25))', lineHeight: 1 }}>🛍️</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── About Section ── */}
            <AboutSection />

            {/* ── Features List ── */}
            <section className="bg-white border-top border-bottom py-5">
                <div className="container py-2">
                    <div className="row g-4">
                        {[
                            { icon: '🚚', title: 'Fast Delivery', desc: 'Nationwide shipping' },
                            { icon: '🛡️', title: 'Secure Payment', desc: '100% safe checkout' },
                            { icon: '⭐', title: 'Best Quality', desc: 'Top products guaranteed' },
                            { icon: '🎧', title: '24/7 Support', desc: 'Always here for you' },
                        ].map((feat, i) => (
                            <div key={i} className="col-6 col-md-3">
                                <div className="text-center p-3">
                                    <div className="d-flex align-items-center justify-content-center rounded-4 mx-auto mb-3 shadow-sm"
                                        style={{ width: '56px', height: '56px', fontSize: '22px', background: 'linear-gradient(135deg,#ede9fe,#dbeafe)' }}>
                                        {feat.icon}
                                    </div>
                                    <h6 className="fw-bold mb-1 text-dark fs-6">{feat.title}</h6>
                                    <p className="text-muted small mb-0" style={{ fontSize: '12px' }}>{feat.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Trending Products Section ── */}
            <section className="py-5 my-3">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-end mb-4 pb-2 border-bottom">
                        <div>
                            <h2 className="fw-bold mb-1 fs-3 fs-md-2 text-dark">Trending Products</h2>
                            <p className="text-muted mb-0 small">Explore our most recently added items</p>
                        </div>
                        <Link to="/products" className="btn btn-outline-primary rounded-pill d-none d-md-block px-4">
                            View All
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-5 my-5">
                            <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }} />
                            <h5 className="text-muted">Loading products...</h5>
                        </div>
                    ) : recentProducts.length === 0 ? (
                        <div className="text-center py-5 my-5 bg-white rounded-4 border shadow-sm">
                            <div className="display-1 mb-3">📭</div>
                            <h4 className="text-dark">No products available right now</h4>
                            <p className="text-muted">Please check back later!</p>
                        </div>
                    ) : (
                        <div className="row g-3 g-md-4">
                            {recentProducts.map(product => (
                                <div key={product.id} className="col-12 col-sm-6 col-md-4 col-xl-3">
                                    <div className="card h-100 bg-white border border-light-subtle rounded-4 overflow-hidden shadow-sm transition-all">

                                        {/* Image Section */}
                                        <div className="position-relative bg-light overflow-hidden" style={{ height: '220px' }}>
                                            {product.category && (
                                                <span className="position-absolute top-0 start-0 m-2 z-2 px-2 py-1 rounded-pill bg-white bg-opacity-75 text-secondary fw-semibold text-truncate shadow-sm"
                                                    style={{ fontSize: '10px', maxWidth: '90px' }}>
                                                    {product.category}
                                                </span>
                                            )}

                                            {product.stock <= 0 ? (
                                                <span className="position-absolute top-0 end-0 m-2 z-2 badge bg-danger text-white rounded-pill" style={{ fontSize: '10px' }}>Out of Stock</span>
                                            ) : product.stock <= 5 ? (
                                                <span className="position-absolute top-0 end-0 m-2 z-2 badge bg-warning text-dark rounded-pill" style={{ fontSize: '10px' }}>Low Stock ({product.stock})</span>
                                            ) : (
                                                <span className="position-absolute top-0 end-0 m-2 z-2 badge bg-success text-white rounded-pill" style={{ fontSize: '10px' }}>In Stock</span>
                                            )}

                                            <img
                                                src={product.imageURL || 'https://via.placeholder.com/300'}
                                                alt={product.name}
                                                className="w-100 h-100 object-fit-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/300?text=No+Image';
                                                }}
                                            />
                                        </div>

                                        {/* Details Section */}
                                        <div className="card-body p-3 d-flex flex-column flex-grow-1">
                                            <h6 className="fw-bold text-dark mb-1 text-truncate fs-6" title={product.name}>
                                                {product.name}
                                            </h6>
                                            <p className="text-muted small mb-3 text-truncate" style={{ fontSize: '12px' }} title={product.description}>
                                                {product.description}
                                            </p>

                                            <div className="mt-auto d-flex justify-content-between align-items-center pt-2">
                                                <span className="fs-6 fs-md-5 fw-bold text-primary">
                                                    Rs. {Number(product.price).toLocaleString()}
                                                </span>
                                                <Link
                                                    to="/products"
                                                    className="btn btn-sm rounded-circle text-white shadow-sm d-flex align-items-center justify-content-center"
                                                    style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#6366f1,#3b82f6)', border: 'none' }}
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

                    <div className="text-center mt-4 d-md-none">
                        <Link to="/products" className="btn btn-outline-primary rounded-pill w-100 py-2">
                            View All Products
                        </Link>
                    </div>

                </div>
            </section>

            {/* ── Call to Action ── */}
            <section className="py-5 border-top" style={{ background: 'linear-gradient(135deg,#f8fafc,#ede9fe)' }}>
                <div className="container py-3 text-center">
                    <h3 className="fw-bold mb-3 fs-4">Didn't find what you're looking for?</h3>
                    <p className="text-muted mb-4 small fs-6">We have hundreds of products across multiple categories waiting for you.</p>
                    <Link to="/products" className="btn btn-primary btn-lg rounded-pill px-5 shadow-sm fw-semibold">
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