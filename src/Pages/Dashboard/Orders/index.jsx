import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/Auth';

const STATUS = {
    processing: { label: 'Processing', icon: '⏳', bg: '#fffbeb', color: '#d97706', border: '#fde68a', dot: '#f59e0b' },
    shipped:    { label: 'Shipped',    icon: '🚚', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', dot: '#3b82f6' },
    delivered:  { label: 'Delivered', icon: '✅', bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0', dot: '#22c55e' },
    cancelled:  { label: 'Cancelled', icon: '❌', bg: '#fef2f2', color: '#dc2626', border: '#fecaca', dot: '#ef4444' },
}
const PAYMENT = {
    pending: { label: 'Pending', bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' },
    paid:    { label: 'Paid',    bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
    failed:  { label: 'Failed', bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
}

const Orders = () => {
    const { user } = useAuth();
    const isSuperAdmin = user?.role === 'superAdmin';

    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [expandedRow, setExpandedRow] = useState(null);

    // modal
    const [orderToEdit, setOrderToEdit] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [newStatus, setNewStatus] = useState('');

    // inline actions
    const [deletingId, setDeletingId] = useState(null);
    const [shippingId, setShippingId] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const jwt = () => localStorage.getItem('jwt');
    const headers = () => ({ Authorization: `Bearer ${jwt()}` });

    // ── Fetch
    const getDocuments = useCallback(() => {
        setLoading(true);
        axios.get(`${window.api}/api/orders/all`, { headers: headers() })
            .then(res => { if (res.status === 200) setDocuments(res.data.orders); })
            .catch(() => window.toastify('Failed to load orders', 'error'))
            .finally(() => setLoading(false));
    }, []);
    useEffect(() => { getDocuments(); }, [getDocuments]);

    // ── Delete
    const handleDelete = (order) => {
        setDeletingId(order.id);
        axios.delete(`${window.api}/api/orders/delete/${order.id}`, { headers: headers() })
            .then(res => {
                if (res.status === 200) {
                    window.toastify(res.data.message, 'success');
                    setDocuments(prev => prev.filter(d => d.id !== order.id));
                    setConfirmDelete(null);
                }
            })
            .catch(err => window.toastify(err.response?.data?.message || 'Error', 'error'))
            .finally(() => setDeletingId(null));
    };

    // ── Edit modal
    const handleEdit = (order) => { setOrderToEdit(order); setNewStatus(order.orderStatus); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); setOrderToEdit(null); setNewStatus(''); };

    const handleUpdate = async () => {
        if (!newStatus) return window.toastify('Select a status', 'error');
        setIsProcessing(true);
        try {
            const res = await axios.patch(`${window.api}/api/orders/update/${orderToEdit.id}`, { orderStatus: newStatus }, { headers: headers() });
            if (res.status === 200) {
                window.toastify('Order updated!', 'success');
                setDocuments(prev => prev.map(d => d.id === orderToEdit.id ? res.data.order : d));
                closeModal();
            }
        } catch (err) { window.toastify(err.response?.data?.message || 'Error', 'error'); }
        finally { setIsProcessing(false); }
    };

    // ── Ship
    const handleMarkShipped = (order) => {
        setShippingId(order.id);
        axios.patch(`${window.api}/api/orders/update/${order.id}`, { orderStatus: 'shipped' }, { headers: headers() })
            .then(res => {
                if (res.status === 200) {
                    window.toastify('Marked as Shipped!', 'success');
                    setDocuments(prev => prev.map(d => d.id === order.id ? res.data.order : d));
                }
            })
            .catch(err => window.toastify(err.response?.data?.message || 'Error', 'error'))
            .finally(() => setShippingId(null));
    };

    // ── Stats
    const stats = {
        total: documents.length,
        processing: documents.filter(o => o.orderStatus === 'processing').length,
        shipped: documents.filter(o => o.orderStatus === 'shipped').length,
        delivered: documents.filter(o => o.orderStatus === 'delivered').length,
        cancelled: documents.filter(o => o.orderStatus === 'cancelled').length,
        revenue: documents.filter(o => o.orderStatus !== 'cancelled').reduce((s, o) => s + (o.totalAmount || 0), 0),
    };

    // ── Filter
    const filtered = documents.filter(o => {
        const q = searchQuery.toLowerCase();
        const matchSearch = !q ||
            o.id?.toLowerCase().includes(q) ||
            o.shippingAddress?.fullName?.toLowerCase().includes(q) ||
            o.shippingAddress?.city?.toLowerCase().includes(q);
        const matchStatus = filterStatus === 'all' || o.orderStatus === filterStatus;
        return matchSearch && matchStatus;
    });

    return (
        <div style={{ padding: 'clamp(14px, 3vw, 28px)', fontFamily: "'Inter', sans-serif", minHeight: '100%', background: '#f8fafc' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                @keyframes ord-in  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
                @keyframes ord-spin{ to{transform:rotate(360deg)} }
                @keyframes ord-dot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.7);opacity:.4} }
                .ord-row  { transition: background 0.15s; cursor:pointer; }
                .ord-row:hover { background:#f1f5f9 !important; }
                .ord-btn  { border:none; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; border-radius:9px; transition:all 0.2s; }
                .ord-btn:hover:not(:disabled) { transform:translateY(-2px); }
                .ord-btn:disabled { opacity:.5; cursor:not-allowed; }
                .ord-search:focus { outline:none; border-color:#0d9488 !important; box-shadow:0 0 0 3px rgba(13,148,136,0.15) !important; }
                .ord-sel:focus { outline:none; border-color:#0d9488 !important; box-shadow:0 0 0 3px rgba(13,148,136,0.15) !important; }
                .ord-modal-sel:focus { outline:none; border-color:#0d9488 !important; box-shadow:0 0 0 3px rgba(13,148,136,0.15) !important; }
                .ord-save:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 24px rgba(13,148,136,.35) !important; }
                .ord-save { transition:all 0.2s; }

                /* Smooth Horizontal Scrollbar for Orders Table */
                .ord-table-scroll::-webkit-scrollbar { height: 6px; }
                .ord-table-scroll::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
                .ord-table-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
                .ord-table-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

                @media (max-width: 576px) {
                    .ord-header-btn { width: 100% !important; justify-content: center !important; }
                    .ord-filter-box { flex-direction: column !important; align-items: stretch !important; }
                    .ord-filter-info { margin-left: 0 !important; text-align: left !important; }
                    .ord-summary-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>

            {/* ── Header ── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12, animation: 'ord-in 0.4s ease' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: 'clamp(20px, 4vw, 26px)', fontWeight: 800, color: '#0f172a', letterSpacing: -0.5 }}>🛒 Orders Management</h1>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94a3b8' }}>Track and manage all customer orders</p>
                </div>
                <button className="ord-header-btn" onClick={getDocuments} style={{ padding: '9px 18px', borderRadius: 10, border: '1.5px solid #ccfbf1', background: '#fff', color: '#0d9488', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, boxShadow: '0 2px 8px rgba(13,148,136,0.08)' }}>
                    🔄 Refresh
                </button>
            </div>

            {/* ── Stat Cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 14, marginBottom: 24, animation: 'ord-in 0.4s ease 0.05s both' }}>
                {[
                    { label: 'Total Orders', value: stats.total,     icon: '📦', color: '#0d9488', bg: '#ccfbf1' },
                    { label: 'Processing',   value: stats.processing, icon: '⏳', color: '#d97706', bg: '#fffbeb' },
                    { label: 'Shipped',      value: stats.shipped,    icon: '🚚', color: '#0284c7', bg: '#e0f2fe' },
                    { label: 'Delivered',    value: stats.delivered,  icon: '✅', color: '#16a34a', bg: '#dcfce7' },
                    { label: 'Cancelled',    value: stats.cancelled,  icon: '❌', color: '#dc2626', bg: '#fef2f2' },
                    { label: 'Revenue',      value: `Rs. ${stats.revenue.toLocaleString()}`, icon: '💰', color: '#0d9488', bg: '#f0fdfa' },
                ].map((s, i) => (
                    <div key={i} style={{ background: '#fff', borderRadius: 16, padding: '14px 16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
                        <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.value}</div>
                            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginTop: 3 }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Filters ── */}
            <div className="ord-filter-box" style={{ background: '#fff', borderRadius: 16, padding: '14px 18px', marginBottom: 18, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', animation: 'ord-in 0.4s ease 0.1s both' }}>
                <input className="ord-search" type="text" placeholder="🔍 Search order ID, customer, city…"
                    value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    style={{ flex: 1, minWidth: 180, padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13, background: '#f8fafc', color: '#0f172a', transition: 'all 0.2s' }}
                />
                <select className="ord-sel" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                    style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13, background: '#f8fafc', color: '#0f172a', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <option value="all">All Status</option>
                    <option value="processing">⏳ Processing</option>
                    <option value="shipped">🚚 Shipped</option>
                    <option value="delivered">✅ Delivered</option>
                    <option value="cancelled">❌ Cancelled</option>
                </select>
                {(searchQuery || filterStatus !== 'all') && (
                    <button onClick={() => { setSearchQuery(''); setFilterStatus('all'); }}
                        style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 12, background: '#f1f5f9', color: '#64748b', cursor: 'pointer', fontWeight: 600 }}>
                        ✕ Clear
                    </button>
                )}
                <div className="ord-filter-info" style={{ marginLeft: 'auto', fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{filtered.length} of {documents.length} orders</div>
            </div>

            {/* ── Orders Table Container ── */}
            <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.07)', overflow: 'hidden', animation: 'ord-in 0.4s ease 0.15s both' }}>
                <div className="ord-table-scroll" style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <div style={{ minWidth: '880px' }}>

                        {/* Table Header */}
                        <div style={{ display: 'grid', gridTemplateColumns: '36px 1.4fr 2.2fr 1.2fr 1.3fr 1fr 90px', gap: 10, background: '#042f2e', padding: '14px 20px', alignItems: 'center' }}>
                            {['#', 'Order ID', 'Customer', 'Total', 'Order Status', 'Payment', 'Actions'].map((h, i) => (
                                <div key={i} style={{ fontSize: 11, fontWeight: 700, color: '#5eead4', textTransform: 'uppercase', letterSpacing: 0.8 }}>{h}</div>
                            ))}
                        </div>

                        {/* Loading */}
                        {loading && (
                            <div style={{ padding: 56, textAlign: 'center' }}>
                                <div style={{ width: 36, height: 36, border: '3px solid #e2e8f0', borderTop: '3px solid #0d9488', borderRadius: '50%', animation: 'ord-spin 0.8s linear infinite', margin: '0 auto 14px' }} />
                                <p style={{ color: '#94a3b8', fontSize: 13, margin: 0 }}>Loading orders…</p>
                            </div>
                        )}

                        {/* Empty */}
                        {!loading && filtered.length === 0 && (
                            <div style={{ padding: 56, textAlign: 'center' }}>
                                <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                                <div style={{ fontSize: 15, fontWeight: 700, color: '#475569' }}>No orders found</div>
                                <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Try adjusting your filters</div>
                            </div>
                        )}

                        {/* Rows */}
                        {!loading && filtered.map((order, idx) => {
                            const st = STATUS[order.orderStatus] || STATUS.processing;
                            const pay = PAYMENT[order.paymentStatus] || PAYMENT.pending;
                            const isExpanded = expandedRow === order.id;

                            return (
                                <div key={order.id} style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #f1f5f9' : 'none' }}>

                                    {/* ── Main Row ── */}
                                    <div className="ord-row" onClick={() => setExpandedRow(isExpanded ? null : order.id)}
                                        style={{ display: 'grid', gridTemplateColumns: '36px 1.4fr 2.2fr 1.2fr 1.3fr 1fr 90px', gap: 10, padding: '14px 20px', alignItems: 'center', background: isExpanded ? '#f0fdfa' : '#fff' }}>

                                        {/* # */}
                                        <div style={{ fontSize: 12, color: '#cbd5e1', fontWeight: 700 }}>{idx + 1}</div>

                                        {/* Order ID */}
                                        <div>
                                            <div style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 700, color: '#0d9488', background: '#ccfbf1', display: 'inline-block', padding: '2px 8px', borderRadius: 6 }}>
                                                #{order.id?.substring(0, 8)}
                                            </div>
                                            <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 3 }}>
                                                {new Date(order.createdAt).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </div>
                                        </div>

                                        {/* Customer */}
                                        <div style={{ minWidth: 0, paddingRight: 8 }}>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.shippingAddress?.fullName || '—'}</div>
                                            <div style={{ fontSize: 11, color: '#94a3b8' }}>{order.shippingAddress?.phone} · {order.shippingAddress?.city}</div>
                                        </div>

                                        {/* Total */}
                                        <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>
                                            Rs. {Number(order.totalAmount).toLocaleString()}
                                        </div>

                                        {/* Order Status */}
                                        <div>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: st.dot, display: 'inline-block', animation: order.orderStatus === 'processing' || order.orderStatus === 'shipped' ? 'ord-dot 1.8s infinite' : 'none' }} />
                                                {st.label}
                                            </span>
                                        </div>

                                        {/* Payment */}
                                        <div>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999, background: pay.bg, color: pay.color, border: `1px solid ${pay.border}` }}>
                                                {pay.label}
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        {isSuperAdmin ? (
                                            <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                                                <button className="ord-btn" onClick={() => handleEdit(order)}
                                                    style={{ width: 32, height: 32, background: '#ccfbf1', color: '#0d9488', fontSize: 13 }} title="Update Status">✏️</button>
                                                <button className="ord-btn" onClick={() => handleMarkShipped(order)}
                                                    disabled={shippingId === order.id || order.orderStatus === 'shipped' || order.orderStatus === 'delivered'}
                                                    style={{ width: 32, height: 32, background: '#e0f2fe', color: '#0284c7', fontSize: 13 }} title="Mark as Shipped">
                                                    {shippingId === order.id
                                                        ? <span style={{ width: 14, height: 14, border: '2px solid #bae6fd', borderTop: '2px solid #0284c7', borderRadius: '50%', animation: 'ord-spin 0.8s linear infinite', display: 'inline-block' }} />
                                                        : '🚚'
                                                    }
                                                </button>
                                                <button className="ord-btn" onClick={() => setConfirmDelete(order)}
                                                    style={{ width: 32, height: 32, background: '#fef2f2', color: '#dc2626', fontSize: 13 }} title="Delete Order">🗑️</button>
                                            </div>
                                        ) : <div />}
                                    </div>

                                    {/* ── Expanded Products ── */}
                                    {isExpanded && (
                                        <div style={{ padding: '14px 20px 18px', background: '#f0fdfa', borderTop: '1px dashed #99f6e4' }}>
                                            <div style={{ fontSize: 11, fontWeight: 700, color: '#0d9488', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>📦 Products in this order</div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                                {order.products?.map((p, i) => (
                                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                                                        <img src={p.imageURL || 'https://via.placeholder.com/40'} alt={p.name}
                                                            style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0', flexShrink: 0 }} />
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                                                            <div style={{ fontSize: 11, color: '#94a3b8' }}>Qty: {p.quantity} · Rs. {Number(p.price).toLocaleString()} each</div>
                                                        </div>
                                                        <div style={{ fontSize: 13, fontWeight: 700, color: '#0d9488', flexShrink: 0 }}>
                                                            Rs. {(p.price * p.quantity).toLocaleString()}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {order.shippingAddress?.address && (
                                                <div style={{ marginTop: 12, padding: '10px 14px', background: '#fff', borderRadius: 10, border: '1px solid #bbf7d0', fontSize: 12, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    📍 <span style={{ color: '#475569' }}>{order.shippingAddress.address}, {order.shippingAddress.city}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Update Status Modal ── */}
            {isModalOpen && orderToEdit && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(4,47,46,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(4px)' }}
                    onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
                    <div style={{ background: '#fff', borderRadius: 24, padding: 24, width: '100%', maxWidth: 440, boxShadow: '0 24px 64px rgba(0,0,0,0.18)', animation: 'ord-in 0.3s ease' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                            <div style={{ width: 44, height: 44, borderRadius: 14, background: '#ccfbf1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>✏️</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Update Order Status</div>
                                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>#{orderToEdit.id?.substring(0, 12)}</div>
                            </div>
                            <button onClick={closeModal} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: '#f1f5f9', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>✕</button>
                        </div>

                        {/* Summary */}
                        <div style={{ padding: '14px 16px', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 20 }}>
                            <div className="ord-summary-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                {[
                                    { label: 'Customer', value: orderToEdit.shippingAddress?.fullName },
                                    { label: 'Total', value: `Rs. ${Number(orderToEdit.totalAmount).toLocaleString()}` },
                                    { label: 'City', value: orderToEdit.shippingAddress?.city },
                                    { label: 'Payment', value: orderToEdit.paymentStatus },
                                ].map((item, i) => (
                                    <div key={i}>
                                        <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.label}</div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', textTransform: 'capitalize', marginTop: 2 }}>{item.value || '—'}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 7 }}>New Status</label>
                        <select className="ord-modal-sel" value={newStatus} onChange={e => setNewStatus(e.target.value)}
                            style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 14, color: '#0f172a', background: '#f8fafc', cursor: 'pointer', marginBottom: 20, boxSizing: 'border-box', transition: 'all 0.2s' }}>
                            <option value="">-- Select Status --</option>
                            <option value="processing">⏳ Processing</option>
                            <option value="shipped">🚚 Shipped</option>
                            <option value="delivered">✅ Delivered</option>
                            <option value="cancelled">❌ Cancelled</option>
                        </select>

                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={closeModal} style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                            <button className="ord-save" onClick={handleUpdate} disabled={isProcessing}
                                style={{ flex: 2, padding: '12px', borderRadius: 12, border: 'none', background: isProcessing ? '#99f6e4' : 'linear-gradient(135deg,#0d9488,#042f2e)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: isProcessing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 14px rgba(13,148,136,0.3)' }}>
                                {isProcessing
                                    ? <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'ord-spin 0.8s linear infinite', display: 'inline-block' }} />Updating...</>
                                    : '✅ Update Order'
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Delete Confirm Modal ── */}
            {confirmDelete && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,12,41,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(4px)' }}
                    onClick={e => { if (e.target === e.currentTarget) setConfirmDelete(null); }}>
                    <div style={{ background: '#fff', borderRadius: 24, padding: 28, width: '100%', maxWidth: 380, boxShadow: '0 24px 64px rgba(0,0,0,0.18)', textAlign: 'center', animation: 'ord-in 0.3s ease' }}>
                        <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 14px' }}>🗑️</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Delete Order?</div>
                        <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20, lineHeight: 1.6 }}>
                            Order <strong>#{confirmDelete.id?.substring(0, 8)}</strong> by <strong>{confirmDelete.shippingAddress?.fullName}</strong> will be permanently deleted.
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                            <button onClick={() => handleDelete(confirmDelete)} disabled={deletingId === confirmDelete.id}
                                style={{ flex: 1, padding: '12px', borderRadius: 12, border: 'none', background: deletingId ? '#fca5a5' : 'linear-gradient(135deg,#ef4444,#dc2626)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: deletingId ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 14px rgba(239,68,68,0.3)', transition: 'all 0.2s' }}>
                                {deletingId === confirmDelete.id
                                    ? <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'ord-spin 0.8s linear infinite', display: 'inline-block' }} />Deleting...</>
                                    : '🗑️ Delete'
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;