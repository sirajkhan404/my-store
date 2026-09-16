import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const categories = ["Electronics", "Clothing", "Footwear", "Books", "Home & Kitchen", "Sports", "Toys", "Beauty", "Grocery", "Fast Food", "Other"]

const stockBadge = (stock) => {
    if (stock <= 0)  return { label: 'Out of Stock', bg: '#fef2f2', color: '#dc2626', border: '#fecaca' }
    if (stock <= 5)  return { label: `${stock} Low`,  bg: '#fffbeb', color: '#d97706', border: '#fde68a' }
    return              { label: `${stock} In Stock`, bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' }
}

const CAT_COLORS = ['#6366f1','#ec4899','#f59e0b','#10b981','#06b6d4','#8b5cf6','#ef4444','#0ea5e9','#84cc16','#f97316','#6b7280']
const catColor = (cat) => CAT_COLORS[Math.abs([...(cat||'')].reduce((a,c) => a + c.charCodeAt(0), 0)) % CAT_COLORS.length]

const All = () => {
    const [isModalOpen, setIsModalOpen]     = useState(false)
    const [isProcessing, setIsProcessing]   = useState(false)
    const [productToEdit, setProductToEdit] = useState(null)
    const [deletingId, setDeletingId]       = useState(null)
    const [confirmDelete, setConfirmDelete] = useState(null)
    const [documents, setDocuments]         = useState([])
    const [loading, setLoading]             = useState(true)
    const [previewImageURL, setPreviewImageURL] = useState('')
    const [selectedFile, setSelectedFile]   = useState(null)
    const [searchQuery, setSearchQuery]     = useState('')
    const [filterCat, setFilterCat]         = useState('all')
    const [editForm, setEditForm]           = useState({ name:'', price:'', stock:'', category:'', description:'', imageURL:'' })
    const [formErrors, setFormErrors]       = useState({})

    const fileInputRef = useRef(null)
    const navigate = useNavigate()

    // ── Fetch
    const getDocuments = () => {
        setLoading(true)
        axios.get(window.api + '/api/products/all', { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } })
            .then(res => { if (res.status === 200) setDocuments(res.data.products) })
            .catch(() => window.toastify('Failed to load products', 'error'))
            .finally(() => setLoading(false))
    }
    useEffect(() => { getDocuments() }, [])

    // ── Delete
    const handleDelete = (product) => {
        setDeletingId(product.id)
        axios.delete(window.api + '/api/products/delete/' + product.id, { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } })
            .then(res => {
                if (res.status === 200) {
                    window.toastify(res.data.message, 'success')
                    setDocuments(prev => prev.filter(d => d.id !== product.id))
                    setConfirmDelete(null)
                }
            })
            .catch(err => window.toastify(err.response?.data?.message || 'Error', 'error'))
            .finally(() => setDeletingId(null))
    }

    // ── Edit modal open
    const handleEdit = (product) => {
        setProductToEdit(product)
        setPreviewImageURL(product.imageURL || '')
        setSelectedFile(null)
        setFormErrors({})
        setEditForm({ name: product.name||'', price: product.price||'', stock: product.stock||'', category: product.category||'', description: product.description||'', imageURL: product.imageURL||'' })
        setIsModalOpen(true)
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        if (!file.type.startsWith('image/')) return window.toastify('Please select a valid image file', 'error')
        setSelectedFile(file)
        setPreviewImageURL(URL.createObjectURL(file))
        setEditForm(f => ({ ...f, imageURL: '' }))
    }

    const resetModal = () => {
        setIsModalOpen(false); setPreviewImageURL(''); setSelectedFile(null); setFormErrors({})
        setEditForm({ name:'', price:'', stock:'', category:'', description:'', imageURL:'' })
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    // ── Validate
    const validate = () => {
        const e = {}
        if (!editForm.name || editForm.name.trim().length < 3) e.name = 'Min 3 characters required'
        if (!editForm.price || Number(editForm.price) <= 0)    e.price = 'Enter a valid price'
        if (editForm.stock === '' || Number(editForm.stock) < 0) e.stock = 'Enter a valid stock'
        if (!editForm.category)                                e.category = 'Select a category'
        if (!editForm.description || editForm.description.trim().length < 10) e.description = 'Min 10 characters required'
        if (!selectedFile && (!editForm.imageURL || !editForm.imageURL.trim())) e.imageURL = 'Select an image or enter URL'
        return e
    }

    // ── Update
    const handleUpdate = () => {
        const errors = validate()
        if (Object.keys(errors).length > 0) { setFormErrors(errors); return }
        setIsProcessing(true)
        const headers = { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
        const onSuccess = (res) => {
            window.toastify(res.data.message || 'Product updated', 'success')
            setDocuments(prev => prev.map(d => d.id === productToEdit.id ? res.data.updatedProduct : d))
            resetModal()
        }
        const onError = (err) => window.toastify(err.response?.data?.message || 'Error', 'error')
        const onDone  = () => setIsProcessing(false)

        if (selectedFile) {
            const fd = new FormData()
            fd.append('name', editForm.name.trim()); fd.append('price', editForm.price)
            fd.append('stock', editForm.stock); fd.append('category', editForm.category)
            fd.append('description', editForm.description.trim()); fd.append('image', selectedFile)
            axios.patch(`${window.api}/api/products/update/${productToEdit.id}`, fd, { headers }).then(onSuccess).catch(onError).finally(onDone)
        } else {
            axios.patch(`${window.api}/api/products/update/${productToEdit.id}`,
                { name: editForm.name.trim(), price: editForm.price, stock: editForm.stock, category: editForm.category, description: editForm.description.trim(), imageURL: editForm.imageURL.trim() },
                { headers }
            ).then(onSuccess).catch(onError).finally(onDone)
        }
    }

    // ── Filter
    const filtered = documents.filter(p => {
        const q = searchQuery.toLowerCase()
        const matchSearch = !q || p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q)
        const matchCat = filterCat === 'all' || p.category === filterCat
        return matchSearch && matchCat
    })

    const stats = {
        total: documents.length,
        inStock: documents.filter(p => p.stock > 0).length,
        lowStock: documents.filter(p => p.stock > 0 && p.stock <= 5).length,
        outOfStock: documents.filter(p => p.stock <= 0).length,
    }

    const inputStyle = (err) => ({
        width: '100%', padding: '11px 14px', borderRadius: 10, boxSizing: 'border-box',
        border: `1.5px solid ${err ? '#fca5a5' : '#e2e8f0'}`,
        background: err ? '#fff5f5' : '#f8fafc', fontSize: 14, color: '#0f172a',
        transition: 'all 0.2s'
    })

    return (
        <div style={{ padding: 'clamp(14px, 3vw, 28px)', fontFamily: "'Inter', sans-serif", minHeight: '100%', background: '#f8fafc' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                @keyframes pr-in   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
                @keyframes pr-spin { to{transform:rotate(360deg)} }
                .pr-row  { transition: background 0.15s, box-shadow 0.15s; }
                .pr-row:hover { background: #f0fdfa !important; box-shadow: 0 2px 12px rgba(13,148,136,0.07) !important; }
                .pr-btn  { border:none; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; border-radius:9px; transition:all 0.2s; }
                .pr-btn:hover:not(:disabled) { transform:translateY(-2px); }
                .pr-btn:disabled { opacity:.45; cursor:not-allowed; }
                .pr-search:focus { outline:none; border-color:#0d9488 !important; box-shadow:0 0 0 3px rgba(13,148,136,0.15) !important; }
                .pr-sel:focus { outline:none; border-color:#0d9488 !important; box-shadow:0 0 0 3px rgba(13,148,136,0.15) !important; }
                .pr-input:focus { outline:none; border-color:#0d9488 !important; box-shadow:0 0 0 3px rgba(13,148,136,0.15) !important; }
                .pr-add:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(13,148,136,.35) !important; }
                .pr-add { transition:all 0.2s; }
                .pr-save:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 24px rgba(13,148,136,.35) !important; }
                .pr-save { transition:all 0.2s; }

                /* Scrollbar for smooth horizontal table scroll */
                .pr-table-scroll::-webkit-scrollbar { height: 6px; }
                .pr-table-scroll::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
                .pr-table-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
                .pr-table-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

                @media (max-width: 576px) {
                    .pr-modal-grid { grid-template-columns: 1fr !important; }
                    .pr-header-btn { width: 100% !important; justify-content: center !important; }
                    .pr-filter-box { flex-direction: column !important; align-items: stretch !important; }
                    .pr-filter-info { margin-left: 0 !important; text-align: left !important; }
                }
            `}</style>

            {/* ── Header ── */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12, animation:'pr-in 0.4s ease' }}>
                <div>
                    <h1 style={{ margin:0, fontSize:'clamp(20px, 4vw, 26px)', fontWeight:800, color:'#0f172a', letterSpacing:-0.5 }}>🛍️ Products</h1>
                    <p style={{ margin:'4px 0 0', fontSize:13, color:'#94a3b8' }}>{documents.length} products in your store</p>
                </div>
                <button className="pr-add pr-header-btn" onClick={() => navigate('/dashboard/products/add')}
                    style={{ padding:'10px 22px', borderRadius:12, border:'none', background:'linear-gradient(135deg,#0d9488,#042f2e)', color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:8, boxShadow:'0 4px 14px rgba(13,148,136,0.3)' }}>
                    ➕ Add Product
                </button>
            </div>

            {/* ── Stat Cards ── */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:14, marginBottom:24, animation:'pr-in 0.4s ease 0.05s both' }}>
                {[
                    { label:'Total Products', value:stats.total,      icon:'📦', color:'#0d9488', bg:'#ccfbf1' },
                    { label:'In Stock',       value:stats.inStock,    icon:'✅', color:'#16a34a', bg:'#dcfce7' },
                    { label:'Low Stock ≤5',   value:stats.lowStock,   icon:'⚠️', color:'#d97706', bg:'#fffbeb' },
                    { label:'Out of Stock',   value:stats.outOfStock, icon:'❌', color:'#dc2626', bg:'#fef2f2' },
                ].map((s,i) => (
                    <div key={i} style={{ background:'#fff', borderRadius:16, padding:'14px 16px', boxShadow:'0 2px 10px rgba(0,0,0,0.05)', display:'flex', alignItems:'center', gap:12 }}>
                        <div style={{ width:40, height:40, borderRadius:12, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{s.icon}</div>
                        <div>
                            <div style={{ fontSize:20, fontWeight:800, color:'#0f172a', lineHeight:1 }}>{s.value}</div>
                            <div style={{ fontSize:11, color:'#94a3b8', fontWeight:600, marginTop:3 }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Filters ── */}
            <div className="pr-filter-box" style={{ background:'#fff', borderRadius:16, padding:'14px 18px', marginBottom:18, boxShadow:'0 2px 10px rgba(0,0,0,0.05)', display:'flex', gap:10, flexWrap:'wrap', alignItems:'center', animation:'pr-in 0.4s ease 0.1s both' }}>
                <input className="pr-search" type="text" placeholder="🔍 Search by name or category…"
                    value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    style={{ flex:1, minWidth:180, padding:'10px 14px', borderRadius:10, border:'1.5px solid #e2e8f0', fontSize:13, background:'#f8fafc', color:'#0f172a', transition:'all 0.2s' }}
                />
                <select className="pr-sel" value={filterCat} onChange={e => setFilterCat(e.target.value)}
                    style={{ padding:'10px 14px', borderRadius:10, border:'1.5px solid #e2e8f0', fontSize:13, background:'#f8fafc', color:'#0f172a', cursor:'pointer', transition:'all 0.2s' }}>
                    <option value="all">All Categories</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {(searchQuery || filterCat !== 'all') && (
                    <button onClick={() => { setSearchQuery(''); setFilterCat('all') }}
                        style={{ padding:'10px 14px', borderRadius:10, border:'1.5px solid #e2e8f0', fontSize:12, background:'#f1f5f9', color:'#64748b', cursor:'pointer', fontWeight:600 }}>
                        ✕ Clear
                    </button>
                )}
                <div className="pr-filter-info" style={{ marginLeft:'auto', fontSize:12, color:'#94a3b8', fontWeight:500 }}>{filtered.length} of {documents.length} products</div>
            </div>

            {/* ── Products Table ── */}
            <div style={{ background:'#fff', borderRadius:20, boxShadow:'0 4px 20px rgba(0,0,0,0.07)', overflow:'hidden', animation:'pr-in 0.4s ease 0.15s both' }}>
                <div className="pr-table-scroll" style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <div style={{ minWidth: '880px' }}>
                        {/* Header */}
                        <div style={{ display:'grid', gridTemplateColumns:'40px 60px 2.2fr 1.2fr 1.3fr 1.4fr 2fr 80px', gap:10, background:'#042f2e', padding:'14px 20px', alignItems:'center' }}>
                            {['#','','Name','Price','Stock','Category','Description','Actions'].map((h,i) => (
                                <div key={i} style={{ fontSize:11, fontWeight:700, color:'#5eead4', textTransform:'uppercase', letterSpacing:0.8 }}>{h}</div>
                            ))}
                        </div>

                        {/* Loading */}
                        {loading && (
                            <div style={{ padding:56, textAlign:'center' }}>
                                <div style={{ width:36, height:36, border:'3px solid #e2e8f0', borderTop:'3px solid #0d9488', borderRadius:'50%', animation:'pr-spin 0.8s linear infinite', margin:'0 auto 14px' }} />
                                <p style={{ color:'#94a3b8', fontSize:13, margin:0 }}>Loading products…</p>
                            </div>
                        )}

                        {/* Empty */}
                        {!loading && filtered.length === 0 && (
                            <div style={{ padding:56, textAlign:'center' }}>
                                <div style={{ fontSize:48, marginBottom:12 }}>📭</div>
                                <div style={{ fontSize:15, fontWeight:700, color:'#475569' }}>No products found</div>
                                <div style={{ fontSize:13, color:'#94a3b8', marginTop:4 }}>Try adjusting your search or filter</div>
                            </div>
                        )}

                        {/* Rows */}
                        {!loading && filtered.map((product, idx) => {
                            const sb = stockBadge(product.stock)
                            const cc = catColor(product.category || 'x')
                            return (
                                <div key={product.id} className="pr-row" style={{ display:'grid', gridTemplateColumns:'40px 60px 2.2fr 1.2fr 1.3fr 1.4fr 2fr 80px', gap:10, padding:'14px 20px', alignItems:'center', borderBottom: idx < filtered.length-1 ? '1px solid #f1f5f9' : 'none', background:'#fff' }}>

                                    {/* # */}
                                    <div style={{ fontSize:12, color:'#cbd5e1', fontWeight:700 }}>{idx+1}</div>

                                    {/* Image */}
                                    <div>
                                        <div style={{ width:44, height:44, borderRadius:10, overflow:'hidden', border:'1.5px solid #f1f5f9', background:'#f8fafc', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                            {product.imageURL
                                                ? <img src={product.imageURL} alt={product.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e => e.target.style.display='none'} />
                                                : <span style={{ fontSize:20 }}>📦</span>
                                            }
                                        </div>
                                    </div>

                                    {/* Name */}
                                    <div style={{ minWidth:0, paddingRight:8 }}>
                                        <div style={{ fontSize:13, fontWeight:700, color:'#0f172a', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{product.name}</div>
                                        <div style={{ fontSize:11, color:'#94a3b8', marginTop:2, fontFamily:'monospace' }}>#{product.id?.slice(-6)}</div>
                                    </div>

                                    {/* Price */}
                                    <div style={{ fontSize:14, fontWeight:800, color:'#0d9488' }}>
                                        Rs. {Number(product.price).toLocaleString()}
                                    </div>

                                    {/* Stock */}
                                    <div>
                                        <span style={{ fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:999, background:sb.bg, color:sb.color, border:`1px solid ${sb.border}`, display:'inline-block' }}>
                                            {sb.label}
                                        </span>
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <span style={{ fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:999, background:`${cc}18`, color:cc, border:`1px solid ${cc}33`, textTransform:'capitalize', display:'inline-block', whiteSpace:'nowrap' }}>
                                            {product.category}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <div style={{ fontSize:12, color:'#94a3b8', paddingRight:8, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                                        {product.description}
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display:'flex', gap:6 }}>
                                        <button className="pr-btn" onClick={() => handleEdit(product)}
                                            style={{ width:32, height:32, background:'#ccfbf1', color:'#0d9488', fontSize:13 }} title="Edit">✏️</button>
                                        <button className="pr-btn" onClick={() => setConfirmDelete(product)}
                                            disabled={deletingId === product.id}
                                            style={{ width:32, height:32, background:'#fef2f2', color:'#dc2626', fontSize:13 }} title="Delete">
                                            {deletingId === product.id
                                                ? <span style={{ width:14, height:14, border:'2px solid #fca5a5', borderTop:'2px solid #dc2626', borderRadius:'50%', animation:'pr-spin 0.8s linear infinite', display:'inline-block' }} />
                                                : '🗑️'
                                            }
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Hidden file input */}
            <input type="file" accept="image/*" ref={fileInputRef} style={{ display:'none' }} onChange={handleFileChange} />

            {/* ── Edit Modal ── */}
            {isModalOpen && productToEdit && (
                <div style={{ position:'fixed', inset:0, background:'rgba(4,47,46,0.6)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:16, backdropFilter:'blur(4px)' }}
                    onClick={e => { if (e.target === e.currentTarget) resetModal() }}>
                    <div style={{ background:'#fff', borderRadius:24, padding:0, width:'100%', maxWidth:600, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 24px 64px rgba(0,0,0,0.18)', animation:'pr-in 0.3s ease' }}>

                        {/* Modal Header */}
                        <div style={{ padding:'20px 24px 16px', borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'center', gap:14, position:'sticky', top:0, background:'#fff', zIndex:1, borderRadius:'24px 24px 0 0' }}>
                            <div style={{ width:42, height:42, borderRadius:12, background:'#ccfbf1', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>✏️</div>
                            <div style={{ flex:1 }}>
                                <div style={{ fontSize:16, fontWeight:800, color:'#0f172a' }}>Edit Product</div>
                                <div style={{ fontSize:12, color:'#94a3b8', marginTop:2 }}>{productToEdit.name}</div>
                            </div>
                            <button onClick={resetModal} style={{ width:32, height:32, borderRadius:'50%', border:'none', background:'#f1f5f9', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', color:'#64748b' }}>✕</button>
                        </div>

                        {/* Modal Body */}
                        <div style={{ padding:'20px 24px' }}>
                            <div className="pr-modal-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
                                {/* Name */}
                                <div>
                                    <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:0.8, marginBottom:7 }}>Product Name *</label>
                                    <input className="pr-input" type="text" value={editForm.name} placeholder="Product name"
                                        onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                                        style={inputStyle(formErrors.name)} />
                                    {formErrors.name && <div style={{ fontSize:11, color:'#dc2626', marginTop:4 }}>⚠ {formErrors.name}</div>}
                                </div>
                                {/* Category */}
                                <div>
                                    <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:0.8, marginBottom:7 }}>Category *</label>
                                    <select className="pr-input" value={editForm.category}
                                        onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}
                                        style={{ ...inputStyle(formErrors.category), cursor:'pointer' }}>
                                        <option value="">-- Select Category --</option>
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    {formErrors.category && <div style={{ fontSize:11, color:'#dc2626', marginTop:4 }}>⚠ {formErrors.category}</div>}
                                </div>
                                {/* Price */}
                                <div>
                                    <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:0.8, marginBottom:7 }}>Price (PKR) *</label>
                                    <input className="pr-input" type="number" value={editForm.price} placeholder="0" min={0}
                                        onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))}
                                        style={inputStyle(formErrors.price)} />
                                    {formErrors.price && <div style={{ fontSize:11, color:'#dc2626', marginTop:4 }}>⚠ {formErrors.price}</div>}
                                </div>
                                {/* Stock */}
                                <div>
                                    <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:0.8, marginBottom:7 }}>Stock Quantity *</label>
                                    <input className="pr-input" type="number" value={editForm.stock} placeholder="0" min={0}
                                        onChange={e => setEditForm(f => ({ ...f, stock: e.target.value }))}
                                        style={inputStyle(formErrors.stock)} />
                                    {formErrors.stock && <div style={{ fontSize:11, color:'#dc2626', marginTop:4 }}>⚠ {formErrors.stock}</div>}
                                </div>
                            </div>

                            {/* Description */}
                            <div style={{ marginBottom:16 }}>
                                <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:0.8, marginBottom:7 }}>Description *</label>
                                <textarea className="pr-input" value={editForm.description} placeholder="Product description…" rows={3}
                                    onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                                    style={{ ...inputStyle(formErrors.description), resize:'vertical' }} />
                                {formErrors.description && <div style={{ fontSize:11, color:'#dc2626', marginTop:4 }}>⚠ {formErrors.description}</div>}
                            </div>

                            {/* Image */}
                            <div style={{ marginBottom:20 }}>
                                <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:0.8, marginBottom:7 }}>Product Image *</label>
                                <div style={{ display:'flex', gap:8, marginBottom:10, flexWrap:'wrap' }}>
                                    <input className="pr-input" type="text" value={editForm.imageURL} placeholder="Paste image URL (https://…)"
                                        onChange={e => { setEditForm(f => ({ ...f, imageURL: e.target.value })); setPreviewImageURL(e.target.value); setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                                        style={{ ...inputStyle(formErrors.imageURL), flex:1, minWidth:180 }} />
                                    <button type="button" onClick={() => fileInputRef.current?.click()}
                                        style={{ padding:'11px 16px', borderRadius:10, border:'1.5px solid #e2e8f0', background:'#f8fafc', color:'#475569', fontSize:13, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 }}>
                                        📁 Upload
                                    </button>
                                </div>
                                {formErrors.imageURL && <div style={{ fontSize:11, color:'#dc2626', marginTop:4 }}>⚠ {formErrors.imageURL}</div>}
                                {selectedFile && <div style={{ fontSize:11, color:'#16a34a', marginTop:4 }}>✓ {selectedFile.name}</div>}

                                {previewImageURL && (
                                    <div style={{ display:'flex', alignItems:'center', gap:14, marginTop:12, padding:'12px 14px', background:'#f8fafc', borderRadius:12, border:'1px solid #e2e8f0' }}>
                                        <img src={previewImageURL} alt="preview" onError={e => e.target.style.display='none'}
                                            style={{ width:64, height:64, objectFit:'cover', borderRadius:10, border:'1px solid #e2e8f0', flexShrink:0 }} />
                                        <div>
                                            <div style={{ fontSize:12, fontWeight:600, color:'#475569' }}>Preview</div>
                                            <div style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>{selectedFile ? selectedFile.name : 'From URL'}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div style={{ padding:'0 24px 20px', display:'flex', gap:10 }}>
                            <button onClick={resetModal}
                                style={{ flex:1, padding:'12px', borderRadius:12, border:'1.5px solid #e2e8f0', background:'#f8fafc', color:'#64748b', fontSize:14, fontWeight:600, cursor:'pointer' }}>
                                Cancel
                            </button>
                            <button className="pr-save" onClick={handleUpdate} disabled={isProcessing}
                                style={{ flex:2, padding:'12px', borderRadius:12, border:'none', background: isProcessing ? '#99f6e4' : 'linear-gradient(135deg,#0d9488,#042f2e)', color:'#fff', fontSize:14, fontWeight:700, cursor: isProcessing ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow:'0 4px 14px rgba(13,148,136,0.3)' }}>
                                {isProcessing
                                    ? <><span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.4)', borderTop:'2px solid #fff', borderRadius:'50%', animation:'pr-spin 0.8s linear infinite', display:'inline-block' }} />Updating...</>
                                    : '✅ Update Product'
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Delete Confirm Modal ── */}
            {confirmDelete && (
                <div style={{ position:'fixed', inset:0, background:'rgba(15,12,41,0.6)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:16, backdropFilter:'blur(4px)' }}
                    onClick={e => { if (e.target === e.currentTarget) setConfirmDelete(null) }}>
                    <div style={{ background:'#fff', borderRadius:24, padding:28, width:'100%', maxWidth:380, boxShadow:'0 24px 64px rgba(0,0,0,0.18)', textAlign:'center', animation:'pr-in 0.3s ease' }}>
                        <div style={{ width:60, height:60, borderRadius:'50%', background:'#fef2f2', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, margin:'0 auto 14px' }}>🗑️</div>
                        <div style={{ fontSize:18, fontWeight:800, color:'#0f172a', marginBottom:8 }}>Delete Product?</div>
                        <div style={{ fontSize:13, color:'#64748b', marginBottom:20, lineHeight:1.6 }}>
                            <strong>"{confirmDelete.name}"</strong> will be permanently deleted. This action cannot be undone.
                        </div>
                        <div style={{ display:'flex', gap:10 }}>
                            <button onClick={() => setConfirmDelete(null)}
                                style={{ flex:1, padding:'12px', borderRadius:12, border:'1.5px solid #e2e8f0', background:'#f8fafc', color:'#64748b', fontSize:14, fontWeight:600, cursor:'pointer' }}>Cancel</button>
                            <button onClick={() => handleDelete(confirmDelete)} disabled={!!deletingId}
                                style={{ flex:1, padding:'12px', borderRadius:12, border:'none', background: deletingId ? '#fca5a5' : 'linear-gradient(135deg,#ef4444,#dc2626)', color:'#fff', fontSize:14, fontWeight:700, cursor: deletingId ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow:'0 4px 14px rgba(239,68,68,0.3)', transition:'all 0.2s' }}>
                                {deletingId
                                    ? <><span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.4)', borderTop:'2px solid #fff', borderRadius:'50%', animation:'pr-spin 0.8s linear infinite', display:'inline-block' }} />Deleting...</>
                                    : '🗑️ Delete'
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default All