import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

const initialState = { name: "", email: "", password: "", confirmPassword: "" }

const Register = () => {
    const navigate = useNavigate()

    const [state, setState] = useState(initialState)
    const [isProcessing, setIsProcessing] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

    const handleRegister = (e) => {
        e.preventDefault()
        let { name, email, password, confirmPassword } = state

        const fullName = name.trim()
        if (fullName.length < 3) return window.toastify("Please enter your full name (min 3 chars)", "warning")
        if (password.length < 6) return window.toastify("Password must be at least 6 chars", "warning")
        if (confirmPassword !== password) return window.toastify("Passwords do not match", "warning")

        const user = { fullName, email, password }
        setIsProcessing(true)

        axios.post(`${window.api}/api/auth/register`, user)
            .then((res) => {
                const { status, data } = res
                if (status === 201) {
                    window.toastify("Account Created Successfully! 🎉", "success")
                    navigate("/auth/login")
                }
            })
            .catch(error => {
                console.error(error)
                window.toastify(error?.response?.data?.message || "Something went wrong", "error")
            })
            .finally(() => {
                setIsProcessing(false)
            })
    }

    return (
        <main className="d-flex justify-content-center align-items-center py-4 py-md-5 flex-grow-1 overflow-hidden position-relative w-100"
            style={{ minHeight: 'calc(100vh - 140px)', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>

            {/* Background glowing shapes */}
            <div className="position-absolute rounded-circle bg-primary opacity-50 pointer-event-none"
                style={{ width: '280px', height: '280px', top: '-50px', left: '-50px', filter: 'blur(60px)', zIndex: 1 }}></div>
            <div className="position-absolute rounded-circle bg-info opacity-50 pointer-event-none"
                style={{ width: '220px', height: '220px', bottom: '-50px', right: '-50px', filter: 'blur(60px)', zIndex: 1 }}></div>

            <div className="container position-relative px-3" style={{ zIndex: 3 }}>
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
                        <div className="card bg-white border-0 shadow-lg rounded-4 overflow-hidden position-relative">

                            {/* Header */}
                            <div className="text-white text-center p-4 p-md-5"
                                style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1e293b 100%)' }}>
                                <h2 className="fw-bold mb-2 fs-3 fs-md-2">Create Account ✨</h2>
                                <p className="mb-0 opacity-75 small fs-6">Join MyStore and start shopping today</p>
                            </div>

                            {/* Form Body */}
                            <div className="card-body p-4 p-md-5">
                                <form onSubmit={handleRegister}>

                                    {/* Name */}
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold text-muted small ms-1 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            className="form-control bg-light border-light-subtle rounded-3 px-3 py-2 shadow-sm"
                                            placeholder="John Doe"
                                            name="name"
                                            value={state.name}
                                            onChange={handleChange}
                                            required
                                            style={{ fontSize: '15px' }}
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold text-muted small ms-1 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            className="form-control bg-light border-light-subtle rounded-3 px-3 py-2 shadow-sm"
                                            placeholder="hello@example.com"
                                            name="email"
                                            value={state.email}
                                            onChange={handleChange}
                                            required
                                            style={{ fontSize: '15px' }}
                                        />
                                    </div>

                                    {/* Password + Confirm Password Grid */}
                                    <div className="row g-3 mb-4">
                                        <div className="col-12 col-sm-6">
                                            <label className="form-label fw-semibold text-muted small ms-1 mb-1">Password</label>
                                            <div className="position-relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    className="form-control bg-light border-light-subtle rounded-3 px-3 py-2 pe-5 shadow-sm"
                                                    placeholder="••••••••"
                                                    name="password"
                                                    value={state.password}
                                                    onChange={handleChange}
                                                    required
                                                    style={{ fontSize: '15px' }}
                                                />
                                                <button
                                                    type="button"
                                                    className="position-absolute end-0 top-50 translate-middle-y bg-transparent border-0 text-secondary pe-3"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    tabIndex="-1"
                                                    style={{ fontSize: '16px' }}
                                                >
                                                    {showPassword ? "👁️‍🗨️" : "👁️"}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-6">
                                            <label className="form-label fw-semibold text-muted small ms-1 mb-1">Confirm Password</label>
                                            <div className="position-relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    className="form-control bg-light border-light-subtle rounded-3 px-3 py-2 pe-5 shadow-sm"
                                                    placeholder="••••••••"
                                                    name="confirmPassword"
                                                    value={state.confirmPassword}
                                                    onChange={handleChange}
                                                    required
                                                    style={{ fontSize: '15px' }}
                                                />
                                                <button
                                                    type="button"
                                                    className="position-absolute end-0 top-50 translate-middle-y bg-transparent border-0 text-secondary pe-3"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    tabIndex="-1"
                                                    style={{ fontSize: '16px' }}
                                                >
                                                    {showPassword ? "👁️‍🗨️" : "👁️"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Register Button */}
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 rounded-3 py-3 fw-bold shadow-sm mb-4"
                                        style={{ background: '#3b82f6', border: 'none' }}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <><span className="spinner-border spinner-border-sm me-2" /> Creating Account...</>
                                        ) : 'Sign Up'}
                                    </button>

                                    {/* Link to Login */}
                                    <div className="text-center">
                                        <span className="text-muted small">Already have an account? </span>
                                        <Link to="/auth/login" className="text-primary text-decoration-none fw-bold small">Login here</Link>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Register