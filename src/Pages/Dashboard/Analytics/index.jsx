import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import {
    BarChartOutlined,
    RiseOutlined,
    DollarCircleFilled,
    ShoppingFilled,
    ShopFilled,
    InboxOutlined,
    CheckCircleFilled,
    ClockCircleFilled,
    SyncOutlined,
    ExclamationCircleFilled,
    FireFilled,
    ThunderboltFilled,
    TagFilled,
    TeamOutlined,
    SearchOutlined,
    FilterOutlined,
    ReloadOutlined,
    CheckCircleOutlined,
    CloseCircleFilled,
    CarFilled,
    AppstoreOutlined,
    CrownFilled
} from '@ant-design/icons';

/* ── Smooth Counter Hook ── */
function useAnimatedValue(target, duration = 800) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        if (!target && target !== 0) { setVal(0); return; }
        const num = typeof target === 'number' ? target : parseFloat(target) || 0;
        if (num === 0) { setVal(0); return; }
        let start = 0;
        const step = num / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= num) {
                setVal(num);
                clearInterval(timer);
            } else {
                setVal(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [target, duration]);
    return val;
}

/* ── Responsive Mini Sparkline Chart ── */
function MiniSparkline({ data = [], color = '#0d9488', height = 36 }) {
    if (!data.length) return null;
    const safeData = data.length === 1 ? [data[0], data[0]] : data;
    const max = Math.max(...safeData, 1);
    const min = Math.min(...safeData, 0);
    const range = max - min || 1;
    const w = 120;
    const h = height;
    const pts = safeData.map((v, i) => `${(i / (safeData.length - 1)) * w},${h - ((v - min) / range) * (h - 6) - 3}`);
    const gradId = `spark_${color.replace(/[^a-zA-Z0-9]/g, '')}_${Math.floor(Math.random() * 1000)}`;

    return (
        <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height, overflow: 'hidden' }}>
            <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.28" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.0" />
                </linearGradient>
            </defs>
            <polygon points={`0,${h} ${pts.join(' ')} ${w},${h}`} fill={`url(#${gradId})`} />
            <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/* ── Interactive Radial Donut ── */
