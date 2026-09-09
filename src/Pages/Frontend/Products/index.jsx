import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '@/context/Auth'

const Products = () => {

  const { isAuth, user } = useAuth()
  const location = useLocation()
  
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Check URL for search query
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const query = params.get('search')
    if (query) {
      setSearchQuery(query)
    } else {
      setSearchQuery('')
    }
  }, [location.search])

  // Order modal state
  const [orderModal, setOrderModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [orderLoading, setOrderLoading] = useState(false)
  const [quantity, setQuantity] = useState(1)

  // Shipping form state
  const [shippingForm, setShippingForm] = useState({ fullName: '', phone: '', address: '', city: '' })
  const [formErrors, setFormErrors] = useState({})

  // ── Fetch public products ──────────────────────────────────────────
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${window.api}/api/products/public-all`)
      setProducts(data.products || [])
    } catch (err) {
      window.toastify('Failed to load products', 'error')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  // ── Extract Categories ──────────────────────────────────────────────
  const categoriesList = ['All', ...new Set(products.map(p => p.category).filter(Boolean))]

  // ── Filtered Products ───────────────────────────────────────────────
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category?.toLowerCase() === selectedCategory.toLowerCase()
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // ── Open Order modal ───────────────────────────────────────────────
  const openOrderModal = (product) => {
    if (!isAuth) {
      window.toastify('Please login to place an order', 'warning')
      return
    }
    if (user && user.role !== 'customer') {
      window.toastify('Only customers can place orders!', 'error')
      return
    }
    setSelectedProduct(product)
    setQuantity(1)
    setShippingForm({ fullName: '', phone: '', address: '', city: '' })
    setFormErrors({})
    setOrderModal(true)
  }

  const closeOrderModal = () => {
    setOrderModal(false)
    setSelectedProduct(null)
    setFormErrors({})
  }

  // ── Validate shipping form ─────────────────────────────────────────
  const validate = () => {
    const errors = {}
    if (!shippingForm.fullName.trim()) errors.fullName = 'Please enter your full name'
    if (!shippingForm.phone.trim()) errors.phone = 'Please enter your phone number'
    if (!shippingForm.address.trim()) errors.address = 'Please enter your address'
    if (!shippingForm.city.trim()) errors.city = 'Please enter your city'
    return errors
  }

  // ── Submit Order ───────────────────────────────────────────────────
  const handleOrderSubmit = async (e) => {
    e.preventDefault()
    const errors = validate()
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return }

    try {
      setOrderLoading(true)
      const token = localStorage.getItem('jwt')

      const orderPayload = {
        products: [{
          productId: selectedProduct.id,
          name: selectedProduct.name,
          price: selectedProduct.price,
          quantity: quantity,
          imageURL: selectedProduct.imageURL,
        }],
        shippingAddress: { ...shippingForm },
        totalAmount: selectedProduct.price * quantity,
      }

      await axios.post(
        `${window.api}/api/orders/create`,
        orderPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      window.toastify('Order placed successfully! 🎉', 'success')
      closeOrderModal()

    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to place order'
      window.toastify(msg, 'error')
      console.error(err)
    } finally {
      setOrderLoading(false)
    }
  }

  return (
    <main style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>

      {/* ── Custom CSS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        /* ── Header ── */
        .shop-header {
          background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #3b82f6 100%);
          color: white;
          padding: clamp(48px, 9vw, 90px) 0 clamp(40px, 7vw, 70px);
          position: relative;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }
        .shop-header::before {
          content: '';
          position: absolute;
          width: 360px; height: 360px;
          background: radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%);
          border-radius: 50%;
          top: -100px; right: -80px;
        }
        .shop-header h1 { font-size: clamp(1.8rem, 5vw, 3rem); font-weight: 800; }
        .shop-header p   { font-size: clamp(13px, 2vw, 17px); }

        /* ── Filter Card ── */
        .filter-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          margin-top: -28px;
          position: relative;
          z-index: 10;
          border: 1px solid #e2e8f0;
          padding: clamp(16px, 3vw, 24px);
        }
        .search-input {
          border-radius: 12px;
          background: #f1f5f9;
          border: 1px solid transparent;
          transition: all 0.2s;
          font-size: clamp(13px, 1.8vw, 15px);
        }
        .search-input:focus {
          background: white;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
          outline: none;
        }

        /* ── Category Buttons ── */
        .cat-btn {
          border-radius: 10px;
          padding: 7px 14px;
          font-size: clamp(12px, 1.5vw, 14px);
          font-weight: 600;
          transition: all 0.2s;
          border: 1.5px solid #e2e8f0;
          color: #475569;
          background: white;
          white-space: nowrap;
        }
        .cat-btn:hover  { background: #f1f5f9; border-color: #c7d2fe; color: #6366f1; }
        .cat-btn.active {
          background: linear-gradient(135deg,#6366f1,#3b82f6);
          color: white; border-color: transparent;
          box-shadow: 0 4px 12px rgba(99,102,241,0.35);
        }

        /* ── Product Cards ── */
        .product-card {
          background: white;
          border-radius: 20px;
          border: 1px solid #edf2f7;
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
          font-family: 'Inter', sans-serif;
        }
        .product-card:hover {
          transform: translateY(-7px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.09);
          border-color: #c7d2fe;
        }
        .product-img-wrap {
          height: clamp(160px, 22vw, 240px);
          background: #f8fafc;
          border-radius: 20px 20px 0 0;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .product-img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .product-card:hover .product-img { transform: scale(1.07); }

        .badge-category {
          position: absolute; top: 12px; left: 12px;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(4px);
          color: #334155;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: clamp(10px,1.4vw,12px);
          font-weight: 700;
          box-shadow: 0 2px 6px rgba(0,0,0,0.06);
          z-index: 2;
          max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .badge-stock {
          position: absolute; top: 12px; right: 12px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: clamp(10px,1.4vw,12px);
          font-weight: 700; z-index: 2;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        .product-card .card-body-inner {
          padding: clamp(12px, 2.5vw, 20px);
        }
        .product-card h5 { font-size: clamp(13px, 1.8vw, 16px); }
        .product-card .price { font-size: clamp(15px, 2vw, 20px); font-weight: 800; color: #6366f1; }

        .btn-order {
          background: linear-gradient(135deg,#6366f1,#3b82f6);
          color: white; border: none;
          border-radius: 12px;
          padding: clamp(9px,1.5vw,12px);
          font-weight: 700;
          font-size: clamp(13px,1.6vw,15px);
          transition: all 0.2s;
          width: 100%;
        }
        .btn-order:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(99,102,241,0.4);
        }
        .btn-order:disabled { background: #cbd5e1; cursor: not-allowed; }

        /* ── Order Modal ── */
        .prem-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(15,23,42,0.65);
          backdrop-filter: blur(5px);
          z-index: 1040;
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
        }
        .prem-modal-box {
          background: white;
          border-radius: 24px;
          width: 100%; max-width: 520px;
          max-height: 92vh;
          overflow-y: auto;
          box-shadow: 0 32px 80px rgba(0,0,0,0.2);
          animation: modal-in 0.3s ease;
        }
        @keyframes modal-in { from{opacity:0;transform:scale(0.95) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .prem-modal-hdr {
          padding: 20px 24px 16px;
          border-bottom: 1px solid #f1f5f9;
          display: flex; align-items: flex-start; justify-content: space-between;
          position: sticky; top: 0; background: #fff; border-radius: 24px 24px 0 0; z-index: 1;
        }
        .prem-close {
          width: 32px; height: 32px; border-radius: 50%;
          border: 1.5px solid #e2e8f0; background: #f8fafc;
          cursor: pointer; font-size: 15px;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s; flex-shrink: 0;
        }
        .prem-close:hover { background: #f1f5f9; }
        .prem-modal-body { padding: clamp(16px,3vw,24px); }

        .form-control-custom {
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: clamp(10px,1.5vw,13px) 14px;
          font-size: clamp(13px,1.6vw,15px);
          transition: all 0.2s;
          width: 100%;
        }
        .form-control-custom:focus {
          background: white; outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
        }
        .form-control-custom.is-invalid { border-color: #fca5a5; background: #fff5f5; }

        /* ── Responsive ── */
        @media (max-width: 575px) {
          .filter-card { margin-top: 0; border-radius: 16px; }
          .cat-scroll  { overflow-x: auto; flex-wrap: nowrap !important; padding-bottom: 4px; }
          .cat-scroll::-webkit-scrollbar { height: 0; }
          .product-card { border-radius: 16px; }
          .product-img-wrap { border-radius: 16px 16px 0 0; }
          .prem-modal-box { border-radius: 20px; }
        }
      `}</style>


      {/* ── Header Banner ─────────────────────────────────── */}
      <section className="shop-header text-center">
        <div className="container position-relative z-1">
          <span className="badge bg-white bg-opacity-25 text-white rounded-pill px-3 py-2 mb-3 fw-semibold border border-white border-opacity-25">
            🛍️ Shop the Best
          </span>
          <h1 className="display-4 fw-bold mb-3">Our Collection</h1>
          <p className="lead opacity-75 mb-0 mx-auto" style={{ maxWidth: '600px' }}>
            Discover top-quality products crafted for your lifestyle. Enjoy fast delivery and secure payments on every order.
          </p>
        </div>
      </section>

      {/* ── Search & Filter Bar ──────────────────────────────── */}
      <section className="container px-3 px-md-4">
        <div className="filter-card p-4">
          <div className="row align-items-center g-3">
            <div className="col-lg-4">
              <div className="position-relative">
                <span className="position-absolute" style={{ top: '50%', transform: 'translateY(-50%)', left: '16px', color: '#94a3b8' }}>🔍</span>
                <input
                  type="text"
                  className="form-control form-control-lg search-input ps-5"
                  placeholder="Search products by name or description..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-lg-8">
              <div className="d-flex flex-wrap gap-2 justify-content-lg-end cat-scroll">
                {categoriesList.map((cat, idx) => (
                  <button
                    key={idx}
                    className={`cat-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat === 'All' ? '🌟 ' : ''}{cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Products Grid ─────────────────────────────────── */}
      <section className="py-5">
        <div className="container">
          {loading ? (
            <div className="text-center py-5 my-5">
              <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <h5 className="mt-4 text-muted fw-semibold">Fetching amazing products...</h5>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-5 my-5 bg-white rounded-4 border p-5 shadow-sm mx-auto" style={{ maxWidth: '600px' }}>
              <div className="display-1 mb-3">😕</div>
              <h3 className="fw-bold">No products found</h3>
              <p className="text-muted mb-0">Try adjusting your search or selecting a different category.</p>
              <button className="btn btn-outline-primary rounded-pill mt-4 px-4" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {filteredProducts.map(product => (
                <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={product._id || product.id}>
                  <div className="product-card">

                    {/* Image Section */}
                    <div className="product-img-wrap">
                      {product.category && (
                        <span className="badge-category">
                          {product.category}
                        </span>
                      )}

                      {product.stock <= 0 ? (
                        <span className="badge-stock bg-danger text-white">Out of Stock</span>
                      ) : product.stock <= 5 ? (
                        <span className="badge-stock bg-warning text-dark">Only {product.stock} left</span>
                      ) : (
                        <span className="badge-stock bg-success text-white">In Stock</span>
                      )}

                      <img
                        src={product.imageURL || 'https://via.placeholder.com/400x300?text=No+Image'}
                        alt={product.name}
                        className="product-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                        }}
                      />
                    </div>

                    {/* Details Section */}
                    <div className="card-body-inner d-flex flex-column flex-grow-1">
                      <h5 className="fw-bold text-dark mb-2 text-truncate" title={product.name}>{product.name}</h5>
                      <p className="text-muted small mb-3 flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: 'clamp(12px,1.5vw,14px)' }}>
                        {product.description}
                      </p>
                      <div className="mt-auto">
                        <div className="price mb-2">Rs. {Number(product.price).toLocaleString()}</div>
                        <button
                          className="btn-order"
                          onClick={() => openOrderModal(product)}
                          disabled={product.stock <= 0}
                        >
                          {product.stock <= 0 ? 'Out of Stock' : '🛒 Order Now'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Order Modal ── */}
      {orderModal && selectedProduct && (
        <div className="prem-modal-overlay" onClick={e => { if (e.target.classList.contains('prem-modal-overlay')) closeOrderModal() }}>
          <div className="prem-modal-box">

            {/* Header */}
            <div className="prem-modal-hdr">
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Complete Your Order</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>Almost there! Just fill in your details.</div>
              </div>
              <button className="prem-close" onClick={closeOrderModal}>✕</button>
            </div>

            {/* Body */}
            <div className="prem-modal-body">

              {/* Product Info */}
              <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:20, padding:'12px 14px', background:'#f8fafc', borderRadius:14, border:'1px solid #e2e8f0' }}>
                <img src={selectedProduct.imageURL || 'https://via.placeholder.com/72'} alt={selectedProduct.name}
                  style={{ width:64, height:64, objectFit:'cover', borderRadius:10, border:'1px solid #e2e8f0', flexShrink:0 }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:'#0f172a', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{selectedProduct.name}</div>
                  <div style={{ fontSize:15, fontWeight:800, color:'#6366f1', marginTop:2 }}>Rs. {Number(selectedProduct.price).toLocaleString()}</div>
                  <span style={{ fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:20, background:'#ede9fe', color:'#6366f1', display:'inline-block', marginTop:4 }}>{selectedProduct.category}</span>
                </div>
              </div>

              {/* Quantity */}
              <div style={{ marginBottom:20 }}>
                <label style={{ display:'block', fontSize:12, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:0.8, marginBottom:8 }}>Select Quantity</label>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', background:'#f8fafc', borderRadius:14, border:'1px solid #e2e8f0' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      style={{ width:36, height:36, borderRadius:'50%', border:'1.5px solid #e2e8f0', background:'white', fontSize:18, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>−</button>
                    <span style={{ fontSize:18, fontWeight:800, color:'#0f172a', minWidth:24, textAlign:'center' }}>{quantity}</span>
                    <button type="button" onClick={() => setQuantity(q => Math.min(selectedProduct.stock, q + 1))}
                      style={{ width:36, height:36, borderRadius:'50%', border:'1.5px solid #e2e8f0', background:'white', fontSize:18, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:11, color:'#94a3b8', fontWeight:600 }}>Total</div>
                    <div style={{ fontSize:17, fontWeight:800, color:'#6366f1' }}>Rs. {(selectedProduct.price * quantity).toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <hr style={{ borderColor:'#f1f5f9', margin:'0 0 20px' }} />

              <div style={{ fontSize:14, fontWeight:700, color:'#0f172a', marginBottom:14, display:'flex', alignItems:'center', gap:6 }}>📍 Shipping Details</div>

              {/* Form */}
              <form onSubmit={handleOrderSubmit}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                  <div style={{ gridColumn:'1/-1' }}>
                    <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:0.7, marginBottom:6 }}>Full Name</label>
                    <input type="text" className={`form-control-custom ${formErrors.fullName ? 'is-invalid' : ''}`}
                      placeholder="John Doe" value={shippingForm.fullName}
                      onChange={e => setShippingForm(f => ({ ...f, fullName: e.target.value }))} />
                    {formErrors.fullName && <div style={{ fontSize:11, color:'#dc2626', marginTop:4 }}>⚠ {formErrors.fullName}</div>}
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:0.7, marginBottom:6 }}>Phone</label>
                    <input type="text" className={`form-control-custom ${formErrors.phone ? 'is-invalid' : ''}`}
                      placeholder="03XX-XXXXXXX" value={shippingForm.phone}
                      onChange={e => setShippingForm(f => ({ ...f, phone: e.target.value }))} />
                    {formErrors.phone && <div style={{ fontSize:11, color:'#dc2626', marginTop:4 }}>⚠ {formErrors.phone}</div>}
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:0.7, marginBottom:6 }}>City</label>
                    <input type="text" className={`form-control-custom ${formErrors.city ? 'is-invalid' : ''}`}
                      placeholder="Karachi / Lahore" value={shippingForm.city}
                      onChange={e => setShippingForm(f => ({ ...f, city: e.target.value }))} />
                    {formErrors.city && <div style={{ fontSize:11, color:'#dc2626', marginTop:4 }}>⚠ {formErrors.city}</div>}
                  </div>
                  <div style={{ gridColumn:'1/-1' }}>
                    <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:0.7, marginBottom:6 }}>Delivery Address</label>
                    <textarea className={`form-control-custom ${formErrors.address ? 'is-invalid' : ''}`}
                      placeholder="House No, Street, Area..." rows={2} value={shippingForm.address}
                      onChange={e => setShippingForm(f => ({ ...f, address: e.target.value }))} />
                    {formErrors.address && <div style={{ fontSize:11, color:'#dc2626', marginTop:4 }}>⚠ {formErrors.address}</div>}
                  </div>
                </div>

                <div style={{ display:'flex', gap:10, marginTop:20 }}>
                  <button type="button" onClick={closeOrderModal}
                    style={{ flex:1, padding:'12px', borderRadius:12, border:'1.5px solid #e2e8f0', background:'#f8fafc', color:'#64748b', fontSize:14, fontWeight:600, cursor:'pointer' }}>Cancel</button>
                  <button type="submit" disabled={orderLoading}
                    style={{ flex:2, padding:'12px', borderRadius:12, border:'none', background: orderLoading ? '#c7d2fe' : 'linear-gradient(135deg,#6366f1,#3b82f6)', color:'white', fontSize:14, fontWeight:700, cursor: orderLoading ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow:'0 4px 14px rgba(99,102,241,0.3)' }}>
                    {orderLoading
                      ? <><span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.4)', borderTop:'2px solid white', borderRadius:'50%', animation:'spin 0.8s linear infinite', display:'inline-block' }} />Processing...</>
                      : `Confirm Order — Rs. ${(selectedProduct.price * quantity).toLocaleString()}`
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Products