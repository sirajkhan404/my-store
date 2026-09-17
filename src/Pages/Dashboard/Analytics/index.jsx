import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import {
    BarChartOutlined,
    RiseOutlined,
    FallOutlined,
    DollarCircleFilled,
    ShoppingFilled,
    ShopFilled,
    InboxOutlined,
    CheckCircleFilled,
    ClockCircleFilled,
    SyncOutlined,
    ExclamationCircleFilled,
    FireFilled,
    SafetyCertificateFilled,
    ThunderboltFilled,
    TagFilled,
    EyeOutlined,
    TeamOutlined,
    CalendarOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    SearchOutlined,
    FilterFilled,
    ReloadOutlined,
    CheckCircleOutlined,
    CloseCircleFilled,
    CarFilled
} from '@ant-design/icons';

/* ── Animated Counter Hook ── */
function useCountUp(target, duration = 1000) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        if (!target && target !== 0) { setVal(0); return; }
        let start = 0;
        const total = typeof target === 'number' ? target : parseFloat(target) || 0;
        if (total === 0) { setVal(0); return; }
        const step = total / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= total) {
                setVal(total);
                clearInterval(timer);
            } else {
                setVal(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [target, duration]);
    return val;
}

/* ── Sparkline SVG ── */
function Sparkline({ data = [], color = '#0d9488', height = 40 }) {
    if (!data.length) return null;
    const safeData = data.length === 1 ? [data[0], data[0]] : data;
    const max = Math.max(...safeData, 1);
    const min = Math.min(...safeData, 0);
    const range = max - min || 1;
    const w = 140;
    const h = height;
    const pts = safeData.map((v, i) => `${(i / (safeData.length - 1)) * w},${h - ((v - min) / range) * (h - 8) - 4}`);
    const gradId = `spark_${color.replace(/[^a-zA-Z0-9]/g, '')}_${Math.floor(Math.random() * 10000)}`;

    return (
        <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height, overflow: 'visible' }}>
            <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.0" />
                </linearGradient>
            </defs>
            <polygon points={`0,${h} ${pts.join(' ')} ${w},${h}`} fill={`url(#${gradId})`} />
            <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/* ── Donut Chart ── */
function Donut({ slices = [], size = 140 }) {
    const r = 46;
    const cx = 65;
    const cy = 65;
    const circ = 2 * Math.PI * r;
    const total = slices.reduce((s, x) => s + (x.value || 0), 0) || 1;
    let offset = 0;

    return (
        <svg viewBox="0 0 130 130" width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="18" />
            {slices.map((sl, i) => {
                const dash = ((sl.value || 0) / total) * circ;
                const gap = circ - dash;
                const el = (
                    <circle
                        key={i}
                        cx={cx}
                        cy={cy}
                        r={r}
                        fill="none"
                        stroke={sl.color}
                        strokeWidth="18"
                        strokeDasharray={`${dash} ${gap}`}
                        strokeDashoffset={-offset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dasharray 0.8s ease' }}
                    />
                );
                offset += dash;
                return el;
            })}
        </svg>
    );
}

/* ── Weekly Orders Bar Chart ── */
function WeeklyBarChart({ bars = [], color = '#0d9488' }) {
    const max = Math.max(...bars.map(b => b.value), 1);
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '110px', padding: '10px 4px 0' }}>
            {bars.map((b, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: b.value > 0 ? '#0d9488' : '#94a3b8' }}>
                        {b.value > 0 ? b.value : ''}
                    </div>
                    <div
                        style={{
                            width: '100%',
                            borderRadius: '6px 6px 0 0',
                            height: `${(b.value / max) * 75}px`,
                            background: b.value > 0 ? `linear-gradient(180deg, ${color}, #14b8a6)` : '#e2e8f0',
                            transition: 'height 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                            minHeight: b.value > 0 ? '6px' : '3px'
                        }}
                        title={`${b.label}: ${b.value} Orders`}
                    />
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>{b.label}</span>
                </div>
            ))}
        </div>
    );
}

