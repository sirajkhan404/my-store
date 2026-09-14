import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/Auth'

const Home = () => {
    const { user } = useAuth()
    const navigate = useNavigate()

    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])
    const [users, setUsers] = useState([])
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)

    const token = localStorage.getItem('jwt')
    const headers = { Authorization: `Bearer ${token}` }

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true)
            try {
                const [prodRes, orderRes, userRes, msgRes] = await Promise.allSettled([
                    axios.get(`${window.api}/api/products/all`, { headers }),
                    axios.get(`${window.api}/api/orders/all`, { headers }),
                    axios.get(`${window.api}/api/auth/users`, { headers }),
                    axios.get(`${window.api}/api/contact/all`, { headers }),
                ])
                if (prodRes.status === 'fulfilled') setProducts(prodRes.value.data.products || [])
                if (orderRes.status === 'fulfilled') setOrders(orderRes.value.data.orders || [])
                if (userRes.status === 'fulfilled') setUsers(userRes.value.data.users || [])
                if (msgRes.status === 'fulfilled') setMessages(msgRes.value.data.messages || [])
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchAll()
    }, [])

    // ── Computed Stats ────────────────────────────────────────────────
    const stats = {
        totalProducts: products.length,
        outOfStock: products.filter(p => p.stock <= 0).length,
        totalOrders: orders.length,
        processingOrders: orders.filter(o => o.orderStatus === 'processing').length,
        deliveredOrders: orders.filter(o => o.orderStatus === 'delivered').length,
        totalRevenue: orders
            .filter(o => o.orderStatus !== 'cancelled')
            .reduce((sum, o) => sum + (o.totalAmount || 0), 0),
        totalUsers: users.length,
        activeUsers: users.filter(u => u.status === 'active').length,
        totalMessages: messages.length,
    }

    // ── Recent Orders ─────────────────────────────────────────────────
    const recentOrders = [...orders]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)

    const orderStatusBadge = {
        processing: 'bg-warning text-dark',
        shipped: 'bg-info text-white',
        delivered: 'bg-success text-white',
        cancelled: 'bg-danger text-white',
    }

    // ── Top Products (by stock sold = not current stock) ──────────────
    const topProducts = [...products]
        .sort((a, b) => b.price - a.price)
        .slice(0, 5)

    return (
        <div className="p-3 p-md-4 p-lg-5" style={{ background: '#f8fafc' }}>
            <style>{`
                .stat-card {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 20px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.02);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                    cursor: pointer;
                }
                .stat-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 25px rgba(0,0,0,0.06);
                    border-color: #cbd5e1;
                }
                .stat-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 4px;
                }
                .stat-card.primary::before { background: linear-gradient(90deg, #4f46e5, #818cf8); }
                .stat-card.warning::before { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
                .stat-card.success::before { background: linear-gradient(90deg, #10b981, #34d399); }
                .stat-card.dark::before { background: linear-gradient(90deg, #0f172a, #475569); }
                .stat-card.info::before { background: linear-gradient(90deg, #06b6d4, #38bdf8); }
                
                .stat-icon-wrapper {
                    width: 48px;
                    height: 48px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                }
                .stat-card.primary .stat-icon-wrapper { background: #e0e7ff; color: #4f46e5; }
                .stat-card.warning .stat-icon-wrapper { background: #fef3c7; color: #f59e0b; }
                .stat-card.success .stat-icon-wrapper { background: #d1fae5; color: #10b981; }
                .stat-card.dark .stat-icon-wrapper { background: #f1f5f9; color: #0f172a; }
                .stat-card.info .stat-icon-wrapper { background: #cffafe; color: #06b6d4; }
            `}</style>

            {/* ── Welcome Header ────────────────────────────────────── */}
            <div className="mb-5 bg-white p-4 rounded-4 shadow-sm border" style={{ borderColor: '#e2e8f0' }}>
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    <div>
                        <h3 className="fw-bold mb-1 text-dark">
                            Dashboard Overview ✨
                        </h3>
                        <p className="text-muted mb-0">Welcome back, <span className="fw-semibold text-primary">{user?.fullName || 'Admin'}</span>! Here's what's happening in your store today.</p>
                    </div>
                    <div className="text-end d-none d-md-block">
                        <div className="text-muted small fw-semibold text-uppercase letter-spacing-1">Today's Date</div>
                        <div className="fw-bold text-dark fs-5">{new Date().toLocaleDateString('en-PK', { weekday: 'long', month: 'short', day: 'numeric' })}</div>
                    </div>
                </div>
            </div>

            {/* ── Stats Cards ───────────────────────────────────────── */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status" />
                    <p className="mt-3 text-muted fw-semibold">Fetching the latest data...</p>
                </div>
            ) : (
                <>
                    <div className="row g-4 mb-5">
                        {[
                            {
                                label: 'Total Products', value: stats.totalProducts,
                                sub: `${stats.outOfStock} out of stock`,
                                icon: '📦', color: 'primary',
                                link: '/dashboard/products',
                                adminOnly: true
                            },
                            {
                                label: 'Total Orders', value: stats.totalOrders,
                                sub: `${stats.processingOrders} processing`,
                                icon: '🛒', color: 'warning',
                                link: '/dashboard/orders',
                                adminOnly: false
                            },
                            {
                                label: 'Delivered', value: stats.deliveredOrders,
                                sub: 'Successfully completed',
                                icon: '✅', color: 'success',
                                link: '/dashboard/orders',
                                adminOnly: false
                            },
                            {
                                label: 'Total Revenue', value: `Rs. ${stats.totalRevenue.toLocaleString()}`,
                                sub: 'Excluding cancelled orders',
                                icon: '💰', color: 'dark',
                                link: '/dashboard/orders',
                                adminOnly: true
                            },
                            {
                                label: 'Total Users', value: stats.totalUsers,
                                sub: `${stats.activeUsers} active`,
                                icon: '👥', color: 'info',
                                link: '/dashboard/users',
                                adminOnly: true
                            },
                            {
                                label: 'Contact Messages', value: stats.totalMessages,
                                sub: 'User inquiries & feedback',
                                icon: '💬', color: 'primary',
                                link: '/dashboard/messages',
                                adminOnly: true
                            },
                        ]
                        .filter(s => user?.role === 'superAdmin' || !s.adminOnly)
                        .map((s, i) => (
                            <div key={i} className="col-12 col-sm-6 col-xl-4">
                                <div
                                    className={`stat-card h-100 ${s.color}`}
                                    onClick={() => navigate(s.link)}
                                >
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <div className="stat-icon-wrapper">
                                                {s.icon}
                                            </div>
                                            <div className="badge bg-light text-dark border rounded-pill px-3 py-2 fw-semibold">View Details</div>
                                        </div>
                                        <div>
                                            <div className="fw-bold text-dark mb-1" style={{ fontSize: '28px', lineHeight: 1 }}>{s.value}</div>
                                            <div className="fw-semibold text-muted mb-1">{s.label}</div>
                                            <div className="small fw-medium" style={{ color: '#94a3b8' }}>{s.sub}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── Recent Orders + Top Products ─────────────────── */}
                    <div className="row g-4">

                        {/* Recent Orders */}
                        <div className={`col-12 ${user?.role === 'superAdmin' ? 'col-lg-7' : ''}`}>
                            <div className="card border-0 shadow-sm rounded-4 h-100" style={{ border: '1px solid #e2e8f0' }}>
                                <div className="card-header bg-white border-0 pt-4 pb-2 px-4 d-flex justify-content-between align-items-center">
                                    <h5 className="fw-bold mb-0 text-dark">🕐 Recent Orders</h5>
                                    <button
                                        className="btn btn-sm btn-light fw-semibold px-3 rounded-pill"
                                        onClick={() => navigate('/dashboard/orders')}
                                    >
                                        View All
                                    </button>
                                </div>
                                <div className="card-body p-0">
                                    {recentOrders.length === 0 ? (
                                        <div className="text-center py-5 text-muted">
                                            <div className="fs-1 mb-2">📭</div>
                                            <p className="mb-0 fw-semibold">No orders yet</p>
                                        </div>
                                    ) : (
                                        <div className="table-responsive px-4 pb-4 mt-3">
                                            <table className="table table-borderless align-middle mb-0">
                                                <thead>
                                                    <tr className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.5px' }}>
                                                        <th className="pb-3">Order ID</th>
                                                        <th className="pb-3">Customer</th>
                                                        <th className="pb-3">Total</th>
                                                        <th className="pb-3">Status</th>
                                                        <th className="pb-3">Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {recentOrders.map(order => (
                                                        <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                            <td className="py-3">
                                                                <code className="small bg-light text-dark fw-bold px-2 py-1 rounded">
                                                                    #{order.id?.substring(0, 8)}
                                                                </code>
                                                            </td>
                                                            <td className="py-3 small fw-bold text-dark">
                                                                {order.shippingAddress?.fullName}
                                                            </td>
                                                            <td className="py-3 small text-primary fw-bold">
                                                                Rs. {Number(order.totalAmount).toLocaleString()}
                                                            </td>
                                                            <td className="py-3">
                                                                <span className={`badge rounded-pill px-3 py-1 fw-semibold ${orderStatusBadge[order.orderStatus] || 'bg-secondary'} text-capitalize`}>
                                                                    {order.orderStatus}
                                                                </span>
                                                            </td>
                                                            <td className="py-3 small text-muted text-nowrap fw-medium">
                                                                {new Date(order.createdAt).toLocaleDateString('en-PK', {
                                                                    day: '2-digit', month: 'short'
                                                                })}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Top Products */}
                        {user?.role === 'superAdmin' && (
                            <div className="col-12 col-lg-5">
                                <div className="card border-0 shadow-sm rounded-4 h-100" style={{ border: '1px solid #e2e8f0' }}>
                                    <div className="card-header bg-white border-0 pt-4 pb-2 px-4 d-flex justify-content-between align-items-center">
                                        <h5 className="fw-bold mb-0 text-dark">🏆 Top Products</h5>
                                        <button
                                            className="btn btn-sm btn-light fw-semibold px-3 rounded-pill"
                                            onClick={() => navigate('/dashboard/products')}
                                        >
                                            View All
                                        </button>
                                    </div>
                                    <div className="card-body px-4 py-4">
                                        {topProducts.length === 0 ? (
                                            <div className="text-center py-5 text-muted">
                                                <div className="fs-1 mb-2">📭</div>
                                                <p className="mb-0 fw-semibold">No products yet</p>
                                            </div>
                                        ) : (
                                            <div className="d-flex flex-column gap-3">
                                                {topProducts.map((product, i) => (
                                                    <div key={product.id} className="d-flex align-items-center gap-3 p-2 rounded-3" style={{ transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                        <div className="fw-bold text-muted d-flex align-items-center justify-content-center bg-light rounded-circle" style={{ width: 32, height: 32, fontSize: 13 }}>
                                                            {i + 1}
                                                        </div>
                                                        <img
                                                            src={product.imageURL || 'https://via.placeholder.com/48'}
                                                            alt={product.name}
                                                            style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 12, border: '1px solid #e2e8f0', flexShrink: 0 }}
                                                        />
                                                        <div className="flex-grow-1 overflow-hidden">
                                                            <div className="fw-bold small text-truncate text-dark" style={{ fontSize: '14px' }}>{product.name}</div>
                                                            <div className="text-muted fw-medium" style={{ fontSize: 12 }}>{product.category}</div>
                                                        </div>
                                                        <div className="text-end flex-shrink-0">
                                                            <div className="fw-bold text-primary small">Rs. {Number(product.price).toLocaleString()}</div>
                                                            <div className="text-muted" style={{ fontSize: 11 }}>{product.stock} in stock</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* ── Quick Actions ─────────────────────────────────── */}
                    <div className="mt-4">
                        <h6 className="fw-bold mb-3">⚡ Quick Actions</h6>
                        <div className="d-flex flex-wrap gap-2">
                            {user?.role === 'superAdmin' && (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => navigate('/dashboard/products/add')}
                                >
                                    ➕ Add Product
                                </button>
                            )}
                            <button
                                className="btn btn-outline-warning"
                                onClick={() => navigate('/dashboard/orders')}
                            >
                                🛒 Manage Orders
                            </button>
                            {user?.role === 'superAdmin' && (
                                <button
                                    className="btn btn-outline-info"
                                    onClick={() => navigate('/dashboard/users')}
                                >
                                    👥 View Users
                                </button>
                            )}
                            {user?.role === 'superAdmin' && (
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => navigate('/dashboard/messages')}
                                >
                                    💬 View Messages
                                </button>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Home