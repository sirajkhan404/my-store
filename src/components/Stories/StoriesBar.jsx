import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { PlusOutlined, FireFilled, ThunderboltFilled } from '@ant-design/icons';
import { useAuth } from '@/context/Auth';
import StoryViewer from './StoryViewer';

const StoriesBar = () => {
    const { user } = useAuth();
    const isSuperAdmin = user?.role === 'superAdmin';

    const [stories, setStories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStoryIndex, setSelectedStoryIndex] = useState(null);
    const [seenStories, setSeenStories] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('mystore_seen_stories') || '[]');
        } catch {
            return [];
        }
    });

    // Fetch active stories
    const fetchPublicStories = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${window.api}/api/stories/public-all`);
            if (res.data && res.data.stories) {
                setStories(res.data.stories);
            }
        } catch (err) {
            console.error('Stories fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPublicStories();
    }, []);

    // Open Story
    const handleOpenStory = (index) => {
        const story = stories[index];
        if (story) {
            if (!seenStories.includes(story.id)) {
                const updated = [...seenStories, story.id];
                setSeenStories(updated);
                localStorage.setItem('mystore_seen_stories', JSON.stringify(updated));
            }
        }
        setSelectedStoryIndex(index);
    };

    // If no stories and not superAdmin, hide
    if (!isLoading && stories.length === 0 && !isSuperAdmin) {
        return null;
    }

    return (
        <section style={{
            background: 'linear-gradient(180deg, #f0fdfa 0%, #ffffff 100%)',
            padding: '20px 0 10px 0',
            borderBottom: '1px solid rgba(13, 148, 136, 0.08)'
        }}>
            <div className="container">
                {/* Header label */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '14px',
                    padding: '0 4px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                            background: 'linear-gradient(135deg, #0d9488, #042f2e)',
                            color: '#5eead4',
                            borderRadius: '8px',
                            padding: '4px 8px',
                            fontSize: '12px',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            <ThunderboltFilled style={{ color: '#f59e0b' }} /> STORE STORIES
                        </span>
                        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
                            Daily Highlights & Exclusive Offers
                        </span>
                    </div>

                    {isSuperAdmin && (
                        <Link
                            to="/dashboard/stories"
                            style={{
                                color: '#0d9488',
                                fontSize: '13px',
                                fontWeight: 700,
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}
                        >
                            Manage Stories →
                        </Link>
                    )}
                </div>

                {/* Horizontal Scroll Stories List */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '18px',
                        overflowX: 'auto',
                        paddingBottom: '12px',
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#0d9488 #f1f5f9',
                        WebkitOverflowScrolling: 'touch'
                    }}
                >
                    {/* SuperAdmin Quick "+ Add Story" Circle */}
                    {isSuperAdmin && (
                        <Link
                            to="/dashboard/stories"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px',
                                textDecoration: 'none',
                                flexShrink: 0,
                                width: '80px',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{
                                width: '70px',
                                height: '70px',
                                borderRadius: '50%',
                                border: '2px dashed #0d9488',
                                background: '#f0fdfa',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#0d9488',
                                fontSize: '24px',
                                transition: 'all 0.2s ease',
                                position: 'relative'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.06)';
                                e.currentTarget.style.background = '#ccfbf1';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.background = '#f0fdfa';
                            }}
                            >
                                <PlusOutlined />
                            </div>
                            <span style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                color: '#0d9488',
                                textAlign: 'center',
                                whiteSpace: 'nowrap'
                            }}>
                                Add Story
                            </span>
                        </Link>
                    )}

                    {/* Stories Avatars */}
                    {stories.map((story, idx) => {
                        const isSeen = seenStories.includes(story.id);
                        const isVideo = story.mediaType === 'video' || story.mediaURL?.endsWith('.mp4');

                        return (
                            <div
                                key={story.id || idx}
                                onClick={() => handleOpenStory(idx)}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '8px',
                                    cursor: 'pointer',
                                    flexShrink: 0,
                                    width: '80px',
                                    userSelect: 'none'
                                }}
                            >
                                {/* Gradient Ring */}
                                <div
                                    style={{
                                        width: '74px',
                                        height: '74px',
                                        borderRadius: '50%',
                                        padding: '3px',
                                        background: isSeen
                                            ? '#cbd5e1'
                                            : 'linear-gradient(135deg, #f59e0b 0%, #0d9488 50%, #5eead4 100%)',
                                        boxShadow: isSeen
                                            ? 'none'
                                            : '0 4px 14px rgba(13, 148, 136, 0.35)',
                                        transition: 'all 0.25s ease',
                                        position: 'relative'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    {/* Inner white gap */}
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '50%',
                                        padding: '2px',
                                        background: '#fff',
                                        overflow: 'hidden'
                                    }}>
                                        {/* Thumbnail Media */}
                                        {isVideo ? (
                                            <video
                                                src={story.mediaURL}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                                                muted
                                            />
                                        ) : (
                                            <img
                                                src={story.mediaURL}
                                                alt={story.title || 'Story'}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                                                loading="lazy"
                                            />
                                        )}
                                    </div>

                                    {/* Live / Promo Badge if tagged */}
                                    {story.productPrice > 0 && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '-2px',
                                            right: '-2px',
                                            background: '#f59e0b',
                                            color: '#042f2e',
                                            borderRadius: '50%',
                                            width: '20px',
                                            height: '20px',
                                            fontSize: '10px',
                                            fontWeight: 900,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '2px solid #fff',
                                            boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                                        }}>
                                            <FireFilled />
                                        </div>
                                    )}
                                </div>

                                {/* Caption label */}
                                <span style={{
                                    fontSize: '11px',
                                    fontWeight: isSeen ? 600 : 700,
                                    color: isSeen ? '#64748b' : '#042f2e',
                                    textAlign: 'center',
                                    width: '100%',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {story.title || 'Special'}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Story Viewer Modal */}
            {selectedStoryIndex !== null && (
                <StoryViewer
                    stories={stories}
                    initialIndex={selectedStoryIndex}
                    onClose={() => setSelectedStoryIndex(null)}
                />
            )}
        </section>
    );
};

export default StoriesBar;