const Analytics = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [timeRange, setTimeRange] = useState('all'); // 'all' | 'today' | 'week' | 'month'
    const [refreshInterval, setRefreshInterval] = useState(15); // in seconds
    const [searchTerm, setSearchTerm] = useState('');

    const fetchAll = useCallback(async (isManual = false) => {
        if (isManual) setIsRefreshing(true);
        const jwt = localStorage.getItem('jwt');
        const headers = jwt ? { Authorization: `Bearer ${jwt}` } : {};

        try {
            const [rOrders, rProds, rUsers] = await Promise.allSettled([
                axios.get(`${window.api}/api/orders/all`, { headers }),
                axios.get(`${window.api}/api/products/public-all`),
                axios.get(`${window.api}/api/auth/all`, { headers })
            ]);

            if (rOrders.status === 'fulfilled') setOrders(rOrders.value.data?.orders || []);
            if (rProds.status === 'fulfilled') setProducts(rProds.value.data?.products || []);
            if (rUsers.status === 'fulfilled') setUsers(rUsers.value.data?.users || []);
            setLastUpdated(new Date());
        } catch (err) {
            console.error('Failed to refresh analytics data:', err);
        } finally {
            setLoading(false);
            if (isManual) setTimeout(() => setIsRefreshing(false), 500);
        }
    }, []);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    // Polling Interval
    useEffect(() => {
        if (!refreshInterval || refreshInterval <= 0) return;
        const timer = setInterval(() => {
            fetchAll(false);
        }, refreshInterval * 1000);
        return () => clearInterval(timer);
    }, [refreshInterval, fetchAll]);

    // ── Filter orders by selected time range ──
    const filteredOrders = useMemo(() => {
        const now = new Date();
        return orders.filter(o => {
            if (timeRange === 'all') return true;
            if (!o.createdAt) return true;
            const orderDate = new Date(o.createdAt);
            if (timeRange === 'today') {
                return orderDate.toDateString() === now.toDateString();
            }
            if (timeRange === 'week') {
                const diffTime = Math.abs(now - orderDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays <= 7;
            }
            if (timeRange === 'month') {
                return (
                    orderDate.getMonth() === now.getMonth() &&
                    orderDate.getFullYear() === now.getFullYear()
                );
            }
            return true;
        });
    }, [orders, timeRange]);

    // ── Metrics & Calculations ──
    const totalRevenue = useMemo(() => {
        return filteredOrders
            .filter(o => (o.orderStatus || o.status) !== 'cancelled')
            .reduce((sum, o) => sum + (Number(o.totalAmount) || Number(o.totalPrice) || 0), 0);
    }, [filteredOrders]);

    const deliveredCount = useMemo(() => filteredOrders.filter(o => (o.orderStatus || o.status) === 'delivered').length, [filteredOrders]);
    const processingCount = useMemo(() => filteredOrders.filter(o => ['processing', 'shipped'].includes(o.orderStatus || o.status)).length, [filteredOrders]);
    const pendingCount = useMemo(() => filteredOrders.filter(o => (o.orderStatus || o.status) === 'pending').length, [filteredOrders]);
    const cancelledCount = useMemo(() => filteredOrders.filter(o => (o.orderStatus || o.status) === 'cancelled').length, [filteredOrders]);

    const totalStockCount = useMemo(() => products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0), [products]);
    const totalInventoryValue = useMemo(() => products.reduce((acc, p) => acc + ((Number(p.price) || 0) * (Number(p.stock) || 0)), 0), [products]);
    const outOfStockCount = useMemo(() => products.filter(p => Number(p.stock) <= 0).length, [products]);
    const lowStockCount = useMemo(() => products.filter(p => Number(p.stock) > 0 && Number(p.stock) <= 5).length, [products]);

    // Animated values
    const cRevenue = useCountUp(totalRevenue);
    const cOrders = useCountUp(filteredOrders.length);
    const cProducts = useCountUp(products.length);
    const cUsers = useCountUp(users.length);

    // Days chart
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayCounts = Array(7).fill(0);
    filteredOrders.forEach(o => {
        if (o.createdAt) {
            const d = new Date(o.createdAt).getDay();
            if (!isNaN(d)) dayCounts[d]++;
        }
    });
    const dayBars = days.map((label, i) => ({ label, value: dayCounts[i] }));

    // Sparkline revenue data
    const revSpark = useMemo(() => {
        const sorted = [...filteredOrders].sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        const pts = sorted.slice(-10).map(o => Number(o.totalAmount) || Number(o.totalPrice) || 0);
        return pts.length ? pts : [0, 0];
    }, [filteredOrders]);

    // Categories
    const categories = useMemo(() => {
        const catMap = {};
        products.forEach(p => {
            const c = p.category || 'General';
            catMap[c] = (catMap[c] || 0) + 1;
        });
        return Object.entries(catMap)
            .map(([label, value]) => ({ label, value }))
            .sort((a, b) => b.value - a.value);
    }, [products]);

    // Donut chart slices
    const donutSlices = [
        { label: 'Delivered', value: deliveredCount, color: '#10b981' },
        { label: 'Processing', value: processingCount, color: '#0d9488' },
        { label: 'Pending', value: pendingCount, color: '#f59e0b' },
        { label: 'Cancelled', value: cancelledCount, color: '#ef4444' }
    ];

    // Low stock & top selling products
    const lowStockProducts = useMemo(() => {
        return [...products]
            .filter(p => Number(p.stock) <= 5)
            .sort((a, b) => Number(a.stock) - Number(b.stock))
            .slice(0, 5);
    }, [products]);

    const topSellingProducts = useMemo(() => {
        return [...products]
            .sort((a, b) => Number(b.price) - Number(a.price))
            .slice(0, 5);
    }, [products]);

    // Search filter for recent orders
    const searchedOrders = useMemo(() => {
        let list = [...filteredOrders].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            list = list.filter(o =>
                (o._id || o.id || '').toLowerCase().includes(q) ||
                (o.user?.fullName || o.shippingAddress?.fullName || '').toLowerCase().includes(q) ||
                (o.orderStatus || o.status || '').toLowerCase().includes(q)
            );
        }
        return list.slice(0, 8);
    }, [filteredOrders, searchTerm]);

    if (loading) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1 py-5" style={{ minHeight: '60vh' }}>
                <div className="spinner-border text-teal mb-3" style={{ width: '3.5rem', height: '3.5rem', color: '#0d9488' }} role="status">
                    <span className="visually-hidden">Loading Analytics...</span>
                </div>
                <h5 className="fw-bold text-dark">Connecting Live Analytics Data...</h5>
                <p className="text-muted small">Tracking your real-time store performance</p>
            </div>
        );
    }

    return (
        <div className="p-3 p-md-4 p-lg-5" style={{ fontFamily: "'Inter', sans-serif", background: '#f8fafc', minHeight: '100vh' }}>

            {/* ══ Live Control & Header Bar ══ */}
            <div className="card bg-white border border-light-subtle rounded-4 p-4 shadow-sm mb-4">
                <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
                    
                    {/* Title & Live Beacon */}
                    <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                            <h2 className="fw-extrabold text-dark fs-3 mb-0" style={{ letterSpacing: '-0.5px' }}>
                                Live Store Intelligence
                            </h2>
                            <span className="badge rounded-pill d-inline-flex align-items-center gap-2 px-3 py-2"
                                style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', fontSize: '11px', fontWeight: 700 }}>
                                <span style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: '#10b981',
                                    boxShadow: '0 0 10px #10b981',
                                    animation: 'pulse 1.5s infinite'
                                }} />
                                LIVE REAL-TIME
                            </span>
                        </div>
                        <p className="text-muted small mb-0">
                            Real-time order throughput, stock levels, and revenue performance tracker.
                        </p>
                    </div>

                    {/* Action Controls */}
                    <div className="d-flex flex-wrap align-items-center gap-2">
                        
                        {/* Time Range Filter */}
                        <div className="btn-group p-1 bg-light rounded-3 border border-light-subtle" role="group">
                            {[
                                { id: 'all', label: 'All Time' },
                                { id: 'today', label: 'Today' },
                                { id: 'week', label: 'This Week' },
                                { id: 'month', label: 'This Month' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setTimeRange(tab.id)}
                                    className={`btn btn-sm px-3 rounded-2 fw-semibold ${timeRange === tab.id ? 'bg-white shadow-sm text-dark' : 'text-secondary border-0'}`}
                                    style={{ fontSize: '12px' }}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Polling Interval Selector */}
                        <select
                            className="form-select form-select-sm bg-light border-light-subtle rounded-3 text-secondary fw-semibold"
                            style={{ width: 'auto', fontSize: '12px', paddingRight: '28px' }}
                            value={refreshInterval}
                            onChange={(e) => setRefreshInterval(Number(e.target.value))}
                        >
                            <option value={5}>Auto Sync: 5s</option>
                            <option value={15}>Auto Sync: 15s</option>
                            <option value={30}>Auto Sync: 30s</option>
                            <option value={60}>Auto Sync: 60s</option>
                            <option value={0}>Pause Auto Sync</option>
                        </select>

                        {/* Manual Refresh Button */}
                        <button
                            onClick={() => fetchAll(true)}
                            className="btn btn-sm text-white rounded-3 px-3 py-2 d-flex align-items-center gap-2 fw-bold shadow-sm"
                            style={{ background: 'linear-gradient(135deg, #0d9488, #042f2e)', border: 'none' }}
                            title="Force Refresh Data"
                        >
                            <SyncOutlined spin={isRefreshing} />
                            <span>{isRefreshing ? 'Syncing...' : 'Sync Now'}</span>
                        </button>
                    </div>
                </div>

                {/* Status Ticker Subbar */}
                <div className="d-flex flex-wrap align-items-center justify-content-between pt-3 mt-3 border-top border-light-subtle text-muted" style={{ fontSize: '12px' }}>
                    <div className="d-flex align-items-center gap-3">
                        <span><ClockCircleFilled className="me-1 text-teal" style={{ color: '#0d9488' }} /> Last Synced: <strong>{lastUpdated.toLocaleTimeString()}</strong></span>
                        <span className="d-none d-md-inline text-secondary">•</span>
                        <span className="d-none d-md-inline">Active Inventory Items: <strong>{products.length}</strong></span>
                        <span className="d-none d-md-inline text-secondary">•</span>
                        <span className="d-none d-md-inline">Registered Customers: <strong>{users.length}</strong></span>
                    </div>
                    <div className="d-flex align-items-center gap-1 text-success fw-semibold">
                        <SafetyCertificateFilled /> <span>Store Engine 100% Operational</span>
                    </div>
                </div>
            </div>

            {/* ══ 4 Top-Tier Real-Time KPI Cards ══ */}
            <div className="row g-4 mb-4">
                
                {/* 1. Gross Revenue */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card bg-white border border-light-subtle rounded-4 shadow-sm h-100 overflow-hidden position-relative">
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #0d9488, #5eead4)' }} />
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <div className="text-secondary small fw-bold text-uppercase" style={{ letterSpacing: '0.8px', fontSize: '11px' }}>
                                        Gross Revenue
                                    </div>
                                    <div className="fw-extrabold text-dark my-1 fs-3" style={{ letterSpacing: '-0.5px' }}>
                                        Rs. {cRevenue.toLocaleString()}
                                    </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-center rounded-3"
                                    style={{ width: '44px', height: '44px', background: '#f0fdfa', color: '#0d9488', fontSize: '20px' }}>
                                    <DollarCircleFilled />
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between text-muted small mt-2">
                                <span>Avg. per Order</span>
                                <strong className="text-dark">
                                    Rs. {filteredOrders.length ? Math.round(totalRevenue / filteredOrders.length).toLocaleString() : 0}
                                </strong>
                            </div>
                            <div className="mt-3">
                                <Sparkline data={revSpark} color="#0d9488" height={32} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Total Orders */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card bg-white border border-light-subtle rounded-4 shadow-sm h-100 overflow-hidden position-relative">
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #10b981, #6ee7b7)' }} />
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <div className="text-secondary small fw-bold text-uppercase" style={{ letterSpacing: '0.8px', fontSize: '11px' }}>
                                        Total Orders
                                    </div>
                                    <div className="fw-extrabold text-dark my-1 fs-3" style={{ letterSpacing: '-0.5px' }}>
                                        {cOrders}
                                    </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-center rounded-3"
                                    style={{ width: '44px', height: '44px', background: '#ecfdf5', color: '#10b981', fontSize: '20px' }}>
                                    <ShoppingFilled />
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between text-muted small mt-2">
                                <span>Delivered / Shipped</span>
                                <span className="badge bg-success-subtle text-success fw-bold px-2 py-1 rounded-pill">
                                    {deliveredCount} ({filteredOrders.length ? Math.round((deliveredCount / filteredOrders.length) * 100) : 0}%)
                                </span>
                            </div>
                            <div className="mt-3">
                                <Sparkline data={dayBars.map(b => b.value)} color="#10b981" height={32} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Total Inventory & Valuation */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card bg-white border border-light-subtle rounded-4 shadow-sm h-100 overflow-hidden position-relative">
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #f59e0b, #fde68a)' }} />
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <div className="text-secondary small fw-bold text-uppercase" style={{ letterSpacing: '0.8px', fontSize: '11px' }}>
                                        Inventory Value
                                    </div>
                                    <div className="fw-extrabold text-dark my-1 fs-3" style={{ letterSpacing: '-0.5px' }}>
                                        Rs. {totalInventoryValue.toLocaleString()}
                                    </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-center rounded-3"
                                    style={{ width: '44px', height: '44px', background: '#fffbeb', color: '#f59e0b', fontSize: '20px' }}>
                                    <ShopFilled />
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between text-muted small mt-2">
                                <span>In-Stock Stock Units</span>
                                <strong className="text-dark">{totalStockCount} items</strong>
                            </div>
                            <div className="mt-3">
                                <Sparkline data={products.slice(0, 10).map(p => Number(p.stock) || 0)} color="#f59e0b" height={32} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Active Community */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card bg-white border border-light-subtle rounded-4 shadow-sm h-100 overflow-hidden position-relative">
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #6366f1, #a5b4fc)' }} />
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <div className="text-secondary small fw-bold text-uppercase" style={{ letterSpacing: '0.8px', fontSize: '11px' }}>
                                        Customers & Users
                                    </div>
                                    <div className="fw-extrabold text-dark my-1 fs-3" style={{ letterSpacing: '-0.5px' }}>
                                        {cUsers}
                                    </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-center rounded-3"
                                    style={{ width: '44px', height: '44px', background: '#eef2ff', color: '#6366f1', fontSize: '20px' }}>
                                    <TeamOutlined />
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between text-muted small mt-2">
                                <span>Super Admins</span>
                                <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1 rounded-pill">
                                    {users.filter(u => u.role === 'superAdmin').length} Active
                                </span>
                            </div>
                            <div className="mt-3">
                                <Sparkline data={[1, 2, 4, 3, 5, 6, users.length || 7]} color="#6366f1" height={32} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* ══ Charts Row ══ */}
            <div className="row g-4 mb-4">
                
                {/* Orders by Day Volume Chart */}
                <div className="col-12 col-lg-7">
                    <div className="card bg-white border border-light-subtle rounded-4 shadow-sm p-4 h-100">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <div>
                                <h5 className="fw-bold text-dark fs-5 mb-0 d-flex align-items-center gap-2">
                                    <BarChartOutlined style={{ color: '#0d9488' }} /> Order Volume Distribution
                                </h5>
                                <p className="text-muted small mb-0">Daily order intake tracking throughout the week</p>
                            </div>
                            <span className="badge bg-light text-dark border px-3 py-2 rounded-pill fw-semibold" style={{ fontSize: '11px' }}>
                                Weekday Breakdown
                            </span>
                        </div>
                        <WeeklyBarChart bars={dayBars} color="#0d9488" />
                    </div>
                </div>

                {/* Order Status Donut Chart */}
                <div className="col-12 col-lg-5">
                    <div className="card bg-white border border-light-subtle rounded-4 shadow-sm p-4 h-100">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <div>
                                <h5 className="fw-bold text-dark fs-5 mb-0">Order Status Breakdown</h5>
                                <p className="text-muted small mb-0">Fulfillment lifecycle distribution</p>
                            </div>
                            <span className="badge bg-teal-subtle text-teal fw-bold px-2 py-1 rounded-pill" style={{ background: '#f0fdfa', color: '#0d9488' }}>
                                {filteredOrders.length} Orders
                            </span>
                        </div>

                        <div className="d-flex flex-column flex-sm-row align-items-center justify-content-center gap-4 my-auto py-2">
                            <div className="position-relative d-flex align-items-center justify-content-center">
                                <Donut slices={donutSlices} size={140} />
                                <div className="position-absolute text-center">
                                    <div className="fw-extrabold fs-4 text-dark mb-0">{filteredOrders.length}</div>
                                    <div className="text-secondary text-uppercase fw-bold" style={{ fontSize: '9px', letterSpacing: '0.8px' }}>Total</div>
                                </div>
                            </div>

                            <div className="d-flex flex-column gap-2 flex-grow-1 w-100">
                                {[
                                    { label: 'Delivered', count: deliveredCount, color: '#10b981', bg: '#ecfdf5' },
                                    { label: 'Processing / Shipped', count: processingCount, color: '#0d9488', bg: '#f0fdfa' },
                                    { label: 'Pending', count: pendingCount, color: '#f59e0b', bg: '#fffbeb' },
                                    { label: 'Cancelled', count: cancelledCount, color: '#ef4444', bg: '#fef2f2' },
                                ].map((item, idx) => (
                                    <div key={idx} className="d-flex align-items-center justify-content-between p-2 rounded-3" style={{ background: item.bg }}>
                                        <div className="d-flex align-items-center gap-2">
                                            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
                                            <span className="small fw-semibold text-dark">{item.label}</span>
                                        </div>
                                        <span className="small fw-bold" style={{ color: item.color }}>
                                            {item.count} ({filteredOrders.length ? Math.round((item.count / filteredOrders.length) * 100) : 0}%)
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* ══ Live Stock & Category Radar ══ */}
            <div className="row g-4 mb-4">
                
                {/* Low Stock Live Alerts */}
                <div className="col-12 col-lg-6">
                    <div className="card bg-white border border-light-subtle rounded-4 shadow-sm p-4 h-100">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <div>
                                <h5 className="fw-bold text-dark fs-5 mb-0 d-flex align-items-center gap-2">
                                    <ExclamationCircleFilled style={{ color: '#ef4444' }} /> Inventory Health & Alerts
                                </h5>
                                <p className="text-muted small mb-0">Items requiring restocking attention</p>
                            </div>
                            <span className="badge bg-danger-subtle text-danger fw-bold px-3 py-1 rounded-pill" style={{ fontSize: '11px' }}>
                                {outOfStockCount} Out of Stock
                            </span>
                        </div>

                        {lowStockProducts.length === 0 ? (
                            <div className="text-center py-4 text-muted small">
                                <CheckCircleFilled className="text-success fs-3 d-block mb-2" />
                                All products have healthy stock levels!
                            </div>
                        ) : (
                            <div className="d-flex flex-column gap-3">
                                {lowStockProducts.map((p, idx) => (
                                    <div key={idx} className="d-flex align-items-center justify-content-between p-2 rounded-3 border border-light-subtle bg-light">
                                        <div className="d-flex align-items-center gap-3 min-width-0">
                                            <div className="rounded-3 overflow-hidden flex-shrink-0 bg-white border border-light-subtle d-flex align-items-center justify-content-center"
                                                style={{ width: '42px', height: '42px' }}>
                                                {p.imageURL ? (
                                                    <img src={p.imageURL} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <InboxOutlined style={{ fontSize: '20px', color: '#94a3b8' }} />
                                                )}
                                            </div>
                                            <div className="min-width-0">
                                                <div className="fw-bold text-dark small text-truncate" style={{ maxWidth: '200px' }}>{p.name}</div>
                                                <div className="text-muted text-capitalize" style={{ fontSize: '11px' }}>{p.category || 'General'}</div>
                                            </div>
                                        </div>
                                        <div className="text-end flex-shrink-0">
                                            <span className={`badge rounded-pill px-3 py-1 fw-bold ${Number(p.stock) <= 0 ? 'bg-danger text-white' : 'bg-warning text-dark'}`} style={{ fontSize: '11px' }}>
                                                {Number(p.stock) <= 0 ? 'Out of Stock' : `Only ${p.stock} left`}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Categories Distribution */}
                <div className="col-12 col-lg-6">
                    <div className="card bg-white border border-light-subtle rounded-4 shadow-sm p-4 h-100">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <div>
                                <h5 className="fw-bold text-dark fs-5 mb-0 d-flex align-items-center gap-2">
                                    <TagFilled style={{ color: '#0d9488' }} /> Product Categories Mix
                                </h5>
                                <p className="text-muted small mb-0">Inventory allocation across categories</p>
                            </div>
                            <span className="badge bg-light text-dark border px-3 py-1 rounded-pill fw-semibold" style={{ fontSize: '11px' }}>
                                {categories.length} Categories
                            </span>
                        </div>

                        {categories.length === 0 ? (
                            <div className="text-center py-4 text-muted small">No categories registered.</div>
                        ) : (
                            <div className="d-flex flex-column gap-3">
                                {categories.slice(0, 5).map((cat, idx) => {
                                    const pct = Math.round((cat.value / (products.length || 1)) * 100);
                                    const colors = ['#0d9488', '#f59e0b', '#10b981', '#6366f1', '#ec4899'];
                                    const color = colors[idx % colors.length];
                                    return (
                                        <div key={idx}>
                                            <div className="d-flex justify-content-between align-items-center mb-1 small fw-semibold">
                                                <span className="text-capitalize text-dark">{cat.label}</span>
                                                <span style={{ color }}>{cat.value} products ({pct}%)</span>
                                            </div>
                                            <div className="progress" style={{ height: '7px', borderRadius: '10px', background: '#f1f5f9' }}>
                                                <div
                                                    className="progress-bar"
                                                    role="progressbar"
                                                    style={{ width: `${pct}%`, background: color, borderRadius: '10px' }}
                                                    aria-valuenow={pct}
                                                    aria-valuemin="0"
                                                    aria-valuemax="100"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* ══ Live Recent Orders Feed ══ */}
            <div className="card bg-white border border-light-subtle rounded-4 shadow-sm overflow-hidden mb-4">
                <div className="card-header bg-white border-0 pt-4 px-4 pb-3">
                    <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                        <div>
                            <h5 className="fw-bold text-dark fs-5 mb-0 d-flex align-items-center gap-2">
                                <ThunderboltFilled style={{ color: '#f59e0b' }} /> Live Orders Activity Stream
                            </h5>
                            <p className="text-muted small mb-0">Real-time incoming customer transactions</p>
                        </div>

                        {/* Search Box */}
                        <div className="input-group" style={{ maxWidth: '280px' }}>
                            <span className="input-group-text bg-light border-light-subtle text-muted">
                                <SearchOutlined />
                            </span>
                            <input
                                type="text"
                                className="form-control form-control-sm bg-light border-light-subtle"
                                placeholder="Search live orders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ fontSize: '13px' }}
                            />
                        </div>
                    </div>
                </div>

                {searchedOrders.length === 0 ? (
                    <div className="text-center py-5 text-muted small">
                        No recent transactions found.
                    </div>
                ) : (
                    <div className="table-responsive px-4 pb-4">
                        <table className="table table-hover align-middle mb-0 text-nowrap">
                            <thead className="table-light">
                                <tr className="text-secondary fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.8px' }}>
                                    <th className="py-3">Order ID</th>
                                    <th className="py-3">Customer</th>
                                    <th className="py-3">Items</th>
                                    <th className="py-3">Total Amount</th>
                                    <th className="py-3">Status</th>
                                    <th className="py-3 text-end">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchedOrders.map((o, idx) => {
                                    const st = o.orderStatus || o.status || 'pending';
                                    const statusBadge = {
                                        delivered: 'bg-success text-white',
                                        processing: 'bg-primary text-white',
                                        shipped: 'bg-info text-dark',
                                        pending: 'bg-warning text-dark',
                                        cancelled: 'bg-danger text-white'
                                    };
                                    return (
                                        <tr key={idx}>
                                            <td className="py-3 fw-bold text-dark" style={{ fontSize: '13px' }}>
                                                #{o._id?.slice(-6)?.toUpperCase() || o.id?.slice(-6)?.toUpperCase() || `ORD-${idx + 1}`}
                                            </td>
                                            <td className="py-3">
                                                <div className="fw-semibold text-dark" style={{ fontSize: '13px' }}>
                                                    {o.user?.fullName || o.shippingAddress?.fullName || 'Customer'}
                                                </div>
                                                <div className="text-muted" style={{ fontSize: '11px' }}>
                                                    {o.user?.email || o.shippingAddress?.city || 'Verified Buyer'}
                                                </div>
                                            </td>
                                            <td className="py-3 text-secondary" style={{ fontSize: '13px' }}>
                                                {o.items?.length || o.cart?.length || 1} Item(s)
                                            </td>
                                            <td className="py-3 fw-bold text-teal" style={{ color: '#0d9488', fontSize: '13px' }}>
                                                Rs. {(Number(o.totalAmount) || Number(o.totalPrice) || 0).toLocaleString()}
                                            </td>
                                            <td className="py-3">
                                                <span className={`badge rounded-pill px-3 py-1 fw-bold text-capitalize ${statusBadge[st] || 'bg-secondary text-white'}`} style={{ fontSize: '11px' }}>
                                                    {st}
                                                </span>
                                            </td>
                                            <td className="py-3 text-end text-muted" style={{ fontSize: '12px' }}>
                                                {o.createdAt ? new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
    );
};

export default Analytics;
