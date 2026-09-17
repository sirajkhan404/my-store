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
    ShoppingFilled
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
                background: "linear-gradient(135deg, #f0fdf4 0%, #f8fafc 45%, #ecfdf5 100%)",
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
            {/* Ambient Lighting Gradients */}
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
                    width: "420px",
                    height: "420px",
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
                    maxWidth: "480px",
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

            {/* Main Centered Auth Card */}
            <div
                style={{
                    width: "100%",
                    maxWidth: "480px",
                    background: "#ffffff",
                    borderRadius: "28px",
                    boxShadow: "0 20px 60px -15px rgba(15, 23, 42, 0.1), 0 0 1px 1px rgba(13, 148, 136, 0.08)",
                    border: "1px solid #e2e8f0",
                    overflow: "hidden",
                    padding: "36px 32px",
                    position: "relative",
                    zIndex: 1
                }}
            >
                {/* Brand Logo Header */}
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                    <div
                        style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "18px",
                            background: "linear-gradient(135deg, #14b8a6, #0d9488)",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 10px 25px rgba(13, 148, 136, 0.35)",
                            fontSize: "26px",
                            color: "#ffffff",
                            marginBottom: "12px"
                        }}
                    >
                        <ShoppingFilled />
                    </div>
                    <h3 style={{ margin: "0 0 4px 0", fontSize: "22px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" }}>
                        MyStore<span style={{ color: "#0d9488" }}>.</span>
                    </h3>
                    <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                        Welcome back! Please sign in to continue.
                    </p>
                </div>

                {/* Top Segmented Switcher */}
                <div
                    style={{
                        display: "flex",
                        background: "#f1f5f9",
                        padding: "4px",
                        borderRadius: "14px",
                        marginBottom: "24px"
                    }}
                >
                    <Link
                        to="/auth/login"
                        style={{
                            flex: 1,
                            textAlign: "center",
                            padding: "9px 0",
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
                            padding: "9px 0",
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

                {/* Login Form */}
                <form onSubmit={handleLogin}>
                    {/* Email */}
                    <div style={{ marginBottom: "18px" }}>
                        <label
                            htmlFor="login-email"
                            style={{
                                display: "block",
                                fontSize: "13px",
                                fontWeight: 700,
                                color: "#334155",
                                marginBottom: "6px"
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
                    <div style={{ marginBottom: "18px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
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
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "22px" }}>
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
                    <div style={{ marginTop: "22px", textAlign: "center", fontSize: "13px", color: "#64748b" }}>
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

            {/* Bottom Security Note */}
            <div style={{ marginTop: "20px", textAlign: "center", fontSize: "12px", color: "#64748b", zIndex: 1 }}>
                Protected by MyStore Security • All Rights Reserved © {new Date().getFullYear()}
            </div>
        </main>
    )
}

export default Login