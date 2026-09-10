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
    <main className="d-flex flex-column flex-grow-1 bg-light" style={{ minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>

      {/* ── Header Banner ─────────────────────────────────── */}
      <section className="text-white text-center position-relative overflow-hidden py-5 py-md-6 py-lg-7"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #3b82f6 100%)' }}>

        {/* Background glow shape */}
        <div className="position-absolute rounded-circle pointer-event-none"
          style={{ width: '360px', height: '360px', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', top: '-100px', right: '-80px', zIndex: 0 }}></div>

        <div className="container position-relative py-4" style={{ zIndex: 1 }}>
          <span className="badge bg-white bg-opacity-25 text-white rounded-pill px-3 py-2 mb-3 fw-semibold border border-white border-opacity-25" style={{ fontSize: '12px' }}>
            🛍️ Shop the Best
          </span>
          <h1 className="display-4 display-md-3 fw-bold mb-3" style={{ letterSpacing: '-0.5px' }}>Our Collection</h1>
          <p className="lead opacity-75 mb-0 mx-auto fs-6 fs-md-5" style={{ maxWidth: '600px' }}>
            Discover top-quality products crafted for your lifestyle. Enjoy fast delivery and secure payments on every order.
          </p>
        </div>
      </section>

      {/* ── Search & Filter Bar ──────────────────────────────── */}
      <section className="container px-3 px-md-4 position-relative" style={{ marginTop: '-35px', zIndex: 10 }}>
        <div className="card bg-white border border-light-subtle rounded-4 p-4 shadow-sm">
          <div className="row align-items-center g-3">
            <div className="col-12 col-lg-4">
              <div className="position-relative">
                <span className="position-absolute top-50 translate-middle-y text-muted ms-3" style={{ zIndex: 2 }}>🔍</span>
                <input
                  type="text"
                  className="form-control form-control-lg bg-light border-light-subtle ps-5 rounded-3 py-2"
                  placeholder="Search products by name or description..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ fontSize: '15px' }}
                />
              </div>
            </div>
            <div className="col-12 col-lg-8">
              <div className="d-flex flex-row flex-lg-wrap gap-2 justify-content-lg-end overflow-auto pb-1 pb-lg-0" style={{ scrollbarWidth: 'none' }}>
                {categoriesList.map((cat, idx) => (
                  <button
                    key={idx}
                    className={`btn rounded-3 px-3 py-2 fw-semibold text-nowrap transition-all ${selectedCategory === cat
                        ? 'btn-primary text-white shadow-sm'
                        : 'btn-outline-secondary bg-white text-secondary border-light-subtle'
                      }`}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      fontSize: '14px',
                      background: selectedCategory === cat ? 'linear-gradient(135deg,#6366f1,#3b82f6)' : '',
                      border: selectedCategory === cat ? 'none' : undefined
                    }}
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
              <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <h5 className="text-muted fw-semibold">Fetching amazing products...</h5>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-5 my-5 bg-white rounded-4 border p-5 shadow-sm mx-auto" style={{ maxWidth: '600px' }}>
              <div className="display-1 mb-3">😕</div>
              <h3 className="fw-bold text-dark">No products found</h3>
              <p className="text-muted mb-0">Try adjusting your search or selecting a different category.</p>
              <button className="btn btn-outline-primary rounded-pill mt-4 px-4 py-2 fw-semibold" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {filteredProducts.map(product => (
                <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={product._id || product.id}>
                  <div className="card h-100 bg-white border border-light-subtle rounded-4 overflow-hidden shadow-sm transition-all d-flex flex-column">

                    {/* Image Section */}
                    <div className="position-relative bg-light overflow-hidden" style={{ height: '200px' }}>
                      {product.category && (
                        <span className="position-absolute top-0 start-0 m-3 z-2 px-2.5 py-1 rounded-pill bg-white bg-opacity-75 text-secondary fw-semibold shadow-sm text-truncate"
                          style={{ fontSize: '11px', maxWidth: '100px', backdropFilter: 'blur(4px)' }}>
                          {product.category}
                        </span>
                      )}

                      {product.stock <= 0 ? (
                        <span className="position-absolute top-0 end-0 m-3 z-2 badge bg-danger text-white rounded-pill px-2.5 py-1.5" style={{ fontSize: '11px' }}>Out of Stock</span>
                      ) : product.stock <= 5 ? (
                        <span className="position-absolute top-0 end-0 m-3 z-2 badge bg-warning text-dark rounded-pill px-2.5 py-1.5" style={{ fontSize: '11px' }}>Only {product.stock} left</span>
                      ) : (
                        <span className="position-absolute top-0 end-0 m-3 z-2 badge bg-success text-white rounded-pill px-2.5 py-1.5" style={{ fontSize: '11px' }}>In Stock</span>
                      )}

                      <img
                        src={product.imageURL || 'https://via.placeholder.com/400x300?text=No+Image'}
                        alt={product.name}
                        className="w-100 h-100 object-fit-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                        }}
                      />
                    </div>

                    {/* Details Section */}
                    <div className="card-body p-4 d-flex flex-column flex-grow-1">
                      <h5 className="fw-bold text-dark mb-2 text-truncate fs-6" title={product.name}>{product.name}</h5>
                      <p className="text-muted small mb-3 flex-grow-1 text-truncate-2" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        fontSize: '13px'
                      }}>
                        {product.description}
                      </p>
                      <div className="mt-auto">
                        <div className="fs-5 fw-bold text-primary mb-3">Rs. {Number(product.price).toLocaleString()}</div>
                        <button
                          className="btn btn-primary w-100 rounded-3 py-2.5 fw-bold shadow-sm"
                          style={{ background: 'linear-gradient(135deg,#6366f1,#3b82f6)', border: 'none' }}
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
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(5px)' }} onClick={e => { if (e.target.classList.contains('modal')) closeOrderModal() }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">

              {/* Header */}
              <div className="modal-header border-bottom border-light-subtle px-4 py-3 sticky-top bg-white">
                <div>
                  <h5 className="fw-bold text-dark mb-1 fs-5">Complete Your Order</h5>
                  <p className="text-muted small mb-0">Almost there! Just fill in your details.</p>
                </div>
                <button type="button" className="btn-close shadow-none" onClick={closeOrderModal}></button>
              </div>

              {/* Body */}
              <div className="modal-body p-4">

                {/* Product Info */}
                <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-4 border border-light-subtle mb-4">
                  <img src={selectedProduct.imageURL || 'https://via.placeholder.com/72'} alt={selectedProduct.name}
                    className="rounded-3 border border-light-subtle object-fit-cover flex-shrink-0" style={{ width: '64px', height: '64px' }} />
                  <div className="flex-grow-1 min-width-0">
                    <h6 className="fw-bold text-dark text-truncate mb-1">{selectedProduct.name}</h6>
                    <div className="fs-6 fw-bold text-primary mb-1">Rs. {Number(selectedProduct.price).toLocaleString()}</div>
                    <span className="badge rounded-pill fw-semibold" style={{ background: '#ede9fe', color: '#6366f1', fontSize: '11px' }}>{selectedProduct.category}</span>
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-4">
                  <label className="form-label fw-bold text-secondary text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.8px' }}>Select Quantity</label>
                  <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded-4 border border-light-subtle">
                    <div className="d-flex align-items-center gap-3">
                      <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-0 bg-white" style={{ width: '36px', height: '36px', fontSize: '18px', fontWeight: 'bold' }}>−</button>
                      <span className="fs-5 fw-bold text-dark text-center" style={{ minWidth: '24px' }}>{quantity}</span>
                      <button type="button" onClick={() => setQuantity(q => Math.min(selectedProduct.stock, q + 1))}
                        className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-0 bg-white" style={{ width: '36px', height: '36px', fontSize: '18px', fontWeight: 'bold' }}>+</button>
                    </div>
                    <div className="text-end">
                      <div className="text-muted fw-semibold" style={{ fontSize: '11px' }}>Total</div>
                      <div className="fs-5 fw-bold text-primary">Rs. {(selectedProduct.price * quantity).toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                <hr className="text-muted opacity-25 mb-4" />

                <div className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">📍 Shipping Details</div>

                {/* Form */}
                <form onSubmit={handleOrderSubmit}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-bold text-secondary text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.8px' }}>Full Name</label>
                      <input type="text" className={`form-control rounded-3 bg-light border-light-subtle px-3 py-2 ${formErrors.fullName ? 'is-invalid' : ''}`}
                        placeholder="John Doe" value={shippingForm.fullName}
                        onChange={e => setShippingForm(f => ({ ...f, fullName: e.target.value }))} />
                      {formErrors.fullName && <div className="text-danger small mt-1">⚠ {formErrors.fullName}</div>}
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-bold text-secondary text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.8px' }}>Phone</label>
                      <input type="text" className={`form-control rounded-3 bg-light border-light-subtle px-3 py-2 ${formErrors.phone ? 'is-invalid' : ''}`}
                        placeholder="03XX-XXXXXXX" value={shippingForm.phone}
                        onChange={e => setShippingForm(f => ({ ...f, phone: e.target.value }))} />
                      {formErrors.phone && <div className="text-danger small mt-1">⚠ {formErrors.phone}</div>}
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-bold text-secondary text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.8px' }}>City</label>
                      <input type="text" className={`form-control rounded-3 bg-light border-light-subtle px-3 py-2 ${formErrors.city ? 'is-invalid' : ''}`}
                        placeholder="Karachi / Lahore" value={shippingForm.city}
                        onChange={e => setShippingForm(f => ({ ...f, city: e.target.value }))} />
                      {formErrors.city && <div className="text-danger small mt-1">⚠ {formErrors.city}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-bold text-secondary text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.8px' }}>Delivery Address</label>
                      <textarea className={`form-control rounded-3 bg-light border-light-subtle px-3 py-2 ${formErrors.address ? 'is-invalid' : ''}`}
                        placeholder="House No, Street, Area..." rows={2} value={shippingForm.address}
                        onChange={e => setShippingForm(f => ({ ...f, address: e.target.value }))} />
                      {formErrors.address && <div className="text-danger small mt-1">⚠ {formErrors.address}</div>}
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-4">
                    <button type="button" onClick={closeOrderModal}
                      className="btn btn-light border border-light-subtle rounded-3 py-2.5 px-4 text-secondary fw-semibold">Cancel</button>
                    <button type="submit" disabled={orderLoading}
                      className="btn btn-primary flex-grow-1 rounded-3 py-2.5 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                      style={{ background: orderLoading ? '#c7d2fe' : 'linear-gradient(135deg,#6366f1,#3b82f6)', border: 'none' }}>
                      {orderLoading
                        ? <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />Processing...</>
                        : `Confirm Order — Rs. ${(selectedProduct.price * quantity).toLocaleString()}`
                      }
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Products