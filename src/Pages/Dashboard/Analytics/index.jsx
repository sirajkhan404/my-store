import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import {
    BarChartOutlined,
    DollarCircleFilled,
    ShoppingFilled,
    ShopFilled,
    InboxOutlined,
    CheckCircleFilled,
    ClockCircleFilled,
    SyncOutlined,
    ExclamationCircleFilled,
    ThunderboltFilled,
    TagFilled,
    TeamOutlined,
    SearchOutlined,
    CrownFilled,
    ArrowUpOutlined,
    SafetyCertificateFilled,
    UserOutlined,
    AppstoreOutlined
} from '@ant-design/icons';

/* ── Smooth Animated Number Hook ── */
function useLiveCounter(target, duration = 600) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        if (!target && target !== 0) { setVal(0); return; }
        const num = typeof target === 'number' ? target : parseFloat(target) || 0;
        if (num === 0) { setVal(0); return; }
        let current = 0;
        const step = Math.max(1, num / (duration / 16));
        const timer = setInterval(() => {
            current += step;
            if (current >= num) {
                setVal(num);
                clearInterval(timer);
            } else {
                setVal(Math.floor(current));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [target, duration]);
    return val;
}

const Analytics = () => {
    // ── Data States ──
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSynced, setLastSynced] = useState(new Date());

    // ── Navigation & Filters ──
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'orders' | 'products' | 'users'
    const [timeRange, setTimeRange] = useState('all'); // 'all' | 'today' | '7d' | '30d'
    const [statusFilter, setStatusFilter] = useState('all');
    const [orderSearch, setOrderSearch] = useState('');
    const [productSearch, setProductSearch] = useState('');
    const [userSearch, setUserSearch] = useState('');
    const [stockFilter, setStockFilter] = useState('all'); // 'all' | 'low' | 'out' | 'healthy'

    // ── Live Auto-Sync Configuration ──
    const [autoSync, setAutoSync] = useState(true);
    const [countdown, setCountdown] = useState(12);

    // ── Real-Time Data Fetcher ──
    const fetchLiveData = useCallback(async (manual = false) => {
        if (manual) setIsSyncing(true);
        const token = localStorage.getItem('jwt');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        try {
            const [orderRes, prodRes, userRes] = await Promise.allSettled([
                axios.get(`${window.api}/api/orders/all`, { headers }),
                axios.get(`${window.api}/api/products/all`, { headers }).catch(() => axios.get(`${window.api}/api/products/public-all`)),
                axios.get(`${window.api}/api/auth/users`, { headers })
            ]);

            if (orderRes.status === 'fulfilled' && orderRes.value?.data?.orders) {
                setOrders(Array.isArray(orderRes.value.data.orders) ? orderRes.value.data.orders : []);
            }
            if (prodRes.status === 'fulfilled' && prodRes.value?.data?.products) {
                setProducts(Array.isArray(prodRes.value.data.products) ? prodRes.value.data.products : []);
            }
            if (userRes.status === 'fulfilled' && userRes.value?.data?.users) {
                setUsers(Array.isArray(userRes.value.data.users) ? userRes.value.data.users : []);
            }

            setLastSynced(new Date());
            setCountdown(12);
        } catch (err) {
            console.error('Real-time sync error:', err);
        } finally {
            setLoading(false);
            if (manual) setTimeout(() => setIsSyncing(false), 400);
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchLiveData();
    }, [fetchLiveData]);

    // Live countdown timer
    useEffect(() => {
        if (!autoSync) return;
        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    fetchLiveData(false);
                    return 12;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [autoSync, fetchLiveData]);

    // ── Filter Orders by Time Range ──
    const scopedOrders = useMemo(() => {
        const now = new Date();
        return orders.filter(o => {
            if (timeRange === 'all') return true;
            if (!o.createdAt) return true;
            const d = new Date(o.createdAt);
            if (timeRange === 'today') return d.toDateString() === now.toDateString();
            if (timeRange === '7d') return (now - d) <= 7 * 24 * 60 * 60 * 1000;
            if (timeRange === '30d') return (now - d) <= 30 * 24 * 60 * 60 * 1000;
            return true;
        });
    }, [orders, timeRange]);

    // ── Metric Computations (Crash-Proof) ──
    const totalGrossRevenue = useMemo(() => {
        return scopedOrders
            .filter(o => (o.orderStatus || o.status) !== 'cancelled')
            .reduce((sum, o) => sum + (Number(o.totalAmount) || Number(o.totalPrice) || 0), 0);
    }, [scopedOrders]);

    const deliveredOrders = useMemo(() => scopedOrders.filter(o => (o.orderStatus || o.status) === 'delivered'), [scopedOrders]);
    const processingOrders = useMemo(() => scopedOrders.filter(o => ['processing', 'shipped'].includes(o.orderStatus || o.status)), [scopedOrders]);
    const pendingOrders = useMemo(() => scopedOrders.filter(o => (o.orderStatus || o.status) === 'pending'), [scopedOrders]);
    const cancelledOrders = useMemo(() => scopedOrders.filter(o => (o.orderStatus || o.status) === 'cancelled'), [scopedOrders]);

    const avgBasketValue = scopedOrders.length > 0 ? Math.round(totalGrossRevenue / scopedOrders.length) : 0;
    const peakOrderAmount = useMemo(() => {
        if (!scopedOrders.length) return 0;
        return Math.max(...scopedOrders.map(o => Number(o.totalAmount) || Number(o.totalPrice) || 0));
    }, [scopedOrders]);

    // ── Product Computations ──
    const totalStockUnits = useMemo(() => products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0), [products]);
    const totalInventoryValuation = useMemo(() => products.reduce((sum, p) => sum + ((Number(p.price) || 0) * (Number(p.stock) || 0)), 0), [products]);
    const lowStockProducts = useMemo(() => products.filter(p => Number(p.stock) > 0 && Number(p.stock) <= 5).sort((a, b) => Number(a.stock) - Number(b.stock)), [products]);
    const outOfStockProducts = useMemo(() => products.filter(p => Number(p.stock) <= 0), [products]);
    const healthyStockProducts = useMemo(() => products.filter(p => Number(p.stock) > 5), [products]);

    // ── User Computations ──
    const customerUsers = useMemo(() => users.filter(u => u.role !== 'superAdmin'), [users]);
    const adminUsers = useMemo(() => users.filter(u => u.role === 'superAdmin'), [users]);
    const activeUsers = useMemo(() => users.filter(u => u.status === 'active'), [users]);

    // Animated numbers
    const animRev = useLiveCounter(totalGrossRevenue);
    const animOrders = useLiveCounter(scopedOrders.length);
    const animInventory = useLiveCounter(totalInventoryValuation);
    const animUsers = useLiveCounter(users.length);

    // ── Weekday Velocity ──
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekdayCounts = Array(7).fill(0);
    scopedOrders.forEach(o => {
        if (o.createdAt) {
            const d = new Date(o.createdAt).getDay();
            if (!isNaN(d)) weekdayCounts[d]++;
        }
    });
    const maxDayCount = Math.max(...weekdayCounts, 1);
    const todayIndex = new Date().getDay();

    // ── Category Share ──
    const categories = useMemo(() => {
        const map = {};
        products.forEach(p => {
            const cat = p.category || 'General';
            if (!map[cat]) map[cat] = { count: 0, stock: 0, val: 0 };
            map[cat].count += 1;
            map[cat].stock += Number(p.stock) || 0;
            map[cat].val += (Number(p.price) || 0) * (Number(p.stock) || 0);
        });
        return Object.entries(map)
            .map(([name, d]) => ({ name, ...d }))
            .sort((a, b) => b.count - a.count);
    }, [products]);

    // ── Filtered Live Orders Feed ──
    const filteredOrders = useMemo(() => {
        let list = [...scopedOrders].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        if (statusFilter !== 'all') {
            list = list.filter(o => (o.orderStatus || o.status || 'pending') === statusFilter);
        }
        if (orderSearch.trim()) {
            const q = orderSearch.toLowerCase();
            list = list.filter(o =>
                (o._id || o.id || '').toLowerCase().includes(q) ||
                (o.shippingAddress?.fullName || o.user?.fullName || '').toLowerCase().includes(q) ||
                (o.shippingAddress?.city || '').toLowerCase().includes(q) ||
                (o.shippingAddress?.phone || '').toLowerCase().includes(q)
            );
        }
        return list;
    }, [scopedOrders, statusFilter, orderSearch]);

    // ── Filtered Products Feed ──
    const filteredProducts = useMemo(() => {
        let list = [...products];
        if (stockFilter === 'low') list = list.filter(p => Number(p.stock) > 0 && Number(p.stock) <= 5);
        if (stockFilter === 'out') list = list.filter(p => Number(p.stock) <= 0);
        if (stockFilter === 'healthy') list = list.filter(p => Number(p.stock) > 5);

        if (productSearch.trim()) {
            const q = productSearch.toLowerCase();
            list = list.filter(p =>
                (p.name || '').toLowerCase().includes(q) ||
                (p.category || '').toLowerCase().includes(q) ||
                (p.id || '').toLowerCase().includes(q)
            );
        }
        return list;
    }, [products, stockFilter, productSearch]);

    // ── Filtered Users Feed ──
    const filteredUsers = useMemo(() => {
        let list = [...users].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        if (userSearch.trim()) {
            const q = userSearch.toLowerCase();
            list = list.filter(u =>
                (u.fullName || '').toLowerCase().includes(q) ||
                (u.email || '').toLowerCase().includes(q) ||
                (u.role || '').toLowerCase().includes(q)
            );
        }
        return list;
    }, [users, userSearch]);

    // ── Loading Screen (Bootstrap Only) ──
    if (loading) {
        return (
            <div className="container-fluid py-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '75vh' }}>
                <div className="spinner-border text-success mb-3" style={{ width: '3.5rem', height: '3.5rem' }} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h4 className="fw-bold text-dark">Connecting Live Commerce Radar...</h4>
                <p className="text-muted small">Streaming real-time orders, products stock, and active users</p>
            </div>
        );
    }

    return (
        <div className="container-fluid p-3 p-md-4 p-lg-4 bg-light" style={{ minHeight: '100vh' }}>

            {/* ══ HEADER: Executive Live Telemetry Radar (Bootstrap 5) ══ */}
            <div className="card border-0 shadow-sm rounded-4 mb-4 bg-white overflow-hidden position-relative">
                {/* Visual Top Highlight Bar */}
                <div className="w-100" style={{ height: '5px', background: 'linear-gradient(90deg, #042f2e, #0d9488, #10b981, #f59e0b)' }} />

                <div className="card-body p-4 p-md-4">
                    <div className="row g-3 align-items-center justify-content-between">
                        
                        {/* Title & Live Status Indicator */}
                        <div className="col-12 col-xl-7">
                            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                                <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-2 fw-bold d-inline-flex align-items-center gap-2">
                                    <span
                                        className="rounded-circle d-inline-block"
                                        style={{
                                            width: '8px',
                                            height: '8px',
                                            backgroundColor: '#198754',
                                            boxShadow: '0 0 8px #198754'
                                        }}
                                    />
                                    REAL-TIME LIVE STREAM
                                </span>

                                <span className="badge bg-light text-dark border rounded-pill px-3 py-2 fw-semibold">
                                    <ClockCircleFilled className="text-success me-1" />
                                    Next Sync in <strong>{countdown}s</strong>
                                </span>

                                <span className="badge bg-light text-muted border rounded-pill px-2 py-2 d-none d-sm-inline-flex">
                                    Last ping: {lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </span>
                            </div>

                            <h2 className="fw-bold text-dark fs-3 mb-1">
                                Store Telemetry & Live Intelligence
                            </h2>
                            <p className="text-muted small mb-0">
                                Live order transactions throughput, inventory warehouse valuation, and customer activity tracker.
                            </p>
                        </div>

                        {/* Date Filters & Controls */}
                        <div className="col-12 col-xl-5 text-xl-end">
                            <div className="d-flex flex-wrap align-items-center justify-content-start justify-content-xl-end gap-2">
                                
                                {/* Time Filter Button Group */}
                                <div className="btn-group btn-group-sm bg-light p-1 rounded-pill border" role="group">
                                    {[
                                        { id: 'all', label: 'All Time' },
                                        { id: 'today', label: 'Today' },
                                        { id: '7d', label: '7 Days' },
                                        { id: '30d', label: '30 Days' }
                                    ].map(t => (
                                        <button
                                            key={t.id}
                                            onClick={() => setTimeRange(t.id)}
                                            className={`btn btn-sm rounded-pill px-3 py-1 fw-bold ${timeRange === t.id ? 'btn-white bg-white text-dark shadow-sm' : 'text-secondary border-0'}`}
                                            style={{ fontSize: '11.5px' }}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Auto-Sync Switch Button */}
                                <button
                                    onClick={() => setAutoSync(!autoSync)}
                                    className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold border d-inline-flex align-items-center gap-1 ${autoSync ? 'bg-white text-success border-success-subtle shadow-sm' : 'btn-light text-secondary'}`}
                                    style={{ fontSize: '12px' }}
                                >
                                    <span className="rounded-circle d-inline-block" style={{ width: '7px', height: '7px', backgroundColor: autoSync ? '#198754' : '#6c757d' }} />
                                    {autoSync ? 'Live' : 'Paused'}
                                </button>

                                {/* Manual Force Refresh Button */}
                                <button
                                    onClick={() => fetchLiveData(true)}
                                    disabled={isSyncing}
                                    className="btn btn-sm btn-dark rounded-pill px-3 py-2 fw-bold text-white d-inline-flex align-items-center gap-2 shadow-sm"
                                    style={{ fontSize: '12px' }}
                                >
                                    <SyncOutlined spin={isSyncing} />
                                    <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                                </button>

                            </div>
                        </div>

                    </div>

                    {/* Quick Highlights Strip */}
                    <div className="row g-2 mt-3 pt-3 border-top text-muted small align-items-center">
                        <div className="col-12 col-md-4 d-flex align-items-center gap-2">
                            <ShoppingFilled className="text-success" />
                            <span>Live Scoped Orders: <strong>{scopedOrders.length}</strong> ({deliveredOrders.length} Delivered)</span>
                        </div>
                        <div className="col-12 col-md-4 d-flex align-items-center gap-2">
                            <ShopFilled className="text-warning" />
                            <span>Warehouse Stock: <strong>{totalStockUnits} Units</strong> ({products.length} Products)</span>
                        </div>
                        <div className="col-12 col-md-4 d-flex align-items-center gap-2 justify-content-md-end">
                            <TeamOutlined className="text-primary" />
                            <span>Customer Community: <strong>{users.length} Users</strong> ({activeUsers.length} Active)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ══ 4 EXECUTIVE LIVE KPI METRIC CARDS (Bootstrap 5) ══ */}
            <div className="row g-3 mb-4">
                
                {/* 1. Gross Revenue */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 bg-white p-3 p-md-4 position-relative overflow-hidden">
                        <div className="position-absolute top-0 start-0 bottom-0 bg-success" style={{ width: '4px' }} />
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <span className="text-muted small fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                                    Gross Revenue
                                </span>
                                <h3 className="fw-bold text-dark my-1 fs-4">
                                    Rs. {animRev.toLocaleString()}
                                </h3>
                                <div className="text-muted small" style={{ fontSize: '12px' }}>
                                    Avg Basket: <strong>Rs. {avgBasketValue.toLocaleString()}</strong>
                                </div>
                            </div>
                            <div className="rounded-4 bg-success-subtle text-success p-3 fs-4 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                <DollarCircleFilled />
                            </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top small" style={{ fontSize: '11px' }}>
                            <span className="text-muted">Peak Order: <strong>Rs. {peakOrderAmount.toLocaleString()}</strong></span>
                            <span className="badge bg-success-subtle text-success fw-bold">Live Flow</span>
                        </div>
                    </div>
                </div>

                {/* 2. Total Orders */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 bg-white p-3 p-md-4 position-relative overflow-hidden">
                        <div className="position-absolute top-0 start-0 bottom-0 bg-primary" style={{ width: '4px' }} />
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <span className="text-muted small fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                                    Total Orders
                                </span>
                                <h3 className="fw-bold text-dark my-1 fs-4">
                                    {animOrders}
                                </h3>
                                <div className="text-muted small" style={{ fontSize: '12px' }}>
                                    Fulfillment: <strong className="text-success">{scopedOrders.length ? Math.round((deliveredOrders.length / scopedOrders.length) * 100) : 0}%</strong> Completed
                                </div>
                            </div>
                            <div className="rounded-4 bg-primary-subtle text-primary p-3 fs-4 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                <ShoppingFilled />
                            </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top small" style={{ fontSize: '11px' }}>
                            <span className="text-muted">Pending: <strong className="text-warning">{pendingOrders.length}</strong></span>
                            <span className="badge bg-primary-subtle text-primary fw-bold">{deliveredOrders.length} Delivered</span>
                        </div>
                    </div>
                </div>

                {/* 3. Product Warehouse Valuation */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 bg-white p-3 p-md-4 position-relative overflow-hidden">
                        <div className="position-absolute top-0 start-0 bottom-0 bg-warning" style={{ width: '4px' }} />
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <span className="text-muted small fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                                    Stock Valuation
                                </span>
                                <h3 className="fw-bold text-dark my-1 fs-4">
                                    Rs. {animInventory.toLocaleString()}
                                </h3>
                                <div className="text-muted small" style={{ fontSize: '12px' }}>
                                    Warehouse: <strong>{totalStockUnits} Units</strong>
                                </div>
                            </div>
                            <div className="rounded-4 bg-warning-subtle text-warning p-3 fs-4 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                <ShopFilled />
                            </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top small" style={{ fontSize: '11px' }}>
                            <span className="text-danger fw-bold">{lowStockProducts.length + outOfStockProducts.length} Restock Alerts</span>
                            <span className="badge bg-warning-subtle text-warning fw-bold">{products.length} Products</span>
                        </div>
                    </div>
                </div>

                {/* 4. Active Users & Community */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100 bg-white p-3 p-md-4 position-relative overflow-hidden">
                        <div className="position-absolute top-0 start-0 bottom-0 bg-info" style={{ width: '4px' }} />
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <span className="text-muted small fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                                    Customer Base
                                </span>
                                <h3 className="fw-bold text-dark my-1 fs-4">
                                    {animUsers}
                                </h3>
                                <div className="text-muted small" style={{ fontSize: '12px' }}>
                                    Buyers: <strong>{customerUsers.length}</strong> · Admins: <strong>{adminUsers.length}</strong>
                                </div>
                            </div>
                            <div className="rounded-4 bg-info-subtle text-info p-3 fs-4 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                <TeamOutlined />
                            </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top small" style={{ fontSize: '11px' }}>
                            <span className="text-muted">Active: <strong>{users.length ? Math.round((activeUsers.length / users.length) * 100) : 0}%</strong></span>
                            <span className="badge bg-info-subtle text-info fw-bold">Live Synced</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* ══ NAVIGATION TABS: Bootstrap 5 Pill Switcher ══ */}
            <div className="d-flex flex-wrap gap-2 mb-4">
                {[
                    { id: 'overview', label: 'Command Overview', icon: <AppstoreOutlined /> },
                    { id: 'orders', label: `Live Orders (${scopedOrders.length})`, icon: <ThunderboltFilled /> },
                    { id: 'products', label: `Products & Stocks (${products.length})`, icon: <ShopFilled /> },
                    { id: 'users', label: `Users & Customers (${users.length})`, icon: <TeamOutlined /> },
                ].map(t => (
                    <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id)}
                        className={`btn rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2 shadow-sm ${activeTab === t.id ? 'btn-dark text-white' : 'btn-white bg-white text-secondary border'}`}
                        style={{ fontSize: '13px' }}
                    >
                        {t.icon}
                        <span>{t.label}</span>
                    </button>
                ))}
            </div>

            {/* ══ TAB 1: OVERVIEW COMMAND CENTER ══ */}
            {activeTab === 'overview' && (
                <div className="row g-4 mb-4">
                    
                    {/* Left 7 Columns: Weekly Velocity & Live Orders Stream */}
                    <div className="col-12 col-xl-7">
                        
                        {/* Weekly Orders Velocity Chart */}
                        <div className="card border-0 shadow-sm rounded-4 bg-white p-4 mb-4">
                            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                                <div>
                                    <h5 className="fw-bold text-dark fs-5 mb-0 d-flex align-items-center gap-2">
                                        <BarChartOutlined className="text-success" /> Weekly Order Velocity
                                    </h5>
                                    <p className="text-muted small mb-0">Daily transactions processed during the active cycle</p>
                                </div>
                                <span className="badge bg-success-subtle text-success fw-bold px-3 py-1 rounded-pill">
                                    Live Intake
                                </span>
                            </div>

                            {/* Bar Chart Container */}
                            <div className="d-flex align-items-end justify-content-between gap-2 pt-3" style={{ minHeight: '140px' }}>
                                {days.map((day, idx) => {
                                    const count = weekdayCounts[idx];
                                    const isToday = idx === todayIndex;
                                    const heightPct = Math.max((count / maxDayCount) * 100, 10);
                                    return (
                                        <div key={idx} className="d-flex flex-column align-items-center flex-grow-1 gap-2">
                                            <span className="small fw-bold" style={{ fontSize: '11px', color: count > 0 ? '#198754' : '#adb5bd' }}>
                                                {count > 0 ? count : ''}
                                            </span>
                                            <div
                                                className="w-100 rounded-3"
                                                style={{
                                                    height: `${heightPct}px`,
                                                    maxHeight: '90px',
                                                    backgroundColor: count > 0 ? (isToday ? '#198754' : '#20c997') : '#e9ecef',
                                                    borderRadius: '6px 6px 2px 2px',
                                                    transition: 'height 0.4s ease'
                                                }}
                                                title={`${day}: ${count} Orders`}
                                            />
                                            <span className={`small ${isToday ? 'fw-bold text-success' : 'text-secondary'}`} style={{ fontSize: '11px' }}>
                                                {day}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Recent Live Orders Stream */}
                        <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
                            <div className="card-header bg-white border-0 pt-4 px-4 pb-2">
                                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
                                    <div>
                                        <h5 className="fw-bold text-dark fs-5 mb-0 d-flex align-items-center gap-2">
                                            <ThunderboltFilled className="text-warning" /> Live Recent Orders
                                        </h5>
                                        <p className="text-muted small mb-0">Incoming customer orders updating in real-time</p>
                                    </div>

                                    {/* Order Search */}
                                    <div className="input-group" style={{ maxWidth: '240px' }}>
                                        <span className="input-group-text bg-light border-0 text-muted">
                                            <SearchOutlined />
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm bg-light border-0"
                                            placeholder="Search customer, ID..."
                                            value={orderSearch}
                                            onChange={(e) => setOrderSearch(e.target.value)}
                                            style={{ fontSize: '12.5px' }}
                                        />
                                    </div>
                                </div>

                                {/* Status Filters */}
                                <div className="d-flex gap-2 overflow-auto pb-2">
                                    {[
                                        { id: 'all', label: `All (${scopedOrders.length})` },
                                        { id: 'pending', label: `Pending (${pendingOrders.length})` },
                                        { id: 'processing', label: `Processing (${processingOrders.length})` },
                                        { id: 'delivered', label: `Delivered (${deliveredOrders.length})` },
                                        { id: 'cancelled', label: `Cancelled (${cancelledOrders.length})` },
                                    ].map(p => (
                                        <button
                                            key={p.id}
                                            onClick={() => setStatusFilter(p.id)}
                                            className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold text-nowrap ${statusFilter === p.id ? 'btn-dark text-white shadow-sm' : 'btn-light text-secondary border'}`}
                                            style={{ fontSize: '11.5px' }}
                                        >
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Orders Table */}
                            {filteredOrders.length === 0 ? (
                                <div className="text-center py-5 text-muted small">
                                    <InboxOutlined className="fs-1 d-block mb-2 text-secondary opacity-50" />
                                    No live orders match your criteria.
                                </div>
                            ) : (
                                <div className="table-responsive px-4 pb-4">
                                    <table className="table table-hover align-middle mb-0 text-nowrap">
                                        <thead className="table-light">
                                            <tr className="text-secondary fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                                                <th className="py-3">Order ID</th>
                                                <th className="py-3">Customer</th>
                                                <th className="py-3">Amount (PKR)</th>
                                                <th className="py-3">Status</th>
                                                <th className="py-3 text-end">Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredOrders.slice(0, 7).map((o, idx) => {
                                                const st = o.orderStatus || o.status || 'pending';
                                                const statusBadges = {
                                                    delivered: 'bg-success text-white',
                                                    processing: 'bg-primary text-white',
                                                    shipped: 'bg-info text-white',
                                                    pending: 'bg-warning text-dark',
                                                    cancelled: 'bg-danger text-white'
                                                };

                                                return (
                                                    <tr key={idx}>
                                                        <td className="fw-bold text-dark" style={{ fontSize: '13px' }}>
                                                            #{o._id?.slice(-6)?.toUpperCase() || o.id?.slice(-6)?.toUpperCase() || `ORD-${idx + 1}`}
                                                        </td>
                                                        <td>
                                                            <div className="fw-semibold text-dark" style={{ fontSize: '13px' }}>
                                                                {o.shippingAddress?.fullName || o.user?.fullName || 'Customer'}
                                                            </div>
                                                            <div className="text-muted" style={{ fontSize: '11px' }}>
                                                                {o.products?.length || 1} item(s) · {o.shippingAddress?.city || 'Local'}
                                                            </div>
                                                        </td>
                                                        <td className="fw-bold text-success" style={{ fontSize: '13.5px' }}>
                                                            Rs. {(Number(o.totalAmount) || Number(o.totalPrice) || 0).toLocaleString()}
                                                        </td>
                                                        <td>
                                                            <span className={`badge rounded-pill px-3 py-1 fw-bold text-capitalize ${statusBadges[st] || 'bg-secondary text-white'}`} style={{ fontSize: '11px' }}>
                                                                {st}
                                                            </span>
                                                        </td>
                                                        <td className="text-end text-muted" style={{ fontSize: '11.5px' }}>
                                                            {o.createdAt ? new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
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

                    {/* Right 5 Columns: Lifecycle Donut, Low Stock Alerts, Category Mix */}
                    <div className="col-12 col-xl-5">
                        
                        {/* Fulfillment Pipeline Card */}
                        <div className="card border-0 shadow-sm rounded-4 bg-white p-4 mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h5 className="fw-bold text-dark fs-5 mb-0">Fulfillment Pipeline</h5>
                                    <p className="text-muted small mb-0">Order status breakdown</p>
                                </div>
                                <span className="badge bg-success-subtle text-success fw-bold px-3 py-1 rounded-pill">
                                    {scopedOrders.length} Total
                                </span>
                            </div>

                            {/* Status Progress Bars */}
                            <div className="d-flex flex-column gap-3 mt-3">
                                {[
                                    { label: 'Delivered', count: deliveredOrders.length, color: 'bg-success', text: 'text-success' },
                                    { label: 'Processing / Shipped', count: processingOrders.length, color: 'bg-primary', text: 'text-primary' },
                                    { label: 'Pending Payment / Confirmation', count: pendingOrders.length, color: 'bg-warning', text: 'text-warning' },
                                    { label: 'Cancelled Orders', count: cancelledOrders.length, color: 'bg-danger', text: 'text-danger' },
                                ].map((item, idx) => {
                                    const pct = scopedOrders.length > 0 ? Math.round((item.count / scopedOrders.length) * 100) : 0;
                                    return (
                                        <div key={idx}>
                                            <div className="d-flex justify-content-between align-items-center mb-1 small fw-semibold">
                                                <span className="text-dark">{item.label}</span>
                                                <span className={item.text}>{item.count} orders ({pct}%)</span>
                                            </div>
                                            <div className="progress" style={{ height: '7px', borderRadius: '10px' }}>
                                                <div className={`progress-bar ${item.color}`} style={{ width: `${pct}%`, borderRadius: '10px' }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Critical Low Stock Alerts Card */}
                        <div className="card border-0 shadow-sm rounded-4 bg-white p-4 mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h5 className="fw-bold text-dark fs-5 mb-0 d-flex align-items-center gap-2">
                                        <ExclamationCircleFilled className="text-danger" /> Low Stock Radar
                                    </h5>
                                    <p className="text-muted small mb-0">Products requiring restock attention</p>
                                </div>
                                <span className="badge bg-danger-subtle text-danger fw-bold px-3 py-1 rounded-pill small">
                                    {lowStockProducts.length + outOfStockProducts.length} Alerts
                                </span>
                            </div>

                            {lowStockProducts.length === 0 && outOfStockProducts.length === 0 ? (
                                <div className="text-center py-4 text-muted small">
                                    <CheckCircleFilled className="text-success fs-3 d-block mb-2" />
                                    All warehouse inventory items are well-stocked!
                                </div>
                            ) : (
                                <div className="d-flex flex-column gap-2">
                                    {[...outOfStockProducts, ...lowStockProducts].slice(0, 4).map((p, idx) => {
                                        const isOut = Number(p.stock) <= 0;
                                        return (
                                            <div key={idx} className="d-flex align-items-center justify-content-between p-2 rounded-3 border bg-light">
                                                <div className="d-flex align-items-center gap-2 min-width-0">
                                                    <div className="rounded-2 overflow-hidden flex-shrink-0 bg-white border d-flex align-items-center justify-content-center"
                                                        style={{ width: '38px', height: '38px' }}>
                                                        {p.imageURL ? (
                                                            <img src={p.imageURL} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        ) : (
                                                            <InboxOutlined className="text-muted" />
                                                        )}
                                                    </div>
                                                    <div className="min-width-0">
                                                        <div className="fw-bold text-dark small text-truncate" style={{ maxWidth: '170px' }}>{p.name}</div>
                                                        <div className="text-muted" style={{ fontSize: '11px' }}>Rs. {Number(p.price || 0).toLocaleString()} · {p.category || 'General'}</div>
                                                    </div>
                                                </div>
                                                <span className={`badge rounded-pill px-3 py-1 fw-bold ${isOut ? 'bg-danger text-white' : 'bg-warning text-dark'}`} style={{ fontSize: '11px' }}>
                                                    {isOut ? 'Out of Stock' : `${p.stock} left`}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Category Portfolio Breakdown */}
                        <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h5 className="fw-bold text-dark fs-5 mb-0 d-flex align-items-center gap-2">
                                        <TagFilled className="text-success" /> Category Share
                                    </h5>
                                    <p className="text-muted small mb-0">Live catalog mix and valuation</p>
                                </div>
                                <span className="badge bg-light text-secondary border px-3 py-1 rounded-pill small">
                                    {categories.length} Categories
                                </span>
                            </div>

                            <div className="d-flex flex-column gap-3">
                                {categories.slice(0, 5).map((cat, idx) => {
                                    const pct = Math.round((cat.count / (products.length || 1)) * 100);
                                    const colors = ['bg-success', 'bg-warning', 'bg-primary', 'bg-info', 'bg-dark'];
                                    const c = colors[idx % colors.length];
                                    return (
                                        <div key={idx}>
                                            <div className="d-flex justify-content-between align-items-center mb-1 small fw-semibold">
                                                <span className="text-capitalize text-dark">{cat.name}</span>
                                                <span className="text-muted">{cat.count} items ({pct}%) · Rs. {cat.val.toLocaleString()}</span>
                                            </div>
                                            <div className="progress" style={{ height: '6px', borderRadius: '10px' }}>
                                                <div className={`progress-bar ${c}`} style={{ width: `${pct}%`, borderRadius: '10px' }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>

                </div>
            )}

            {/* ══ TAB 2: ORDERS DEEP-DIVE RADAR ══ */}
            {activeTab === 'orders' && (
                <div className="card border-0 shadow-sm rounded-4 bg-white p-4 p-md-4 mb-4">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                        <div>
                            <h4 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                                <ThunderboltFilled className="text-warning" /> Live Orders Radar & Stream
                            </h4>
                            <p className="text-muted small mb-0">Real-time incoming transactions, customer info, and fulfillment status</p>
                        </div>

                        {/* Search & Status Select */}
                        <div className="d-flex flex-wrap align-items-center gap-2">
                            <div className="input-group" style={{ maxWidth: '280px' }}>
                                <span className="input-group-text bg-light border-0 text-muted">
                                    <SearchOutlined />
                                </span>
                                <input
                                    type="text"
                                    className="form-control form-control-sm bg-light border-0"
                                    placeholder="Search by ID, customer, city..."
                                    value={orderSearch}
                                    onChange={(e) => setOrderSearch(e.target.value)}
                                    style={{ fontSize: '13px' }}
                                />
                            </div>

                            <select
                                className="form-select form-select-sm bg-light border-0"
                                style={{ width: '160px', fontSize: '12px' }}
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Orders ({scopedOrders.length})</option>
                                <option value="pending">Pending ({pendingOrders.length})</option>
                                <option value="processing">Processing ({processingOrders.length})</option>
                                <option value="delivered">Delivered ({deliveredOrders.length})</option>
                                <option value="cancelled">Cancelled ({cancelledOrders.length})</option>
                            </select>
                        </div>
                    </div>

                    {/* Full Orders Table */}
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <InboxOutlined className="fs-1 d-block mb-3 text-secondary opacity-50" />
                            <h5>No live orders found</h5>
                            <p className="small">Try changing your search keywords or date range</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0 text-nowrap">
                                <thead className="table-light">
                                    <tr className="text-secondary fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                                        <th className="py-3">Order ID</th>
                                        <th className="py-3">Customer Details</th>
                                        <th className="py-3">Items</th>
                                        <th className="py-3">Payment</th>
                                        <th className="py-3">Total Amount</th>
                                        <th className="py-3">Status</th>
                                        <th className="py-3 text-end">Date / Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((o, idx) => {
                                        const st = o.orderStatus || o.status || 'pending';
                                        const statusBadges = {
                                            delivered: 'bg-success text-white',
                                            processing: 'bg-primary text-white',
                                            shipped: 'bg-info text-white',
                                            pending: 'bg-warning text-dark',
                                            cancelled: 'bg-danger text-white'
                                        };
                                        const items = o.products || o.items || [];

                                        return (
                                            <tr key={idx}>
                                                <td className="fw-bold text-dark" style={{ fontSize: '13px' }}>
                                                    #{o._id?.slice(-8)?.toUpperCase() || o.id?.slice(-8)?.toUpperCase() || `ORD-${idx + 1}`}
                                                </td>
                                                <td>
                                                    <div className="fw-bold text-dark" style={{ fontSize: '13px' }}>
                                                        {o.shippingAddress?.fullName || o.user?.fullName || 'Customer'}
                                                    </div>
                                                    <div className="text-muted" style={{ fontSize: '11px' }}>
                                                        {o.shippingAddress?.city || 'Local'} · {o.shippingAddress?.phone || 'No phone'}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-1">
                                                        {items.slice(0, 3).map((item, itIdx) => (
                                                            <div key={itIdx} className="rounded-2 overflow-hidden border bg-white d-flex align-items-center justify-content-center"
                                                                style={{ width: '28px', height: '28px' }} title={item.name}>
                                                                {item.imageURL ? (
                                                                    <img src={item.imageURL} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                ) : (
                                                                    <InboxOutlined style={{ fontSize: '11px' }} />
                                                                )}
                                                            </div>
                                                        ))}
                                                        {items.length > 3 && (
                                                            <span className="badge bg-light text-secondary border rounded-pill" style={{ fontSize: '10px' }}>
                                                                +{items.length - 3}
                                                            </span>
                                                        )}
                                                        <span className="small text-muted ms-1" style={{ fontSize: '11px' }}>
                                                            ({items.reduce((s, it) => s + (Number(it.quantity) || 1), 0)} pcs)
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge bg-light text-dark border px-2 py-1 rounded-pill" style={{ fontSize: '11px' }}>
                                                        {o.paymentMethod || 'COD'} ({o.paymentStatus || 'Pending'})
                                                    </span>
                                                </td>
                                                <td className="fw-bold text-success" style={{ fontSize: '14px' }}>
                                                    Rs. {(Number(o.totalAmount) || Number(o.totalPrice) || 0).toLocaleString()}
                                                </td>
                                                <td>
                                                    <span className={`badge rounded-pill px-3 py-1 fw-bold text-capitalize ${statusBadges[st] || 'bg-secondary text-white'}`} style={{ fontSize: '11px' }}>
                                                        {st}
                                                    </span>
                                                </td>
                                                <td className="text-end text-muted" style={{ fontSize: '11.5px' }}>
                                                    {o.createdAt ? new Date(o.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
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

            {/* ══ TAB 3: PRODUCTS INVENTORY RADAR ══ */}
            {activeTab === 'products' && (
                <div className="card border-0 shadow-sm rounded-4 bg-white p-4 p-md-4 mb-4">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                        <div>
                            <h4 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                                <ShopFilled className="text-success" /> Products & Warehouse Inventory
                            </h4>
                            <p className="text-muted small mb-0">Track real-time stock levels, inventory valuation, and restock alarms</p>
                        </div>

                        {/* Search & Stock Filter */}
                        <div className="d-flex flex-wrap align-items-center gap-2">
                            <div className="input-group" style={{ maxWidth: '280px' }}>
                                <span className="input-group-text bg-light border-0 text-muted">
                                    <SearchOutlined />
                                </span>
                                <input
                                    type="text"
                                    className="form-control form-control-sm bg-light border-0"
                                    placeholder="Search product name, category..."
                                    value={productSearch}
                                    onChange={(e) => setProductSearch(e.target.value)}
                                    style={{ fontSize: '13px' }}
                                />
                            </div>

                            <select
                                className="form-select form-select-sm bg-light border-0"
                                style={{ width: '160px', fontSize: '12px' }}
                                value={stockFilter}
                                onChange={(e) => setStockFilter(e.target.value)}
                            >
                                <option value="all">All Stocks ({products.length})</option>
                                <option value="low">Low Stock (≤ 5) ({lowStockProducts.length})</option>
                                <option value="out">Out of Stock ({outOfStockProducts.length})</option>
                                <option value="healthy">Healthy Stock (&gt; 5) ({healthyStockProducts.length})</option>
                            </select>
                        </div>
                    </div>

                    {/* Stock Summary Metrics Row */}
                    <div className="row g-3 mb-4">
                        <div className="col-12 col-sm-4">
                            <div className="p-3 rounded-4 bg-light border">
                                <span className="text-muted small fw-semibold">Healthy Warehouse Units</span>
                                <h4 className="fw-bold text-success my-1">{healthyStockProducts.length} Products</h4>
                                <span className="text-muted" style={{ fontSize: '11px' }}>Adequate stock levels</span>
                            </div>
                        </div>
                        <div className="col-12 col-sm-4">
                            <div className="p-3 rounded-4 bg-warning-subtle border border-warning-subtle">
                                <span className="text-warning-emphasis small fw-semibold">Low Stock Watchlist</span>
                                <h4 className="fw-bold text-warning my-1">{lowStockProducts.length} Products</h4>
                                <span className="text-muted" style={{ fontSize: '11px' }}>Running below 5 units</span>
                            </div>
                        </div>
                        <div className="col-12 col-sm-4">
                            <div className="p-3 rounded-4 bg-danger-subtle border border-danger-subtle">
                                <span className="text-danger small fw-semibold">Out of Stock Alert</span>
                                <h4 className="fw-bold text-danger my-1">{outOfStockProducts.length} Products</h4>
                                <span className="text-muted" style={{ fontSize: '11px' }}>Zero inventory left</span>
                            </div>
                        </div>
                    </div>

                    {/* Products Table */}
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <InboxOutlined className="fs-1 d-block mb-3 text-secondary opacity-50" />
                            <h5>No products found</h5>
                            <p className="small">Try adjusting your search query</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0 text-nowrap">
                                <thead className="table-light">
                                    <tr className="text-secondary fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                                        <th className="py-3">Product Name</th>
                                        <th className="py-3">Category</th>
                                        <th className="py-3">Unit Price</th>
                                        <th className="py-3">Current Stock</th>
                                        <th className="py-3">Total Valuation</th>
                                        <th className="py-3">Health Status</th>
                                        <th className="py-3 text-end">SKU</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((p, idx) => {
                                        const stock = Number(p.stock) || 0;
                                        const price = Number(p.price) || 0;
                                        const val = stock * price;
                                        const isOut = stock <= 0;
                                        const isLow = stock > 0 && stock <= 5;

                                        return (
                                            <tr key={idx}>
                                                <td>
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="rounded-3 overflow-hidden flex-shrink-0 bg-white border d-flex align-items-center justify-content-center"
                                                            style={{ width: '40px', height: '40px' }}>
                                                            {p.imageURL ? (
                                                                <img src={p.imageURL} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            ) : (
                                                                <InboxOutlined className="text-muted" />
                                                            )}
                                                        </div>
                                                        <div className="min-width-0">
                                                            <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '240px', fontSize: '13px' }}>{p.name}</div>
                                                            <div className="text-muted" style={{ fontSize: '11px' }}>ID: #{p.id?.slice(-6) || idx + 1}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge bg-light text-secondary border px-3 py-1 rounded-pill text-capitalize" style={{ fontSize: '11px' }}>
                                                        {p.category || 'General'}
                                                    </span>
                                                </td>
                                                <td className="fw-bold text-dark" style={{ fontSize: '13px' }}>
                                                    Rs. {price.toLocaleString()}
                                                </td>
                                                <td>
                                                    <span className="fw-bold fs-6" style={{ color: isOut ? '#dc3545' : isLow ? '#ffc107' : '#198754' }}>
                                                        {stock}
                                                    </span> <span className="text-muted small">units</span>
                                                </td>
                                                <td className="fw-bold text-success" style={{ fontSize: '13px' }}>
                                                    Rs. {val.toLocaleString()}
                                                </td>
                                                <td>
                                                    {isOut ? (
                                                        <span className="badge bg-danger text-white rounded-pill px-3 py-1 fw-bold" style={{ fontSize: '11px' }}>
                                                            Out of Stock
                                                        </span>
                                                    ) : isLow ? (
                                                        <span className="badge bg-warning text-dark rounded-pill px-3 py-1 fw-bold" style={{ fontSize: '11px' }}>
                                                            Low Stock Alert
                                                        </span>
                                                    ) : (
                                                        <span className="badge bg-success-subtle text-success rounded-pill px-3 py-1 fw-bold" style={{ fontSize: '11px' }}>
                                                            Healthy Stock
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="text-end text-muted" style={{ fontSize: '11.5px' }}>
                                                    {p.id ? `SKU-${p.id.slice(0, 6)}` : 'ACTIVE'}
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

            {/* ══ TAB 4: USERS & COMMUNITY RADAR ══ */}
            {activeTab === 'users' && (
                <div className="card border-0 shadow-sm rounded-4 bg-white p-4 p-md-4 mb-4">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                        <div>
                            <h4 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                                <TeamOutlined className="text-primary" /> Customer Community & User Telemetry
                            </h4>
                            <p className="text-muted small mb-0">Live registered accounts, administrator privileges, and active buyer status</p>
                        </div>

                        {/* Search Input */}
                        <div className="input-group" style={{ maxWidth: '280px' }}>
                            <span className="input-group-text bg-light border-0 text-muted">
                                <SearchOutlined />
                            </span>
                            <input
                                type="text"
                                className="form-control form-control-sm bg-light border-0"
                                placeholder="Search by name, email, role..."
                                value={userSearch}
                                onChange={(e) => setUserSearch(e.target.value)}
                                style={{ fontSize: '13px' }}
                            />
                        </div>
                    </div>

                    {/* Users Summary Cards */}
                    <div className="row g-3 mb-4">
                        <div className="col-12 col-sm-4">
                            <div className="p-3 rounded-4 bg-light border">
                                <span className="text-muted small fw-semibold">Total Community Accounts</span>
                                <h4 className="fw-bold text-dark my-1">{users.length} Users</h4>
                                <span className="text-muted" style={{ fontSize: '11px' }}>{activeUsers.length} verified accounts</span>
                            </div>
                        </div>
                        <div className="col-12 col-sm-4">
                            <div className="p-3 rounded-4 bg-primary-subtle border border-primary-subtle">
                                <span className="text-primary small fw-semibold">Verified Retail Shoppers</span>
                                <h4 className="fw-bold text-primary my-1">{customerUsers.length} Customers</h4>
                                <span className="text-muted" style={{ fontSize: '11px' }}>Store purchasing accounts</span>
                            </div>
                        </div>
                        <div className="col-12 col-sm-4">
                            <div className="p-3 rounded-4 bg-success-subtle border border-success-subtle">
                                <span className="text-success small fw-semibold">Store Administrators</span>
                                <h4 className="fw-bold text-success my-1">{adminUsers.length} SuperAdmins</h4>
                                <span className="text-muted" style={{ fontSize: '11px' }}>Privileged administrators</span>
                            </div>
                        </div>
                    </div>

                    {/* Users Table */}
                    {filteredUsers.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <TeamOutlined className="fs-1 d-block mb-3 text-secondary opacity-50" />
                            <h5>No users found</h5>
                            <p className="small">Try adjusting your search query</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0 text-nowrap">
                                <thead className="table-light">
                                    <tr className="text-secondary fw-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                                        <th className="py-3">User</th>
                                        <th className="py-3">Email Address</th>
                                        <th className="py-3">Role</th>
                                        <th className="py-3">Account Status</th>
                                        <th className="py-3 text-end">Member Since</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((u, idx) => {
                                        const isAdmin = u.role === 'superAdmin';
                                        const initials = u.fullName ? u.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U';

                                        return (
                                            <tr key={idx}>
                                                <td>
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="rounded-circle overflow-hidden flex-shrink-0 d-flex align-items-center justify-content-center fw-bold text-white shadow-sm"
                                                            style={{
                                                                width: '38px',
                                                                height: '38px',
                                                                backgroundColor: isAdmin ? '#042f2e' : '#0d6efd',
                                                                fontSize: '12px'
                                                            }}>
                                                            {u.profilePicture ? (
                                                                <img src={u.profilePicture} alt={u.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            ) : (
                                                                initials
                                                            )}
                                                        </div>
                                                        <div className="min-width-0">
                                                            <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '200px', fontSize: '13px' }}>
                                                                {u.fullName || 'User'}
                                                            </div>
                                                            <div className="text-muted" style={{ fontSize: '11px' }}>UID: #{u.uid?.slice(-6) || idx + 1}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-secondary fw-semibold" style={{ fontSize: '13px' }}>
                                                    {u.email}
                                                </td>
                                                <td>
                                                    {isAdmin ? (
                                                        <span className="badge bg-dark rounded-pill px-3 py-1 fw-bold text-white d-inline-flex align-items-center gap-1" style={{ fontSize: '11px' }}>
                                                            <CrownFilled className="text-warning" /> SuperAdmin
                                                        </span>
                                                    ) : (
                                                        <span className="badge bg-light text-secondary border rounded-pill px-3 py-1 fw-bold" style={{ fontSize: '11px' }}>
                                                            Customer
                                                        </span>
                                                    )}
                                                </td>
                                                <td>
                                                    <span className={`badge rounded-pill px-3 py-1 fw-bold ${u.status === 'active' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`} style={{ fontSize: '11px' }}>
                                                        {u.status || 'active'}
                                                    </span>
                                                </td>
                                                <td className="text-end text-muted" style={{ fontSize: '11.5px' }}>
                                                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Verified Member'}
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

        </div>
    );
};

export default Analytics;
