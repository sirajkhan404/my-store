import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
    MailOutlined,
    ArrowLeftOutlined,
    KeyOutlined,
    CheckCircleFilled,
    SafetyCertificateFilled
} from "@ant-design/icons"

const initialState = { email: "" }

const ForgotPassword = () => {
    const [state, setState] = useState(initialState)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isSent, setIsSent] = useState(false)
    const navigate = useNavigate()

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

    const handleForgotPassword = (e) => {
        e.preventDefault()
        let { email } = state
        if (!email || !email.includes("@")) {
            return window.toastify("Please enter a valid email address", "warning")
        }

        setIsProcessing(true)
        setTimeout(() => {
            setIsProcessing(false)
            setIsSent(true)
            window.toastify("Password reset instructions sent! Please check your inbox 📧", "success")
        }, 1200)
    }

    return (
        <main
            style={{
                minHeight: "100vh",
                background: "#021212",
                backgroundImage: `
                    radial-gradient(circle at 15% 20%, rgba(13, 148, 136, 0.28) 0%, transparent 40%),
                    radial-gradient(circle at 85% 75%, rgba(16, 185, 129, 0.22) 0%, transparent 40%),
                    radial-gradient(circle at 50% 50%, rgba(6, 78, 59, 0.3) 0%, transparent 60%),
                    linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
                `,
                backgroundSize: "100% 100%, 100% 100%, 100% 100%, 32px 32px, 32px 32px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "32px 16px",
                position: "relative",
                overflow: "hidden",
                color: "#ffffff",
                fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            }}
        >
            {/* Top Glow Highlights */}
            <div
                style={{
                    position: "absolute",
                    top: "-120px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "700px",
                    height: "250px",
                    borderRadius: "50%",
                    background: "radial-gradient(ellipse, rgba(45, 212, 191, 0.2) 0%, transparent 70%)",
                    pointerEvents: "none",
                    filter: "blur(50px)",
                    zIndex: 0
                }}
            />

            {/* Top Navigation */}
            <div
                style={{
                    width: "100%",
                    maxWidth: "520px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "24px",
                    zIndex: 2
                }}
            >
                <Link
                    to="/auth/login"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "#a7f3d0",
                        textDecoration: "none",
                        fontSize: "13px",
                        fontWeight: 700,
                        padding: "9px 18px",
                        borderRadius: "14px",
                        background: "rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(16px)",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.25)",
                        transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"
                        e.currentTarget.style.borderColor = "#5eead4"
                        e.currentTarget.style.transform = "translateX(-3px)"
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)"
                        e.currentTarget.style.transform = "translateX(0)"
                    }}
                >
                    <ArrowLeftOutlined /> Back to Sign In
                </Link>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#5eead4",
                            background: "rgba(13, 148, 136, 0.2)",
                            border: "1px solid rgba(94, 234, 212, 0.3)",
                            padding: "6px 14px",
                            borderRadius: "30px",
                            backdropFilter: "blur(10px)"
                        }}
                    >
                        <SafetyCertificateFilled style={{ color: "#34d399", fontSize: "14px" }} />
                        <span>Secure Recovery</span>
                    </div>
                </div>
            </div>

            {/* Main Recovery Card */}
            <div
                style={{
                    width: "100%",
                    maxWidth: "520px",
                    background: "rgba(4, 28, 27, 0.72)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    borderRadius: "32px",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    boxShadow: "0 30px 90px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(94, 234, 212, 0.15)",
                    overflow: "hidden",
                    padding: "40px 32px",
                    position: "relative",
                    zIndex: 1
                }}
            >
                {/* Header Icon */}
                <div style={{ textAlign: "center", marginBottom: "26px" }}>
                    <div
                        style={{
                            width: "68px",
                            height: "68px",
                            borderRadius: "20px",
                            background: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)",
                            color: "#ffffff",
                            fontSize: "28px",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 12px 28px rgba(13, 148, 136, 0.45)",
                            marginBottom: "18px"
                        }}
                    >
                        <KeyOutlined />
                    </div>
                    <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#ffffff", marginBottom: "8px", letterSpacing: "-0.5px" }}>
                        Reset Your Password
                    </h1>
                    <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.65)", maxWidth: "380px", margin: "0 auto", lineHeight: 1.5 }}>
                        Enter the email associated with your MyStore account and we'll send a secure reset link.
                    </p>
                </div>

                {isSent ? (
                    <div
                        style={{
                            background: "rgba(16, 185, 129, 0.12)",
                            border: "1px solid rgba(52, 211, 153, 0.3)",
                            borderRadius: "20px",
                            padding: "26px 20px",
                            textAlign: "center"
                        }}
                    >
                        <div style={{ fontSize: "40px", color: "#34d399", marginBottom: "12px" }}>
                            <CheckCircleFilled />
                        </div>
                        <h4 style={{ fontSize: "18px", fontWeight: 800, color: "#ffffff", marginBottom: "8px" }}>
                            Recovery Link Sent!
                        </h4>
                        <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.8)", marginBottom: "22px" }}>
                            We've sent an email to <strong style={{ color: "#34d399" }}>{state.email}</strong> with instructions to reset your password.
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate("/auth/login")}
                            style={{
                                width: "100%",
                                height: "48px",
                                borderRadius: "14px",
                                border: "none",
                                background: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)",
                                color: "#ffffff",
                                fontSize: "14px",
                                fontWeight: 700,
                                cursor: "pointer",
                                boxShadow: "0 10px 25px rgba(13, 148, 136, 0.4)"
                            }}
                        >
                            Return to Sign In
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleForgotPassword}>
                        <div style={{ marginBottom: "22px" }}>
                            <label
                                htmlFor="reset-email"
                                style={{
                                    display: "block",
                                    fontSize: "13px",
                                    fontWeight: 700,
                                    color: "rgba(255, 255, 255, 0.9)",
                                    marginBottom: "8px"
                                }}
                            >
                                Registered Email Address
                            </label>
                            <div style={{ position: "relative" }}>
                                <span
                                    style={{
                                        position: "absolute",
                                        left: "16px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#5eead4",
                                        fontSize: "16px",
                                        pointerEvents: "none"
                                    }}
                                >
                                    <MailOutlined />
                                </span>
                                <input
                                    id="reset-email"
                                    type="email"
                                    name="email"
                                    placeholder="you@domain.com"
                                    value={state.email}
                                    onChange={handleChange}
                                    required
                                    autoComplete="email"
                                    style={{
                                        width: "100%",
                                        height: "50px",
                                        padding: "0 16px 0 46px",
                                        fontSize: "14px",
                                        color: "#ffffff",
                                        background: "rgba(255, 255, 255, 0.05)",
                                        border: "1px solid rgba(255, 255, 255, 0.12)",
                                        borderRadius: "14px",
                                        outline: "none",
                                        transition: "all 0.25s ease",
                                        boxSizing: "border-box"
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = "#34d399"
                                        e.target.style.background = "rgba(255, 255, 255, 0.08)"
                                        e.target.style.boxShadow = "0 0 0 4px rgba(52, 211, 153, 0.15)"
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = "rgba(255, 255, 255, 0.12)"
                                        e.target.style.background = "rgba(255, 255, 255, 0.05)"
                                        e.target.style.boxShadow = "none"
                                    }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isProcessing}
                            style={{
                                width: "100%",
                                height: "52px",
                                borderRadius: "16px",
                                border: "none",
                                background: isProcessing
                                    ? "rgba(255, 255, 255, 0.2)"
                                    : "linear-gradient(135deg, #10b981 0%, #0d9488 60%, #065f46 100%)",
                                color: "#ffffff",
                                fontSize: "15px",
                                fontWeight: 800,
                                letterSpacing: "0.2px",
                                cursor: isProcessing ? "not-allowed" : "pointer",
                                boxShadow: isProcessing ? "none" : "0 12px 30px rgba(16, 185, 129, 0.45)",
                                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "10px"
                            }}
                            onMouseEnter={(e) => {
                                if (!isProcessing) {
                                    e.currentTarget.style.transform = "translateY(-2px)"
                                    e.currentTarget.style.boxShadow = "0 16px 36px rgba(16, 185, 129, 0.55)"
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isProcessing) {
                                    e.currentTarget.style.transform = "translateY(0)"
                                    e.currentTarget.style.boxShadow = "0 12px 30px rgba(16, 185, 129, 0.45)"
                                }
                            }}
                        >
                            {isProcessing ? (
                                <>
                                    <div
                                        className="spinner-border spinner-border-sm"
                                        role="status"
                                        style={{ width: "18px", height: "18px", borderWidth: "2px" }}
                                    />
                                    <span>Sending Recovery Link...</span>
                                </>
                            ) : (
                                <>
                                    <span>Send Reset Link</span>
                                    <span style={{ fontSize: "16px" }}>→</span>
                                </>
                            )}
                        </button>

                        <div style={{ marginTop: "24px", textAlign: "center", fontSize: "13px", color: "rgba(255, 255, 255, 0.6)" }}>
                            Remember your password?{" "}
                            <Link
                                to="/auth/login"
                                style={{
                                    color: "#34d399",
                                    fontWeight: 800,
                                    textDecoration: "none",
                                    marginLeft: "4px"
                                }}
                            >
                                Sign In
                            </Link>
                        </div>
                    </form>
                )}
            </div>

            {/* Footer Note */}
            <div style={{ marginTop: "24px", textAlign: "center", fontSize: "12px", color: "rgba(255, 255, 255, 0.45)", zIndex: 1 }}>
                Protected by Cloudflare & SSL 256-Bit Encryption • MyStore © {new Date().getFullYear()}
            </div>
        </main>
    )
}

export default ForgotPassword