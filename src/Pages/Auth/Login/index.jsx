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
    GiftFilled,
    RocketFilled
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
            {/* Ambient Lighting Gradients in background */}
            <div
                style={{
                    position: "absolute",
                    top: "-100px",
                    left: "-100px",
                    width: "450px",
                    height: "450px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(13, 148, 136, 0.12) 0%, transparent 70%)",
                    pointerEvents: "none",
                    zIndex: 0
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: "-100px",
                    right: "-100px",
                    width: "450px",
                    height: "450px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)",
                    pointerEvents: "none",
                    zIndex: 0
                }}
            />

            {/* Top Navigation */}
            <div
                style={{
                    width: "100%",
                    maxWidth: "1060px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                    zIndex: 2
                }}
            >
                <Link
                    to="/"
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
                    <ArrowLeftOutlined /> Back to Store
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
                    <span>256-Bit SSL Encrypted</span>
                </div>
            </div>

            {/* Main Auth Container */}
            <div
                style={{
                    width: "100%",
                    maxWidth: "1060px",
                    background: "#ffffff",
                    borderRadius: "28px",
                    boxShadow: "0 20px 60px -15px rgba(15, 23, 42, 0.1), 0 0 1px 1px rgba(13, 148, 136, 0.08)",
                    border: "1px solid #e2e8f0",
                    overflow: "hidden",
                    display: "flex",
                    flexWrap: "wrap",
                    position: "relative",
                    zIndex: 1
                }}
            >
                {/* ══ LEFT SHOWCASE HERO PANEL (Desktop & Tablet) ══ */}
                <div
                    className="col-12 col-lg-5 d-none d-lg-flex flex-column justify-content-between p-4 p-xl-5 text-white"
                    style={{
                        background: "linear-gradient(150deg, #042f2e 0%, #064e3b 50%, #022c22 100%)",
                        position: "relative",
                        overflow: "hidden",
                        minHeight: "590px"
                    }}
                >
                    {/* Glowing decorative orbs */}
                    <div
                        style={{
                            position: "absolute",
                            top: "-60px",
                            right: "-60px",
                            width: "260px",
                            height: "260px",
                            borderRadius: "50%",
                            background: "radial-gradient(circle, rgba(94, 234, 212, 0.25) 0%, transparent 70%)",
                            pointerEvents: "none"
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            bottom: "-60px",
                            left: "-60px",
                            width: "240px",
                            height: "240px",
                            borderRadius: "50%",
                            background: "radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)",
                            pointerEvents: "none"
                        }}
                    />

                    {/* Content Top */}
                    <div style={{ position: "relative", zIndex: 2 }}>
                        {/* Status Chip */}
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                background: "rgba(255, 255, 255, 0.1)",
                                border: "1px solid rgba(255, 255, 255, 0.15)",
                                padding: "6px 14px",
                                borderRadius: "30px",
                                fontSize: "12px",
                                fontWeight: 700,
                                color: "#5eead4",
                                marginBottom: "26px",
                                backdropFilter: "blur(10px)"
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
                            Official Member Portal
                        </div>

                        {/* Brand Logo */}
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "22px" }}>
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    borderRadius: "14px",
                                    background: "linear-gradient(135deg, #14b8a6, #0d9488)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 8px 20px rgba(13, 148, 136, 0.4)",
                                    fontSize: "22px",
                                    color: "#ffffff"
                                }}
                            >
                                <ShoppingFilled />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: "22px", fontWeight: 800, letterSpacing: "-0.5px", color: "#ffffff" }}>
                                    MyStore<span style={{ color: "#5eead4" }}>.</span>
                                </h3>
                                <p style={{ margin: 0, fontSize: "12px", color: "rgba(255, 255, 255, 0.7)" }}>
                                    Next-Gen Curated E-Commerce
                                </p>
                            </div>
                        </div>

                        <h2 style={{ fontSize: "26px", fontWeight: 800, lineHeight: 1.3, marginBottom: "14px", color: "#ffffff" }}>
                            Welcome back to your favorite shopping hub.
                        </h2>
                        <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.8)", lineHeight: 1.6, marginBottom: "28px" }}>
                            Sign in to track orders in real-time, view exclusive product stories, manage your wishlist, and claim member discounts.
                        </p>

                        {/* Value Propositions */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {[
                                { title: "Instant Express Shipping", desc: "Fast & reliable doorstep dispatch", icon: <ThunderboltFilled style={{ color: "#5eead4" }} /> },
                                { title: "Exclusive Stories & Flash Deals", desc: "Discover viral video products first", icon: <StarFilled style={{ color: "#fbbf24" }} /> },
                                { title: "100% Encrypted Safe Payments", desc: "Zero-risk buyer protection & refunds", icon: <SafetyCertificateFilled style={{ color: "#38bdf8" }} /> }
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px",
                                        background: "rgba(255, 255, 255, 0.06)",
                                        border: "1px solid rgba(255, 255, 255, 0.08)",
                                        padding: "10px 14px",
                                        borderRadius: "14px",
                                        backdropFilter: "blur(6px)"
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "34px",
                                            height: "34px",
                                            borderRadius: "10px",
                                            background: "rgba(255, 255, 255, 0.08)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "16px"
                                        }}
                                    >
                                        {item.icon}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: "13px", fontWeight: 700, color: "#ffffff" }}>{item.title}</div>
                                        <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.65)" }}>{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Proof */}
                    <div
                        style={{
                            marginTop: "24px",
                            padding: "12px 16px",
                            background: "rgba(0, 0, 0, 0.25)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            zIndex: 2
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#fbbf24", fontSize: "13px" }}>
                            <StarFilled />
                            <StarFilled />
                            <StarFilled />
                            <StarFilled />
                            <StarFilled />
                            <span style={{ color: "#ffffff", fontWeight: 700, fontSize: "12px", marginLeft: "6px" }}>4.9/5.0</span>
                        </div>
                        <span style={{ fontSize: "11px", color: "#5eead4", fontWeight: 600 }}>15,000+ Happy Customers</span>
                    </div>
                </div>

                {/* ══ RIGHT FORM PANEL (Clean White Studio) ══ */}
                <div
                    className="col-12 col-lg-7 p-4 p-sm-5 d-flex flex-column justify-content-center"
                    style={{ background: "#ffffff", minHeight: "590px" }}
                >
                    <div style={{ maxWidth: "420px", width: "100%", margin: "0 auto" }}>

                        {/* Top Segmented Switcher */}
                        <div
                            style={{
                                display: "flex",
                                background: "#f1f5f9",
                                padding: "4px",
                                borderRadius: "14px",
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
                                    borderRadius: "11px",
                                    textDecoration: "none",
                                    color: "#0f766e",
                                    background: "#ffffff",
                                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
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
                                    borderRadius: "11px",
                                    textDecoration: "none",
                                    color: "#64748b",
                                    background: "transparent",
                                    transition: "all 0.2s ease"
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = "#0f172a" }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = "#64748b" }}
                            >
                                Register
                            </Link>
                        </div>

                        {/* Heading */}
                        <div style={{ marginBottom: "26px" }}>
                            <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#0f172a", marginBottom: "6px", letterSpacing: "-0.5px" }}>
                                Welcome Back 👋
                            </h1>
                            <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
                                Enter your credentials to access your account.
                            </p>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleLogin}>

                            {/* Email */}
                            <div style={{ marginBottom: "20px" }}>
                                <label
                                    htmlFor="login-email"
                                    style={{
                                        display: "block",
                                        fontSize: "13px",
                                        fontWeight: 700,
                                        color: "#334155",
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
                                            color: "#94a3b8",
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

                            {/* Password */}
                            <div style={{ marginBottom: "20px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                                    <label
                                        htmlFor="login-password"
                                        style={{
                                            fontSize: "13px",
                                            fontWeight: 700,
                                            color: "#334155",
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
                                            color: "#0d9488",
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
                                            color: "#94a3b8",
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
                                            height: "48px",
                                            padding: "0 46px 0 46px",
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
                                            color: "#64748b",
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

                            {/* Remember Me */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", color: "#475569", userSelect: "none" }}>
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        style={{
                                            width: "16px",
                                            height: "16px",
                                            accentColor: "#0d9488",
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
                                        <span>Signing In...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In to MyStore</span>
                                        <span style={{ fontSize: "16px" }}>→</span>
                                    </>
                                )}
                            </button>

                            {/* Bottom Register Prompt */}
                            <div style={{ marginTop: "24px", textAlign: "center", fontSize: "13px", color: "#64748b" }}>
                                Don't have an account yet?{" "}
                                <Link
                                    to="/auth/register"
                                    style={{
                                        color: "#0d9488",
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

            {/* Bottom Security Note */}
            <div style={{ marginTop: "20px", textAlign: "center", fontSize: "12px", color: "#64748b", zIndex: 1 }}>
                Protected by MyStore Security • All Rights Reserved © {new Date().getFullYear()}
            </div>
        </main>
    )
}

export default Login