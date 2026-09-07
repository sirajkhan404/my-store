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
        .shop-header {
          background: linear-gradient(135deg, #1e293b 0%, #3b82f6 100%);
          color: white;
          padding: 80px 0 60px;
          position: relative;
          overflow: hidden;
        }
        .shop-header::after {
          content: '';
          position: absolute;
          width: 300px;
          height: 300px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          top: -100px;
          right: -100px;
          filter: blur(50px);
        }
        .filter-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          margin-top: -30px;
          position: relative;
          z-index: 10;
          border: 1px solid #e2e8f0;
        }
        .search-input {
          border-radius: 12px;
          background: #f1f5f9;
          border: 1px solid transparent;
          transition: all 0.2s;
        }
        .search-input:focus {
          background: white;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }
        .cat-btn {
          border-radius: 12px;
          padding: 8px 16px;
          font-weight: 500;
          transition: all 0.2s;
          border: 1px solid #e2e8f0;
          color: #475569;
          background: white;
        }
        .cat-btn:hover {
          background: #f1f5f9;
        }
        .cat-btn.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
          box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
        }
        .product-card {
          background: white;
          border-radius: 20px;
          border: 1px solid #edf2f7;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.08);
          border-color: #cbd5e1;
        }
        .product-img-wrap {
          height: 240px;
          background: #f8fafc;
          border-radius: 20px 20px 0 0;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
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
        .badge-category {
          position: absolute;
          top: 16px;
          left: 16px;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(4px);
          color: #334155;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
          z-index: 2;
        }
        .badge-stock {
          position: absolute;
          top: 16px;
          right: 16px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          z-index: 2;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .btn-order {
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 12px;
          padding: 10px;
          font-weight: 600;
          transition: all 0.2s;
        }
        .btn-order:hover:not(:disabled) {
          background: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(59, 130, 246, 0.4);
        }
        .btn-order:disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }
        /* Modal Customization */
        .premium-modal .modal-content {
          border-radius: 24px;
          border: none;
        }
        .premium-modal .modal-header {
          background: #f8fafc;
          border-radius: 24px 24px 0 0;
          border-bottom: 1px solid #e2e8f0;
          padding: 20px 24px;
        }
        .form-control-custom {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px 16px;
          transition: all 0.2s;
        }
        .form-control-custom:focus {
          background: white;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
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
              <div className="d-flex flex-wrap gap-2 justify-content-lg-end">
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
                    <div className="p-4 d-flex flex-column flex-grow-1">
                      <h5 className="fw-bold text-dark mb-2 text-truncate" title={product.name}>{product.name}</h5>
                      <p className="text-muted small mb-3 flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {product.description}
                      </p>

                      <div className="mt-auto">
                        <div className="fw-bold fs-4 text-primary mb-3">
                          Rs. {Number(product.price).toLocaleString()}
                        </div>
                        <button
                          className="btn-order w-100"
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

      {/* ── Premium Order Modal ──────────────────────── */}
      {orderModal && selectedProduct && (
        <>
          <div className="modal-backdrop fade show" onClick={closeOrderModal} style={{ zIndex: 1040, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)' }} />

          <div className="modal fade show d-block premium-modal" tabIndex="-1" style={{ zIndex: 1045 }} role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content shadow-lg">

                {/* Header */}
                <div className="modal-header">
                  <div>
                    <h5 className="modal-title fw-bold mb-0">Complete Your Order</h5>
                    <small className="text-muted">Almost there! Just fill in your details.</small>
                  </div>
                  <button type="button" className="btn-close bg-white rounded-circle shadow-sm p-2" onClick={closeOrderModal} style={{ opacity: 1 }} />
                </div>

                {/* Body */}
                <div className="modal-body p-4">

                  {/* Product Info Card */}
                  <div className="d-flex gap-3 align-items-center mb-4 p-3 bg-white border rounded-4 shadow-sm">
                    <img
                      src={selectedProduct.imageURL || 'https://via.placeholder.com/80'}
                      alt={selectedProduct.name}
                      className="rounded-3"
                      style={{ width: 80, height: 80, objectFit: 'cover' }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-1 text-truncate" style={{ maxWidth: '200px' }}>{selectedProduct.name}</h6>
                      <p className="text-primary fw-bold mb-0">Rs. {Number(selectedProduct.price).toLocaleString()}</p>
                      <span className="badge bg-light text-dark border mt-1">{selectedProduct.category}</span>
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">Select Quantity</label>
                    <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded-4 border">
                      <div className="d-flex align-items-center gap-2">
                        <button className="btn btn-white border shadow-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, fontWeight: 'bold' }} onClick={() => setQuantity(q => Math.max(1, q - 1))} type="button">−</button>
                        <span className="fw-bold mx-2 fs-5">{quantity}</span>
                        <button className="btn btn-white border shadow-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, fontWeight: 'bold' }} onClick={() => setQuantity(q => Math.min(selectedProduct.stock, q + 1))} type="button">+</button>
                      </div>
                      <div className="text-end">
                        <small className="text-muted d-block">Total Amount</small>
                        <strong className="fs-5 text-primary">Rs. {(selectedProduct.price * quantity).toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>

                  <hr className="my-4 border-light" />

                  <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                    <span>📍</span> Shipping Details
                  </h6>

                  {/* Shipping Form */}
                  <form onSubmit={handleOrderSubmit}>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label small fw-semibold text-muted mb-1">Full Name</label>
                        <input
                          type="text"
                          className={`form-control form-control-custom ${formErrors.fullName ? 'is-invalid border-danger' : ''}`}
                          placeholder="John Doe"
                          value={shippingForm.fullName}
                          onChange={e => setShippingForm(f => ({ ...f, fullName: e.target.value }))}
                        />
                        {formErrors.fullName && <div className="invalid-feedback">{formErrors.fullName}</div>}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-muted mb-1">Phone Number</label>
                        <input
                          type="text"
                          className={`form-control form-control-custom ${formErrors.phone ? 'is-invalid border-danger' : ''}`}
                          placeholder="03XX-XXXXXXX"
                          value={shippingForm.phone}
                          onChange={e => setShippingForm(f => ({ ...f, phone: e.target.value }))}
                        />
                        {formErrors.phone && <div className="invalid-feedback">{formErrors.phone}</div>}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-muted mb-1">City</label>
                        <input
                          type="text"
                          className={`form-control form-control-custom ${formErrors.city ? 'is-invalid border-danger' : ''}`}
                          placeholder="Karachi / Lahore"
                          value={shippingForm.city}
                          onChange={e => setShippingForm(f => ({ ...f, city: e.target.value }))}
                        />
                        {formErrors.city && <div className="invalid-feedback">{formErrors.city}</div>}
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-semibold text-muted mb-1">Delivery Address</label>
                        <textarea
                          className={`form-control form-control-custom ${formErrors.address ? 'is-invalid border-danger' : ''}`}
                          placeholder="House No, Street, Area..."
                          rows={2}
                          value={shippingForm.address}
                          onChange={e => setShippingForm(f => ({ ...f, address: e.target.value }))}
                        />
                        {formErrors.address && <div className="invalid-feedback">{formErrors.address}</div>}
                      </div>
                    </div>

                    {/* Modal Footer / Actions */}
                    <div className="d-flex gap-3 mt-5">
                      <button type="button" className="btn btn-light px-4 fw-semibold rounded-pill" onClick={closeOrderModal}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary flex-fill fw-bold rounded-pill shadow-sm" disabled={orderLoading}>
                        {orderLoading
                          ? <><span className="spinner-border spinner-border-sm me-2" role="status" />Processing...</>
                          : `Confirm Order — Rs. ${(selectedProduct.price * quantity).toLocaleString()}`
                        }
                      </button>
                    </div>
                  </form>

                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  )
}

export default Products