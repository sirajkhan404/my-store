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
    const [showMobileDetail, setShowMobileDetail] = useState(false);

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
            window.toastify(error?.response?.data?.message || 'Failed to fetch messages', 'error');
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
                const next = updated.length > 0 ? updated[0] : null;
                setSelectedMessage(next);
                if (!next) setShowMobileDetail(false);
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

    const selectConversation = (msg) => {
        setSelectedMessage(msg);
        setShowMobileDetail(true);
    };

    return (
        <div className="msg-wrapper" style={{ minHeight: '100%', padding: 'clamp(14px, 3vw, 28px)', fontFamily: "'Inter', sans-serif", background: '#f8fafc' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

                @keyframes msg-fade {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes msg-spin {
                    to { transform: rotate(360deg); }
                }

                .msg-card {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 20px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.04);
                    transition: all 0.25s ease;
                }

                .msg-search-input:focus {
                    outline: none;
                    border-color: #0d9488 !important;
                    box-shadow: 0 0 0 3px rgba(13,148,136,0.15) !important;
                }

                .msg-tab-btn {
                    border: 1px solid #e2e8f0;
                    background: #f8fafc;
                    color: #64748b;
                    font-size: 12px;
                    font-weight: 600;
                    border-radius: 999px;
                    padding: 6px 14px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                }

                .msg-tab-btn.active {
                    background: linear-gradient(135deg, #0d9488, #042f2e);
                    color: #ffffff;
                    border-color: transparent;
                    box-shadow: 0 2px 8px rgba(13,148,136,0.25);
                }

                .msg-tab-btn:hover:not(.active) {
                    background: #f1f5f9;
                    color: #0f172a;
                }

                .msg-item {
                    border-bottom: 1px solid #f1f5f9;
                    padding: 14px 16px;
                    cursor: pointer;
                    transition: all 0.18s ease;
                    background: #ffffff;
                    position: relative;
                }

                .msg-item:hover {
                    background: #f0fdfa !important;
                }

                .msg-item.active {
                    background: #f0fdfa !important;
                }

                .msg-item.active::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 4px;
                    background: linear-gradient(180deg, #0d9488, #042f2e);
                    border-radius: 0 4px 4px 0;
                }

                .msg-custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .msg-custom-scrollbar::-webkit-scrollbar-track {
                    background: #f8fafc;
                    border-radius: 4px;
                }
                .msg-custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 4px;
                }
                .msg-custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }

                .msg-reply-textarea:focus {
                    outline: none;
                    border-color: #0d9488 !important;
                    box-shadow: 0 0 0 3px rgba(13,148,136,0.15) !important;
                }

                .msg-template-btn {
                    border: 1px solid #ccfbf1;
                    background: #f0fdfa;
                    color: #0f766e;
                    font-size: 11.5px;
                    font-weight: 600;
                    border-radius: 8px;
                    padding: 4px 10px;
                    cursor: pointer;
                    transition: all 0.15s ease;
                }
                .msg-template-btn:hover {
                    background: #ccfbf1;
                    color: #042f2e;
                    transform: translateY(-1px);
                }

                .msg-btn-primary {
                    background: linear-gradient(135deg, #0d9488, #042f2e);
                    color: #ffffff;
                    border: none;
                    border-radius: 12px;
                    padding: 10px 20px;
                    font-size: 13.5px;
                    font-weight: 700;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 4px 14px rgba(13,148,136,0.25);
                    transition: all 0.2s ease;
                }
                .msg-btn-primary:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 22px rgba(13,148,136,0.35);
                }
                .msg-btn-primary:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                /* Responsive Split Layout */
                .msg-split-container {
                    display: grid;
                    grid-template-columns: 380px 1fr;
                    gap: 0;
                    background: #ffffff;
                    border-radius: 20px;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.04);
                    overflow: hidden;
                    height: calc(100vh - 270px);
                    min-height: 580px;
                }

                @media (max-width: 991px) {
                    .msg-split-container {
                        grid-template-columns: 1fr;
                        height: auto;
                        min-height: 520px;
                    }
                    .msg-list-pane {
                        display: ${showMobileDetail ? 'none' : 'flex'} !important;
                        height: calc(100vh - 300px);
                        min-height: 480px;
                    }
                    .msg-detail-pane {
                        display: ${showMobileDetail ? 'flex' : 'none'} !important;
                        height: calc(100vh - 280px);
                        min-height: 500px;
                    }
                }
            `}</style>

            {/* ── Top Header Banner ────────────────────────────────────────── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12, animation: 'msg-fade 0.35s ease' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 24 }}>💬</span>
                        <h1 style={{ margin: 0, fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: 800, color: '#0f172a', letterSpacing: -0.5 }}>
                            {isSuperAdmin ? 'Support Messages & Inquiries' : 'My Support Inquiries'}
                        </h1>
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
                        {isSuperAdmin
                            ? 'Manage customer questions, provide instant replies and track support resolutions.'
                            : 'View replies from SuperAdmin or send a new inquiry to get support.'}
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {!isSuperAdmin && (
                        <button className="msg-btn-primary" onClick={() => setNewInquiryModalOpen(true)}>
                            <span>➕</span> New Inquiry
                        </button>
                    )}
                    <button
                        onClick={fetchMessages}
                        disabled={loading}
                        style={{
                            padding: '9px 16px', borderRadius: 12, border: '1.5px solid #ccfbf1',
                            background: '#ffffff', color: '#0d9488', fontSize: 13, fontWeight: 700,
                            cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                            boxShadow: '0 2px 8px rgba(13,148,136,0.08)'
                        }}
                    >
                        <span style={{ display: 'inline-block', animation: loading ? 'msg-spin 0.8s linear infinite' : 'none' }}>🔄</span>
                        Refresh
                    </button>
                </div>
            </div>

            {/* ── Stat Summary Cards ───────────────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 20, animation: 'msg-fade 0.35s ease 0.05s both' }}>
                {[
                    { label: 'Total Messages', value: totalCount, icon: '📩', bg: '#ccfbf1', color: '#0d9488' },
                    { label: 'Pending Reply', value: pendingCount, icon: '⏳', bg: '#fef3c7', color: '#d97706' },
                    { label: 'Replied / Resolved', value: repliedCount, icon: '✅', bg: '#dcfce7', color: '#16a34a' },
                ].map((s, i) => (
                    <div key={i} className="msg-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                            {s.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{s.value}</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginTop: 4 }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Main Split View Box ──────────────────────────────────────── */}
            <div className="msg-split-container" style={{ animation: 'msg-fade 0.35s ease 0.1s both' }}>

                {/* ── Left Pane: Conversation List ─────────────────────────── */}
                <div className="msg-list-pane" style={{ borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: '100%', background: '#ffffff' }}>

                    {/* Search & Filter Header */}
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                        <div style={{ position: 'relative', marginBottom: 10 }}>
                            <input
                                className="msg-search-input"
                                type="text"
                                placeholder="🔍 Search name, subject, email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%', padding: '9px 14px 9px 36px', borderRadius: 10,
                                    border: '1.5px solid #e2e8f0', fontSize: 13, background: '#ffffff',
                                    color: '#0f172a', boxSizing: 'border-box', transition: 'all 0.2s'
                                }}
                            />
                            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#94a3b8' }}>🔍</span>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: 13 }}
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        {/* Filter Tabs */}
                        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
                            {[
                                { id: 'all', label: `All (${totalCount})` },
                                { id: 'pending', label: `⏳ Pending (${pendingCount})` },
                                { id: 'replied', label: `✓ Replied (${repliedCount})` },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    className={`msg-tab-btn ${filterTab === tab.id ? 'active' : ''}`}
                                    onClick={() => setFilterTab(tab.id)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Scrollable List */}
                    <div className="msg-custom-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
                        {loading ? (
                            <div style={{ padding: 48, textAlign: 'center' }}>
                                <div style={{ width: 32, height: 32, border: '3px solid #ccfbf1', borderTop: '3px solid #0d9488', borderRadius: '50%', animation: 'msg-spin 0.8s linear infinite', margin: '0 auto 10px' }} />
                                <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>Loading inbox...</div>
                            </div>
                        ) : filteredMessages.length === 0 ? (
                            <div style={{ padding: '48px 20px', textAlign: 'center' }}>
                                <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: '#334155' }}>No Messages Found</div>
                                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                                    {searchTerm ? 'Try changing your search terms.' : 'Your inbox is currently clear.'}
                                </div>
                            </div>
                        ) : (
                            filteredMessages.map(msg => {
                                const isSelected = selectedMessage?.id === msg.id;
                                const initials = (msg.name || 'User').charAt(0).toUpperCase();

                                return (
                                    <div
                                        key={msg.id}
                                        className={`msg-item ${isSelected ? 'active' : ''}`}
                                        onClick={() => selectConversation(msg)}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                            {/* Avatar Initial */}
                                            <div style={{
                                                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                                                background: isSelected ? 'linear-gradient(135deg, #0d9488, #042f2e)' : '#f1f5f9',
                                                color: isSelected ? '#ffffff' : '#0d9488',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: 14, fontWeight: 700
                                            }}>
                                                {initials}
                                            </div>

                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: 2 }}>
                                                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {isSuperAdmin ? msg.name : msg.subject}
                                                    </div>
                                                    <span style={{ fontSize: 11, color: '#94a3b8', flexShrink: 0, fontWeight: 500 }}>
                                                        {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' }) : ''}
                                                    </span>
                                                </div>

                                                <div style={{ fontSize: 12, fontWeight: 600, color: '#0d9488', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 2 }}>
                                                    {isSuperAdmin ? msg.subject : msg.email}
                                                </div>

                                                <div style={{ fontSize: 12, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 6 }}>
                                                    {msg.message}
                                                </div>

                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                                                    {msg.isReplied ? (
                                                        <span style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: '#dcfce7', color: '#16a34a', border: '1px solid #bbf7d0', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                                                            ✓ Replied
                                                        </span>
                                                    ) : (
                                                        <span style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                                                            ⏳ Pending
                                                        </span>
                                                    )}

                                                    {isSuperAdmin && (
                                                        <span style={{ fontSize: 10.5, color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
                                                            {msg.email}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* ── Right Pane: Active Thread Details & Reply Box ─────────── */}
                <div className="msg-detail-pane" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ffffff' }}>
                    {selectedMessage ? (
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

                            {/* Thread Header */}
                            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                                    {/* Mobile Back Button */}
                                    <button
                                        onClick={() => setShowMobileDetail(false)}
                                        className="d-lg-none"
                                        style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0f172a', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                                    >
                                        ← Back
                                    </button>

                                    <div style={{
                                        width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                                        background: 'linear-gradient(135deg, #0d9488, #042f2e)',
                                        color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 16, fontWeight: 800, boxShadow: '0 2px 8px rgba(13,148,136,0.25)'
                                    }}>
                                        {selectedMessage.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>

                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {selectedMessage.name}
                                        </div>
                                        <div style={{ fontSize: 12, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {selectedMessage.email}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    {selectedMessage.isReplied ? (
                                        <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 999, background: '#dcfce7', color: '#16a34a', border: '1px solid #bbf7d0' }}>
                                            ✓ Replied
                                        </span>
                                    ) : (
                                        <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 999, background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' }}>
                                            ⏳ Pending Reply
                                        </span>
                                    )}

                                    {isSuperAdmin && (
                                        <button
                                            onClick={() => handleDelete(selectedMessage.id)}
                                            disabled={deletingId === selectedMessage.id}
                                            style={{
                                                padding: '6px 12px', borderRadius: 10, border: '1px solid #fecaca',
                                                background: '#fef2f2', color: '#dc2626', fontSize: 12, fontWeight: 700,
                                                cursor: deletingId === selectedMessage.id ? 'not-allowed' : 'pointer',
                                                display: 'flex', alignItems: 'center', gap: 4, transition: 'all 0.15s'
                                            }}
                                            title="Delete Message"
                                        >
                                            {deletingId === selectedMessage.id ? 'Deleting...' : '🗑️ Delete'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Thread Message Scroll Body */}
                            <div className="msg-custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '20px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 16 }}>

                                {/* Subject Card Banner */}
                                <div style={{ background: '#ffffff', borderRadius: 14, padding: '14px 18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                                    <div>
                                        <div style={{ fontSize: 10.5, fontWeight: 700, color: '#0d9488', textTransform: 'uppercase', letterSpacing: 0.8 }}>Subject / Topic</div>
                                        <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginTop: 2 }}>{selectedMessage.subject}</div>
                                    </div>
                                    <div style={{ textAlign: 'right', fontSize: 11.5, color: '#94a3b8' }}>
                                        <div style={{ fontWeight: 600 }}>{selectedMessage.createdAt ? new Date(selectedMessage.createdAt).toLocaleDateString('en-PK', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : ''}</div>
                                        <div>{selectedMessage.createdAt ? new Date(selectedMessage.createdAt).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' }) : ''}</div>
                                    </div>
                                </div>

                                {/* Customer Message Bubble */}
                                <div style={{ maxWidth: '85%', alignSelf: 'flex-start' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, paddingLeft: 4 }}>
                                        <span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>👤 {selectedMessage.name}</span>
                                        <span style={{ fontSize: 10.5, color: '#94a3b8' }}>
                                            {selectedMessage.createdAt ? new Date(selectedMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                        </span>
                                    </div>
                                    <div style={{
                                        background: '#ffffff', borderRadius: '4px 18px 18px 18px', padding: '16px 18px',
                                        border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                                        color: '#0f172a', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word'
                                    }}>
                                        {selectedMessage.message}
                                    </div>
                                </div>

                                {/* SuperAdmin Response Bubble (If Replied) */}
                                {selectedMessage.isReplied && (
                                    <div style={{ maxWidth: '85%', alignSelf: 'flex-end', animation: 'msg-fade 0.3s ease' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, marginBottom: 4, paddingRight: 4 }}>
                                            <span style={{ fontSize: 10.5, fontWeight: 700, padding: '1px 8px', borderRadius: 999, background: '#ccfbf1', color: '#0f766e' }}>
                                                ✓ Sent to User Dashboard
                                            </span>
                                            <span style={{ fontSize: 12, fontWeight: 700, color: '#0d9488' }}>👑 SuperAdmin Response</span>
                                            {selectedMessage.repliedAt && (
                                                <span style={{ fontSize: 10.5, color: '#94a3b8' }}>
                                                    {new Date(selectedMessage.repliedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            )}
                                        </div>
                                        <div style={{
                                            background: 'linear-gradient(135deg, #0d9488 0%, #042f2e 100%)',
                                            borderRadius: '18px 4px 18px 18px', padding: '16px 18px',
                                            boxShadow: '0 4px 16px rgba(13,148,136,0.25)',
                                            color: '#ffffff', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word'
                                        }}>
                                            {selectedMessage.replyText}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Reply Input Box (SuperAdmin) or Customer Status Note */}
                            {isSuperAdmin ? (
                                <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', background: '#ffffff' }}>
                                    <form onSubmit={handleSendReply}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
                                            <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                                {selectedMessage.isReplied ? '✏️ Update / Send New Reply:' : '✉️ Reply to Customer:'}
                                            </label>

                                            {/* Preset Templates */}
                                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                                <button
                                                    type="button"
                                                    className="msg-template-btn"
                                                    onClick={() => setReplyText(`Hi ${selectedMessage.name},\n\nThank you for reaching out to MyStore! We have received your inquiry and are actively handling your request.\n\nBest regards,\nMyStore Support Team`)}
                                                >
                                                    ⚡ Quick Thanks
                                                </button>
                                                <button
                                                    type="button"
                                                    className="msg-template-btn"
                                                    onClick={() => setReplyText(`Hi ${selectedMessage.name},\n\nYour issue regarding "${selectedMessage.subject}" has been successfully resolved. Please let us know if you need any further assistance!\n\nBest regards,\nMyStore Team`)}
                                                >
                                                    ⚡ Resolved
                                                </button>
                                                <button
                                                    type="button"
                                                    className="msg-template-btn"
                                                    onClick={() => setReplyText(`Hi ${selectedMessage.name},\n\nCould you please provide your Order ID or additional details so we can assist you better?\n\nThank you,\nMyStore Support`)}
                                                >
                                                    ⚡ Need Info
                                                </button>
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: 10 }}>
                                            <textarea
                                                className="msg-reply-textarea"
                                                rows={3}
                                                placeholder={`Type your reply to ${selectedMessage.name}... (This reply will appear on their customer dashboard)`}
                                                value={replyText}
                                                onChange={e => setReplyText(e.target.value)}
                                                required
                                                style={{
                                                    width: '100%', padding: '12px 14px', borderRadius: 12,
                                                    border: '1.5px solid #e2e8f0', background: '#f8fafc',
                                                    fontSize: 13.5, color: '#0f172a', boxSizing: 'border-box',
                                                    resize: 'vertical', minHeight: '75px', transition: 'all 0.2s'
                                                }}
                                            />
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10 }}>
                                            <button
                                                type="submit"
                                                className="msg-btn-primary"
                                                disabled={isSendingReply}
                                            >
                                                {isSendingReply ? (
                                                    <>
                                                        <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'msg-spin 0.8s linear infinite', display: 'inline-block' }} />
                                                        Sending...
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>🚀</span> Send Reply
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div style={{ padding: '14px 20px', borderTop: '1px solid #e2e8f0', background: '#f0fdfa', textAlign: 'center', color: '#0f766e', fontSize: 13, fontWeight: 600 }}>
                                    {selectedMessage.isReplied
                                        ? '✓ SuperAdmin has responded to your inquiry above.'
                                        : '⏳ Your inquiry is under review by SuperAdmin. We will respond soon!'}
                                </div>
                            )}

                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 40, textAlign: 'center' }}>
                            <div style={{ width: 70, height: 70, borderRadius: '50%', background: '#ccfbf1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, marginBottom: 14 }}>
                                💬
                            </div>
                            <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Select a Message</div>
                            <div style={{ fontSize: 13, color: '#94a3b8', maxWidth: 300 }}>
                                Click on any conversation from the list to view full thread details and responses.
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Customer New Inquiry Modal ───────────────────────────────── */}
            {newInquiryModalOpen && (
                <div
                    style={{ position: 'fixed', inset: 0, background: 'rgba(4, 47, 46, 0.65)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
                    onClick={e => { if (e.target === e.currentTarget) setNewInquiryModalOpen(false); }}
                >
                    <div style={{ background: '#ffffff', borderRadius: 24, width: '100%', maxWidth: 540, boxShadow: '0 24px 64px rgba(0,0,0,0.2)', overflow: 'hidden', animation: 'msg-fade 0.25s ease' }}>

                        {/* Modal Header */}
                        <div style={{ padding: '20px 24px', background: 'linear-gradient(135deg, #0d9488, #042f2e)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ fontSize: 22 }}>➕</span>
                                <div>
                                    <div style={{ fontSize: 17, fontWeight: 800 }}>New Support Inquiry</div>
                                    <div style={{ fontSize: 12, color: '#5eead4', marginTop: 1 }}>Send a message directly to store support</div>
                                </div>
                            </div>
                            <button
                                onClick={() => setNewInquiryModalOpen(false)}
                                style={{ border: 'none', background: 'rgba(255,255,255,0.15)', color: '#ffffff', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleSendInquiry}>
                            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>
                                        Subject / Topic <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Order delivery status, Product warranty..."
                                        value={inquiryData.subject}
                                        onChange={e => setInquiryData(s => ({ ...s, subject: e.target.value }))}
                                        required
                                        style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 14, color: '#0f172a', background: '#f8fafc', boxSizing: 'border-box' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>
                                        Your Message <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <textarea
                                        rows={5}
                                        placeholder="Please describe your question or issue in detail..."
                                        value={inquiryData.message}
                                        onChange={e => setInquiryData(s => ({ ...s, message: e.target.value }))}
                                        required
                                        style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 14, color: '#0f172a', background: '#f8fafc', boxSizing: 'border-box', resize: 'vertical', minHeight: '120px' }}
                                    />
                                </div>
                            </div>

                            <div style={{ padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                                <button
                                    type="button"
                                    onClick={() => setNewInquiryModalOpen(false)}
                                    disabled={isSendingInquiry}
                                    style={{ padding: '10px 18px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#ffffff', color: '#64748b', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="msg-btn-primary"
                                    disabled={isSendingInquiry}
                                >
                                    {isSendingInquiry ? (
                                        <>
                                            <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'msg-spin 0.8s linear infinite', display: 'inline-block' }} />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <span>🚀</span> Submit Inquiry
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Messages;