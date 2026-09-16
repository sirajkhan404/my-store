import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const services = [
    {
        id: 1,
        icon: '🚀',
        title: 'Express Delivery',
        desc: 'Get your orders delivered at lightning speed. We partner with top logistics providers to ensure same-day and next-day delivery options.',
        badge: 'Same Day',
        badgeColor: '#10b981',
        gradient: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
        iconBg: 'linear-gradient(135deg, #10b981, #059669)',
    },
    {
        id: 2,
        icon: '🛡️',
        title: 'Secure Payments',
        desc: 'Shop with confidence. All transactions are protected with 256-bit SSL encryption and multiple payment gateways for maximum safety.',
        badge: '100% Safe',
        badgeColor: '#3b82f6',
        gradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
        iconBg: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    },
    {
        id: 3,
        icon: '🔄',
        title: 'Easy Returns',
        desc: 'Not satisfied? No problem. Enjoy hassle-free returns within 30 days of purchase — no questions asked, full refund guaranteed.',
        badge: '30 Days',
        badgeColor: '#f59e0b',
        gradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        iconBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
    },
    {
        id: 4,
        icon: '🎧',
        title: '24/7 Customer Support',
        desc: 'Our dedicated support team is available around the clock via live chat, phone, and email to resolve any issue instantly.',
        badge: 'Always On',
        badgeColor: '#8b5cf6',
        gradient: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
        iconBg: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    },
    {
        id: 5,
        icon: '🎁',
        title: 'Exclusive Deals',
        desc: 'Members enjoy exclusive discounts, early sale access, loyalty reward points, and special seasonal offers curated just for them.',
        badge: 'Members Only',
        badgeColor: '#ec4899',
        gradient: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
        iconBg: 'linear-gradient(135deg, #ec4899, #be185d)',
    },
    {
        id: 6,
        icon: '✅',
        title: 'Quality Guaranteed',
        desc: 'Every product listed on My Store passes strict quality checks. We source only from trusted, verified suppliers and manufacturers.',
        badge: 'Verified',
        badgeColor: '#14b8a6',
        gradient: 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)',
        iconBg: 'linear-gradient(135deg, #14b8a6, #0d9488)',
    },
];

const ServiceCard = ({ service, index }) => {
    const [visible, setVisible] = useState(false);
    const [hovered, setHovered] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.15 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className="col-12 col-sm-6 col-lg-4"
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(40px)',
                transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`,
            }}
        >
            <div
                className="h-100 rounded-4 p-4 position-relative overflow-hidden border"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    background: hovered ? service.gradient : '#fff',
                    borderColor: hovered ? 'transparent' : 'rgba(0,0,0,0.07)',
                    boxShadow: hovered
                        ? '0 20px 50px rgba(0,0,0,0.12)'
                        : '0 4px 20px rgba(0,0,0,0.05)',
                    transition: 'all 0.35s ease',
                    cursor: 'default',
                }}
            >
                {/* Top-right badge */}
                <span
                    className="position-absolute top-0 end-0 m-3 px-2 py-1 rounded-pill fw-bold"
                    style={{
                        fontSize: '10px',
                        background: service.badgeColor + '20',
                        color: service.badgeColor,
                        border: `1px solid ${service.badgeColor}40`,
                        letterSpacing: '0.3px',
                    }}
                >
                    {service.badge}
                </span>

                {/* Icon */}
                <div
                    className="d-flex align-items-center justify-content-center rounded-3 mb-4 shadow"
                    style={{
                        width: '64px',
                        height: '64px',
                        fontSize: '28px',
                        background: service.iconBg,
                        transform: hovered ? 'scale(1.1) rotate(-4deg)' : 'scale(1) rotate(0deg)',
                        transition: 'transform 0.35s ease',
                    }}
                >
                    {service.icon}
                </div>

                <h5 className="fw-bold mb-2 text-dark fs-5">{service.title}</h5>
                <p className="text-muted mb-0 lh-base" style={{ fontSize: '14px' }}>{service.desc}</p>

                {/* Bottom accent bar */}
                <div
                    className="position-absolute bottom-0 start-0 rounded-bottom-4"
                    style={{
                        height: '3px',
                        width: hovered ? '100%' : '0%',
                        background: service.iconBg,
                        transition: 'width 0.4s ease',
                    }}
                />
            </div>
        </div>
    );
};

const ServiceSection = () => {
    const [headerVisible, setHeaderVisible] = useState(false);
    const headerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setHeaderVisible(true); },
            { threshold: 0.2 }
        );
        if (headerRef.current) observer.observe(headerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section className="py-5 position-relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)' }}>

            {/* Decorative blobs */}
            <div className="position-absolute" style={{ width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', top: '-100px', left: '-100px', zIndex: 0, pointerEvents: 'none' }} />
            <div className="position-absolute" style={{ width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.07) 0%, transparent 70%)', bottom: '-80px', right: '-80px', zIndex: 0, pointerEvents: 'none' }} />

            <div className="container py-4 position-relative" style={{ zIndex: 1 }}>

                {/* Section Header */}
                <div
                    ref={headerRef}
                    className="text-center mb-5"
                    style={{
                        opacity: headerVisible ? 1 : 0,
                        transform: headerVisible ? 'translateY(0)' : 'translateY(30px)',
                        transition: 'opacity 0.7s ease, transform 0.7s ease',
                    }}
                >
                    <span
                        className="px-3 py-2 rounded-pill fw-bold d-inline-block mb-3"
                        style={{
                            background: 'linear-gradient(135deg, #ede9fe, #dbeafe)',
                            color: '#4f46e5',
                            fontSize: '12px',
                            letterSpacing: '1.5px',
                            textTransform: 'uppercase',
                        }}
                    >
                        ✨ What We Offer
                    </span>
                    <h2 className="display-5 fw-bold text-dark mb-3" style={{ letterSpacing: '-0.5px' }}>
                        Our Premium{' '}
                        <span style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Services
                        </span>
                    </h2>
                    <p className="text-muted mx-auto fs-6 lh-lg" style={{ maxWidth: '560px' }}>
                        We go beyond just selling products. From lightning-fast delivery to round-the-clock support — we've built every service with you in mind.
                    </p>
                    <div className="mx-auto mt-3 rounded-pill" style={{ width: '60px', height: '4px', background: 'linear-gradient(135deg, #4f46e5, #ec4899)' }} />
                </div>

                {/* Service Cards Grid */}
                <div className="row g-4">
                    {services.map((service, i) => (
                        <ServiceCard key={service.id} service={service} index={i} />
                    ))}
                </div>

                {/* Bottom CTA */}
                <div
                    className="mt-5 pt-3 text-center"
                    style={{
                        opacity: headerVisible ? 1 : 0,
                        transition: 'opacity 1s ease 0.5s',
                    }}
                >
                    <div
                        className="d-inline-flex align-items-center gap-3 px-5 py-4 rounded-4 shadow-sm border flex-wrap justify-content-center"
                        style={{ background: 'linear-gradient(135deg, #fff, #f8faff)', borderColor: 'rgba(99,102,241,0.15)' }}
                    >
                        <div className="text-center text-sm-start">
                            <div className="fw-bold text-dark fs-6 mb-1">Ready to experience the difference?</div>
                            <div className="text-muted" style={{ fontSize: '13px' }}>Join thousands of happy shoppers today.</div>
                        </div>
                        <Link
                            to="/products"
                            className="btn btn-lg rounded-pill text-white fw-bold px-4 flex-shrink-0 shadow"
                            style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', border: 'none', fontSize: '14px' }}
                        >
                            Shop Now →
                        </Link>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ServiceSection;