function RadialDonut({ slices = [], totalLabel = "TOTAL", totalValue = 0, size = 150 }) {
    const r = 48;
    const cx = 65;
    const cy = 65;
    const circ = 2 * Math.PI * r;
    const total = slices.reduce((s, x) => s + (x.value || 0), 0) || 1;
    let offset = 0;

    return (
        <div style={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 130 130" width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="16" />
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
                            strokeWidth="16"
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
            <div style={{ position: 'absolute', textAlign: 'center', pointerEvents: 'none' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
                    {totalValue}
                </div>
                <div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: '2px' }}>
                    {totalLabel}
                </div>
            </div>
        </div>
    );
}

/* ── Live Analytics Main Component ── */
const Analytics = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastSync, setLastSync] = useState(new Date());
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'orders' | 'inventory'
    const [timeFilter, setTimeFilter] = useState('all'); // 'all' | 'today' | '7d' | '30d'
    const [searchQuery, setSearchQuery] = useState('');
    const [autoSync, setAutoSync] = useState(true);

    const fetchData = useCallback(async (isManual = false) => {
        if (isManual) setIsRefreshing(true);
        const jwt = localStorage.getItem('jwt');
        const headers = jwt ? { Authorization: `Bearer ${jwt}` } : {};

        try {
            const [orderRes, prodRes, userRes] = await Promise.allSettled([
                axios.get(`${window.api}/api/orders/all`, { headers }),
                axios.get(`${window.api}/api/products/public-all`),
                axios.get(`${window.api}/api/auth/all`, { headers })
            ]);

            if (orderRes.status === 'fulfilled') setOrders(orderRes.value.data?.orders || []);
            if (prodRes.status === 'fulfilled') setProducts(prodRes.value.data?.products || []);
            if (userRes.status === 'fulfilled') setUsers(userRes.value.data?.users || []);
            setLastSync(new Date());
        } catch (error) {
            console.error('Analytics live fetch error:', error);
        } finally {
            setLoading(false);
            if (isManual) setTimeout(() => setIsRefreshing(false), 400);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Polling every 12 seconds
    useEffect(() => {
        if (!autoSync) return;
        const interval = setInterval(() => {
            fetchData(false);
        }, 12000);
        return () => clearInterval(interval);
    }, [autoSync, fetchData]);

    // ── Date Range Filtered Orders ──
    const scopedOrders = useMemo(() => {
        const now = new Date();
        return orders.filter(o => {
            if (timeFilter === 'all') return true;
            if (!o.createdAt) return true;
            const date = new Date(o.createdAt);
            if (timeFilter === 'today') {
                return date.toDateString() === now.toDateString();
            }
            if (timeFilter === '7d') {
                return (now - date) <= 7 * 24 * 60 * 60 * 1000;
            }
            if (timeFilter === '30d') {
                return (now - date) <= 30 * 24 * 60 * 60 * 1000;
            }
            return true;
        });
    }, [orders, timeFilter]);

    // ── Calculations ──
    const totalGrossRevenue = useMemo(() => {
        return scopedOrders
            .filter(o => (o.orderStatus || o.status) !== 'cancelled')
            .reduce((sum, o) => sum + (Number(o.totalAmount) || Number(o.totalPrice) || 0), 0);
    }, [scopedOrders]);

    const deliveredOrders = useMemo(() => scopedOrders.filter(o => (o.orderStatus || o.status) === 'delivered'), [scopedOrders]);
    const processingOrders = useMemo(() => scopedOrders.filter(o => ['processing', 'shipped'].includes(o.orderStatus || o.status)), [scopedOrders]);
    const pendingOrders = useMemo(() => scopedOrders.filter(o => (o.orderStatus || o.status) === 'pending'), [scopedOrders]);
    const cancelledOrders = useMemo(() => scopedOrders.filter(o => (o.orderStatus || o.status) === 'cancelled'), [scopedOrders]);

    const fulfillmentRate = useMemo(() => {
        if (!scopedOrders.length) return 0;
        return Math.round((deliveredOrders.length / scopedOrders.length) * 100);
    }, [scopedOrders, deliveredOrders]);

    const totalStock = useMemo(() => products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0), [products]);
    const totalInventoryValue = useMemo(() => products.reduce((acc, p) => acc + ((Number(p.price) || 0) * (Number(p.stock) || 0)), 0), [products]);
    const lowStockItems = useMemo(() => products.filter(p => Number(p.stock) <= 5).sort((a, b) => Number(a.stock) - Number(b.stock)), [products]);
    const outOfStockCount = useMemo(() => products.filter(p => Number(p.stock) <= 0).length, [products]);

    // Animated values
    const animRevenue = useAnimatedValue(totalGrossRevenue);
    const animOrders = useAnimatedValue(scopedOrders.length);
    const animProducts = useAnimatedValue(products.length);
    const animUsers = useAnimatedValue(users.length);

    // Weekly distribution for bar charts
    const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekdayCounts = Array(7).fill(0);
    scopedOrders.forEach(o => {
        if (o.createdAt) {
            const d = new Date(o.createdAt).getDay();
            if (!isNaN(d)) weekdayCounts[d]++;
        }
    });
    const maxDayCount = Math.max(...weekdayCounts, 1);

    // Donut Slices
    const statusSlices = [
        { label: 'Delivered', value: deliveredOrders.length, color: '#10b981' },
        { label: 'Processing', value: processingOrders.length, color: '#0d9488' },
        { label: 'Pending', value: pendingOrders.length, color: '#f59e0b' },
        { label: 'Cancelled', value: cancelledOrders.length, color: '#ef4444' }
    ];

    // Categories
    const categoryStats = useMemo(() => {
        const map = {};
        products.forEach(p => {
            const cat = p.category || 'General';
            map[cat] = (map[cat] || 0) + 1;
        });
        return Object.entries(map)
            .map(([label, count]) => ({ label, count }))
            .sort((a, b) => b.count - a.count);
    }, [products]);

    // Filtered Order List for Table
    const searchedOrders = useMemo(() => {
        let list = [...scopedOrders].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(o =>
                (o._id || o.id || '').toLowerCase().includes(q) ||
                (o.user?.fullName || o.shippingAddress?.fullName || '').toLowerCase().includes(q) ||
                (o.orderStatus || o.status || '').toLowerCase().includes(q)
            );
        }
        return list;
    }, [scopedOrders, searchQuery]);

    if (loading) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center py-5" style={{ minHeight: '60vh' }}>
                <div className="spinner-border text-teal mb-3" style={{ width: '3rem', height: '3rem', color: '#0d9488' }} role="status" />
                <h6 className="fw-bold text-dark">Initializing Live Store Telemetry...</h6>
                <p className="text-muted small">Tracking live products, inventory, and order pipelines</p>
            </div>
        );
    }

    return (
        <div className="container-fluid p-3 p-md-4 p-lg-5" style={{ fontFamily: "'Inter', sans-serif", background: '#f8fafc', minHeight: '100vh' }}>

            {/* ══ Top Hero Banner ══ */}
            <div className="rounded-4 p-4 p-md-5 text-white position-relative overflow-hidden mb-4 shadow-sm"
                style={{ background: 'linear-gradient(135deg, #042f2e 0%, #134e4a 60%, #0d9488 100%)' }}>
                
                {/* Background ambient glow shapes */}
                <div className="position-absolute rounded-circle pointer-event-none"
                    style={{ width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(94,234,212,0.15) 0%, transparent 70%)', top: '-100px', right: '-50px' }} />
                
                <div className="row g-3 align-items-center justify-content-between position-relative" style={{ zIndex: 1 }}>
                    
                    {/* Left title */}
                    <div className="col-12 col-md-7">
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <span className="badge rounded-pill px-3 py-1 fw-bold d-inline-flex align-items-center gap-2"
                                style={{ background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.25)', fontSize: '11px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 10px #34d399' }} />
                                LIVE TRACKING ACTIVE
                            </span>
                            <span className="small opacity-75 d-none d-sm-inline">
                                Synced: {lastSync.toLocaleTimeString()}
                            </span>
                        </div>
                        <h1 className="fw-extrabold display-6 fs-2 fs-md-1 mb-1" style={{ letterSpacing: '-0.5px' }}>
                            Store Live Intelligence
                        </h1>
                        <p className="opacity-75 small mb-0" style={{ maxWidth: '480px' }}>
                            Live monitoring of orders, inventory stock levels, gross sales, and customer demand.
                        </p>
                    </div>

                    {/* Right controls */}
                    <div className="col-12 col-md-5 text-md-end">
                        <div className="d-flex flex-wrap align-items-center justify-content-start justify-content-md-end gap-2">
                            
                            {/* Auto sync switch button */}
                            <button
                                onClick={() => setAutoSync(!autoSync)}
                                className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1 ${autoSync ? 'btn-light text-dark' : 'btn-outline-light text-white'}`}
                                style={{ fontSize: '12px' }}
                            >
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: autoSync ? '#10b981' : '#94a3b8' }} />
                                {autoSync ? 'Auto-Sync: ON' : 'Auto-Sync: OFF'}
                            </button>

                            {/* Force refresh */}
                            <button
                                onClick={() => fetchData(true)}
                                className="btn btn-sm rounded-pill px-3 py-2 fw-bold text-dark d-inline-flex align-items-center gap-2 shadow-sm"
                                style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', border: 'none', fontSize: '12px' }}
                            >
                                <SyncOutlined spin={isRefreshing} />
                                <span>Sync Now</span>
                            </button>

                        </div>
                    </div>
                </div>

                {/* Sub Navigation Tabs */}
                <div className="d-flex flex-wrap align-items-center justify-content-between pt-4 mt-4 border-top border-white border-opacity-15 gap-2 position-relative" style={{ zIndex: 1 }}>
                    <div className="d-flex gap-2 overflow-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                        {[
                            { id: 'overview', label: 'Overview & Performance', icon: <BarChartOutlined /> },
                            { id: 'orders', label: `Orders (${scopedOrders.length})`, icon: <ShoppingFilled /> },
                            { id: 'inventory', label: `Inventory & Stock (${products.length})`, icon: <InboxOutlined /> },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`btn btn-sm px-3 py-2 rounded-pill fw-bold text-nowrap d-inline-flex align-items-center gap-2 transition-all ${activeTab === tab.id ? 'bg-white text-dark shadow-sm' : 'text-white border-0 opacity-85'}`}
                                style={{
                                    fontSize: '12.5px',
                                    background: activeTab === tab.id ? '#ffffff' : 'rgba(255,255,255,0.1)'
                                }}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Time Range Chips */}
                    <div className="d-flex align-items-center gap-1 bg-black bg-opacity-20 p-1 rounded-pill">
                        {[
                            { id: 'all', label: 'All Time' },
                            { id: 'today', label: 'Today' },
                            { id: '7d', label: '7 Days' },
                            { id: '30d', label: '30 Days' }
                        ].map(tf => (
                            <button
                                key={tf.id}
                                onClick={() => setTimeFilter(tf.id)}
                                className={`btn btn-sm rounded-pill px-2 px-sm-3 py-1 fw-semibold ${timeFilter === tf.id ? 'bg-white text-dark shadow-sm' : 'text-white border-0 opacity-75'}`}
                                style={{ fontSize: '11px' }}
                            >
                                {tf.label}
                            </button>
                        ))}
                    </div>
                </div>

            </div>

            {/* ══ Top 4 KPI Metrics Grid (100% Responsive) ══ */}
            <div className="row g-3 g-md-4 mb-4">
                
                {/* 1. Gross Revenue */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card bg-white border border-light-subtle rounded-4 shadow-sm h-100 p-4 transition-all">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <span className="text-secondary small fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.8px' }}>
                                    Gross Revenue
                                </span>
                                <h3 className="fw-extrabold text-dark my-1 fs-3">
                                    Rs. {animRevenue.toLocaleString()}
                                </h3>
                                <div className="text-muted small">
                                    Avg: <strong>Rs. {scopedOrders.length ? Math.round(totalGrossRevenue / scopedOrders.length).toLocaleString() : 0}</strong> / order
                                </div>
                            </div>
                            <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                                style={{ width: '44px', height: '44px', background: '#f0fdfa', color: '#0d9488', fontSize: '20px' }}>
                                <DollarCircleFilled />
                            </div>
                        </div>
                        <div className="mt-3">
                            <MiniSparkline data={scopedOrders.slice(-8).map(o => Number(o.totalAmount) || Number(o.totalPrice) || 0)} color="#0d9488" />
                        </div>
                    </div>
                </div>

                {/* 2. Total Orders & Fulfillment */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card bg-white border border-light-subtle rounded-4 shadow-sm h-100 p-4 transition-all">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <span className="text-secondary small fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.8px' }}>
                                    Total Orders
                                </span>
                                <h3 className="fw-extrabold text-dark my-1 fs-3">
                                    {animOrders}
                                </h3>
                                <div className="text-muted small">
                                    Fulfillment: <strong className="text-success">{fulfillmentRate}%</strong> Delivered
                                </div>
                            </div>
                            <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                                style={{ width: '44px', height: '44px', background: '#ecfdf5', color: '#10b981', fontSize: '20px' }}>
                                <ShoppingFilled />
                            </div>
                        </div>
                        <div className="mt-3">
                            <MiniSparkline data={weekdayCounts} color="#10b981" />
                        </div>
                    </div>
                </div>

                {/* 3. Live Inventory Value */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card bg-white border border-light-subtle rounded-4 shadow-sm h-100 p-4 transition-all">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <span className="text-secondary small fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.8px' }}>
                                    Stock Valuation
                                </span>
                                <h3 className="fw-extrabold text-dark my-1 fs-3">
                                    Rs. {totalInventoryValue.toLocaleString()}
                                </h3>
                                <div className="text-muted small">
                                    In Stock: <strong>{totalStock} units</strong> ({products.length} products)
                                </div>
                            </div>
                            <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                                style={{ width: '44px', height: '44px', background: '#fffbeb', color: '#f59e0b', fontSize: '20px' }}>
                                <ShopFilled />
                            </div>
                        </div>
                        <div className="mt-3">
                            <MiniSparkline data={products.slice(0, 10).map(p => Number(p.stock) || 0)} color="#f59e0b" />
                        </div>
                    </div>
                </div>

                {/* 4. Customers & Community */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card bg-white border border-light-subtle rounded-4 shadow-sm h-100 p-4 transition-all">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <span className="text-secondary small fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.8px' }}>
                                    Active Customers
                                </span>
                                <h3 className="fw-extrabold text-dark my-1 fs-3">
                                    {animUsers}
                                </h3>
                                <div className="text-muted small">
                                    Admins: <strong>{users.filter(u => u.role === 'superAdmin').length}</strong> · Buyers: <strong>{users.filter(u => u.role !== 'superAdmin').length}</strong>
                                </div>
                            </div>
                            <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                                style={{ width: '44px', height: '44px', background: '#eef2ff', color: '#6366f1', fontSize: '20px' }}>
                                <TeamOutlined />
                            </div>
                        </div>
                        <div className="mt-3">
                            <MiniSparkline data={[1, 2, 4, 3, 5, users.length || 6]} color="#6366f1" />
                        </div>
                    </div>
                </div>

            </div>

            {/* ══ TAB 1: Overview & Performance ══ */}
            {activeTab === 'overview' && (
                <>
                    <div className="row g-4 mb-4">
                        
                        {/* Weekly Orders Bar Flow */}
                        <div className="col-12 col-lg-7">
                            <div className="card bg-white border border-light-subtle rounded-4 shadow-sm p-4 h-100">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div>
                                        <h5 className="fw-bold text-dark fs-5 mb-0 d-flex align-items-center gap-2">
                                            <BarChartOutlined style={{ color: '#0d9488' }} /> Weekly Order Velocity
                                        </h5>
                                        <p className="text-muted small mb-0">Daily transactions processed through your store</p>
                                    </div>
                                    <span className="badge bg-light text-secondary border px-3 py-1 rounded-pill small">
                                        Sun - Sat
                                    </span>
                                </div>

                                <div className="d-flex align-items-end justify-content-between gap-2 pt-3" style={{ minHeight: '140px' }}>
                                    {weekdayLabels.map((day, idx) => {
                                        const count = weekdayCounts[idx];
                                        const heightPct = Math.max((count / maxDayCount) * 100, 8);
                                        return (
                                            <div key={idx} className="d-flex flex-column align-items-center flex-grow-1 gap-2">
                                                <span className="small fw-bold" style={{ color: count > 0 ? '#0d9488' : '#94a3b8', fontSize: '11px' }}>
                                                    {count > 0 ? count : ''}
                                                </span>
                                                <div
                                                    className="w-100 rounded-3 transition-all"
                                                    style={{
                                                        height: `${heightPct}px`,
                                                        maxHeight: '100px',
                                                        background: count > 0 ? 'linear-gradient(180deg, #0d9488, #14b8a6)' : '#e2e8f0',
                                                        borderRadius: '6px 6px 0 0'
                                                    }}
                                                    title={`${day}: ${count} Orders`}
                                                />
                                                <span className="small fw-semibold text-secondary" style={{ fontSize: '11px' }}>
                                                    {day}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Status Donut Breakdown */}
                        <div className="col-12 col-lg-5">
                            <div className="card bg-white border border-light-subtle rounded-4 shadow-sm p-4 h-100">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div>
                                        <h5 className="fw-bold text-dark fs-5 mb-0">Order Pipeline Status</h5>
                                        <p className="text-muted small mb-0">Real-time status breakdown</p>
                                    </div>
                                    <span className="badge bg-light text-teal fw-bold px-2 py-1 rounded-pill" style={{ color: '#0d9488' }}>
                                        {scopedOrders.length} Total
                                    </span>
                                </div>

                                <div className="d-flex flex-column flex-sm-row align-items-center justify-content-around gap-3 my-auto py-2">
                                    <RadialDonut slices={statusSlices} totalLabel="ORDERS" totalValue={scopedOrders.length} size={140} />
                                    
                                    <div className="d-flex flex-column gap-2 w-100" style={{ maxWidth: '200px' }}>
                                        {[
                                            { label: 'Delivered', count: deliveredOrders.length, color: '#10b981', bg: '#ecfdf5' },
                                            { label: 'Processing', count: processingOrders.length, color: '#0d9488', bg: '#f0fdfa' },
                                            { label: 'Pending', count: pendingOrders.length, color: '#f59e0b', bg: '#fffbeb' },
                                            { label: 'Cancelled', count: cancelledOrders.length, color: '#ef4444', bg: '#fef2f2' },
                                        ].map((item, idx) => (
                                            <div key={idx} className="d-flex align-items-center justify-content-between p-2 rounded-3" style={{ background: item.bg }}>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
                                                    <span className="small fw-semibold text-dark" style={{ fontSize: '11px' }}>{item.label}</span>
                                                </div>
                                                <span className="small fw-bold" style={{ color: item.color, fontSize: '11px' }}>
                                                    {item.count}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Stock Alert + Category Breakdown */}
                    <div className="row g-4">
                        
                        {/* Low Stock Radar */}
                        <div className="col-12 col-lg-6">
                            <div className="card bg-white border border-light-subtle rounded-4 shadow-sm p-4 h-100">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div>
                                        <h5 className="fw-bold text-dark fs-5 mb-0 d-flex align-items-center gap-2">
                                            <ExclamationCircleFilled style={{ color: '#ef4444' }} /> Low Stock Radar
                                        </h5>
                                        <p className="text-muted small mb-0">Items with 5 or fewer units remaining</p>
                                    </div>
                                    <span className="badge bg-danger-subtle text-danger fw-bold px-3 py-1 rounded-pill small">
                                        {lowStockItems.length} Alerts
                                    </span>
                                </div>

                                {lowStockItems.length === 0 ? (
                                    <div className="text-center py-4 text-muted small">
                                        <CheckCircleFilled className="text-success fs-3 d-block mb-2" />
                                        All inventory stocks are healthy and plentiful!
                                    </div>
                                ) : (
                                    <div className="d-flex flex-column gap-3">
                                        {lowStockItems.slice(0, 4).map((p, idx) => (
                                            <div key={idx} className="d-flex align-items-center justify-content-between p-2 rounded-3 border border-light-subtle bg-light">
                                                <div className="d-flex align-items-center gap-3 min-width-0">
                                                    <div className="rounded-3 overflow-hidden flex-shrink-0 bg-white border border-light-subtle d-flex align-items-center justify-content-center"
                                                        style={{ width: '40px', height: '40px' }}>
                                                        {p.imageURL ? (
                                                            <img src={p.imageURL} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        ) : (
                                                            <InboxOutlined style={{ color: '#94a3b8' }} />
                                                        )}
                                                    </div>
                                                    <div className="min-width-0">
                                                        <div className="fw-bold text-dark small text-truncate" style={{ maxWidth: '180px' }}>{p.name}</div>
                                                        <div className="text-muted" style={{ fontSize: '11px' }}>{p.category || 'General'}</div>
                                                    </div>
                                                </div>
                                                <span className={`badge rounded-pill px-3 py-1 fw-bold ${Number(p.stock) <= 0 ? 'bg-danger text-white' : 'bg-warning text-dark'}`} style={{ fontSize: '11px' }}>
                                                    {Number(p.stock) <= 0 ? 'Out of Stock' : `${p.stock} units left`}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Category Inventory Share */}
                        <div className="col-12 col-lg-6">
                            <div className="card bg-white border border-light-subtle rounded-4 shadow-sm p-4 h-100">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div>
                                        <h5 className="fw-bold text-dark fs-5 mb-0 d-flex align-items-center gap-2">
                                            <TagFilled style={{ color: '#0d9488' }} /> Category Distribution
                                        </h5>
                                        <p className="text-muted small mb-0">Inventory portfolio spread</p>
                                    </div>
                                    <span className="badge bg-light text-secondary border px-3 py-1 rounded-pill small">
                                        {categoryStats.length} Categories
                                    </span>
                                </div>

                                <div className="d-flex flex-column gap-3">
                                    {categoryStats.slice(0, 4).map((cat, idx) => {
                                        const pct = Math.round((cat.count / (products.length || 1)) * 100);
                                        const colors = ['#0d9488', '#f59e0b', '#10b981', '#6366f1'];
                                        const c = colors[idx % colors.length];
                                        return (
                                            <div key={idx}>
                                                <div className="d-flex justify-content-between align-items-center mb-1 small fw-semibold">
                                                    <span className="text-capitalize text-dark">{cat.label}</span>
                                                    <span style={{ color: c }}>{cat.count} items ({pct}%)</span>
                                                </div>
                                                <div className="progress" style={{ height: '6px', borderRadius: '10px', background: '#f1f5f9' }}>
                                                    <div className="progress-bar" style={{ width: `${pct}%`, background: c, borderRadius: '10px' }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                    </div>
                </>
            )}

            {/* ══ TAB 2: Live Orders Stream ══ */}
            {activeTab === 'orders' && (
                <div className="card bg-white border border-light-subtle rounded-4 shadow-sm overflow-hidden mb-4">
                    <div className="card-header bg-white border-0 pt-4 px-4 pb-3">
                        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                            <div>
                                <h5 className="fw-bold text-dark fs-5 mb-0 d-flex align-items-center gap-2">
                                    <ThunderboltFilled style={{ color: '#f59e0b' }} /> Real-Time Orders Feed
                                </h5>
                                <p className="text-muted small mb-0">Live customer purchase orders and delivery tracking</p>
                            </div>

                            {/* Search bar */}
                            <div className="input-group" style={{ maxWidth: '320px' }}>
                                <span className="input-group-text bg-light border-light-subtle text-muted">
                                    <SearchOutlined />
                                </span>
                                <input
                                    type="text"
                                    className="form-control form-control-sm bg-light border-light-subtle"
                                    placeholder="Search by customer, ID or status..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ fontSize: '13px' }}
                                />
                            </div>
                        </div>
                    </div>

                    {searchedOrders.length === 0 ? (
                        <div className="text-center py-5 text-muted small">
                            No orders found matching your search.
                        </div>
                    ) : (
                        <div className="table-responsive px-4 pb-4">
                            <table className="table table-hover align-middle mb-0 text-nowrap">
                                <thead className="table-light">
                                    <tr className="text-secondary fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.8px' }}>
                                        <th className="py-3">Order ID</th>
                                        <th className="py-3">Customer</th>
                                        <th className="py-3">Items Count</th>
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
                                                        {o.user?.email || o.shippingAddress?.city || 'Verified Customer'}
                                                    </div>
                                                </td>
                                                <td className="py-3 text-secondary" style={{ fontSize: '13px' }}>
                                                    {o.items?.length || o.cart?.length || 1} Item(s)
                                                </td>
                                                <td className="py-3 fw-bold" style={{ color: '#0d9488', fontSize: '13px' }}>
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
            )}

            {/* ══ TAB 3: Inventory & Products Live Health ══ */}
            {activeTab === 'inventory' && (
                <div className="card bg-white border border-light-subtle rounded-4 shadow-sm overflow-hidden mb-4">
                    <div className="card-header bg-white border-0 pt-4 px-4 pb-3">
                        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                            <div>
                                <h5 className="fw-bold text-dark fs-5 mb-0 d-flex align-items-center gap-2">
                                    <ShopFilled style={{ color: '#0d9488' }} /> Live Products & Stock Telemetry
                                </h5>
                                <p className="text-muted small mb-0">Total of {products.length} registered products with live stock tracking</p>
                            </div>
                            <div className="d-flex gap-2">
                                <span className="badge bg-warning-subtle text-warning-emphasis px-3 py-2 rounded-pill fw-bold" style={{ fontSize: '11px' }}>
                                    {lowStockItems.length} Low Stock
                                </span>
                                <span className="badge bg-danger-subtle text-danger px-3 py-2 rounded-pill fw-bold" style={{ fontSize: '11px' }}>
                                    {outOfStockCount} Out of Stock
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive px-4 pb-4">
                        <table className="table table-hover align-middle mb-0 text-nowrap">
                            <thead className="table-light">
                                <tr className="text-secondary fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.8px' }}>
                                    <th className="py-3">Product</th>
                                    <th className="py-3">Category</th>
                                    <th className="py-3">Unit Price</th>
                                    <th className="py-3">Stock Units</th>
                                    <th className="py-3">Valuation</th>
                                    <th className="py-3 text-end">Health Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((p, idx) => {
                                    const stock = Number(p.stock) || 0;
                                    const price = Number(p.price) || 0;
                                    const val = stock * price;
                                    return (
                                        <tr key={idx}>
                                            <td className="py-3">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="rounded-3 overflow-hidden flex-shrink-0 bg-white border border-light-subtle d-flex align-items-center justify-content-center"
                                                        style={{ width: '42px', height: '42px' }}>
                                                        {p.imageURL ? (
                                                            <img src={p.imageURL} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        ) : (
                                                            <InboxOutlined style={{ color: '#94a3b8', fontSize: '20px' }} />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold text-dark" style={{ fontSize: '13.5px' }}>{p.name}</div>
                                                        <div className="text-muted" style={{ fontSize: '11px' }}>ID: {p.id || p._id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 text-capitalize text-secondary" style={{ fontSize: '13px' }}>
                                                {p.category || 'General'}
                                            </td>
                                            <td className="py-3 fw-bold text-dark" style={{ fontSize: '13px' }}>
                                                Rs. {price.toLocaleString()}
                                            </td>
                                            <td className="py-3">
                                                <span className="fw-bold text-dark me-2" style={{ fontSize: '13px' }}>{stock}</span>
                                                <div className="progress d-inline-flex" style={{ width: '60px', height: '5px', background: '#f1f5f9' }}>
                                                    <div
                                                        className="progress-bar"
                                                        style={{
                                                            width: `${Math.min((stock / 50) * 100, 100)}%`,
                                                            background: stock <= 0 ? '#ef4444' : stock <= 5 ? '#f59e0b' : '#10b981'
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                            <td className="py-3 fw-bold" style={{ color: '#0d9488', fontSize: '13px' }}>
                                                Rs. {val.toLocaleString()}
                                            </td>
                                            <td className="py-3 text-end">
                                                <span className={`badge rounded-pill px-3 py-1 fw-bold ${stock <= 0 ? 'bg-danger text-white' : stock <= 5 ? 'bg-warning text-dark' : 'bg-success-subtle text-success'}`} style={{ fontSize: '11px' }}>
                                                    {stock <= 0 ? 'Out of Stock' : stock <= 5 ? 'Low Stock' : 'Healthy Stock'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Analytics;
