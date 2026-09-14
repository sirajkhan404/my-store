import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const token = localStorage.getItem('jwt');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${window.api}/api/contact/all`, { headers });
            setMessages(data.messages || []);
        } catch (error) {
            console.error(error);
            window.toastify(error?.response?.data?.message || 'Failed to fetch contact messages', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;
        setDeletingId(id);
        try {
            const { data } = await axios.delete(`${window.api}/api/contact/delete/${id}`, { headers });
            window.toastify(data.message || 'Message deleted successfully', 'success');
            setMessages(prev => prev.filter(m => m.id !== id));
            if (selectedMessage?.id === id) setSelectedMessage(null);
        } catch (error) {
            console.error(error);
            window.toastify(error?.response?.data?.message || 'Failed to delete message', 'error');
        } finally {
            setDeletingId(null);
        }
    };

    const filteredMessages = messages.filter(m => {
        const term = searchTerm.toLowerCase();
        return (
            m.name?.toLowerCase().includes(term) ||
            m.email?.toLowerCase().includes(term) ||
            m.subject?.toLowerCase().includes(term) ||
            m.message?.toLowerCase().includes(term)
        );
    });

    return (
        <div className="p-3 p-md-4 p-lg-5 bg-light" style={{ minHeight: 'calc(100vh - 70px)', fontFamily: "'Inter', sans-serif" }}>

            {/* ── Page Header ────────────────────────────────────── */}
            <div className="mb-4 bg-white p-4 rounded-4 shadow-sm border border-light-subtle">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                            <span className="fs-3">💬</span>
                            <h3 className="fw-bold mb-0 text-dark">Contact Messages</h3>
                        </div>
                        <p className="text-muted mb-0 small">
                            View and respond to inquiries submitted by store visitors.
                        </p>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <button
                            className="btn btn-outline-secondary btn-sm rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-2"
                            onClick={fetchMessages}
                            disabled={loading}
                        >
                            <span>🔄</span> Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Search & Filter Controls ─────────────────────── */}
            <div className="row g-3 mb-4 align-items-center">
                <div className="col-12 col-md-6 col-lg-5">
                    <div className="position-relative">
                        <input
                            type="text"
                            className="form-control bg-white border border-secondary-subtle rounded-3 py-2 px-3 w-100 pe-5 shadow-sm"
                            placeholder="Search by name, email, subject..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ fontSize: '14px' }}
                        />
                        {searchTerm && (
                            <button
                                className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-muted text-decoration-none pe-3 shadow-none"
                                onClick={() => setSearchTerm('')}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>
                <div className="col-12 col-md-6 col-lg-7 text-md-end">
                    <span className="badge bg-white text-dark border px-3 py-2 rounded-pill fw-semibold shadow-sm">
                        Total Messages: <span className="text-primary fw-bold">{messages.length}</span>
                    </span>
                    {searchTerm && (
                        <span className="badge text-white ms-2 px-3 py-2 rounded-pill fw-semibold shadow-sm" style={{ background: '#4f46e5' }}>
                            Found: {filteredMessages.length}
                        </span>
                    )}
                </div>
            </div>

            {/* ── Messages Table ───────────────────────────────── */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive" style={{ WebkitOverflowScrolling: 'touch' }}>
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status" />
                            <p className="mt-3 text-muted fw-semibold mb-0">Loading messages...</p>
                        </div>
                    ) : filteredMessages.length === 0 ? (
                        <div className="text-center py-5 text-muted bg-white">
                            <div className="fs-1 mb-2">📭</div>
                            <h6 className="fw-bold text-dark mb-1">No Messages Found</h6>
                            <p className="small mb-0">
                                {searchTerm ? 'Try adjusting your search query.' : 'No contact form submissions yet.'}
                            </p>
                        </div>
                    ) : (
                        <table className="table align-middle mb-0 text-nowrap text-md-wrap" style={{ minWidth: '800px' }}>
                            <thead>
                                <tr className="text-white" style={{ background: '#1e293b' }}>
                                    <th className="py-3 px-4" style={{ width: '60px', fontSize: '13px', textTransform: 'uppercase' }}>#</th>
                                    <th className="py-3 px-4" style={{ fontSize: '13px', textTransform: 'uppercase' }}>Sender Info</th>
                                    <th className="py-3 px-4" style={{ fontSize: '13px', textTransform: 'uppercase' }}>Subject</th>
                                    <th className="py-3 px-4" style={{ fontSize: '13px', textTransform: 'uppercase' }}>Message Preview</th>
                                    <th className="py-3 px-4" style={{ fontSize: '13px', textTransform: 'uppercase' }}>Date</th>
                                    <th className="py-3 px-4 text-center" style={{ width: '150px', fontSize: '13px', textTransform: 'uppercase' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMessages.map((msg, index) => (
                                    <tr key={msg.id || index} className="bg-white">
                                        <td className="py-3 px-4 fw-bold text-muted small">{index + 1}</td>
                                        <td className="py-3 px-4">
                                            <div className="fw-bold text-dark fs-6 mb-1">{msg.name}</div>
                                            <div className="small text-muted d-flex align-items-center gap-1">
                                                <span>✉️</span>
                                                <a href={`mailto:${msg.email}`} className="text-decoration-none text-primary">
                                                    {msg.email}
                                                </a>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="badge bg-light text-dark border px-2 py-1 rounded fw-semibold">
                                                {msg.subject}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="text-truncate text-muted small" style={{ maxWidth: '280px' }}>
                                                {msg.message}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 small text-muted text-nowrap fw-medium">
                                            {msg.createdAt
                                                ? new Date(msg.createdAt).toLocaleString('en-PK', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })
                                                : 'N/A'}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <div className="d-flex justify-content-center align-items-center gap-2">
                                                <button
                                                    className="btn btn-sm btn-outline-primary rounded-3 px-2 py-1 shadow-sm"
                                                    title="View Full Message"
                                                    onClick={() => setSelectedMessage(msg)}
                                                >
                                                    👁️
                                                </button>
                                                <a
                                                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                                                    className="btn btn-sm btn-outline-success rounded-3 px-2 py-1 shadow-sm"
                                                    title="Reply via Email"
                                                >
                                                    ✉️
                                                </a>
                                                <button
                                                    className="btn btn-sm btn-outline-danger rounded-3 px-2 py-1 shadow-sm"
                                                    title="Delete Message"
                                                    disabled={deletingId === msg.id}
                                                    onClick={() => handleDelete(msg.id)}
                                                >
                                                    {deletingId === msg.id ? (
                                                        <span className="spinner-border spinner-border-sm" role="status" />
                                                    ) : (
                                                        '🗑️'
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* ── View Message Modal ─────────────────────────────── */}
            {selectedMessage && (
                <div
                    className="modal show d-block"
                    tabIndex="-1"
                    style={{ background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1060 }}
                    onClick={e => { if (e.target.classList.contains('modal')) setSelectedMessage(null); }}
                >
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
                            <div
                                className="modal-header text-white p-4"
                                style={{ background: 'linear-gradient(135deg, #1e293b 0%, #4f46e5 100%)' }}
                            >
                                <div className="d-flex align-items-center gap-2">
                                    <span className="fs-4">💬</span>
                                    <h5 className="modal-title fw-bold">Message Details</h5>
                                </div>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white shadow-none"
                                    onClick={() => setSelectedMessage(null)}
                                />
                            </div>
                            <div className="modal-body p-4 bg-white">
                                <div className="row g-3 mb-4">
                                    <div className="col-12 col-md-6">
                                        <div className="p-3 bg-light rounded-3 border">
                                            <div className="small text-muted fw-bold text-uppercase mb-1">Sender Name</div>
                                            <div className="fw-bold text-dark fs-6">{selectedMessage.name}</div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="p-3 bg-light rounded-3 border">
                                            <div className="small text-muted fw-bold text-uppercase mb-1">Email Address</div>
                                            <a href={`mailto:${selectedMessage.email}`} className="fw-bold text-primary text-decoration-none fs-6">
                                                {selectedMessage.email}
                                            </a>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="p-3 bg-light rounded-3 border">
                                            <div className="small text-muted fw-bold text-uppercase mb-1">Subject</div>
                                            <div className="fw-bold text-dark">{selectedMessage.subject}</div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="p-3 bg-light rounded-3 border">
                                            <div className="small text-muted fw-bold text-uppercase mb-1">Date & Time</div>
                                            <div className="fw-semibold text-dark small">
                                                {selectedMessage.createdAt
                                                    ? new Date(selectedMessage.createdAt).toLocaleString('en-PK', {
                                                        dateStyle: 'full',
                                                        timeStyle: 'short',
                                                    })
                                                    : 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <label className="form-label small text-muted fw-bold text-uppercase mb-2">Message Content</label>
                                    <div
                                        className="p-4 rounded-3 bg-light border text-dark fs-6 lh-base"
                                        style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', minHeight: '140px' }}
                                    >
                                        {selectedMessage.message}
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer bg-light p-3 d-flex flex-column flex-sm-row justify-content-between gap-2">
                                <button
                                    type="button"
                                    className="btn btn-outline-danger px-3 py-2 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
                                    onClick={() => handleDelete(selectedMessage.id)}
                                >
                                    <span>🗑️</span> Delete Message
                                </button>
                                <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-sm-auto">
                                    <button
                                        type="button"
                                        className="btn btn-secondary px-4 py-2 rounded-3 fw-semibold"
                                        onClick={() => setSelectedMessage(null)}
                                    >
                                        Close
                                    </button>
                                    <a
                                        href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                                        className="btn btn-primary px-4 py-2 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2 text-decoration-none"
                                        style={{ background: 'linear-gradient(135deg, #4f46e5, #3b82f6)', border: 'none' }}
                                    >
                                        <span>✉️</span> Reply via Email
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Messages;