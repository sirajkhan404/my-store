import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/Auth';

const Messages = () => {
    const { user } = useAuth();
    const isSuperAdmin = user?.role === 'superAdmin';

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTab, setFilterTab] = useState('all'); // 'all', 'pending', 'replied'
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    // Reply state
    const [replyText, setReplyText] = useState('');
    const [isSendingReply, setIsSendingReply] = useState(false);

    // Customer New Inquiry State
    const [newInquiryModalOpen, setNewInquiryModalOpen] = useState(false);
    const [inquiryData, setInquiryData] = useState({ subject: '', message: '' });
    const [isSendingInquiry, setIsSendingInquiry] = useState(false);

    const token = localStorage.getItem('jwt');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchMessages = async () => {
        setLoading(true);
        try {
            if (isSuperAdmin) {
                const { data } = await axios.get(`${window.api}/api/contact/all`, { headers });
                const list = data.messages || [];
                setMessages(list);
                if (list.length > 0 && !selectedMessage) {
                    setSelectedMessage(list[0]);
                }
            } else {
                const userEmail = user?.email || '';
                const { data } = await axios.get(`${window.api}/api/contact/my-messages?email=${encodeURIComponent(userEmail)}`, { headers });
                const list = data.messages || [];
                setMessages(list);
                if (list.length > 0 && !selectedMessage) {
                    setSelectedMessage(list[0]);
                }
            }
        } catch (error) {
            console.error(error);
            window.toastify(error?.response?.data?.message || 'Failed to fetch contact messages', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchMessages();
    }, [user]);

    // SuperAdmin Delete
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;
        setDeletingId(id);
        try {
            const { data } = await axios.delete(`${window.api}/api/contact/delete/${id}`, { headers });
            window.toastify(data.message || 'Message deleted successfully', 'success');
            const updated = messages.filter(m => m.id !== id);
            setMessages(updated);
            if (selectedMessage?.id === id) {
                setSelectedMessage(updated.length > 0 ? updated[0] : null);
            }
        } catch (error) {
            console.error(error);
            window.toastify(error?.response?.data?.message || 'Failed to delete message', 'error');
        } finally {
            setDeletingId(null);
        }
    };

    // SuperAdmin Reply Submit
    const handleSendReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim() || !selectedMessage) return window.toastify('Please enter a reply message', 'warning');

        setIsSendingReply(true);
        try {
            const { data } = await axios.post(
                `${window.api}/api/contact/reply`,
                { id: selectedMessage.id, replyText },
                { headers }
            );

            window.toastify(data.message || 'Reply sent successfully!', 'success');

            const updatedMsg = { ...selectedMessage, isReplied: true, replyText, repliedAt: new Date() };
            setMessages(prev => prev.map(m => (m.id === selectedMessage.id ? updatedMsg : m)));
            setSelectedMessage(updatedMsg);
            setReplyText('');
        } catch (error) {
            console.error(error);
            window.toastify(error?.response?.data?.message || 'Failed to send reply', 'error');
        } finally {
            setIsSendingReply(false);
        }
    };

    // Customer New Inquiry Submit
    const handleSendInquiry = async (e) => {
        e.preventDefault();
        if (!inquiryData.subject || !inquiryData.message) {
            return window.toastify('Please fill all required fields', 'warning');
        }

        setIsSendingInquiry(true);
        try {
            const payload = {
                name: user?.fullName || 'Customer',
                email: user?.email || '',
                uid: user?.uid || '',
                subject: inquiryData.subject,
                message: inquiryData.message,
            };

            const { data } = await axios.post(`${window.api}/api/contact/send`, payload);
            window.toastify(data.message || 'Inquiry sent successfully!', 'success');
            setInquiryData({ subject: '', message: '' });
            setNewInquiryModalOpen(false);
            fetchMessages();
        } catch (error) {
            console.error(error);
            window.toastify(error?.response?.data?.message || 'Failed to send inquiry', 'error');
        } finally {
            setIsSendingInquiry(false);
        }
    };

    // Filters
    const filteredMessages = messages.filter(m => {
        const matchesTerm =
            m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.message?.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesTerm) return false;
        if (filterTab === 'pending') return !m.isReplied;
        if (filterTab === 'replied') return m.isReplied;
        return true;
    });

    const totalCount = messages.length;
    const pendingCount = messages.filter(m => !m.isReplied).length;
    const repliedCount = messages.filter(m => m.isReplied).length;

    return (
        <div className="p-3 p-md-4 p-lg-5 bg-light" style={{ minHeight: 'calc(100vh - 70px)', fontFamily: "'Inter', sans-serif" }}>

            {/* ── Top Header & Action Banner ─────────────────────────────── */}
            <div className="mb-4 bg-white p-4 rounded-4 shadow-sm border border-light-subtle">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                            <span className="fs-3">💬</span>
                            <h3 className="fw-bold mb-0 text-dark">
                                {isSuperAdmin ? 'Support Messages Inbox' : 'My Inquiries & Responses'}
                            </h3>
                        </div>
                        <p className="text-muted mb-0 small">
                            {isSuperAdmin
                                ? 'Manage visitor inquiries, review questions, and send replies directly to users.'
                                : 'Track your support inquiries and view official replies from SuperAdmin.'}
                        </p>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        {!isSuperAdmin && (
                            <button
                                className="btn btn-primary rounded-pill px-4 py-2 fw-semibold shadow-sm d-flex align-items-center gap-2 border-0"
                                style={{ background: 'linear-gradient(135deg, #4f46e5, #3b82f6)' }}
                                onClick={() => setNewInquiryModalOpen(true)}
                            >
                                ➕ New Inquiry
                            </button>
                        )}
                        <button
                            className="btn btn-outline-secondary rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-2"
                            onClick={fetchMessages}
                            disabled={loading}
                        >
                            <span>🔄</span> Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Overview Stat Badges ───────────────────────────────────── */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-sm-4">
                    <div className="card bg-white border border-light-subtle rounded-4 p-3 px-4 shadow-sm d-flex flex-row align-items-center gap-3 h-100">
                        <div className="d-flex align-items-center justify-content-center rounded-3 text-primary fw-bold flex-shrink-0"
                            style={{ width: '44px', height: '44px', background: '#e0e7ff', fontSize: '20px' }}>
                            📩
                        </div>
                        <div>
                            <div className="fw-bold fs-4 text-dark lh-1">{totalCount}</div>
                            <div className="text-muted small fw-semibold mt-1">Total Messages</div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-4">
                    <div className="card bg-white border border-light-subtle rounded-4 p-3 px-4 shadow-sm d-flex flex-row align-items-center gap-3 h-100">
                        <div className="d-flex align-items-center justify-content-center rounded-3 text-warning fw-bold flex-shrink-0"
                            style={{ width: '44px', height: '44px', background: '#fef3c7', fontSize: '20px' }}>
                            ⏳
                        </div>
                        <div>
                            <div className="fw-bold fs-4 text-dark lh-1">{pendingCount}</div>
                            <div className="text-muted small fw-semibold mt-1">Pending Response</div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-4">
                    <div className="card bg-white border border-light-subtle rounded-4 p-3 px-4 shadow-sm d-flex flex-row align-items-center gap-3 h-100">
                        <div className="d-flex align-items-center justify-content-center rounded-3 text-success fw-bold flex-shrink-0"
                            style={{ width: '44px', height: '44px', background: '#d1fae5', fontSize: '20px' }}>
                            ✅
                        </div>
                        <div>
                            <div className="fw-bold fs-4 text-dark lh-1">{repliedCount}</div>
                            <div className="text-muted small fw-semibold mt-1">Replied Inquiries</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Split Inbox Main Layout ────────────────────────────────── */}
            <div className="row g-4" style={{ minHeight: '680px' }}>

                {/* ── Left Column: Message List ── */}
                <div className={`col-12 col-lg-4 ${selectedMessage && 'd-none d-lg-block'}`}>
                    <div className="card bg-white border border-light-subtle rounded-4 shadow-sm overflow-hidden h-100 d-flex flex-column">

                        {/* Search & Tabs Header */}
                        <div className="p-3 border-bottom bg-white">
                            <div className="position-relative mb-3">
                                <input
                                    type="text"
                                    className="form-control bg-light border-light-subtle rounded-3 py-2 px-3 pe-5 shadow-sm"
                                    placeholder="Search by name, subject, message..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    style={{ fontSize: '13px' }}
                                />
                                {searchTerm && (
                                    <button
                                        className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-muted pe-3 text-decoration-none shadow-none"
                                        onClick={() => setSearchTerm('')}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                            {/* Filter Tabs */}
                            <div className="d-flex align-items-center gap-1 overflow-auto pb-1">
                                {[
                                    { id: 'all', label: `All (${totalCount})` },
                                    { id: 'pending', label: `⏳ Pending (${pendingCount})` },
                                    { id: 'replied', label: `✓ Replied (${repliedCount})` },
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold text-nowrap ${filterTab === tab.id ? 'btn-primary shadow-sm' : 'btn-outline-secondary bg-white text-secondary border-light-subtle'}`}
                                        onClick={() => setFilterTab(tab.id)}
                                        style={{ fontSize: '12.5px', background: filterTab === tab.id ? 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)' : '', border: filterTab === tab.id ? 'none' : undefined }}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Scrollable List Items */}
                        <div className="flex-grow-1 overflow-auto">
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary spinner-border-sm" role="status" />
                                    <p className="mt-2 text-muted small fw-medium">Loading inbox...</p>
                                </div>
                            ) : filteredMessages.length === 0 ? (
                                <div className="text-center py-5 text-muted px-3">
                                    <div className="fs-2 mb-2">📭</div>
                                    <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '14px' }}>No Messages Found</h6>
                                    <p className="small mb-0 opacity-75">
                                        {searchTerm ? 'Try adjusting your search query.' : 'Inbox is currently empty.'}
                                    </p>
                                </div>
                            ) : (
                                filteredMessages.map(msg => (
                                    <div
                                        key={msg.id}
                                        className={`p-3 border-bottom cursor-pointer transition-all ${selectedMessage?.id === msg.id ? 'bg-indigo-subtle border-start border-4 border-primary' : 'bg-white'}`}
                                        onClick={() => setSelectedMessage(msg)}
                                        style={{
                                            cursor: 'pointer',
                                            background: selectedMessage?.id === msg.id ? '#eef2ff' : '#ffffff',
                                            borderLeft: selectedMessage?.id === msg.id ? '4px solid #4f46e5' : '1px solid #f1f5f9'
                                        }}
                                    >
                                        <div className="d-flex justify-content-between align-items-start mb-1">
                                            <div className="fw-bold text-dark text-truncate" style={{ fontSize: '14px', maxWidth: '180px' }}>
                                                {isSuperAdmin ? msg.name : msg.subject}
                                            </div>
                                            <span className="small text-muted" style={{ fontSize: '11px' }}>
                                                {msg.createdAt
                                                    ? new Date(msg.createdAt).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })
                                                    : ''}
                                            </span>
                                        </div>

                                        <div className="fw-semibold text-primary mb-1 text-truncate" style={{ fontSize: '13px' }}>
                                            {isSuperAdmin ? msg.subject : `Email: ${msg.email}`}
                                        </div>

                                        <div className="text-muted small text-truncate mb-2" style={{ fontSize: '12px' }}>
                                            {msg.message}
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center">
                                            {msg.isReplied ? (
                                                <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill fw-semibold" style={{ fontSize: '11px' }}>
                                                    ✓ Replied
                                                </span>
                                            ) : (
                                                <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-pill fw-semibold" style={{ fontSize: '11px' }}>
                                                    ⏳ Pending
                                                </span>
                                            )}
                                            {isSuperAdmin && (
                                                <span className="text-muted small text-truncate" style={{ fontSize: '11px', maxWidth: '140px' }}>
                                                    {msg.email}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Right Column: Selected Message Details & Reply Panel ── */}
                <div className={`col-12 col-lg-8 ${!selectedMessage && 'd-none d-lg-block'}`}>
                    <div className="card bg-white border border-light-subtle rounded-4 shadow-sm overflow-hidden h-100 d-flex flex-column">
                        {selectedMessage ? (
                            <div className="d-flex flex-column h-100">

                                {/* Panel Top Header */}
                                <div className="p-4 border-bottom bg-white d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-3">
                                        <button
                                            className="btn btn-sm btn-light border d-lg-none"
                                            onClick={() => setSelectedMessage(null)}
                                        >
                                            ← Back
                                        </button>
                                        <div className="d-flex align-items-center justify-content-center text-white fw-bold rounded-circle flex-shrink-0 shadow-sm"
                                            style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #4f46e5, #3b82f6)', fontSize: '18px' }}>
                                            {selectedMessage.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <h5 className="fw-bold mb-0 text-dark fs-6">{selectedMessage.name}</h5>
                                            <div className="text-muted small">{selectedMessage.email}</div>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center gap-2">
                                        {selectedMessage.isReplied ? (
                                            <span className="badge bg-success text-white px-3 py-2 rounded-pill fw-semibold">
                                                ✓ Replied
                                            </span>
                                        ) : (
                                            <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-semibold">
                                                ⏳ Pending
                                            </span>
                                        )}
                                        {isSuperAdmin && (
                                            <button
                                                className="btn btn-outline-danger btn-sm rounded-pill px-3 py-1 fw-semibold shadow-sm"
                                                disabled={deletingId === selectedMessage.id}
                                                onClick={() => handleDelete(selectedMessage.id)}
                                            >
                                                {deletingId === selectedMessage.id ? 'Deleting...' : '🗑️ Delete'}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Panel Scrollable Thread View */}
                                <div className="flex-grow-1 p-4 overflow-auto bg-light" style={{ minHeight: '320px' }}>

                                    {/* Subject Header Banner */}
                                    <div className="bg-white p-3 rounded-4 border mb-4 shadow-sm d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
                                        <div>
                                            <span className="text-muted small fw-bold text-uppercase d-block mb-1">Subject</span>
                                            <h6 className="fw-bold text-dark mb-0">{selectedMessage.subject}</h6>
                                        </div>
                                        <div className="text-muted small text-sm-end">
                                            <div className="fw-semibold">{selectedMessage.createdAt ? new Date(selectedMessage.createdAt).toLocaleDateString('en-PK', { weekday: 'short', month: 'short', day: 'numeric' }) : ''}</div>
                                            <div>{selectedMessage.createdAt ? new Date(selectedMessage.createdAt).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' }) : ''}</div>
                                        </div>
                                    </div>

                                    {/* User Message Bubble */}
                                    <div className="mb-4">
                                        <div className="d-flex align-items-center gap-2 mb-2 ms-1">
                                            <span className="fw-bold small text-dark">👤 {selectedMessage.name}</span>
                                            <span className="text-muted small" style={{ fontSize: '11px' }}>
                                                {selectedMessage.createdAt ? new Date(selectedMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </span>
                                        </div>
                                        <div className="p-4 bg-white rounded-4 border shadow-sm text-dark fs-6 lh-base"
                                            style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                            {selectedMessage.message}
                                        </div>
                                    </div>

                                    {/* SuperAdmin Reply Bubble */}
                                    {selectedMessage.isReplied && (
                                        <div className="mt-4 ms-md-4">
                                            <div className="d-flex align-items-center justify-content-between mb-2 me-1">
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className="fw-bold small" style={{ color: '#4f46e5' }}>👑 SuperAdmin Response</span>
                                                    <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-0.5 rounded-pill small">
                                                        ✓ Sent to User Dashboard
                                                    </span>
                                                </div>
                                                {selectedMessage.repliedAt && (
                                                    <span className="text-muted small" style={{ fontSize: '11px' }}>
                                                        {new Date(selectedMessage.repliedAt).toLocaleString('en-PK', { dateStyle: 'short', timeStyle: 'short' })}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="p-4 rounded-4 text-white shadow-sm fs-6 lh-base"
                                                style={{ background: 'linear-gradient(135deg, #1e293b 0%, #4f46e5 100%)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                                {selectedMessage.replyText}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* SuperAdmin Inline Quick Reply Box */}
                                {isSuperAdmin ? (
                                    <div className="p-4 bg-white border-top">
                                        <form onSubmit={handleSendReply}>
                                            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-2">
                                                <label className="form-label fw-bold text-dark small mb-0">
                                                    {selectedMessage.isReplied ? '✏️ Edit / Send New Reply:' : '✉️ Reply to User:'}
                                                </label>

                                                {/* Preset Templates */}
                                                <div className="d-flex gap-1 flex-wrap">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-light border rounded-pill px-2 py-1"
                                                        style={{ fontSize: '11px' }}
                                                        onClick={() => setReplyText(`Hi ${selectedMessage.name},\n\nThank you for reaching out! We have received your message and will process your request shortly.\n\nBest regards,\nMyStore Team`)}
                                                    >
                                                        ⚡ Thank You
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-light border rounded-pill px-2 py-1"
                                                        style={{ fontSize: '11px' }}
                                                        onClick={() => setReplyText(`Hi ${selectedMessage.name},\n\nThank you for contacting MyStore. Your request regarding "${selectedMessage.subject}" has been successfully resolved.\n\nBest regards,\nMyStore Team`)}
                                                    >
                                                        ⚡ Resolved
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="position-relative mb-3">
                                                <textarea
                                                    className="form-control rounded-4 p-3 bg-light border border-light-subtle shadow-sm"
                                                    rows={3}
                                                    placeholder={`Type your reply to ${selectedMessage.name}... (This reply will appear on their dashboard)`}
                                                    value={replyText}
                                                    onChange={e => setReplyText(e.target.value)}
                                                    required
                                                    style={{ fontSize: '14px', resize: 'vertical' }}
                                                />
                                            </div>

                                            <div className="d-flex justify-content-end">
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm d-flex align-items-center gap-2 border-0"
                                                    style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)' }}
                                                    disabled={isSendingReply}
                                                >
                                                    {isSendingReply ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm" role="status" />
                                                            <span>Sending Reply...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>🚀</span> Send Reply to User
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="p-3 bg-white border-top text-center text-muted small">
                                        {selectedMessage.isReplied
                                            ? '✓ SuperAdmin has responded to your inquiry above.'
                                            : '⏳ Your inquiry is under review by SuperAdmin. Check back soon!'}
                                    </div>
                                )}

                            </div>
                        ) : (
                            <div className="d-flex flex-column align-items-center justify-content-center h-100 p-5 text-center text-muted">
                                <div className="fs-1 mb-3">💬</div>
                                <h5 className="fw-bold text-dark mb-1">Select a Message</h5>
                                <p className="small mb-0 opacity-75">
                                    Choose a message from the left panel to view conversation thread and details.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* ── Customer New Inquiry Modal ──────────────────────── */}
            {newInquiryModalOpen && (
                <div
                    className="modal show d-block"
                    tabIndex="-1"
                    style={{ background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(5px)', zIndex: 1070 }}
                    onClick={e => { if (e.target.classList.contains('modal')) setNewInquiryModalOpen(false); }}
                >
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
                            <div
                                className="modal-header text-white p-4"
                                style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)' }}
                            >
                                <div className="d-flex align-items-center gap-2">
                                    <span className="fs-4">➕</span>
                                    <div>
                                        <h5 className="modal-title fw-bold mb-0">Send New Support Inquiry</h5>
                                        <small className="opacity-75">Send a message directly to SuperAdmin</small>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white shadow-none"
                                    onClick={() => setNewInquiryModalOpen(false)}
                                />
                            </div>
                            <form onSubmit={handleSendInquiry}>
                                <div className="modal-body p-4 bg-white">
                                    <div className="mb-3">
                                        <label className="form-label small text-muted fw-bold text-uppercase mb-1">Subject <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control rounded-3 p-3 border shadow-sm"
                                            placeholder="e.g. Order issue, Product inquiry..."
                                            value={inquiryData.subject}
                                            onChange={e => setInquiryData(s => ({ ...s, subject: e.target.value }))}
                                            required
                                            style={{ fontSize: '15px' }}
                                        />
                                    </div>

                                    <div className="mb-2">
                                        <label className="form-label small text-muted fw-bold text-uppercase mb-1">Your Message <span className="text-danger">*</span></label>
                                        <textarea
                                            className="form-control rounded-3 p-3 border shadow-sm"
                                            rows={5}
                                            placeholder="Describe your question or issue in detail..."
                                            value={inquiryData.message}
                                            onChange={e => setInquiryData(s => ({ ...s, message: e.target.value }))}
                                            required
                                            style={{ fontSize: '15px', resize: 'vertical', minHeight: '120px' }}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer bg-light p-3 d-flex justify-content-end gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-secondary px-4 py-2 rounded-3 fw-semibold"
                                        onClick={() => setNewInquiryModalOpen(false)}
                                        disabled={isSendingInquiry}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary px-4 py-2 rounded-3 fw-semibold d-flex align-items-center gap-2 border-0 shadow-sm"
                                        style={{ background: 'linear-gradient(135deg, #4f46e5, #3b82f6)' }}
                                        disabled={isSendingInquiry}
                                    >
                                        {isSendingInquiry ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm" role="status" />
                                                <span>Sending...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>🚀</span> Send Message
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Messages;