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
                background: "linear-gradient(135deg, #f0fdf4 0%, #f8fafc 40%, #ecfdf5 100%)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "24px 16px",
                position: "relative",
                overflow: "hidden",
                fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            }}
        >
            {/* Background Ambient Glows */}
            <div
                style={{
                    position: "absolute",
                    top: "-80px",
                    left: "-80px",
                    width: "420px",
                    height: "420px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(13, 148, 136, 0.12) 0%, transparent 70%)",
                    pointerEvents: "none",
                    zIndex: 0
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: "-80px",
                    right: "-80px",
                    width: "400px",
                    height: "400px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)",
                    pointerEvents: "none",
                    zIndex: 0
                }}
            />

            {/* Top Navigation Bar */}
            <div
                style={{
                    width: "100%",
                    maxWidth: "500px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                    zIndex: 2
                }}
            >
                <Link
                    to="/auth/login"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "#0f766e",
                        textDecoration: "none",
                        fontSize: "14px",
                        fontWeight: 700,
                        padding: "8px 16px",
                        borderRadius: "12px",
                        background: "#ffffff",
                        border: "1px solid #ccfbf1",
                        boxShadow: "0 2px 8px rgba(13, 148, 136, 0.06)",
                        transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateX(-3px)"
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(13, 148, 136, 0.12)"
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateX(0)"
                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(13, 148, 136, 0.06)"
                    }}
                >
                    <ArrowLeftOutlined /> Back to Sign In
                </Link>

                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#0f766e",
                        background: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                        padding: "6px 14px",
                        borderRadius: "20px"
                    }}
                >
                    <SafetyCertificateFilled style={{ color: "#10b981" }} />
                    <span>Secure Recovery</span>
                </div>
            </div>

            {/* Main Recovery Card */}
            <div
                style={{
                    width: "100%",
                    maxWidth: "500px",
                    background: "#ffffff",
                    borderRadius: "28px",
                    boxShadow: "0 20px 60px -15px rgba(15, 23, 42, 0.1), 0 0 1px 1px rgba(13, 148, 136, 0.08)",
                    border: "1px solid #e2e8f0",
                    overflow: "hidden",
                    padding: "36px 30px",
                    position: "relative",
                    zIndex: 1
                }}
            >
                {/* Header Icon */}
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                    <div
                        style={{
                            width: "64px",
                            height: "64px",
                            borderRadius: "20px",
                            background: "linear-gradient(135deg, #14b8a6, #0d9488)",
                            color: "#ffffff",
                            fontSize: "26px",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 10px 25px rgba(13, 148, 136, 0.35)",
                            marginBottom: "16px"
                        }}
                    >
                        <KeyOutlined />
                    </div>
                    <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", marginBottom: "8px", letterSpacing: "-0.5px" }}>
                        Reset Your Password
                    </h1>
                    <p style={{ fontSize: "14px", color: "#64748b", maxWidth: "380px", margin: "0 auto", lineHeight: 1.5 }}>
                        Enter the email associated with your MyStore account and we'll send a secure reset link.
                    </p>
                </div>

                {isSent ? (
                    <div
                        style={{
                            background: "#f0fdf4",
                            border: "1px solid #bbf7d0",
                            borderRadius: "16px",
                            padding: "24px 20px",
                            textAlign: "center"
                        }}
                    >
                        <div style={{ fontSize: "36px", color: "#10b981", marginBottom: "12px" }}>
                            <CheckCircleFilled />
                        </div>
                        <h4 style={{ fontSize: "17px", fontWeight: 800, color: "#166534", marginBottom: "8px" }}>
                            Recovery Link Sent!
                        </h4>
                        <p style={{ fontSize: "13px", color: "#15803d", marginBottom: "20px" }}>
                            We've sent an email to <strong>{state.email}</strong> with instructions to reset your password.
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate("/auth/login")}
                            style={{
                                width: "100%",
                                height: "46px",
                                borderRadius: "12px",
                                border: "none",
                                background: "#0d9488",
                                color: "#ffffff",
                                fontSize: "14px",
                                fontWeight: 700,
                                cursor: "pointer"
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
                                    color: "#334155",
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
                                        color: "#94a3b8",
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
                                    placeholder="name@example.com"
                                    value={state.email}
                                    onChange={handleChange}
                                    required
                                    autoComplete="email"
                                    style={{
                                        width: "100%",
                                        height: "48px",
                                        padding: "0 16px 0 46px",
                                        fontSize: "14px",
                                        color: "#0f172a",
                                        background: "#f8fafc",
                                        border: "1.5px solid #e2e8f0",
                                        borderRadius: "12px",
                                        outline: "none",
                                        transition: "all 0.2s ease",
                                        boxSizing: "border-box"
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = "#0d9488"
                                        e.target.style.background = "#ffffff"
                                        e.target.style.boxShadow = "0 0 0 4px rgba(13, 148, 136, 0.12)"
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = "#e2e8f0"
                                        e.target.style.background = "#f8fafc"
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
                                height: "50px",
                                borderRadius: "14px",
                                border: "none",
                                background: isProcessing
                                    ? "#94a3b8"
                                    : "linear-gradient(135deg, #0d9488 0%, #042f2e 100%)",
                                color: "#ffffff",
                                fontSize: "15px",
                                fontWeight: 700,
                                cursor: isProcessing ? "not-allowed" : "pointer",
                                boxShadow: isProcessing ? "none" : "0 10px 25px -5px rgba(13, 148, 136, 0.45)",
                                transition: "all 0.25s ease",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "10px"
                            }}
                            onMouseEnter={(e) => {
                                if (!isProcessing) {
                                    e.currentTarget.style.transform = "translateY(-2px)"
                                    e.currentTarget.style.boxShadow = "0 14px 30px -5px rgba(13, 148, 136, 0.55)"
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isProcessing) {
                                    e.currentTarget.style.transform = "translateY(0)"
                                    e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(13, 148, 136, 0.45)"
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
                                    <span>Sending Link...</span>
                                </>
                            ) : (
                                <>
                                    <span>Send Password Reset Link</span>
                                    <span style={{ fontSize: "16px" }}>→</span>
                                </>
                            )}
                        </button>

                        <div style={{ marginTop: "24px", textAlign: "center", fontSize: "13px", color: "#64748b" }}>
                            Remember your password?{" "}
                            <Link
                                to="/auth/login"
                                style={{
                                    color: "#0d9488",
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

            {/* Footer */}
            <div style={{ marginTop: "20px", textAlign: "center", fontSize: "12px", color: "#64748b", zIndex: 1 }}>
                Protected by MyStore Security • All Rights Reserved © {new Date().getFullYear()}
            </div>
        </main>
    )
}

export default ForgotPassword