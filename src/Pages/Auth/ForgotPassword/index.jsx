import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const initialState = { email: "" }

const ForgotPassword = () => {
    const [state, setState] = useState(initialState)
    const [isProcessing, setIsProcessing] = useState(false)
    const navigate = useNavigate()

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

    const handleForgotPassword = (e) => {
        e.preventDefault()
        let { email } = state
        if (!email) return window.toastify("Please enter your email", "warning")

        setIsProcessing(true)
        setTimeout(() => {
            setIsProcessing(false)
            window.toastify("Password reset instructions sent to your email! 📧", "success")
            navigate("/auth/login")
        }, 1200)
    }

    return (
        <main className="d-flex justify-content-center align-items-center py-4 py-md-5 flex-grow-1 overflow-hidden position-relative w-100"
            style={{ minHeight: 'calc(100vh - 140px)', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>

            {/* Decorative background blur shapes */}
            <div className="position-absolute rounded-circle bg-primary opacity-50 pointer-event-none"
                style={{ width: '280px', height: '280px', top: '-50px', left: '-50px', filter: 'blur(60px)', zIndex: 1 }}></div>
            <div className="position-absolute rounded-circle bg-info opacity-50 pointer-event-none"
                style={{ width: '220px', height: '220px', bottom: '-50px', right: '-50px', filter: 'blur(60px)', zIndex: 1 }}></div>

            <div className="container position-relative px-3" style={{ zIndex: 3 }}>
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
                        <div className="card bg-white border-0 shadow-lg rounded-4 overflow-hidden position-relative">

                            {/* Header */}
                            <div className="text-white text-center p-4 p-md-5"
                                style={{ background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)' }}>
                                <h2 className="fw-bold mb-2 fs-3 fs-md-2">Reset Password 🔑</h2>
                                <p className="mb-0 opacity-75 small fs-6">Enter your email to receive reset link</p>
                            </div>

                            {/* Body */}
                            <div className="card-body p-4 p-md-5">
                                <form onSubmit={handleForgotPassword}>

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

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 rounded-3 py-3 fw-bold shadow-sm mb-4"
                                        style={{ background: '#3b82f6', border: 'none' }}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <><span className="spinner-border spinner-border-sm me-2" /> Sending Link...</>
                                        ) : 'Send Reset Link'}
                                    </button>

                                    <div className="text-center">
                                        <span className="text-muted small">Remember your password? </span>
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

export default ForgotPassword