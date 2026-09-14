import React, { useState } from 'react';

const WhatsAppButton = () => {
    const [isHovered, setIsHovered] = useState(false);

    // WhatsApp phone number formatted for Pakistan (+92 346 6407536 -> 923466407536)
    const phoneNumber = "923466407536";
    const defaultMessage = encodeURIComponent("Hello MyStore! I have an inquiry about your products/services.");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

    return (
        <>
            {/* WhatsApp Floating Button */}
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="position-fixed d-flex align-items-center justify-content-center text-white text-decoration-none rounded-circle shadow-lg"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                aria-label="Chat on WhatsApp"
                title="Chat with us on WhatsApp"
                style={{
                    bottom: '28px',
                    right: '28px',
                    width: '60px',
                    height: '60px',
                    backgroundColor: isHovered ? '#20ba5a' : '#25D366',
                    zIndex: 9999,
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    transform: isHovered ? 'scale(1.1) translateY(-3px)' : 'scale(1)',
                    boxShadow: isHovered ? '0 10px 25px rgba(37, 211, 102, 0.5)' : '0 6px 20px rgba(37, 211, 102, 0.4)'
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
            </a>

            {/* Tooltip (Hidden on small screens using Bootstrap d-none d-sm-block) */}
            <div className={`position-fixed bg-dark text-white px-3 py-2 rounded-3 shadow-lg d-none d-sm-block transition-all ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                style={{
                    bottom: '38px',
                    right: '98px',
                    fontSize: '13px',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    zIndex: 9998,
                    pointerEvents: 'none',
                    transform: isHovered ? 'translateX(0)' : 'translateX(10px)',
                    transition: 'all 0.25s ease'
                }}
            >
                Chat with us on WhatsApp! 💬
                <span className="position-absolute top-50 translate-middle-y"
                    style={{
                        right: '-6px',
                        borderWidth: '6px 0 6px 6px',
                        borderStyle: 'solid',
                        borderColor: 'transparent transparent transparent #0f172a'
                    }}
                />
            </div>
        </>
    );
};

export default WhatsAppButton;