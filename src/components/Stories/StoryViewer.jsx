import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    CloseOutlined, 
    LeftOutlined, 
    RightOutlined, 
    ShoppingOutlined, 
    ArrowRightOutlined,
    SoundOutlined,
    MutedOutlined,
    PauseOutlined,
    CaretRightOutlined,
    HeartFilled,
    HeartOutlined
} from '@ant-design/icons';
import { useAuth } from '@/context/Auth';

const getVisitorId = () => {
    let vid = localStorage.getItem('mystore_visitor_id');
    if (!vid) {
        vid = 'v_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
        localStorage.setItem('mystore_visitor_id', vid);
    }
    return vid;
};

const StoryViewer = ({ stories = [], initialIndex = 0, onClose }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [progress, setProgress] = useState(0); // 0 to 100
    const [isPaused, setIsPaused] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    // Likes tracking
    const [likesState, setLikesState] = useState({}); // { [storyId]: { isLiked: boolean, count: number } }
    const [showHeartBurst, setShowHeartBurst] = useState(false);

    const visitorId = user?.uid || getVisitorId();

    const activeStories = stories.filter(s => s.isActive !== false);
    const currentStory = activeStories[currentIndex] || activeStories[0];

    const duration = (currentStory?.duration || 5) * 1000; // in ms
    const stepTime = 50; // update every 50ms
    const stepIncrement = (stepTime / duration) * 100;

    const progressTimerRef = useRef(null);
    const videoRef = useRef(null);
    const lastTapRef = useRef(0);

    // Initialize likes for current story
    useEffect(() => {
        if (!currentStory) return;
        const sId = currentStory.id;
        const initialLikes = Array.isArray(currentStory.likes) ? currentStory.likes : [];
        const isUserLiked = initialLikes.includes(visitorId);
        const count = currentStory.likesCount !== undefined ? currentStory.likesCount : initialLikes.length;

        setLikesState(prev => ({
            ...prev,
            [sId]: prev[sId] || { isLiked: isUserLiked, count: count }
        }));

        // Record Story View
        const recordView = async () => {
            try {
                const jwt = localStorage.getItem('jwt');
                const headers = jwt ? { Authorization: `Bearer ${jwt}` } : {};
                await axios.post(
                    `${window.api}/api/stories/view/${sId}`,
                    {
                        uid: user?.uid || visitorId,
                        name: user?.fullName || user?.name || "Guest Visitor",
                        email: user?.email || "",
                        avatar: user?.profilePicture || user?.avatar || "",
                        role: user?.role || "customer"
                    },
                    { headers }
                );
            } catch (vErr) {
                // Silently ignore view recording errors
            }
        };
        recordView();
    }, [currentStory, visitorId, user]);

    // Handle Like Toggle
    const handleToggleLike = async (e) => {
        if (e) e.stopPropagation();
        if (!currentStory) return;

        const sId = currentStory.id;
        const currentState = likesState[sId] || {
            isLiked: Array.isArray(currentStory.likes) && currentStory.likes.includes(visitorId),
            count: currentStory.likesCount || 0
        };

        const newIsLiked = !currentState.isLiked;
        const newCount = newIsLiked ? currentState.count + 1 : Math.max(0, currentState.count - 1);

        // Optimistic UI update
        setLikesState(prev => ({
            ...prev,
            [sId]: { isLiked: newIsLiked, count: newCount }
        }));

        if (newIsLiked) {
            setShowHeartBurst(true);
            setTimeout(() => setShowHeartBurst(false), 900);
        }

        try {
            const jwt = localStorage.getItem('jwt');
            const headers = jwt ? { Authorization: `Bearer ${jwt}` } : {};
            const res = await axios.post(`${window.api}/api/stories/like/${sId}`, { userId: visitorId }, { headers });
            if (res.data) {
                setLikesState(prev => ({
                    ...prev,
                    [sId]: { isLiked: res.data.isLiked, count: res.data.likesCount }
                }));
            }
        } catch (err) {
            console.error('Like error:', err);
        }
    };

    // Double tap handler for instant like
    const handleDoubleTap = (e) => {
        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300;
        if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
            handleToggleLike(e);
            lastTapRef.current = 0;
        } else {
            lastTapRef.current = now;
        }
    };

    // Go to next story
    const handleNext = () => {
        if (currentIndex < activeStories.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setProgress(0);
        } else {
            onClose();
        }
    };

    // Go to previous story
    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setProgress(0);
        } else {
            setProgress(0);
        }
    };

    // Timer Effect
    useEffect(() => {
        if (!currentStory) return;

        // Reset progress on story change
        setProgress(0);

        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(() => {});
        }
    }, [currentIndex]);

    // Interval for Progress
    useEffect(() => {
        if (isPaused) {
            if (videoRef.current) videoRef.current.pause();
            return;
        }

        if (videoRef.current) {
            videoRef.current.play().catch(() => {});
        }

        progressTimerRef.current = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressTimerRef.current);
                    handleNext();
                    return 0;
                }
                return prev + stepIncrement;
            });
        }, stepTime);

        return () => {
            if (progressTimerRef.current) clearInterval(progressTimerRef.current);
        };
    }, [isPaused, currentIndex, duration]);

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'l' || e.key === 'L') handleToggleLike();
            if (e.key === ' ') {
                e.preventDefault();
                setIsPaused(p => !p);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, isPaused, likesState]);

    if (!currentStory) return null;

    const isVideo = currentStory.mediaType === 'video' || currentStory.mediaURL?.endsWith('.mp4');
    const currentLikeInfo = likesState[currentStory.id] || {
        isLiked: Array.isArray(currentStory.likes) && currentStory.likes.includes(visitorId),
        count: currentStory.likesCount || 0
    };

    const handleProductClick = (e) => {
        e.stopPropagation();
        onClose();
        if (currentStory.storyLink) {
            window.open(currentStory.storyLink, '_blank');
        } else if (currentStory.productId) {
            navigate(`/products`);
        } else {
            navigate('/products');
        }
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(0, 0, 0, 0.92)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
            overflow: 'hidden'
        }}>
            {/* Background ambient glow matching current story */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${currentStory.mediaURL})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(50px) brightness(0.25)',
                transform: 'scale(1.2)',
                pointerEvents: 'none'
            }} />

            {/* Main Phone-style Story Container */}
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '430px',
                    height: '100%',
                    maxHeight: '880px',
                    borderRadius: '28px',
                    overflow: 'hidden',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)',
                    background: '#000',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}
                onMouseDown={() => setIsPaused(true)}
                onMouseUp={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
            >
                {/* ══ Media Item ══ */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: '#042f2e' }}>
                    {isVideo ? (
                        <video
                            ref={videoRef}
                            src={currentStory.mediaURL}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            autoPlay
                            playsInline
                            muted={isMuted}
                            loop
                        />
                    ) : (
                        <img
                            src={currentStory.mediaURL}
                            alt={currentStory.title || 'Story'}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                animation: 'storyZoom 10s ease-out infinite alternate'
                            }}
                        />
                    )}
                    <style>{`
                        @keyframes storyZoom {
                            from { transform: scale(1); }
                            to { transform: scale(1.05); }
                        }
                        @keyframes heartPop {
                            0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                            50% { transform: translate(-50%, -50%) scale(1.3); opacity: 1; }
                            80% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.9; }
                            100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
                        }
                    `}</style>
                </div>

                {/* ══ Big Heart Burst Animation on Double Tap / Like ══ */}
                {showHeartBurst && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 15,
                        pointerEvents: 'none',
                        animation: 'heartPop 0.8s ease-out forwards',
                        color: '#ff2b56',
                        fontSize: '92px',
                        filter: 'drop-shadow(0 10px 30px rgba(255, 43, 86, 0.7))'
                    }}>
                        <HeartFilled />
                    </div>
                )}

                {/* ══ Top Gradient Shade & Progress Bars ══ */}
                <div style={{
                    position: 'relative',
                    zIndex: 10,
                    padding: '16px 16px 24px 16px',
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)'
                }}>
                    {/* Multi-story Segment Progress Bars */}
                    <div style={{ display: 'flex', gap: '5px', marginBottom: '14px' }}>
                        {activeStories.map((s, idx) => {
                            let barFill = 0;
                            if (idx < currentIndex) barFill = 100;
                            else if (idx === currentIndex) barFill = progress;

                            return (
                                <div
                                    key={s.id || idx}
                                    style={{
                                        flex: 1,
                                        height: '3px',
                                        background: 'rgba(255, 255, 255, 0.3)',
                                        borderRadius: '3px',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <div
                                        style={{
                                            width: `${barFill}%`,
                                            height: '100%',
                                            background: '#5eead4',
                                            boxShadow: '0 0 8px rgba(94, 234, 212, 0.8)',
                                            transition: idx === currentIndex ? 'width 0.05s linear' : 'none'
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {/* Story Header: Poster profile, Title & Close */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '50%',
                                padding: '2px',
                                background: 'linear-gradient(135deg, #f59e0b, #0d9488)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '50%',
                                    background: '#042f2e',
                                    color: '#5eead4',
                                    fontWeight: 900,
                                    fontSize: '15px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    M
                                </div>
                            </div>

                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ color: '#fff', fontWeight: 800, fontSize: '14px' }}>
                                        My Store
                                    </span>
                                    <span style={{
                                        background: '#0d9488',
                                        color: '#fff',
                                        borderRadius: '50%',
                                        width: '14px',
                                        height: '14px',
                                        fontSize: '9px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        ✓
                                    </span>
                                </div>
                                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>
                                    {currentStory.createdAt ? new Date(currentStory.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Featured'}
                                </span>
                            </div>
                        </div>

                        {/* Controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {isVideo && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                                    style={{
                                        background: 'rgba(0,0,0,0.4)',
                                        border: 'none',
                                        color: '#fff',
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '14px'
                                    }}
                                >
                                    {isMuted ? <MutedOutlined /> : <SoundOutlined />}
                                </button>
                            )}

                            <button
                                onClick={(e) => { e.stopPropagation(); setIsPaused(!isPaused); }}
                                style={{
                                    background: 'rgba(0,0,0,0.4)',
                                    border: 'none',
                                    color: '#fff',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '13px'
                                }}
                            >
                                {isPaused ? <CaretRightOutlined /> : <PauseOutlined />}
                            </button>

                            <button
                                onClick={(e) => { e.stopPropagation(); onClose(); }}
                                style={{
                                    background: 'rgba(0,0,0,0.4)',
                                    border: 'none',
                                    color: '#fff',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '14px'
                                }}
                            >
                                <CloseOutlined />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ══ Tap Left / Right Areas (with Double Tap detection) ══ */}
                <div 
                    style={{ position: 'absolute', inset: 0, zIndex: 5, display: 'flex' }}
                    onClick={handleDoubleTap}
                >
                    <div
                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                        style={{ width: '35%', height: '100%', cursor: 'pointer' }}
                    />
                    <div
                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                        style={{ width: '65%', height: '100%', cursor: 'pointer' }}
                    />
                </div>

                {/* ══ Bottom Info, Interactive Product Pill & Like Button ══ */}
                <div style={{
                    position: 'relative',
                    zIndex: 10,
                    padding: '28px 16px 20px 16px',
                    background: 'linear-gradient(0deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)'
                }}>
                    {/* Caption / Title */}
                    {currentStory.title && (
                        <div style={{
                            color: '#fff',
                            fontSize: '15px',
                            fontWeight: 700,
                            lineHeight: 1.4,
                            marginBottom: '14px',
                            textShadow: '0 2px 8px rgba(0,0,0,0.8)'
                        }}>
                            {currentStory.title}
                        </div>
                    )}

                    {/* Linked Product Card or Shop Button */}
                    {(currentStory.productName || currentStory.productId || currentStory.storyLink) ? (
                        <div
                            onClick={handleProductClick}
                            style={{
                                background: 'rgba(255, 255, 255, 0.15)',
                                backdropFilter: 'blur(16px)',
                                border: '1px solid rgba(255, 255, 255, 0.25)',
                                borderRadius: '18px',
                                padding: '12px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                                marginBottom: '14px'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #0d9488, #5eead4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#042f2e',
                                    fontSize: '16px',
                                    flexShrink: 0
                                }}>
                                    <ShoppingOutlined />
                                </div>
                                <div style={{ overflow: 'hidden' }}>
                                    <div style={{
                                        color: '#fff',
                                        fontSize: '13px',
                                        fontWeight: 700,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {currentStory.productName || 'Featured Product'}
                                    </div>
                                    {currentStory.productPrice > 0 && (
                                        <div style={{ color: '#f59e0b', fontSize: '12px', fontWeight: 800 }}>
                                            Rs. {currentStory.productPrice.toLocaleString()}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                style={{
                                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                    color: '#042f2e',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '12px',
                                    fontWeight: 800,
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    flexShrink: 0,
                                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
                                }}
                            >
                                Shop Now <ArrowRightOutlined />
                            </button>
                        </div>
                    ) : (
                        <div
                            onClick={handleProductClick}
                            style={{
                                background: 'rgba(255, 255, 255, 0.12)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '16px',
                                padding: '10px 16px',
                                textAlign: 'center',
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '13px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                marginBottom: '14px'
                            }}
                        >
                            <ShoppingOutlined style={{ color: '#5eead4' }} /> Explore All Products →
                        </div>
                    )}

                    {/* ══ Interactive Like Bar (Heart Button & Likes Count) ══ */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '4px 8px'
                    }}>
                        <div style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '12px', fontStyle: 'italic' }}>
                            Double-tap or tap ❤️ to like
                        </div>

                        <button
                            onClick={handleToggleLike}
                            style={{
                                background: currentLikeInfo.isLiked 
                                    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.35), rgba(244, 63, 94, 0.25))' 
                                    : 'rgba(255, 255, 255, 0.15)',
                                backdropFilter: 'blur(12px)',
                                border: currentLikeInfo.isLiked ? '1px solid rgba(239, 68, 68, 0.6)' : '1px solid rgba(255, 255, 255, 0.25)',
                                color: currentLikeInfo.isLiked ? '#ff3b5c' : '#ffffff',
                                padding: '8px 16px',
                                borderRadius: '30px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '14px',
                                fontWeight: 700,
                                transition: 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                transform: currentLikeInfo.isLiked ? 'scale(1.05)' : 'scale(1)',
                                boxShadow: currentLikeInfo.isLiked ? '0 4px 16px rgba(255, 59, 92, 0.4)' : 'none'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = currentLikeInfo.isLiked ? 'scale(1.05)' : 'scale(1)'}
                        >
                            {currentLikeInfo.isLiked ? (
                                <HeartFilled style={{ fontSize: '18px', color: '#ff2b56' }} />
                            ) : (
                                <HeartOutlined style={{ fontSize: '18px' }} />
                            )}
                            <span>{currentLikeInfo.count > 0 ? currentLikeInfo.count : 'Like'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Desktop Navigation Floating Chevrons */}
            <button
                onClick={handlePrev}
                style={{
                    position: 'absolute',
                    left: 'calc(50% - 280px)',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '18px',
                    zIndex: 20,
                    transition: 'all 0.2s'
                }}
                className="d-none d-md-flex"
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >
                <LeftOutlined />
            </button>

            <button
                onClick={handleNext}
                style={{
                    position: 'absolute',
                    right: 'calc(50% - 280px)',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '18px',
                    zIndex: 20,
                    transition: 'all 0.2s'
                }}
                className="d-none d-md-flex"
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >
                <RightOutlined />
            </button>
        </div>
    );
};

export default StoryViewer;
