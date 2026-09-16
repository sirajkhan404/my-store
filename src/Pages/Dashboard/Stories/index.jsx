import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
    PlusOutlined, 
    DeleteOutlined, 
    EyeOutlined, 
    CheckCircleOutlined, 
    CloseCircleOutlined, 
    LoadingOutlined, 
    ShoppingOutlined,
    ClockCircleOutlined,
    CloudUploadOutlined,
    LinkOutlined,
    ThunderboltOutlined,
    HeartFilled
} from '@ant-design/icons';
import { Modal, Tooltip, Switch, Popconfirm } from 'antd';
import StoryViewer from '@/components/Stories/StoryViewer';

const StoriesManagement = () => {
    const [stories, setStories] = useState([]);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [selectedProductId, setSelectedProductId] = useState('');
    const [customLink, setCustomLink] = useState('');
    const [duration, setDuration] = useState(5);
    const [mediaType, setMediaType] = useState('image');
    const [mediaFile, setMediaFile] = useState(null);
    const [mediaPreview, setMediaPreview] = useState('');
    const [mediaUrlInput, setMediaUrlInput] = useState('');

    // Story viewer state for preview
    const [previewStoryIndex, setPreviewStoryIndex] = useState(null);

    const fileInputRef = useRef(null);

    // Fetch all stories for admin
    const fetchStories = async () => {
        try {
            setIsLoading(true);
            const jwt = localStorage.getItem('jwt');
            const res = await axios.get(`${window.api}/api/stories/all`, {
                headers: { Authorization: `Bearer ${jwt}` }
            });
            if (res.data && res.data.stories) {
                setStories(res.data.stories);
            }
        } catch (err) {
            console.error('Fetch stories error:', err);
            window.toastify?.(err.response?.data?.message || 'Failed to fetch stories', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch products for product linker dropdown
    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${window.api}/api/products/public-all`);
            if (res.data && res.data.products) {
                setProducts(res.data.products);
            }
        } catch (err) {
            console.error('Fetch products error:', err);
        }
    };

    useEffect(() => {
        fetchStories();
        fetchProducts();
    }, []);

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setMediaFile(file);
            setMediaPreview(URL.createObjectURL(file));
            if (file.type.startsWith('video/')) {
                setMediaType('video');
            } else {
                setMediaType('image');
            }
        }
    };

    const handleClearFile = () => {
        setMediaFile(null);
        setMediaPreview('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // Reset Form
    const resetForm = () => {
        setTitle('');
        setSelectedProductId('');
        setCustomLink('');
        setDuration(5);
        setMediaType('image');
        setMediaFile(null);
        setMediaPreview('');
        setMediaUrlInput('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // Handle Story Creation
    const handleCreateStory = async (e) => {
        e.preventDefault();
        if (!mediaFile && !mediaUrlInput.trim()) {
            return window.toastify?.('Please upload an image/video or provide a media URL', 'warning');
        }

        try {
            setIsSubmitting(true);
            const jwt = localStorage.getItem('jwt');
            const formData = new FormData();

            if (title.trim()) formData.append('title', title.trim());
            if (selectedProductId) formData.append('productId', selectedProductId);
            if (customLink.trim()) formData.append('storyLink', customLink.trim());
            formData.append('duration', duration);
            formData.append('mediaType', mediaType);

            if (mediaFile) {
                formData.append('media', mediaFile);
            } else if (mediaUrlInput.trim()) {
                formData.append('mediaURL', mediaUrlInput.trim());
            }

            const res = await axios.post(`${window.api}/api/stories/create`, formData, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.status === 201) {
                window.toastify?.('Story published successfully! 🎉', 'success');
                setIsModalOpen(false);
                resetForm();
                fetchStories();
            }
        } catch (err) {
            console.error('Create story error:', err);
            window.toastify?.(err.response?.data?.message || 'Failed to publish story', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Toggle Active Status
    const handleToggleActive = async (id) => {
        try {
            const jwt = localStorage.getItem('jwt');
            const res = await axios.patch(`${window.api}/api/stories/toggle/${id}`, {}, {
                headers: { Authorization: `Bearer ${jwt}` }
            });
            if (res.status === 200) {
                setStories(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
                window.toastify?.(res.data.message || 'Status updated', 'success');
            }
        } catch (err) {
            console.error('Toggle error:', err);
            window.toastify?.(err.response?.data?.message || 'Failed to update status', 'error');
        }
    };

    // Delete Story
    const handleDeleteStory = async (id) => {
        try {
            const jwt = localStorage.getItem('jwt');
            const res = await axios.delete(`${window.api}/api/stories/delete/${id}`, {
                headers: { Authorization: `Bearer ${jwt}` }
            });
            if (res.status === 200) {
                setStories(prev => prev.filter(s => s.id !== id));
                window.toastify?.('Story removed successfully', 'success');
            }
        } catch (err) {
            console.error('Delete error:', err);
            window.toastify?.(err.response?.data?.message || 'Failed to delete story', 'error');
        }
    };

    return (
        <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header Banner */}
            <div style={{
                background: 'linear-gradient(135deg, #042f2e 0%, #0d9488 50%, #115e59 100%)',
                borderRadius: '24px',
                padding: '32px 36px',
                color: '#fff',
                marginBottom: '32px',
                boxShadow: '0 20px 40px rgba(4, 47, 46, 0.15)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '20px'
            }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <span style={{ 
                            background: 'rgba(255,255,255,0.15)', 
                            padding: '6px 14px', 
                            borderRadius: '20px', 
                            fontSize: '13px', 
                            fontWeight: 600,
                            letterSpacing: '0.5px'
                        }}>
                            ✨ Visual Marketing
                        </span>
                        <span style={{ 
                            background: '#10b981', 
                            color: '#fff',
                            padding: '4px 10px', 
                            borderRadius: '12px', 
                            fontSize: '12px', 
                            fontWeight: 700 
                        }}>
                            {stories.filter(s => s.isActive).length} Active Stories
                        </span>
                        <span style={{ 
                            background: 'rgba(239, 68, 68, 0.25)', 
                            border: '1px solid rgba(239, 68, 68, 0.4)',
                            color: '#fecaca',
                            padding: '4px 10px', 
                            borderRadius: '12px', 
                            fontSize: '12px', 
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            <HeartFilled style={{ color: '#ef4444' }} />
                            {stories.reduce((acc, s) => acc + (s.likesCount || s.likes?.length || 0), 0)} Total Likes
                        </span>
                    </div>
                    <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px' }}>
                        Product Stories Dashboard
                    </h1>
                    <p style={{ margin: '8px 0 0 0', color: 'rgba(255,255,255,0.8)', fontSize: '15px' }}>
                        Create Instagram-style product stories to highlight new arrivals, flash deals, and promotions.
                    </p>
                </div>

                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    style={{
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: '#042f2e',
                        border: 'none',
                        padding: '14px 28px',
                        borderRadius: '16px',
                        fontWeight: 700,
                        fontSize: '15px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        boxShadow: '0 10px 25px rgba(245, 158, 11, 0.35)',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <PlusOutlined style={{ fontSize: '18px' }} />
                    + Add New Story
                </button>
            </div>

            {/* Content Section */}
            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                    <LoadingOutlined style={{ fontSize: '42px', color: '#0d9488' }} />
                    <p style={{ marginTop: '16px', color: '#64748b', fontWeight: 600 }}>Loading stories...</p>
                </div>
            ) : stories.length === 0 ? (
                <div style={{
                    background: '#fff',
                    borderRadius: '24px',
                    padding: '60px 24px',
                    textAlign: 'center',
                    border: '2px dashed #cbd5e1',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                }}>
                    <div style={{ 
                        width: '80px', 
                        height: '80px', 
                        borderRadius: '50%', 
                        background: '#f0fdfa', 
                        color: '#0d9488', 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '36px',
                        marginBottom: '16px'
                    }}>
                        📱
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                        No Stories Created Yet
                    </h3>
                    <p style={{ color: '#64748b', maxWidth: '440px', margin: '0 auto 24px', fontSize: '14px', lineHeight: 1.6 }}>
                        Boost your store sales by posting attractive stories of your products with direct buy links.
                    </p>
                    <button
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        style={{
                            background: '#0d9488',
                            color: '#fff',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '12px',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        Create Your First Story
                    </button>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: '24px'
                }}>
                    {stories.map((story, index) => {
                        const isVideo = story.mediaType === 'video' || story.mediaURL?.endsWith('.mp4');
                        return (
                            <div
                                key={story.id}
                                style={{
                                    background: '#fff',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                                    border: story.isActive ? '2px solid #5eead4' : '1px solid #e2e8f0',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {/* Media Preview / Story Aspect Box */}
                                <div style={{
                                    height: '340px',
                                    position: 'relative',
                                    background: '#042f2e',
                                    overflow: 'hidden'
                                }}>
                                    {isVideo ? (
                                        <video
                                            src={story.mediaURL}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            muted
                                            playsInline
                                        />
                                    ) : (
                                        <img
                                            src={story.mediaURL}
                                            alt={story.title || 'Story preview'}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    )}

                                    {/* Top Overlay Badges */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '12px',
                                        left: '12px',
                                        right: '12px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        zIndex: 2
                                    }}>
                                        <span style={{
                                            background: story.isActive ? 'rgba(16, 185, 129, 0.9)' : 'rgba(100, 116, 139, 0.9)',
                                            backdropFilter: 'blur(8px)',
                                            color: '#fff',
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            {story.isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                                            {story.isActive ? 'Active' : 'Inactive'}
                                        </span>

                                        <span style={{
                                            background: 'rgba(0,0,0,0.6)',
                                            backdropFilter: 'blur(8px)',
                                            color: '#fff',
                                            padding: '4px 8px',
                                            borderRadius: '8px',
                                            fontSize: '11px',
                                            fontWeight: 600
                                        }}>
                                            ⏱️ {story.duration || 5}s
                                        </span>
                                    </div>

                                    {/* Play Overlay Preview Button */}
                                    <div
                                        onClick={() => setPreviewStoryIndex(index)}
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'rgba(0,0,0,0.2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.45)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.2)'}
                                    >
                                        <div style={{
                                            width: '54px',
                                            height: '54px',
                                            borderRadius: '50%',
                                            background: 'rgba(255,255,255,0.9)',
                                            color: '#0d9488',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '22px',
                                            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                                            transform: 'scale(1)',
                                            transition: 'transform 0.2s'
                                        }}>
                                            <EyeOutlined />
                                        </div>
                                    </div>

                                    {/* Bottom Linked Product Overlay if any */}
                                    {story.productName && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '12px',
                                            left: '12px',
                                            right: '12px',
                                            background: 'rgba(4, 47, 46, 0.85)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255,255,255,0.15)',
                                            borderRadius: '12px',
                                            padding: '8px 12px',
                                            color: '#fff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            zIndex: 2
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                                                <ShoppingOutlined style={{ color: '#5eead4', fontSize: '14px' }} />
                                                <span style={{ fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {story.productName}
                                                </span>
                                            </div>
                                            {story.productPrice > 0 && (
                                                <span style={{ fontSize: '12px', fontWeight: 800, color: '#f59e0b', flexShrink: 0 }}>
                                                    Rs. {story.productPrice}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Body Information */}
                                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        <h4 style={{
                                            fontSize: '15px',
                                            fontWeight: 700,
                                            color: '#0f172a',
                                            margin: '0 0 6px 0',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {story.title || 'Untitled Story'}
                                        </h4>
                                        <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <ClockCircleOutlined />
                                                {new Date(story.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: '4px', 
                                                color: '#ef4444', 
                                                fontWeight: 700,
                                                background: '#fef2f2',
                                                padding: '2px 8px',
                                                borderRadius: '10px',
                                                fontSize: '11px'
                                            }}>
                                                <HeartFilled />
                                                {story.likesCount || (Array.isArray(story.likes) ? story.likes.length : 0)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Bar */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginTop: '16px',
                                        paddingTop: '12px',
                                        borderTop: '1px solid #f1f5f9'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Switch
                                                checked={story.isActive}
                                                onChange={() => handleToggleActive(story.id)}
                                                style={{ background: story.isActive ? '#0d9488' : '#cbd5e1' }}
                                            />
                                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                                                {story.isActive ? 'Live' : 'Hidden'}
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <Tooltip title="Preview Story">
                                                <button
                                                    onClick={() => setPreviewStoryIndex(index)}
                                                    style={{
                                                        border: 'none',
                                                        background: '#f0fdfa',
                                                        color: '#0d9488',
                                                        width: '34px',
                                                        height: '34px',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    <EyeOutlined />
                                                </button>
                                            </Tooltip>

                                            <Popconfirm
                                                title="Delete this story?"
                                                description="Are you sure you want to permanently delete this product story?"
                                                onConfirm={() => handleDeleteStory(story.id)}
                                                okText="Yes, Delete"
                                                cancelText="Cancel"
                                                okButtonProps={{ danger: true }}
                                            >
                                                <Tooltip title="Delete Story">
                                                    <button
                                                        style={{
                                                            border: 'none',
                                                            background: '#fef2f2',
                                                            color: '#ef4444',
                                                            width: '34px',
                                                            height: '34px',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        <DeleteOutlined />
                                                    </button>
                                                </Tooltip>
                                            </Popconfirm>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add Story Modal */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', fontWeight: 800, color: '#042f2e' }}>
                        <span style={{ background: '#f0fdfa', color: '#0d9488', padding: '6px', borderRadius: '10px' }}>
                            <ThunderboltOutlined />
                        </span>
                        Add New Product Story
                    </div>
                }
                open={isModalOpen}
                onCancel={() => !isSubmitting && setIsModalOpen(false)}
                footer={null}
                centered
                width={650}
                bodyStyle={{ padding: '24px 0 0 0' }}
            >
                <form onSubmit={handleCreateStory}>
                    {/* Media Uploader Area */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                            Upload Story Media (Image or Video) *
                        </label>

                        {mediaPreview ? (
                            <div style={{
                                position: 'relative',
                                width: '100%',
                                height: '240px',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                background: '#042f2e',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {mediaType === 'video' ? (
                                    <video
                                        src={mediaPreview}
                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                        controls
                                    />
                                ) : (
                                    <img
                                        src={mediaPreview}
                                        alt="Preview"
                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    />
                                )}
                                <button
                                    type="button"
                                    onClick={handleClearFile}
                                    style={{
                                        position: 'absolute',
                                        top: '12px',
                                        right: '12px',
                                        background: 'rgba(239, 68, 68, 0.9)',
                                        color: '#fff',
                                        border: 'none',
                                        padding: '6px 14px',
                                        borderRadius: '8px',
                                        fontWeight: 600,
                                        fontSize: '12px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Remove & Replace
                                </button>
                            </div>
                        ) : (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                    border: '2px dashed #0d9488',
                                    background: '#f0fdfa',
                                    borderRadius: '16px',
                                    padding: '36px 20px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <CloudUploadOutlined style={{ fontSize: '40px', color: '#0d9488', marginBottom: '12px' }} />
                                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '15px' }}>
                                    Click to Browse Image or Video
                                </div>
                                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                                    Supports JPG, PNG, WEBP, MP4 (Vertical 9:16 recommended)
                                </div>
                            </div>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />

                        {/* Or URL input */}
                        {!mediaFile && (
                            <div style={{ marginTop: '12px' }}>
                                <span style={{ fontSize: '12px', color: '#64748b' }}>Or enter direct image/video URL:</span>
                                <input
                                    type="url"
                                    placeholder="https://example.com/story.jpg"
                                    value={mediaUrlInput}
                                    onChange={(e) => {
                                        setMediaUrlInput(e.target.value);
                                        if (e.target.value) setMediaPreview(e.target.value);
                                        else setMediaPreview('');
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '10px 14px',
                                        borderRadius: '10px',
                                        border: '1px solid #cbd5e1',
                                        marginTop: '4px',
                                        fontSize: '13px'
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Story Title / Caption */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                            Story Caption / Title
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. New Wireless Earbuds 50% Off! 🔥"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                border: '1px solid #cbd5e1',
                                fontSize: '14px'
                            }}
                        />
                    </div>

                    {/* Link To Product */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                            <ShoppingOutlined style={{ color: '#0d9488', marginRight: '6px' }} />
                            Tag / Link a Store Product (Optional)
                        </label>
                        <select
                            value={selectedProductId}
                            onChange={(e) => setSelectedProductId(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                border: '1px solid #cbd5e1',
                                fontSize: '14px',
                                background: '#fff'
                            }}
                        >
                            <option value="">-- No Product Tagged (Story Only) --</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.name} - (Rs. {p.price})
                                </option>
                            ))}
                        </select>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                            Tagging a product will show an interactive "Shop Now" card directly on the story.
                        </div>
                    </div>

                    {/* Duration and Custom Link */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                Duration (Seconds)
                            </label>
                            <select
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    border: '1px solid #cbd5e1',
                                    fontSize: '14px',
                                    background: '#fff'
                                }}
                            >
                                <option value={3}>3 Seconds (Fast)</option>
                                <option value={5}>5 Seconds (Standard)</option>
                                <option value={7}>7 Seconds</option>
                                <option value={10}>10 Seconds (Detailed)</option>
                                <option value={15}>15 Seconds (Video)</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                                <LinkOutlined style={{ marginRight: '6px' }} />
                                Custom External Link (Optional)
                            </label>
                            <input
                                type="url"
                                placeholder="https://..."
                                value={customLink}
                                onChange={(e) => setCustomLink(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    border: '1px solid #cbd5e1',
                                    fontSize: '14px'
                                }}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            disabled={isSubmitting}
                            style={{
                                padding: '12px 20px',
                                borderRadius: '12px',
                                border: '1px solid #cbd5e1',
                                background: '#f8fafc',
                                color: '#475569',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                                padding: '12px 28px',
                                borderRadius: '12px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #0d9488, #042f2e)',
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '14px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: '0 8px 20px rgba(13, 148, 136, 0.3)'
                            }}
                        >
                            {isSubmitting ? (
                                <>
                                    <LoadingOutlined /> Uploading & Publishing...
                                </>
                            ) : (
                                <>
                                    ✨ Publish Story Now
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Interactive Story Viewer Component for preview */}
            {previewStoryIndex !== null && (
                <StoryViewer
                    stories={stories}
                    initialIndex={previewStoryIndex}
                    onClose={() => setPreviewStoryIndex(null)}
                />
            )}
        </div>
    );
};

export default StoriesManagement;
