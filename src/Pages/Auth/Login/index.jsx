import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../../context/Auth"
import axios from "axios"

const initialState = { email: "", password: "" }

const Login = () => {
    const { readProfile } = useAuth()
    const navigate = useNavigate()

    const [state, setState] = useState(initialState)
    const [isProcessing, setIsProcessing] = useState(false)

    const [showPassword, setShowPassword] = useState(false)

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

    const handleLogin = (e) => {
        e.preventDefault()
        let { email, password } = state

        if (!email || !password) {
            window.toastify("Please enter email and password", "warning")
            return
        }

        const userData = { email, password }
        setIsProcessing(true)

        axios.post(`${window.api}/api/auth/login`, userData)
            .then((res) => {
                const { status, data } = res
                if (status === 200) {
                    localStorage.setItem("jwt", data.token)
                    readProfile(data.token)
                    window.toastify("Login successful 🎉", "success")
                    navigate("/dashboard")
                } else {
                    window.toastify(data.message, "error")
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
                    background: linear-gradient(135deg, #1e293b 0%, #3b82f6 100%);
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
                    <div className="col-12 col-md-8 col-lg-5 col-xl-4">
                        <div className="auth-card">
                            
                            <div className="auth-header">
                                <h2 className="fw-bold mb-2">Welcome Back! 👋</h2>
                                <p className="mb-0 opacity-75">Sign in to continue to MyStore</p>
                            </div>

                            <div className="p-4 p-md-5">
                                <form onSubmit={handleLogin}>
                                    
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

                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-1 ms-1">
                                            <label className="form-label fw-semibold text-muted small mb-0">Password</label>
                                            <Link to="/auth/forgot-password" className="small text-decoration-none text-primary fw-semibold">Forgot Password?</Link>
                                        </div>
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

                                    <button 
                                        type="submit" 
                                        className="btn btn-primary auth-btn w-100"
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <><span className="spinner-border spinner-border-sm me-2"/> Logging in...</>
                                        ) : 'Sign In'}
                                    </button>



                                    <div className="text-center">
                                        <span className="text-muted small">Don't have an account? </span>
                                        <Link to="/auth/register" className="text-primary text-decoration-none fw-bold small">Create Account</Link>
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

export default Login