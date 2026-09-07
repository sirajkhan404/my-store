import axios from 'axios'
import React, { useEffect, useState } from 'react'

const ROLE_CONFIG = {
    superAdmin: { label: 'Super Admin', icon: '👑', bg: '#1a1a2e', color: '#fbbf24', border: '#f59e0b' },
    customer:   { label: 'Customer',    icon: '🛍',  bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
}
const STATUS_CONFIG = {
    active:   { label: 'Active',   dot: '#22c55e', bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
    inactive: { label: 'Inactive', dot: '#ef4444', bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
}

const Users = () => {
    const [documents, setDocuments] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [filterRole, setFilterRole] = useState('all')

    // Modal state
    const [modalOpen, setModalOpen] = useState(false)
    const [userToEdit, setUserToEdit] = useState(null)
    const [editForm, setEditForm] = useState({ name: '', role: '', status: '' })
    const [isProcessing, setIsProcessing] = useState(false)

    // Delete confirm
    const [confirmDelete, setConfirmDelete] = useState(null)

    const token = () => localStorage.getItem('jwt')
    const headers = () => ({ Authorization: `Bearer ${token()}` })

    const getDocuments = () => {
        setIsLoading(true)
        axios.get(`${window.api}/api/auth/users`, { headers: headers() })
            .then(res => { if (!res.data.isError) setDocuments(res.data.users) })
            .catch(() => window.toastify('Something went wrong', 'error'))
            .finally(() => setIsLoading(false))
    }

    useEffect(() => { getDocuments() }, [])

    const handleEdit = (user) => {
        setUserToEdit(user)
        setEditForm({ name: user.fullName || '', role: user.role || '', status: user.status || '' })
        setModalOpen(true)
    }

    const handleUpdate = () => {
        if (!editForm.name.trim()) return window.toastify('Name is required', 'warning')
        setIsProcessing(true)
        axios.patch(`${window.api}/api/auth/update-user`,
            { name: editForm.name, role: editForm.role, status: editForm.status, uid: userToEdit.uid },
            { headers: headers() }
        ).then(res => {
            if (res.data.isError) return window.toastify(res.data.message, 'error')
            window.toastify('User updated successfully', 'success')
            setDocuments(prev => prev.map(d => d.uid === userToEdit.uid ? res.data.updatedUser : d))
            setModalOpen(false)
        }).catch(() => window.toastify('Something went wrong', 'error'))
        .finally(() => setIsProcessing(false))
    }

    const handleDelete = (user) => {
        setIsProcessing(true)
        axios.delete(`${window.api}/api/auth/delete-user-by-superAdmin/${user.uid}`, { headers: headers() })
            .then(res => {
                if (res.data.isError) return window.toastify(res.data.message, 'error')
                window.toastify('User deleted successfully', 'success')
                setDocuments(prev => prev.filter(d => d.uid !== user.uid))
                setConfirmDelete(null)
            }).catch(() => window.toastify('Something went wrong', 'error'))
            .finally(() => setIsProcessing(false))
    }

    const filtered = documents.filter(u => {
        const matchSearch = !search ||
            (u.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
            (u.email || '').toLowerCase().includes(search.toLowerCase())
        const matchRole = filterRole === 'all' || u.role === filterRole
        return matchSearch && matchRole
    })

    const admins = documents.filter(u => u.role === 'superAdmin').length
    const customers = documents.filter(u => u.role === 'customer').length
    const active = documents.filter(u => u.status === 'active').length

    return (
        <div style={{ padding: '28px 24px', fontFamily: "'Inter', sans-serif", minHeight: '100%', background: '#f8fafc' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                @keyframes usr-in { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
                @keyframes usr-spin { to{transform:rotate(360deg)} }
                @keyframes pulse-dot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.6);opacity:0.5} }
                .usr-row { transition: background 0.18s, box-shadow 0.18s; }
                .usr-row:hover { background: #f1f5f9 !important; }
                .usr-icon-btn { transition: all 0.2s; border:none; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; border-radius:10px; }
                .usr-icon-btn:hover { transform:translateY(-2px); }
                .usr-search:focus { outline:none; border-color:#6366f1 !important; box-shadow:0 0 0 3px rgba(99,102,241,0.15) !important; }
                .usr-select:focus { outline:none; border-color:#6366f1 !important; box-shadow:0 0 0 3px rgba(99,102,241,0.15) !important; }
                .usr-modal-input:focus { outline:none; border-color:#6366f1 !important; box-shadow:0 0 0 3px rgba(99,102,241,0.15) !important; }
                .usr-modal-select:focus { outline:none; border-color:#6366f1 !important; box-shadow:0 0 0 3px rgba(99,102,241,0.15) !important; }
                .usr-save-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 24px rgba(99,102,241,0.35) !important; }
                .usr-save-btn { transition:all 0.2s; }
            `}</style>

            {/* ── Header ── */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:12, animation:'usr-in 0.4s ease' }}>
                <div>
                    <h1 style={{ margin:0, fontSize:24, fontWeight:800, color:'#0f172a', letterSpacing:-0.5 }}>👥 Users Management</h1>
                    <p style={{ margin:'4px 0 0', fontSize:13, color:'#94a3b8' }}>Manage all registered users and their roles</p>
                </div>
                <div style={{ fontSize:13, color:'#64748b', background:'#fff', border:'1px solid #e2e8f0', borderRadius:10, padding:'7px 14px', fontWeight:500 }}>
                    {documents.length} total users
                </div>
            </div>

            {/* ── Stat Cards ── */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:16, marginBottom:24, animation:'usr-in 0.4s ease 0.05s both' }}>
                {[
                    { label:'Total Users',  value:documents.length, icon:'👥', color:'#6366f1', bg:'#ede9fe' },
                    { label:'Super Admins', value:admins,            icon:'👑', color:'#d97706', bg:'#fef3c7' },
                    { label:'Customers',    value:customers,         icon:'🛍', color:'#1d4ed8', bg:'#dbeafe' },
                    { label:'Active',       value:active,            icon:'🟢', color:'#16a34a', bg:'#dcfce7' },
                ].map((s,i) => (
                    <div key={i} style={{ background:'#fff', borderRadius:16, padding:'18px 20px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', display:'flex', alignItems:'center', gap:14 }}>
                        <div style={{ width:44, height:44, borderRadius:12, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
                            {s.icon}
                        </div>
                        <div>
                            <div style={{ fontSize:22, fontWeight:800, color:'#0f172a', lineHeight:1 }}>{s.value}</div>
                            <div style={{ fontSize:11, color:'#94a3b8', fontWeight:600, marginTop:3 }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Filters ── */}
            <div style={{ background:'#fff', borderRadius:16, padding:'16px 20px', marginBottom:20, boxShadow:'0 2px 12px rgba(0,0,0,0.05)', display:'flex', gap:12, flexWrap:'wrap', alignItems:'center', animation:'usr-in 0.4s ease 0.1s both' }}>
                <input
                    className="usr-search"
                    type="text"
                    placeholder="🔍  Search by name or email…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ flex:1, minWidth:200, padding:'10px 14px', borderRadius:10, border:'1.5px solid #e2e8f0', fontSize:13, background:'#f8fafc', color:'#0f172a', transition:'all 0.2s' }}
                />
                <select
                    className="usr-select"
                    value={filterRole}
                    onChange={e => setFilterRole(e.target.value)}
                    style={{ padding:'10px 14px', borderRadius:10, border:'1.5px solid #e2e8f0', fontSize:13, background:'#f8fafc', color:'#0f172a', cursor:'pointer', transition:'all 0.2s' }}
                >
                    <option value="all">All Roles</option>
                    <option value="superAdmin">Super Admin</option>
                    <option value="customer">Customer</option>
                </select>
                {(search || filterRole !== 'all') && (
                    <button onClick={() => { setSearch(''); setFilterRole('all') }}
                        style={{ padding:'10px 16px', borderRadius:10, border:'1.5px solid #e2e8f0', fontSize:12, background:'#f1f5f9', color:'#64748b', cursor:'pointer', fontWeight:600 }}>
                        ✕ Clear
                    </button>
                )}
                <div style={{ marginLeft:'auto', fontSize:12, color:'#94a3b8', fontWeight:500 }}>
                    Showing {filtered.length} of {documents.length}
                </div>
            </div>

            {/* ── Table ── */}
            <div style={{ background:'#fff', borderRadius:20, boxShadow:'0 4px 20px rgba(0,0,0,0.07)', overflow:'hidden', animation:'usr-in 0.4s ease 0.15s both' }}>

                {/* Table Header */}
                <div style={{ display:'grid', gridTemplateColumns:'2fr 2fr 3fr 1.5fr 1.5fr 1fr', gap:0, background:'#1e293b', padding:'14px 24px' }}>
                    {['Name','UID','Email','Role','Status','Actions'].map((h,i) => (
                        <div key={i} style={{ fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:1 }}>{h}</div>
                    ))}
                </div>

                {/* Loading */}
                {isLoading && (
                    <div style={{ padding:48, textAlign:'center' }}>
                        <div style={{ width:36, height:36, border:'3px solid #e2e8f0', borderTop:'3px solid #6366f1', borderRadius:'50%', animation:'usr-spin 0.8s linear infinite', margin:'0 auto 12px' }} />
                        <p style={{ color:'#94a3b8', fontSize:13 }}>Loading users…</p>
                    </div>
                )}

                {/* Empty */}
                {!isLoading && filtered.length === 0 && (
                    <div style={{ padding:56, textAlign:'center' }}>
                        <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
                        <div style={{ fontSize:15, fontWeight:600, color:'#475569' }}>No users found</div>
                        <div style={{ fontSize:13, color:'#94a3b8', marginTop:4 }}>Try adjusting your search or filter</div>
                    </div>
                )}

                {/* Rows */}
                {!isLoading && filtered.map((user, i) => {
                    const role = ROLE_CONFIG[user.role] || ROLE_CONFIG.customer
                    const status = STATUS_CONFIG[user.status] || STATUS_CONFIG.inactive
                    return (
                        <div key={user.uid} className="usr-row" style={{
                            display:'grid', gridTemplateColumns:'2fr 2fr 3fr 1.5fr 1.5fr 1fr',
                            gap:0, padding:'16px 24px', alignItems:'center',
                            borderBottom: i < filtered.length - 1 ? '1px solid #f1f5f9' : 'none',
                            background:'#fff'
                        }}>
                            {/* Name + Avatar */}
                            <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:0 }}>
                                <div style={{
                                    width:38, height:38, borderRadius:12, flexShrink:0, overflow:'hidden',
                                    background: user.profilePicture ? '#fff' : `linear-gradient(135deg, ${role.color}33, ${role.color}66)`,
                                    display:'flex', alignItems:'center', justifyContent:'center',
                                    border:`1.5px solid ${role.border}`, fontSize:15, fontWeight:700, color:role.color
                                }}>
                                    {user.profilePicture
                                        ? <img src={user.profilePicture} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                                        : (user.fullName || 'U').charAt(0).toUpperCase()
                                    }
                                </div>
                                <div style={{ minWidth:0 }}>
                                    <div style={{ fontSize:13, fontWeight:700, color:'#0f172a', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                                        {user.fullName || '—'}
                                    </div>
                                </div>
                            </div>

                            {/* UID */}
                            <div style={{ fontSize:11, color:'#94a3b8', fontFamily:'monospace', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                                {user.uid}
                            </div>

                            {/* Email */}
                            <div style={{ fontSize:13, color:'#475569', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                                {user.email}
                            </div>

                            {/* Role badge */}
                            <div>
                                <span style={{
                                    display:'inline-flex', alignItems:'center', gap:5, fontSize:11,
                                    fontWeight:700, padding:'4px 12px', borderRadius:999,
                                    background:role.bg, color:role.color,
                                    border:`1px solid ${role.border}`, textTransform:'capitalize',
                                    whiteSpace:'nowrap'
                                }}>
                                    {role.icon} {role.label}
                                </span>
                            </div>

                            {/* Status badge */}
                            <div>
                                <span style={{
                                    display:'inline-flex', alignItems:'center', gap:6, fontSize:11,
                                    fontWeight:700, padding:'4px 12px', borderRadius:999,
                                    background:status.bg, color:status.color,
                                    border:`1px solid ${status.border}`,
                                }}>
                                    <span style={{ width:6, height:6, borderRadius:'50%', background:status.dot, animation: user.status==='active' ? 'pulse-dot 2s infinite' : 'none', display:'inline-block' }} />
                                    {status.label}
                                </span>
                            </div>

                            {/* Actions */}
                            <div style={{ display:'flex', gap:8 }}>
                                <button className="usr-icon-btn" onClick={() => handleEdit(user)}
                                    style={{ width:34, height:34, background:'#ede9fe', color:'#7c3aed', fontSize:14 }}
                                    title="Edit user">
                                    ✏️
                                </button>
                                <button className="usr-icon-btn" onClick={() => setConfirmDelete(user)}
                                    style={{ width:34, height:34, background:'#fef2f2', color:'#dc2626', fontSize:14 }}
                                    title="Delete user">
                                    🗑️
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* ── Edit Modal ── */}
            {modalOpen && userToEdit && (
                <div style={{ position:'fixed', inset:0, background:'rgba(15,12,41,0.6)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20, backdropFilter:'blur(4px)' }}
                    onClick={e => { if (e.target === e.currentTarget) setModalOpen(false) }}>
                    <div style={{ background:'#fff', borderRadius:24, padding:32, width:'100%', maxWidth:440, boxShadow:'0 24px 64px rgba(0,0,0,0.18)', animation:'usr-in 0.3s ease' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:24 }}>
                            <div style={{ width:48, height:48, borderRadius:14, background:'#ede9fe', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>✏️</div>
                            <div>
                                <div style={{ fontSize:16, fontWeight:800, color:'#0f172a' }}>Edit User</div>
                                <div style={{ fontSize:12, color:'#94a3b8', marginTop:2 }}>{userToEdit.email}</div>
                            </div>
                        </div>

                        {/* Name */}
                        <div style={{ marginBottom:16 }}>
                            <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:0.8, marginBottom:7 }}>Full Name</label>
                            <input className="usr-modal-input"
                                value={editForm.name}
                                onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                                placeholder="Enter full name"
                                style={{ width:'100%', padding:'11px 14px', borderRadius:10, border:'1.5px solid #e2e8f0', fontSize:14, color:'#0f172a', background:'#f8fafc', boxSizing:'border-box', transition:'all 0.2s' }}
                            />
                        </div>

                        {/* Role */}
                        <div style={{ marginBottom:16 }}>
                            <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:0.8, marginBottom:7 }}>Role</label>
                            <select className="usr-modal-select"
                                value={editForm.role}
                                onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}
                                style={{ width:'100%', padding:'11px 14px', borderRadius:10, border:'1.5px solid #e2e8f0', fontSize:14, color:'#0f172a', background:'#f8fafc', cursor:'pointer', transition:'all 0.2s' }}>
                                <option value="customer">Customer</option>
                                <option value="superAdmin">Super Admin</option>
                            </select>
                        </div>

                        {/* Status */}
                        <div style={{ marginBottom:28 }}>
                            <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:0.8, marginBottom:7 }}>Status</label>
                            <select className="usr-modal-select"
                                value={editForm.status}
                                onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                                style={{ width:'100%', padding:'11px 14px', borderRadius:10, border:'1.5px solid #e2e8f0', fontSize:14, color:'#0f172a', background:'#f8fafc', cursor:'pointer', transition:'all 0.2s' }}>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        <div style={{ display:'flex', gap:10 }}>
                            <button onClick={() => setModalOpen(false)}
                                style={{ flex:1, padding:'12px', borderRadius:12, border:'1.5px solid #e2e8f0', background:'#f8fafc', color:'#64748b', fontSize:14, fontWeight:600, cursor:'pointer' }}>
                                Cancel
                            </button>
                            <button className="usr-save-btn" onClick={handleUpdate} disabled={isProcessing}
                                style={{ flex:2, padding:'12px', borderRadius:12, border:'none', background: isProcessing ? '#c7d2fe' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', fontSize:14, fontWeight:700, cursor: isProcessing ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow:'0 4px 14px rgba(99,102,241,0.3)' }}>
                                {isProcessing
                                    ? <><span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.4)', borderTop:'2px solid #fff', borderRadius:'50%', animation:'usr-spin 0.8s linear infinite', display:'inline-block' }} />Saving...</>
                                    : '💾  Save Changes'
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Delete Confirm Modal ── */}
            {confirmDelete && (
                <div style={{ position:'fixed', inset:0, background:'rgba(15,12,41,0.6)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20, backdropFilter:'blur(4px)' }}
                    onClick={e => { if (e.target === e.currentTarget) setConfirmDelete(null) }}>
                    <div style={{ background:'#fff', borderRadius:24, padding:32, width:'100%', maxWidth:400, boxShadow:'0 24px 64px rgba(0,0,0,0.18)', textAlign:'center', animation:'usr-in 0.3s ease' }}>
                        <div style={{ width:64, height:64, borderRadius:'50%', background:'#fef2f2', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, margin:'0 auto 16px' }}>🗑️</div>
                        <div style={{ fontSize:18, fontWeight:800, color:'#0f172a', marginBottom:8 }}>Delete User?</div>
                        <div style={{ fontSize:13, color:'#64748b', marginBottom:24, lineHeight:1.6 }}>
                            Are you sure you want to delete <strong>"{confirmDelete.fullName}"</strong>?<br />This action cannot be undone.
                        </div>
                        <div style={{ display:'flex', gap:10 }}>
                            <button onClick={() => setConfirmDelete(null)}
                                style={{ flex:1, padding:'12px', borderRadius:12, border:'1.5px solid #e2e8f0', background:'#f8fafc', color:'#64748b', fontSize:14, fontWeight:600, cursor:'pointer' }}>
                                Cancel
                            </button>
                            <button onClick={() => handleDelete(confirmDelete)} disabled={isProcessing}
                                style={{ flex:1, padding:'12px', borderRadius:12, border:'none', background: isProcessing ? '#fca5a5' : 'linear-gradient(135deg,#ef4444,#dc2626)', color:'#fff', fontSize:14, fontWeight:700, cursor: isProcessing ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow:'0 4px 14px rgba(239,68,68,0.3)', transition:'all 0.2s' }}>
                                {isProcessing
                                    ? <><span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.4)', borderTop:'2px solid #fff', borderRadius:'50%', animation:'usr-spin 0.8s linear infinite', display:'inline-block' }} />Deleting...</>
                                    : '🗑️  Delete'
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Users
