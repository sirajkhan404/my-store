import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/Auth';

const Profile = () => {
    const { user, readProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState(user?.fullName || '');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(user?.profilePicture || '');
    const [activeTab, setActiveTab] = useState('edit');
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!fullName.trim()) return window.toastify("Full name cannot be empty.", "warning");
        try {
            setLoading(true);
            const token = localStorage.getItem('jwt');
            const formData = new FormData();
            formData.append('fullName', fullName);
            if (imageFile) formData.append('image', imageFile);
            const { data } = await axios.put(
                `${window.api}/api/auth/update-profile`, formData,
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
            );
            window.toastify(data.message, "success");
            await readProfile(token);
        } catch (err) {
            window.toastify(err.response?.data?.message || "Failed to update profile", "error");
        } finally { setLoading(false); }
    };

    const initials = (fullName || user?.fullName || 'U').charAt(0).toUpperCase();
    const isAdmin = user?.role === 'superAdmin';

    return (
        <div style={{ minHeight: '100%', background: 'linear-gradient(135deg, #042f2e 0%, #032221 50%, #021a19 100%)', padding: '36px 24px', fontFamily: "'Inter', sans-serif" }}>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                @keyframes glow-pulse { 0%,100%{box-shadow:0 0 20px rgba(13,148,136,0.4)} 50%{box-shadow:0 0 40px rgba(94,234,212,0.8)} }
                @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
                @keyframes pf2-spin { to{transform:rotate(360deg)} }
                @keyframes pf2-in { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
                @keyframes shimmer-move { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
                .glass { backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
                .tab-btn { transition: all 0.25s; cursor:pointer; border:none; }
                .tab-btn.active { background: rgba(13,148,136,0.3) !important; color:#5eead4 !important; border-color: rgba(94,234,212,0.5) !important; }
                .tab-btn:hover:not(.active) { background: rgba(255,255,255,0.08) !important; }
                .pf2-input { transition: all 0.2s; }
                .pf2-input:focus { outline:none; border-color: rgba(94,234,212,0.8) !important; box-shadow: 0 0 0 3px rgba(13,148,136,0.25) !important; }
                .pf2-input::placeholder { color: rgba(255,255,255,0.25); }
                .pf2-save:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(13,148,136,0.5) !important; }
                .pf2-save:active:not(:disabled) { transform:translateY(0); }
                .pf2-save { transition: all 0.25s; }
                .avatar-glow { animation: glow-pulse 2.5s ease-in-out infinite; }
                .pf2-card { animation: pf2-in 0.4s ease both; }
            `}</style>

            {/* ── BG blobs ── */}
            <div style={{ position: 'fixed', top: 80, right: 80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(13,148,136,0.15)', filter: 'blur(60px)', pointerEvents: 'none' }} />
            <div style={{ position: 'fixed', bottom: 80, left: 60, width: 250, height: 250, borderRadius: '50%', background: 'rgba(245,158,11,0.08)', filter: 'blur(60px)', pointerEvents: 'none' }} />

            <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative' }}>

                {/* ── Top Hero Section ── */}
                <div className="pf2-card glass" style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 28, marginBottom: 20, overflow: 'hidden',
                    animationDelay: '0s'
                }}>
                    {/* shimmer top bar */}
                    <div style={{ height: 3, background: 'linear-gradient(90deg, #0d9488, #5eead4, #f59e0b, #5eead4, #0d9488)', backgroundSize: '200%', animation: 'shimmer-move 3s linear infinite' }} />

                    <div style={{ padding: '36px 36px 32px', display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>

                        {/* Avatar */}
                        <div style={{ position: 'relative', flexShrink: 0 }} onClick={() => fileInputRef.current?.click()}>
                            <div className="avatar-glow" style={{
                                width: 100, height: 100, borderRadius: '50%', cursor: 'pointer',
                                border: '3px solid rgba(94,234,212,0.6)', overflow: 'hidden',
                                background: imagePreview ? '#000' : 'linear-gradient(135deg, #0d9488, #042f2e)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                {imagePreview
                                    ? <img src={imagePreview} alt="dp" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    : <span style={{ fontSize: 38, fontWeight: 800, color: '#fff' }}>{initials}</span>
                                }
                            </div>
                            {/* edit dot */}
                            <div style={{
                                position: 'absolute', bottom: 2, right: 2,
                                width: 28, height: 28, borderRadius: '50%', cursor: 'pointer',
                                background: 'linear-gradient(135deg,#0d9488,#042f2e)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 13, border: '2px solid #032221',
                                boxShadow: '0 2px 8px rgba(13,148,136,0.5)'
                            }}>📷</div>
                            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" style={{ display: 'none' }} />
                        </div>

                        {/* Name & Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: -0.5 }}>
                                    {user?.fullName}
                                </h2>
                                <span style={{
                                    fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
                                    background: isAdmin ? 'rgba(245,158,11,0.2)' : 'rgba(13,148,136,0.2)',
                                    color: isAdmin ? '#fbbf24' : '#5eead4',
                                    border: `1px solid ${isAdmin ? 'rgba(245,158,11,0.4)' : 'rgba(94,234,212,0.4)'}`,
                                    textTransform: 'capitalize'
                                }}>
                                    {isAdmin ? '👑 Super Admin' : '🛍 Customer'}
                                </span>
                            </div>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 14 }}>{user?.email}</div>

                            {/* Mini stats */}
                            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                                {[
                                    { label: 'Status', value: user?.status || 'active', color: '#4ade80' },
                                    { label: 'Member since', value: user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024', color: '#fb923c' },
                                    { label: 'Account', value: 'Verified', color: '#5eead4' },
                                ].map((s, i) => (
                                    <div key={i}>
                                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>{s.label}</div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: s.color, textTransform: 'capitalize', marginTop: 2 }}>{s.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Tabs ── */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                    {[
                        { key: 'edit', icon: '✏️', label: 'Edit Profile' },
                        { key: 'security', icon: '🔐', label: 'Security' },
                    ].map(tab => (
                        <button key={tab.key}
                            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.key)}
                            style={{
                                padding: '9px 18px', borderRadius: 12, fontSize: 13, fontWeight: 600,
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'rgba(255,255,255,0.6)',
                                display: 'flex', alignItems: 'center', gap: 7
                            }}>
                            <span>{tab.icon}</span>{tab.label}
                        </button>
                    ))}
                </div>

                {/* ── Edit Tab ── */}
                {activeTab === 'edit' && (
                    <div className="pf2-card glass" style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 24, padding: 32, animationDelay: '.05s'
                    }}>
                        <form onSubmit={handleUpdateProfile}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 20 }}>

                                {/* Full Name */}
                                <div>
                                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                                        Full Name
                                    </label>
                                    <input
                                        className="pf2-input"
                                        type="text"
                                        value={fullName}
                                        onChange={e => setFullName(e.target.value)}
                                        placeholder="Your full name"
                                        style={{
                                            width: '100%', padding: '13px 16px', borderRadius: 12, boxSizing: 'border-box',
                                            background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.12)',
                                            color: '#fff', fontSize: 14, fontWeight: 500,
                                        }}
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                                        Email Address
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="email" value={user?.email} disabled
                                            style={{
                                                width: '100%', padding: '13px 16px 13px 42px', borderRadius: 12, boxSizing: 'border-box',
                                                background: 'rgba(255,255,255,0.03)', border: '1.5px solid rgba(255,255,255,0.06)',
                                                color: 'rgba(255,255,255,0.3)', fontSize: 14, cursor: 'not-allowed',
                                            }}
                                        />
                                        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, opacity: 0.4 }}>🔒</span>
                                    </div>
                                    <p style={{ margin: '5px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>Cannot be changed</p>
                                </div>
                            </div>

                            {/* Photo Upload */}
                            <div style={{ marginBottom: 28 }}>
                                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                                    Profile Photo
                                </label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{
                                        border: `2px dashed ${imageFile ? 'rgba(94,234,212,0.7)' : 'rgba(255,255,255,0.12)'}`,
                                        borderRadius: 14, padding: '20px 22px', cursor: 'pointer',
                                        background: imageFile ? 'rgba(13,148,136,0.15)' : 'rgba(255,255,255,0.03)',
                                        display: 'flex', alignItems: 'center', gap: 16,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{
                                        width: 52, height: 52, borderRadius: 12, overflow: 'hidden', flexShrink: 0,
                                        background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}>
                                        {imagePreview
                                            ? <img src={imagePreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            : <span style={{ fontSize: 24 }}>🖼️</span>
                                        }
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: imageFile ? '#5eead4' : 'rgba(255,255,255,0.6)' }}>
                                            {imageFile ? `✓ ${imageFile.name}` : 'Click to upload a new photo'}
                                        </div>
                                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 3 }}>PNG, JPG or GIF · Max 5MB</div>
                                    </div>
                                </div>
                            </div>

                            {/* Save Button */}
                            <button
                                type="submit"
                                className="pf2-save"
                                disabled={loading}
                                style={{
                                    width: '100%', padding: '14px', borderRadius: 14, border: 'none',
                                    background: loading ? 'rgba(13,148,136,0.4)' : 'linear-gradient(135deg, #0d9488 0%, #0f766e 50%, #042f2e 100%)',
                                    color: '#fff', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                    boxShadow: '0 4px 20px rgba(13,148,136,0.35)', letterSpacing: 0.3
                                }}
                            >
                                {loading ? (
                                    <>
                                        <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'pf2-spin 0.8s linear infinite', display: 'inline-block' }} />
                                        Saving...
                                    </>
                                ) : '💾  Save Changes'}
                            </button>
                        </form>
                    </div>
                )}

                {/* ── Security Tab ── */}
                {activeTab === 'security' && (
                    <div className="pf2-card glass" style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 24, padding: 32, animationDelay: '.05s'
                    }}>
                        <div style={{ marginBottom: 24 }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Account Security</div>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>Your account details and security info</div>
                        </div>

                        {[
                            { icon: '👤', label: 'Full Name', value: user?.fullName, color: '#c4b5fd' },
                            { icon: '📧', label: 'Email', value: user?.email, color: '#93c5fd' },
                            { icon: '🛡️', label: 'Role', value: user?.role, color: isAdmin ? '#fbbf24' : '#60a5fa' },
                            { icon: '🟢', label: 'Status', value: user?.status, color: '#4ade80' },
                            { icon: '🔑', label: 'Password', value: '••••••••••', color: 'rgba(255,255,255,0.4)' },
                            { icon: '📅', label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' }) : '—', color: '#fb923c' },
                        ].map((item, i, arr) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '15px 0',
                                borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                                gap: 12, flexWrap: 'wrap'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{
                                        width: 38, height: 38, borderRadius: 10,
                                        background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17
                                    }}>{item.icon}</div>
                                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{item.label}</span>
                                </div>
                                <span style={{ fontSize: 13, fontWeight: 700, color: item.color, textTransform: 'capitalize' }}>
                                    {item.value}
                                </span>
                            </div>
                        ))}

                        {/* Security Note */}
                        <div style={{
                            marginTop: 24, padding: '14px 18px', borderRadius: 12,
                            background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)',
                            display: 'flex', alignItems: 'flex-start', gap: 10
                        }}>
                            <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
                            <p style={{ margin: 0, fontSize: 12, color: 'rgba(251,191,36,0.8)', lineHeight: 1.5 }}>
                                To change your password or email, please contact support. Keep your account secure by not sharing your credentials.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
