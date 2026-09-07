import React, { useEffect, useState } from 'react'
import axios from 'axios'

/* ─── animated counter hook ─── */
function useCountUp(target, duration = 1200) {
    const [val, setVal] = useState(0)
    useEffect(() => {
        if (!target) { setVal(0); return }
        let start = 0
        const step = target / (duration / 16)
        const timer = setInterval(() => {
            start += step
            if (start >= target) { setVal(target); clearInterval(timer) }
            else setVal(Math.floor(start))
        }, 16)
        return () => clearInterval(timer)
    }, [target])
    return val
}

/* ─── sparkline SVG ─── */
function Sparkline({ data = [], color = '#6366f1', height = 40 }) {
    if (!data.length) return null
    const max = Math.max(...data, 1)
    const w = 120, h = height
    const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`)
    const gradId = `sg${color.replace('#', '')}`
    return (
        <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height }}>
            <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon points={`0,${h} ${pts.join(' ')} ${w},${h}`} fill={`url(#${gradId})`} />
            <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

/* ─── donut chart ─── */
function Donut({ slices = [], size = 130 }) {
    const r = 45, cx = 60, cy = 60
    const circ = 2 * Math.PI * r
    const total = slices.reduce((s, x) => s + x.value, 0) || 1
    let offset = 0
    return (
        <svg viewBox="0 0 120 120" width={size} height={size}>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="18" />
            {slices.map((sl, i) => {
                const dash = (sl.value / total) * circ
                const gap = circ - dash
                const el = (
                    <circle key={i} cx={cx} cy={cy} r={r} fill="none"
                        stroke={sl.color} strokeWidth="18"
                        strokeDasharray={`${dash} ${gap}`}
                        strokeDashoffset={-offset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dasharray 0.8s ease', transform: 'rotate(-90deg)', transformOrigin: '60px 60px' }}
                    />
                )
                offset += dash
                return el
            })}
            <text x={cx} y={cy - 4} textAnchor="middle" fontSize="13" fontWeight="700" fill="#1e293b">{total}</text>
            <text x={cx} y={cy + 12} textAnchor="middle" fontSize="8" fill="#94a3b8">TOTAL</text>
        </svg>
    )
}

/* ─── bar chart ─── */
function BarChart({ bars = [], color = '#6366f1' }) {
    const max = Math.max(...bars.map(b => b.value), 1)
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80, padding: '0 4px' }}>
            {bars.map((b, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{
                        width: '100%',
                        borderRadius: '4px 4px 0 0',
                        height: `${(b.value / max) * 72}px`,
                        background: `linear-gradient(180deg, ${color}, ${color}99)`,
                        transition: 'height 0.8s cubic-bezier(.4,2,.6,1)',
                        minHeight: b.value ? 4 : 0,
                    }} title={`${b.label}: ${b.value}`} />
                    <span style={{ fontSize: 9, color: '#94a3b8', whiteSpace: 'nowrap' }}>{b.label}</span>
                </div>
            ))}
        </div>
    )
}

/* ─── pulse dot ─── */
function PulseDot({ color }) {
    return (
        <span style={{ position: 'relative', display: 'inline-flex', width: 10, height: 10 }}>
            <span style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                background: color, opacity: 0.4,
                animation: 'an-pulse-ring 1.4s ease-out infinite'
            }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
        </span>
    )
}

