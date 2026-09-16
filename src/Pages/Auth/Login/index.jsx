import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../../context/Auth"
import axios from "axios"
import {
    MailOutlined,
    LockOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    ArrowLeftOutlined,
    SafetyCertificateFilled,
    CheckCircleFilled,
    ThunderboltFilled,
    ShoppingFilled,
    StarFilled,
    CrownFilled,
    GlobalOutlined
} from "@ant-design/icons"

const initialState = { email: "", password: "" }

const Login = () => {
    const { readProfile } = useAuth()
    const navigate = useNavigate()

    const [state, setState] = useState(initialState)
    const [isProcessing, setIsProcessing] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(true)

    useEffect(() => {
        const savedEmail = localStorage.getItem("mystore_remember_email")
        if (savedEmail) {
            setState(s => ({ ...s, email: savedEmail }))
        }
    }, [])

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

    const handleLogin = (e) => {
        e.preventDefault()
        let { email, password } = state

        if (!email || !password) {
            window.toastify("Please enter both email and password", "warning")
            return
        }

        const userData = { email: email.trim().toLowerCase(), password }
        setIsProcessing(true)

        axios.post(`${window.api}/api/auth/login`, userData)
            .then((res) => {
                const { status, data } = res
                if (status === 200) {
                    if (rememberMe) {
                        localStorage.setItem("mystore_remember_email", email.trim().toLowerCase())
                    } else {
                        localStorage.removeItem("mystore_remember_email")
                    }
                    localStorage.setItem("jwt", data.token)
                    readProfile(data.token)
                    window.toastify("Welcome back! Login successful 🎉", "success")
                    navigate("/dashboard")
                } else {
                    window.toastify(data?.message || "Invalid credentials", "error")
                }
            })
            .catch(error => {
                console.error(error)
                window.toastify(error?.response?.data?.message || "Internal server error", "error")
            })
            .finally(() => {
                setIsProcessing(false)
            })
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
                    top: "-150px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "800px",
                    height: "300px",
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
                    maxWidth: "1120px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "24px",
                    zIndex: 2
                }}
            >
                <Link
                    to="/"
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
                    <ArrowLeftOutlined /> Back to Store
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
                        <span>256-Bit SSL Encrypted</span>
                    </div>
                </div>
            </div>

            {/* Main Luxury Glass Card */}
            <div
                style={{
                    width: "100%",
                    maxWidth: "1120px",
                    background: "rgba(4, 28, 27, 0.72)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    borderRadius: "32px",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    boxShadow: "0 30px 90px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(94, 234, 212, 0.15)",
                    overflow: "hidden",
                    display: "flex",
                    flexWrap: "wrap",
                    position: "relative",
                    zIndex: 1
                }}
            >
                {/* ══ LEFT SHOWCASE HERO (Desktop & Large Screens) ══ */}
                <div
                    className="col-12 col-lg-5 d-none d-lg-flex flex-column justify-content-between p-4 p-xl-5"
                    style={{
                        background: "linear-gradient(160deg, rgba(6, 78, 59, 0.6) 0%, rgba(4, 47, 46, 0.8) 50%, rgba(2, 26, 25, 0.95) 100%)",
                        borderRight: "1px solid rgba(255, 255, 255, 0.1)",
                        position: "relative",
                        overflow: "hidden",
                        minHeight: "600px"
                    }}
                >
                    {/* Glowing decorative circles */}
                    <div
                        style={{
                            position: "absolute",
                            top: "-60px",
                            right: "-60px",
                            width: "300px",
                            height: "300px",
                            borderRadius: "50%",
                            background: "radial-gradient(circle, rgba(94, 234, 212, 0.25) 0%, transparent 70%)",
                            filter: "blur(40px)",
                            pointerEvents: "none"
                        }}
                    />

                    {/* Top Branding Section */}
                    <div style={{ position: "relative", zIndex: 2 }}>
                        {/* Status Chip */}
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                background: "rgba(16, 185, 129, 0.15)",
                                border: "1px solid rgba(52, 211, 153, 0.3)",
                                padding: "6px 14px",
                                borderRadius: "30px",
                                fontSize: "12px",
                                fontWeight: 700,
                                color: "#6ee7b7",
                                marginBottom: "28px"
                            }}
                        >
                            <span
                                style={{
                                    width: "8px",
                                    height: "8px",
                                    borderRadius: "50%",
                                    background: "#10b981",
                                    boxShadow: "0 0 10px #10b981"
                                }}
                            />
                            Premium Shopping Experience
                        </div>

                        {/* Brand Logo */}
                        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
                            <div
                                style={{
                                    width: "52px",
                                    height: "52px",
                                    borderRadius: "16px",
                                    background: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 10px 25px rgba(13, 148, 136, 0.5)",
                                    fontSize: "24px",
                                    color: "#ffffff"
                                }}
                            >
                                <ShoppingFilled />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px", color: "#ffffff" }}>
                                    MyStore<span style={{ color: "#34d399" }}>.</span>
                                </h3>
                                <p style={{ margin: 0, fontSize: "12px", color: "rgba(255, 255, 255, 0.65)" }}>
                                    Luxury & Curated Goods
                                </p>
                            </div>
                        </div>

                        <h2 style={{ fontSize: "28px", fontWeight: 800, lineHeight: 1.3, marginBottom: "16px", color: "#ffffff" }}>
                            Elevate your shopping with next-level ease.
                        </h2>
                        <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.75)", lineHeight: 1.6, marginBottom: "32px" }}>
                            Access your personalized dashboard, watch live product stories, monitor active orders, and enjoy exclusive member perks.
                        </p>

                        {/* Interactive Feature Cards */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {[
                                { title: "Lightning Express Shipping", desc: "Doorstep delivery in 24-48 hours", icon: <ThunderboltFilled style={{ color: "#34d399" }} /> },
                                { title: "Exclusive Product Stories", desc: "Watch video demos and grab flash discounts", icon: <StarFilled style={{ color: "#fbbf24" }} /> },
                                { title: "VIP Buyer Protection", desc: "Guaranteed refunds & seamless returns", icon: <SafetyCertificateFilled style={{ color: "#38bdf8" }} /> }
                            ].map((feat, i) => (
                                <div
                                    key={i}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "14px",
                                        background: "rgba(255, 255, 255, 0.04)",
                                        border: "1px solid rgba(255, 255, 255, 0.08)",
                                        padding: "12px 16px",
                                        borderRadius: "16px",
                                        backdropFilter: "blur(10px)"
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "36px",
                                            height: "36px",
                                            borderRadius: "10px",
                                            background: "rgba(255, 255, 255, 0.06)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "18px"
                                        }}
                                    >
                                        {feat.icon}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: "13px", fontWeight: 700, color: "#ffffff" }}>{feat.title}</div>
                                        <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)" }}>{feat.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Testimonial Banner */}
                    <div
                        style={{
                            marginTop: "28px",
                            padding: "14px 18px",
                            background: "rgba(0, 0, 0, 0.35)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            borderRadius: "18px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            zIndex: 2
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#fbbf24", fontSize: "13px" }}>
                            <StarFilled />
                            <StarFilled />
                            <StarFilled />
                            <StarFilled />
                            <StarFilled />
                            <span style={{ color: "#ffffff", fontWeight: 700, fontSize: "12px", marginLeft: "6px" }}>4.9/5.0</span>
                        </div>
                        <span style={{ fontSize: "12px", color: "#34d399", fontWeight: 700 }}>15,000+ Happy Customers</span>
                    </div>
                </div>

                {/* ══ RIGHT FORM CARD (Dark Luxury Glass) ══ */}
                <div
                    className="col-12 col-lg-7 p-4 p-sm-5 d-flex flex-column justify-content-center"
                    style={{
                        background: "rgba(3, 20, 19, 0.65)",
                        minHeight: "600px",
                        position: "relative"
                    }}
                >
                    <div style={{ maxWidth: "440px", width: "100%", margin: "0 auto" }}>

                        {/* Switcher Pill */}
                        <div
                            style={{
                                display: "flex",
                                background: "rgba(0, 0, 0, 0.4)",
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                padding: "4px",
                                borderRadius: "16px",
                                marginBottom: "28px"
                            }}
                        >
                            <Link
                                to="/auth/login"
                                style={{
                                    flex: 1,
                                    textAlign: "center",
                                    padding: "10px 0",
                                    fontSize: "14px",
                                    fontWeight: 700,
                                    borderRadius: "12px",
                                    textDecoration: "none",
                                    color: "#ffffff",
                                    background: "linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(13, 148, 136, 0.4) 100%)",
                                    border: "1px solid rgba(52, 211, 153, 0.35)",
                                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
                                    transition: "all 0.2s ease"
                                }}
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/auth/register"
                                style={{
                                    flex: 1,
                                    textAlign: "center",
                                    padding: "10px 0",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    borderRadius: "12px",
                                    textDecoration: "none",
                                    color: "rgba(255, 255, 255, 0.6)",
                                    background: "transparent",
                                    transition: "all 0.2s ease"
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff" }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)" }}
                            >
                                Create Account
                            </Link>
                        </div>

                        {/* Title Header */}
                        <div style={{ marginBottom: "26px" }}>
                            <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#ffffff", marginBottom: "8px", letterSpacing: "-0.5px" }}>
                                Welcome Back 👋
                            </h1>
                            <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.65)", margin: 0 }}>
                                Enter your credentials to access your account.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleLogin}>
                            {/* Email */}
                            <div style={{ marginBottom: "20px" }}>
                                <label
                                    htmlFor="login-email"
                                    style={{
                                        display: "block",
                                        fontSize: "13px",
                                        fontWeight: 700,
                                        color: "rgba(255, 255, 255, 0.9)",
                                        marginBottom: "8px"
                                    }}
                                >
                                    Email Address
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
                                        id="login-email"
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

                            {/* Password */}
                            <div style={{ marginBottom: "20px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                                    <label
                                        htmlFor="login-password"
                                        style={{
                                            fontSize: "13px",
                                            fontWeight: 700,
                                            color: "rgba(255, 255, 255, 0.9)",
                                            margin: 0
                                        }}
                                    >
                                        Password
                                    </label>
                                    <Link
                                        to="/auth/forgot-password"
                                        style={{
                                            fontSize: "12px",
                                            fontWeight: 700,
                                            color: "#34d399",
                                            textDecoration: "none"
                                        }}
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>
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
                                        <LockOutlined />
                                    </span>
                                    <input
                                        id="login-password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="••••••••••••"
                                        value={state.password}
                                        onChange={handleChange}
                                        required
                                        autoComplete="current-password"
                                        style={{
                                            width: "100%",
                                            height: "50px",
                                            padding: "0 46px 0 46px",
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
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        style={{
                                            position: "absolute",
                                            right: "12px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            background: "none",
                                            border: "none",
                                            color: "rgba(255, 255, 255, 0.6)",
                                            cursor: "pointer",
                                            padding: "6px",
                                            fontSize: "16px",
                                            display: "flex",
                                            alignItems: "center"
                                        }}
                                    >
                                        {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember me */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "26px" }}>
                                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", color: "rgba(255, 255, 255, 0.75)", userSelect: "none" }}>
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        style={{
                                            width: "16px",
                                            height: "16px",
                                            accentColor: "#10b981",
                                            cursor: "pointer",
                                            borderRadius: "4px"
                                        }}
                                    />
                                    <span>Remember email on this device</span>
                                </label>
                            </div>

                            {/* Submit Button */}
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
                                        <span>Signing in securely...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In to Account</span>
                                        <span style={{ fontSize: "16px" }}>→</span>
                                    </>
                                )}
                            </button>

                            {/* Bottom Prompt */}
                            <div style={{ marginTop: "24px", textAlign: "center", fontSize: "13px", color: "rgba(255, 255, 255, 0.6)" }}>
                                Don't have an account yet?{" "}
                                <Link
                                    to="/auth/register"
                                    style={{
                                        color: "#34d399",
                                        fontWeight: 800,
                                        textDecoration: "none",
                                        marginLeft: "4px"
                                    }}
                                >
                                    Create Free Account
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom Security Assurance */}
            <div style={{ marginTop: "24px", textAlign: "center", fontSize: "12px", color: "rgba(255, 255, 255, 0.45)", zIndex: 1 }}>
                Protected by Cloudflare & SSL 256-Bit Encryption • MyStore © {new Date().getFullYear()}
            </div>
        </main>
    )
}

export default Login