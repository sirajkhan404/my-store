import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ContactSection from "./ContactSection";
import ServiceSection from "./ServiceSection";
import StoriesBar from "../../../components/Stories/StoriesBar";
import { useCart } from "../../../context/CartContext";

/* ── Theme tokens ───────────────────────────────────── */
const T = {
  primary: "#0d9488",   // teal-600
  primary2: "#0f766e",   // teal-700
  accent: "#f59e0b",   // amber-400
  accent2: "#d97706",   // amber-500
  dark: "#042f2e",   // very dark teal
  dark2: "#134e4a",   // teal-900
  light: "#f0fdfa",   // teal-50
  card: "#ffffff",
  muted: "#6b7280",
};

/* ── FadeIn helper ──────────────────────────────────── */
const FadeIn = ({ children, delay = 0, from = "up" }) => {
  const [v, setV] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.1 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  const t = from === "up" ? "translateY(40px)" : from === "left" ? "translateX(-40px)" : "translateX(40px)";
  return (
    <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "none" : t, transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s` }}>
      {children}
    </div>
  );
};

/* ── Product Card ───────────────────────────────────── */
const ProductCard = ({ product, addedId, onAdd }) => {
  const [hov, setHov] = useState(false);
  const added = addedId === product.id;
  const oos = product.stock <= 0;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: "20px", overflow: "hidden", background: T.card,
        boxShadow: hov ? "0 28px 56px rgba(13,148,136,0.18)" : "0 4px 20px rgba(0,0,0,0.07)",
        transform: hov ? "translateY(-8px)" : "none",
        transition: "all 0.3s ease",
        border: hov ? `1.5px solid ${T.primary}` : "1.5px solid rgba(0,0,0,0.06)",
      }}
    >
      {/* Image */}
      <div style={{ height: "230px", overflow: "hidden", position: "relative", background: T.light }}>
        <img
          src={product.imageURL || "https://via.placeholder.com/300"}
          alt={product.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: hov ? "scale(1.09)" : "scale(1)", transition: "transform 0.5s ease" }}
          onError={e => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/300?text=No+Image"; }}
        />
        {product.category && (
          <span style={{ position: "absolute", top: 10, left: 10, background: "rgba(255,255,255,0.92)", color: T.dark2, fontSize: "10px", padding: "3px 10px", borderRadius: "20px", fontWeight: 600, backdropFilter: "blur(4px)" }}>
            {product.category}
          </span>
        )}
        {oos ? (
          <span style={{ position: "absolute", top: 10, right: 10, background: "#ef4444", color: "#fff", fontSize: "10px", padding: "3px 10px", borderRadius: "20px", fontWeight: 700 }}>Out of Stock</span>
        ) : product.stock <= 5 ? (
          <span style={{ position: "absolute", top: 10, right: 10, background: T.accent, color: T.dark, fontSize: "10px", padding: "3px 10px", borderRadius: "20px", fontWeight: 700 }}>Only {product.stock} left</span>
        ) : (
          <span style={{ position: "absolute", top: 10, right: 10, background: T.primary, color: "#fff", fontSize: "10px", padding: "3px 10px", borderRadius: "20px", fontWeight: 700 }}>In Stock</span>
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(4,47,46,0.55) 0%, transparent 55%)", opacity: hov ? 1 : 0, transition: "opacity 0.3s ease" }} />
      </div>

      {/* Body */}
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <h6 style={{ fontWeight: 700, color: T.dark, margin: 0, fontSize: "14px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={product.name}>{product.name}</h6>
        <p style={{ color: T.muted, fontSize: "12px", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={product.description}>{product.description}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
          <span style={{ fontWeight: 800, fontSize: "17px", color: T.primary }}>Rs. {Number(product.price).toLocaleString()}</span>
        </div>
        <button
          onClick={() => onAdd(product)}
          disabled={oos}
          style={{
            width: "100%", padding: "10px", borderRadius: "40px", border: "none", fontWeight: 700, fontSize: "13px", color: "#fff",
            background: added ? "linear-gradient(135deg,#10b981,#059669)" : oos ? "#d1d5db" : `linear-gradient(135deg, ${T.primary}, ${T.primary2})`,
            cursor: oos ? "not-allowed" : "pointer",
            transition: "all 0.3s ease",
            boxShadow: oos ? "none" : hov ? `0 8px 20px rgba(13,148,136,0.4)` : "none",
          }}
        >
          {added ? "✓ Added to Cart!" : oos ? "Out of Stock" : "🛒 Add to Cart"}
        </button>
      </div>
    </div>
  );
};

/* ── Home Page ──────────────────────────────────────── */
const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);
  const { addToCart } = useCart();

  const handleAdd = (p) => {
    if (p.stock <= 0) return;
    addToCart(p);
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1600);
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${window.api}/api/products/public-all`);
        setProducts(data.products || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const recent = [...products].reverse().slice(0, 8);

  const cats = [
    { icon: "📱", name: "Electronics" }, { icon: "👕", name: "Fashion" },
    { icon: "🏠", name: "Home & Living" }, { icon: "👟", name: "Footwear" },
    { icon: "⌚", name: "Accessories" }, { icon: "🎮", name: "Gaming" },
    { icon: "📚", name: "Books" }, { icon: "🎁", name: "Gifts" },
  ];

  const stats = [
    { v: "10K+", l: "Happy Customers", icon: "😊" },
    { v: "5K+", l: "Products Listed", icon: "📦" },
    { v: "99%", l: "Satisfaction Rate", icon: "⭐" },
    { v: "24/7", l: "Customer Support", icon: "🎧" },
  ];

  const trust = [
    { icon: "🚀", t: "Express Delivery", s: "Same day available" },
    { icon: "🛡️", t: "Secure Payment", s: "256-bit encryption" },
    { icon: "🔄", t: "Easy Returns", s: "30-day free returns" },
    { icon: "🎧", t: "24/7 Support", s: "Always here for you" },
  ];

  return (
    <main style={{ fontFamily: "'Inter','Segoe UI',sans-serif", background: "#f8fffe" }}>

      {/* ══ HERO ════════════════════════════════════════ */}
      <section style={{
        background: `linear-gradient(135deg, ${T.dark} 0%, ${T.dark2} 45%, #155e75 100%)`,
        minHeight: "92vh", display: "flex", alignItems: "center",
        position: "relative", overflow: "hidden",
      }}>
        {/* Glow orbs */}
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, rgba(13,148,136,0.25) 0%, transparent 70%)`, top: -150, right: -150, pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", background: `radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 70%)`, bottom: -80, left: -60, pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, rgba(13,148,136,0.15) 0%, transparent 70%)`, top: "40%", left: "30%", pointerEvents: "none" }} />

        <div className="container position-relative py-5" style={{ zIndex: 1 }}>
          <div className="row align-items-center g-5">

            {/* Left */}
            <div className="col-12 col-lg-6">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-4"
                style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.35)", backdropFilter: "blur(8px)" }}>
                <span style={{ background: T.accent, color: T.dark, borderRadius: "40px", padding: "2px 10px", fontSize: "11px", fontWeight: 800 }}>NEW</span>
                <span style={{ color: "#fde68a", fontSize: "13px", fontWeight: 600 }}>Summer 2026 Collection is Live! 🌿</span>
              </div>

              <h1 style={{ fontSize: "clamp(2.2rem,5vw,3.8rem)", fontWeight: 900, color: "#fff", lineHeight: 1.15, letterSpacing: "-1.5px", marginBottom: "1.5rem" }}>
                Shop Smarter,{" "}
                <span style={{ background: `linear-gradient(135deg, ${T.accent}, #fbbf24)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Live Better
                </span>
              </h1>

              <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "17px", lineHeight: 1.75, maxWidth: "480px", marginBottom: "2rem" }}>
                Discover thousands of premium products at unbeatable prices. Fast delivery, secure payments, and a seamless shopping experience — all in one place.
              </p>

              <div className="d-flex flex-wrap gap-3 mb-5">
                <Link to="/products" className="btn btn-lg rounded-pill fw-bold px-5"
                  style={{ background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`, color: T.dark, border: "none", boxShadow: `0 10px 32px rgba(245,158,11,0.45)`, fontSize: "15px" }}>
                  Shop Now →
                </Link>
                <Link to="/about" className="btn btn-lg rounded-pill fw-semibold px-4"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", backdropFilter: "blur(8px)" }}>
                  Learn More
                </Link>
              </div>

              <div className="d-flex flex-wrap gap-4">
                {[["10K+", "Customers"], ["5K+", "Products"], ["4.9★", "Rating"]].map(([v, l], i) => (
                  <div key={i}>
                    <div style={{ fontWeight: 800, fontSize: "1.6rem", color: T.accent }}>{v}</div>
                    <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "13px" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right glass card */}
            <div className="col-lg-6 d-none d-lg-flex justify-content-center">
              <div style={{ position: "relative", width: 420 }}>
                <div style={{
                  padding: "48px 40px", borderRadius: "28px", textAlign: "center",
                  background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 40px 80px rgba(0,0,0,0.35)",
                  transform: "rotate(2deg)",
                }}>
                  <div style={{ fontSize: 88, lineHeight: 1, filter: "drop-shadow(0 16px 28px rgba(0,0,0,0.35))" }}>🛍️</div>
                  <h4 style={{ fontWeight: 800, color: "#fff", marginTop: 24, marginBottom: 8 }}>Premium Collection</h4>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, marginBottom: 24 }}>Curated picks just for you</p>
                  <div className="d-flex justify-content-center gap-2">
                    {["📱", "👕", "⌚", "👟"].map((e, i) => (
                      <span key={i} style={{ borderRadius: 12, padding: "8px 12px", background: "rgba(255,255,255,0.1)", fontSize: 20 }}>{e}</span>
                    ))}
                  </div>
                </div>

                {/* Floating badges */}
                <div style={{ position: "absolute", bottom: -24, left: -40, borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(14px)", border: "1px solid rgba(255,255,255,0.15)", transform: "rotate(-4deg)" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16, flexShrink: 0 }}>✓</div>
                  <div>
                    <div style={{ fontWeight: 700, color: "#fff", fontSize: 13 }}>Order Delivered</div>
                    <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 10 }}>Just now · Pakistan</div>
                  </div>
                </div>
                <div style={{ position: "absolute", top: -20, right: -36, borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(14px)", border: "1px solid rgba(255,255,255,0.15)", transform: "rotate(3deg)" }}>
                  <span style={{ fontSize: 24 }}>🔥</span>
                  <div>
                    <div style={{ fontWeight: 700, color: "#fff", fontSize: 13 }}>Trending Today</div>
                    <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 10 }}>120+ sold</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 90" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
            <path d="M0 45 C360 90 1080 0 1440 45 L1440 90 L0 90 Z" fill="#f8fffe" />
          </svg>
        </div>
      </section>

      {/* ══ STORIES BAR ════════════════════════════════ */}
      <StoriesBar />

      {/* ══ TRUST STRIP ════════════════════════════════ */}
      <section style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "28px 0" }}>
        <div className="container">
          <div className="row g-3">
            {trust.map((f, i) => (
              <div key={i} className="col-6 col-md-3">
                <div className="d-flex flex-column flex-md-row align-items-center gap-3 p-3 rounded-4"
                  style={{ background: i % 2 === 0 ? "#f0fdfa" : "#fffbeb" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: `linear-gradient(135deg, ${T.light}, #ccfbf1)` }}>
                    {f.icon}
                  </div>
                  <div className="text-center text-md-start">
                    <div style={{ fontWeight: 700, color: T.dark, fontSize: 14 }}>{f.t}</div>
                    <div style={{ color: T.muted, fontSize: 12 }}>{f.s}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRODUCTS ════════════════════════════════════ */}
      <section style={{ background: "#fff", padding: "64px 0" }}>
        <div className="container">
          <FadeIn>
            <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-5">
              <div>
                <span style={{ background: `linear-gradient(135deg,#fef3c7,#fde68a)`, color: T.accent2, fontSize: 12, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", padding: "5px 16px", borderRadius: 40, display: "inline-block", marginBottom: 12 }}>
                  🔥 Just Arrived
                </span>
                <h2 style={{ fontWeight: 800, color: T.dark, fontSize: "2rem", marginBottom: 4 }}>Trending Products</h2>
                <p style={{ color: T.muted, fontSize: 14, margin: 0 }}>Explore our freshest arrivals handpicked for you</p>
              </div>
              <Link to="/products" className="btn rounded-pill fw-semibold px-4"
                style={{ border: `2px solid ${T.primary}`, color: T.primary, fontSize: 14 }}>
                View All →
              </Link>
            </div>
          </FadeIn>

          {loading ? (
            <div className="text-center py-5">
              <div style={{ width: 52, height: 52, borderRadius: "50%", border: `4px solid #ccfbf1`, borderTopColor: T.primary, animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
              <span style={{ color: T.muted, fontWeight: 600 }}>Loading products...</span>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : recent.length === 0 ? (
            <div className="text-center py-5 rounded-4" style={{ background: T.light }}>
              <div style={{ fontSize: "3.5rem" }}>📭</div>
              <h5 style={{ color: T.dark, marginTop: 16 }}>No products yet</h5>
            </div>
          ) : (
            <div className="row g-4">
              {recent.map((p, i) => (
                <div key={p.id} className="col-12 col-sm-6 col-md-4 col-xl-3">
                  <FadeIn delay={i * 0.07}>
                    <ProductCard product={p} addedId={addedId} onAdd={handleAdd} />
                  </FadeIn>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-5 d-md-none">
            <Link to="/products" className="btn rounded-pill px-5 py-2 fw-semibold"
              style={{ border: `2px solid ${T.primary}`, color: T.primary }}>
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* ══ STATS BANNER ════════════════════════════════ */}
      <section style={{ background: `linear-gradient(135deg, ${T.dark} 0%, ${T.dark2} 60%, #155e75 100%)`, padding: "64px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 25% 50%, rgba(245,158,11,0.15) 0%, transparent 60%)`, pointerEvents: "none" }} />
        <div className="container position-relative">
          <div className="row g-4 text-center">
            {stats.map((s, i) => (
              <div key={i} className="col-6 col-md-3">
                <FadeIn delay={i * 0.1}>
                  <div style={{ padding: "28px 20px", borderRadius: 20, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
                    <div style={{ fontSize: "2rem", marginBottom: 8 }}>{s.icon}</div>
                    <div style={{ fontWeight: 800, fontSize: "2rem", background: `linear-gradient(135deg, ${T.accent}, #fbbf24)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 4 }}>{s.v}</div>
                    <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 600 }}>{s.l}</div>
                  </div>
                </FadeIn>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SERVICES ════════════════════════════════════ */}
      <ServiceSection />

      {/* ══ CTA ═════════════════════════════════════════ */}
      <section style={{ background: "linear-gradient(135deg,#f0fdfa,#fffbeb)", padding: "64px 0" }}>
        <div className="container">
          <FadeIn>
            <div style={{ borderRadius: 28, padding: "64px 40px", textAlign: "center", position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${T.dark} 0%, ${T.dark2} 50%, #0e7490 100%)`, boxShadow: `0 24px 60px rgba(4,47,46,0.35)` }}>
              <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 70% 30%, rgba(245,158,11,0.12) 0%, transparent 60%)`, pointerEvents: "none" }} />
              <div style={{ position: "relative" }}>
                <span style={{ fontSize: "3rem" }}>🛍️</span>
                <h2 style={{ fontWeight: 900, color: "#fff", fontSize: "2.2rem", marginTop: 20, marginBottom: 14, letterSpacing: "-0.5px" }}>
                  Ready to Start Shopping?
                </h2>
                <p style={{ color: "rgba(255,255,255,0.7)", maxWidth: 480, margin: "0 auto 32px", fontSize: 16, lineHeight: 1.7 }}>
                  Join thousands of happy customers and discover amazing products every day.
                </p>
                <Link to="/products" className="btn btn-lg rounded-pill fw-bold px-5"
                  style={{ background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`, color: T.dark, border: "none", fontSize: 16, boxShadow: `0 10px 32px rgba(245,158,11,0.4)` }}>
                  Explore Full Store →
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ CONTACT ═════════════════════════════════════ */}
      <ContactSection />

    </main>
  );
};

export default Home;