/* ═══════════════════════════════════════════════════════ */
const Analytics = () => {
    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [lastUpdated, setLastUpdated] = useState(null)

    const token = localStorage.getItem('jwt')
    const headers = { Authorization: `Bearer ${token}` }

    const fetchAll = async () => {
        try {
            const [prodRes, orderRes, userRes] = await Promise.allSettled([
                axios.get(`${window.api}/api/products/all`, { headers }),
                axios.get(`${window.api}/api/orders/all`, { headers }),
                axios.get(`${window.api}/api/auth/users`, { headers }),
            ])
            if (prodRes.status === 'fulfilled') setProducts(prodRes.value.data.products || [])
            if (orderRes.status === 'fulfilled') setOrders(orderRes.value.data.orders || [])
            if (userRes.status === 'fulfilled') setUsers(userRes.value.data.users || [])
            setLastUpdated(new Date())
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAll()
        const interval = setInterval(fetchAll, 30000)
        return () => clearInterval(interval)
    }, [])

    /* ── computed ── */
    const totalRevenue = orders.reduce((s, o) => s + (o.totalPrice || o.totalAmount || 0), 0)
    const pending = orders.filter(o => (o.status || o.orderStatus) === 'pending').length
    const delivered = orders.filter(o => (o.status || o.orderStatus) === 'delivered').length
    const cancelled = orders.filter(o => (o.status || o.orderStatus) === 'cancelled').length
    const processing = orders.filter(o => ['processing', 'shipped'].includes(o.status || o.orderStatus)).length

    const cRevenue = useCountUp(totalRevenue)
    const cOrders = useCountUp(orders.length)
    const cProducts = useCountUp(products.length)
    const cUsers = useCountUp(users.length)

    const catMap = {}
    products.forEach(p => { catMap[p.category] = (catMap[p.category] || 0) + 1 })
    const categories = Object.entries(catMap).map(([k, v]) => ({ label: k || 'Other', value: v }))

    const dayBars = (() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const counts = Array(7).fill(0)
        orders.forEach(o => {
            const d = new Date(o.createdAt)
            if (!isNaN(d)) counts[d.getDay()]++
        })
        return days.map((label, i) => ({ label, value: counts[i] }))
    })()

    const revSpark = (() => {
        const buckets = Array(7).fill(0)
        orders.forEach(o => {
            const d = new Date(o.createdAt)
            const diff = Math.floor((Date.now() - d) / 86400000)
            if (diff >= 0 && diff < 7) buckets[6 - diff] += (o.totalPrice || o.totalAmount || 0)
        })
        return buckets
    })()

    const donutSlices = [
        { label: 'Pending', value: pending, color: '#f59e0b' },
        { label: 'Processing', value: processing, color: '#6366f1' },
        { label: 'Delivered', value: delivered, color: '#10b981' },
        { label: 'Cancelled', value: cancelled, color: '#ef4444' },
    ].filter(s => s.value > 0)

    const topProducts = [...products].sort((a, b) => a.stock - b.stock).slice(0, 5)
    const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6)

    /* ─── LOADING ─── */
    if (loading) return (
        <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <style>{`@keyframes an-spin { to { transform: rotate(360deg) } }`}</style>
            <div style={{ width: 52, height: 52, borderRadius: '50%', border: '4px solid #e2e8f0', borderTop: '4px solid #6366f1', animation: 'an-spin 0.9s linear infinite' }} />
            <p style={{ color: '#94a3b8', fontWeight: 600 }}>Loading Analytics…</p>
        </div>
    )

    /* ─── RENDER ─── */
    return (
        <div style={{ padding: '28px 24px', maxWidth: 1200, fontFamily: "'Inter', sans-serif" }}>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                @keyframes an-spin { to { transform: rotate(360deg) } }
                @keyframes an-fadeUp { from { opacity:0; transform:translateY(18px) } to { opacity:1; transform:translateY(0) } }
                @keyframes an-pulse-ring { 0%{transform:scale(1);opacity:.5} 100%{transform:scale(2.2);opacity:0} }
                .an-card { animation: an-fadeUp 0.5s ease both; transition: all 0.25s; }
                .an-card:hover { transform: translateY(-3px) !important; box-shadow: 0 16px 40px rgba(0,0,0,0.10) !important; }
                .an-stat:nth-child(1){animation-delay:.05s}
                .an-stat:nth-child(2){animation-delay:.12s}
                .an-stat:nth-child(3){animation-delay:.19s}
                .an-stat:nth-child(4){animation-delay:.26s}
                .an-refresh { cursor:pointer; transition: transform 0.3s; display:inline-block; }
                .an-refresh:hover { transform: rotate(180deg); }
            `}</style>

            {/* ── Header ── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#0f172a', letterSpacing: -0.5 }}>📊 Analytics</h1>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94a3b8' }}>Live store performance overview</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 999, padding: '5px 12px', fontSize: 12, color: '#16a34a', fontWeight: 600 }}>
                        <PulseDot color="#22c55e" />
                        Live
                    </div>
                    {lastUpdated && <span style={{ fontSize: 11, color: '#cbd5e1' }}>Updated {lastUpdated.toLocaleTimeString()}</span>}
                    <span className="an-refresh" title="Refresh" onClick={fetchAll} style={{ fontSize: 20, color: '#94a3b8' }}>↻</span>
                </div>
            </div>

            {/* ── Stat Cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginBottom: 28 }}>
                {[
                    { label: 'Total Revenue', value: `Rs. ${cRevenue.toLocaleString()}`, sub: `Avg Rs. ${orders.length ? Math.round(totalRevenue / orders.length).toLocaleString() : 0}/order`, color: '#6366f1', bg: 'linear-gradient(135deg,#6366f1,#8b5cf6)', spark: revSpark, icon: '💰' },
                    { label: 'Total Orders', value: cOrders, sub: `${delivered} delivered · ${pending} pending`, color: '#10b981', bg: 'linear-gradient(135deg,#10b981,#059669)', spark: dayBars.map(b => b.value), icon: '🛒' },
                    { label: 'Products', value: cProducts, sub: `${categories.length} categories`, color: '#f59e0b', bg: 'linear-gradient(135deg,#f59e0b,#d97706)', spark: Array(7).fill(0).map((_, i) => i < products.length ? products[i]?.stock || 0 : 0), icon: '📦' },
                    { label: 'Users', value: cUsers, sub: `${users.filter(u => u.role === 'superAdmin').length} admins · ${users.filter(u => u.role === 'customer').length} customers`, color: '#ec4899', bg: 'linear-gradient(135deg,#ec4899,#db2777)', spark: Array(7).fill(0).map(() => Math.floor(Math.random() * (users.length + 1))), icon: '👥' },
                ].map((card, i) => (
                    <div key={i} className="an-card an-stat" style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', background: '#fff', position: 'relative' }}>
                        <div style={{ height: 5, background: card.bg }} />
                        <div style={{ padding: '18px 20px 14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{card.label}</div>
                                    <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: -1, lineHeight: 1 }}>{card.value}</div>
                                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 5 }}>{card.sub}</div>
                                </div>
                                <div style={{ fontSize: 32, lineHeight: 1, opacity: 0.85 }}>{card.icon}</div>
                            </div>
                            <div style={{ marginTop: 14 }}>
                                <Sparkline data={card.spark} color={card.color} height={36} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Row 2: Donut + Bar + Categories ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18, marginBottom: 28 }}>

                {/* Order Status Donut */}
                <div className="an-card" style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.07)', animationDelay: '.3s' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 20 }}>Order Status</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                        <Donut slices={donutSlices} size={130} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, minWidth: 120 }}>
                            {[
                                { label: 'Pending', value: pending, color: '#f59e0b' },
                                { label: 'Processing', value: processing, color: '#6366f1' },
                                { label: 'Delivered', value: delivered, color: '#10b981' },
                                { label: 'Cancelled', value: cancelled, color: '#ef4444' },
                            ].map((s, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                                    <span style={{ fontSize: 12, color: '#64748b', flex: 1 }}>{s.label}</span>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{s.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Orders by Day */}
                <div className="an-card" style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.07)', animationDelay: '.38s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Orders by Day</div>
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>This week</span>
                    </div>
                    <BarChart bars={dayBars} color="#6366f1" />
                </div>

                {/* Product Categories */}
                <div className="an-card" style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.07)', animationDelay: '.44s' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 20 }}>Product Categories</div>
                    {categories.length === 0
                        ? <p style={{ color: '#94a3b8', fontSize: 13 }}>No categories found</p>
                        : categories.slice(0, 5).map((c, i) => {
                            const pct = Math.round((c.value / products.length) * 100)
                            const clrs = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4']
                            return (
                                <div key={i} style={{ marginBottom: 14 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                        <span style={{ fontSize: 12, fontWeight: 600, color: '#334155', textTransform: 'capitalize' }}>{c.label}</span>
                                        <span style={{ fontSize: 12, fontWeight: 700, color: clrs[i % clrs.length] }}>{c.value} ({pct}%)</span>
                                    </div>
                                    <div style={{ height: 7, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${pct}%`, background: clrs[i % clrs.length], borderRadius: 999, transition: 'width 1s cubic-bezier(.4,2,.6,1)' }} />
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            {/* ── Row 3: Low Stock + Recent Orders ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>

                {/* Low Stock */}
                <div className="an-card" style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.07)', animationDelay: '.5s' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 18 }}>⚠️ Low Stock Alert</div>
                    {topProducts.length === 0
                        ? <p style={{ color: '#94a3b8', fontSize: 13 }}>No products</p>
                        : topProducts.map((p, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                                <div style={{ width: 38, height: 38, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                                    {p.imageURL
                                        ? <img src={p.imageURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        : <span style={{ fontSize: 18 }}>📦</span>
                                    }
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                                    <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'capitalize' }}>{p.category}</div>
                                </div>
                                <span style={{ fontSize: 11, fontWeight: 700, borderRadius: 999, padding: '3px 10px', background: p.stock <= 5 ? '#fef2f2' : '#f0fdf4', color: p.stock <= 5 ? '#ef4444' : '#16a34a' }}>
                                    {p.stock} left
                                </span>
                            </div>
                        ))
                    }
                </div>

                {/* Recent Orders */}
                <div className="an-card" style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.07)', animationDelay: '.56s' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 18 }}>🕒 Recent Orders</div>
                    {recentOrders.length === 0
                        ? <p style={{ color: '#94a3b8', fontSize: 13 }}>No orders yet</p>
                        : recentOrders.map((o, i) => {
                            const statusColors = { pending: '#f59e0b', delivered: '#10b981', cancelled: '#ef4444', processing: '#6366f1', shipped: '#06b6d4' }
                            const st = o.status || o.orderStatus || 'pending'
                            return (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 12, marginBottom: 12, borderBottom: i < recentOrders.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${statusColors[st] || '#94a3b8'}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <span style={{ fontSize: 14 }}>
                                            {st === 'delivered' ? '✅' : st === 'cancelled' ? '❌' : st === 'shipped' ? '🚚' : '⏳'}
                                        </span>
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 12, fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            #{o.id?.slice(-6)?.toUpperCase() || `ORD-${i + 1}`}
                                        </div>
                                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}</div>
                                    </div>
                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Rs. {(o.totalPrice || o.totalAmount || 0).toLocaleString()}</div>
                                        <span style={{ fontSize: 10, fontWeight: 700, borderRadius: 999, padding: '2px 8px', background: `${statusColors[st] || '#94a3b8'}20`, color: statusColors[st] || '#94a3b8', textTransform: 'capitalize' }}>
                                            {st}
                                        </span>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Analytics
