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
        if (!window.isValidEmail(email)) return window.toastify("Please enter a valid email", "warning")
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
        <main className="auth-bg d-flex justify-content-center align-items-center py-5 flex-grow-1" style={{ minHeight: 'calc(100vh - 150px)' }}>
            <style>{`
                .auth-bg {
                    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                    position: relative;
                }
                .auth-card {
                    background: #ffffff;
                    border-radius: 24px;
                    border: none;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.08);
                    overflow: hidden;
                    position: relative;
                    z-index: 10;
                }
                .auth-header {
                    background: linear-gradient(135deg, #3b82f6 0%, #1e293b 100%);
                    color: white;
                    padding: 40px 30px;
                    text-align: center;
                }
                .auth-input {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 14px 18px;
                    font-size: 15px;
                    transition: all 0.2s;
                }
                .auth-input:focus {
                    background: white;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
                }
                .password-toggle-btn {
                    position: absolute;
                    right: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: #64748b;
                    cursor: pointer;
                    padding: 0;
                    font-size: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .password-toggle-btn:hover {
                    color: #3b82f6;
                }
                .auth-btn {
                    background: #3b82f6;
                    border: none;
                    border-radius: 12px;
                    padding: 14px;
                    font-weight: 700;
                    font-size: 16px;
                    transition: all 0.3s;
                }
                .auth-btn:hover {
                    background: #2563eb;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
                }
                .social-btn {
                    border: 1px solid #e2e8f0;
                    background: white;
                    color: #475569;
                    font-weight: 600;
                    border-radius: 12px;
                    padding: 12px;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                .social-btn:hover {
                    background: #f8fafc;
                    border-color: #cbd5e1;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }
                .divider {
                    display: flex;
                    align-items: center;
                    text-align: center;
                    color: #94a3b8;
                    margin: 24px 0;
                }
                .divider::before, .divider::after {
                    content: '';
                    flex: 1;
                    border-bottom: 1px solid #e2e8f0;
                }
                .divider:not(:empty)::before {
                    margin-right: .25em;
                }
                .divider:not(:empty)::after {
                    margin-left: .25em;
                }
                .floating-shape {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(60px);
                    z-index: 1;
                    opacity: 0.6;
                }
            `}</style>

            <div className="floating-shape bg-primary" style={{ width: 300, height: 300, top: '-50px', left: '-50px' }}></div>
            <div className="floating-shape bg-info" style={{ width: 250, height: 250, bottom: '-50px', right: '-50px' }}></div>

            <div className="container position-relative z-3">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div className="auth-card">
                            
                            <div className="auth-header">
                                <h2 className="fw-bold mb-2">Create Account ✨</h2>
                                <p className="mb-0 opacity-75">Join MyStore and start shopping today</p>
                            </div>

                            <div className="p-4 p-md-5">
                                <form onSubmit={handleRegister}>
                                    
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold text-muted small ms-1">Full Name</label>
                                        <input 
                                            type="text" 
                                            className="form-control auth-input" 
                                            placeholder="John Doe" 
                                            name="name" 
                                            value={state.name}
                                            onChange={handleChange} 
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-semibold text-muted small ms-1">Email Address</label>
                                        <input 
                                            type="email" 
                                            className="form-control auth-input" 
                                            placeholder="hello@example.com" 
                                            name="email" 
                                            value={state.email}
                                            onChange={handleChange} 
                                            required
                                        />
                                    </div>

                                    <div className="row g-3 mb-4">
                                        <div className="col-12 col-sm-6">
                                            <label className="form-label fw-semibold text-muted small ms-1">Password</label>
                                            <div className="position-relative">
                                                <input 
                                                    type={showPassword ? "text" : "password"}
                                                    className="form-control auth-input pe-5" 
                                                    placeholder="••••••••" 
                                                    name="password" 
                                                    value={state.password}
                                                    onChange={handleChange} 
                                                    required
                                                />
                                                <button 
                                                    type="button" 
                                                    className="password-toggle-btn"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    tabIndex="-1"
                                                >
                                                    {showPassword ? "👁️‍🗨️" : "👁️"}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-6">
                                            <label className="form-label fw-semibold text-muted small ms-1">Confirm Password</label>
                                            <div className="position-relative">
                                                <input 
                                                    type={showPassword ? "text" : "password"}
                                                    className="form-control auth-input pe-5" 
                                                    placeholder="••••••••" 
                                                    name="confirmPassword" 
                                                    value={state.confirmPassword}
                                                    onChange={handleChange} 
                                                    required
                                                />
                                                <button 
                                                    type="button" 
                                                    className="password-toggle-btn"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    tabIndex="-1"
                                                >
                                                    {showPassword ? "👁️‍🗨️" : "👁️"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="btn btn-primary auth-btn w-100"
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <><span className="spinner-border spinner-border-sm me-2"/> Creating Account...</>
                                        ) : 'Sign Up'}
                                    </button>

                                    <div className="divider small fw-semibold">OR SIGN UP WITH</div>

                                    <div className="row g-3 mb-4">
                                        <div className="col-6">
                                            <button 
                                                type="button" 
                                                className="btn w-100 social-btn"
                                                onClick={() => window.toastify("Google Signup will be available once API keys are configured.", "info")}
                                            >
                                                <svg width="20" height="20" viewBox="0 0 48 48">
                                                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                                                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                                                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                                                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                                                    <path fill="none" d="M0 0h48v48H0z"/>
                                                </svg>
                                                Google
                                            </button>
                                        </div>
                                        <div className="col-6">
                                            <button 
                                                type="button" 
                                                className="btn w-100 social-btn"
                                                onClick={() => window.toastify("Facebook Signup will be available once API keys are configured.", "info")}
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                                </svg>
                                                Facebook
                                            </button>
                                        </div>
                                    </div>

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