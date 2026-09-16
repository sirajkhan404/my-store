import React, { useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/Auth";
import { useNavigate } from "react-router-dom";

const CartSidebar = ({ isOpen, onClose }) => {
    const { cartItems, removeFromCart, updateQty, clearCart, totalAmount } = useCart();
    const { isAuth, user } = useAuth();
    const navigate = useNavigate();

    const [showCheckout, setShowCheckout] = useState(false);
    const [form, setForm] = useState({ fullName: "", phone: "", address: "", city: "" });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const freeShippingThreshold = 5000;
    const progressPercent = Math.min(100, Math.round((totalAmount / freeShippingThreshold) * 100));

    const handleOrder = async (e) => {
        e.preventDefault();
        if (!form.fullName || !form.phone || !form.address || !form.city) {
            setError("Kripya tamam fields ko fill karein.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const jwt = localStorage.getItem("jwt");
            const products = cartItems.map(i => ({
                productId: i.productId,
                name: i.name,
                price: i.price,
                quantity: i.quantity,
                imageURL: i.imageURL,
            }));
            await axios.post(
                `${window.api}/api/orders/create`,
                { products, totalAmount, shippingAddress: form },
                { headers: { Authorization: `Bearer ${jwt}` } }
            );
            setSuccess(true);
            clearCart();
            setTimeout(() => {
                setSuccess(false);
                setShowCheckout(false);
                onClose();
                navigate("/dashboard/orders");
            }, 2200);
        } catch (err) {
            setError(err?.response?.data?.message || "Order place nahi hua. Dobara koshish karein.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* ── Cart Drawer Backdrop ── */}
            <div
                className={`position-fixed top-0 start-0 w-100 h-100 transition-all ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                style={{
                    zIndex: 9998,
                    background: "rgba(4, 47, 46, 0.7)",
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                    transition: "all 0.3s ease",
                }}
                onClick={onClose}
            />

            {/* ── Cart Drawer Panel ── */}
            <div
                className="position-fixed top-0 h-100 bg-white shadow-2xl d-flex flex-column"
                style={{
                    width: "100%",
                    maxWidth: "420px",
                    right: isOpen ? 0 : "-100%",
                    zIndex: 9999,
                    transition: "right 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                    boxShadow: isOpen ? "-10px 0 50px rgba(0,0,0,0.35)" : "none",
                }}
            >
                {/* 1. Header */}
                <div
                    className="p-3.5 px-4 text-white d-flex align-items-center justify-content-between position-relative"
                    style={{
                        background: "linear-gradient(135deg, #042f2e 0%, #0d9488 100%)",
                        borderBottom: "1px solid rgba(94, 234, 212, 0.25)",
                    }}
                >
                    <div className="d-flex align-items-center gap-2.5">
                        <div
                            className="rounded-3 d-flex align-items-center justify-content-center"
                            style={{
                                width: "36px",
                                height: "36px",
                                background: "rgba(255, 255, 255, 0.18)",
                                border: "1px solid rgba(94, 234, 212, 0.4)",
                                fontSize: "18px",
                            }}
                        >
                            🛒
                        </div>
                        <div>
                            <div className="fw-bold fs-5 lh-1 text-white">Shopping Cart</div>
                            <div style={{ fontSize: "11.5px", color: "#5eead4", marginTop: "3px" }}>
                                {cartItems.length} {cartItems.length === 1 ? "Product" : "Products"} in Bag
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="btn btn-sm text-white rounded-circle p-0 d-flex align-items-center justify-content-center border-0 shadow-none"
                        style={{ width: "32px", height: "32px", background: "rgba(255,255,255,0.15)" }}
                        aria-label="Close cart"
                    >
                        ✕
                    </button>
                </div>

                {/* 2. Free Delivery Meter */}
                {cartItems.length > 0 && (
                    <div className="px-4 py-2.5 border-bottom" style={{ background: "#f0fdfa", borderColor: "#ccfbf1" }}>
                        <div className="d-flex align-items-center justify-content-between mb-1.5" style={{ fontSize: "11.5px" }}>
                            <span className="fw-semibold text-dark">
                                {totalAmount >= freeShippingThreshold ? (
                                    <span className="text-success fw-bold">🎉 You unlocked FREE Delivery!</span>
                                ) : (
                                    <>Add <strong style={{ color: "#0d9488" }}>Rs. {(freeShippingThreshold - totalAmount).toLocaleString()}</strong> for Free Delivery</>
                                )}
                            </span>
                            <span className="fw-bold text-muted">{progressPercent}%</span>
                        </div>
                        <div className="progress" style={{ height: "6px", background: "#e2e8f0", borderRadius: "10px" }}>
                            <div
                                className="progress-bar progress-bar-striped progress-bar-animated"
                                style={{
                                    width: `${progressPercent}%`,
                                    background: "linear-gradient(90deg, #0d9488, #5eead4)",
                                    borderRadius: "10px",
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* 3. Items List Area */}
                <div className="flex-grow-1 overflow-auto px-3 py-3">
                    {cartItems.length === 0 ? (
                        <div className="text-center py-5 my-auto d-flex flex-column align-items-center justify-content-center h-100">
                            <div
                                className="rounded-circle d-flex align-items-center justify-content-center mb-3 shadow-sm"
                                style={{
                                    width: "90px",
                                    height: "90px",
                                    background: "linear-gradient(135deg, #f0fdfa, #ccfbf1)",
                                    fontSize: "42px",
                                }}
                            >
                                🛍️
                            </div>
                            <h5 className="fw-bold text-dark mb-1">Your cart is empty</h5>
                            <p className="text-muted small mb-4" style={{ maxWidth: "230px" }}>
                                Explore our collection and add your favorite products!
                            </p>
                            <button
                                onClick={() => { onClose(); navigate("/products"); }}
                                className="btn rounded-pill px-4 py-2 fw-bold text-white shadow-sm"
                                style={{ background: "linear-gradient(135deg, #0d9488, #0f766e)", border: "none", fontSize: "14px" }}
                            >
                                Browse Products →
                            </button>
                        </div>
                    ) : (
                        <div className="d-flex flex-column gap-2.5">
                            {cartItems.map(item => (
                                <div
                                    key={item.productId}
                                    className="d-flex align-items-center gap-3 p-2.5 rounded-4 border shadow-2xs transition-all"
                                    style={{
                                        background: "#ffffff",
                                        borderColor: "#e5e7eb",
                                    }}
                                >
                                    <div
                                        className="rounded-3 overflow-hidden flex-shrink-0 border"
                                        style={{ width: "65px", height: "65px", background: "#f8fafc", borderColor: "#f1f5f9" }}
                                    >
                                        <img
                                            src={item.imageURL || "https://via.placeholder.com/65"}
                                            alt={item.name}
                                            className="w-100 h-100 object-fit-cover"
                                            onError={e => { e.target.src = "https://via.placeholder.com/65?text=No+Img"; }}
                                        />
                                    </div>

                                    <div className="flex-grow-1 min-width-0">
                                        <div className="fw-semibold text-dark text-truncate" style={{ fontSize: "13.5px" }}>
                                            {item.name}
                                        </div>
                                        <div className="fw-bold mt-0.5" style={{ fontSize: "13px", color: "#0d9488" }}>
                                            Rs. {Number(item.price).toLocaleString()}
                                        </div>

                                        {/* Stepper */}
                                        <div className="d-flex align-items-center gap-2 mt-1.5">
                                            <div
                                                className="d-flex align-items-center border rounded-pill p-0.5"
                                                style={{ background: "#f8fafc", borderColor: "#e2e8f0" }}
                                            >
                                                <button
                                                    className="btn btn-sm p-0 rounded-circle d-flex align-items-center justify-content-center border-0"
                                                    style={{ width: "22px", height: "22px", background: "#ffffff", color: "#374151" }}
                                                    onClick={() => updateQty(item.productId, item.quantity - 1)}
                                                    aria-label="Decrease quantity"
                                                >
                                                    -
                                                </button>
                                                <span className="fw-bold px-2" style={{ fontSize: "12px", minWidth: "20px", textAlign: "center" }}>
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    className="btn btn-sm p-0 rounded-circle d-flex align-items-center justify-content-center border-0"
                                                    style={{ width: "22px", height: "22px", background: "#ffffff", color: "#374151" }}
                                                    disabled={item.stock && item.quantity >= item.stock}
                                                    onClick={() => updateQty(item.productId, item.quantity + 1)}
                                                    aria-label="Increase quantity"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-end flex-shrink-0 d-flex flex-column align-items-end justify-content-between h-100 py-1">
                                        <button
                                            onClick={() => removeFromCart(item.productId)}
                                            className="btn btn-sm p-1 text-danger border-0 bg-transparent shadow-none"
                                            style={{ fontSize: "15px", lineHeight: 1 }}
                                            title="Remove item"
                                        >
                                            🗑️
                                        </button>
                                        <div className="fw-bold text-dark mt-2" style={{ fontSize: "13px" }}>
                                            Rs. {(item.price * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 4. Footer Checkout Box */}
                {cartItems.length > 0 && (
                    <div className="p-3.5 px-4 border-top" style={{ background: "#f8fafc", borderColor: "#e2e8f0" }}>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className="text-muted fw-semibold" style={{ fontSize: "13px" }}>Subtotal:</span>
                            <span className="fw-semibold text-dark" style={{ fontSize: "14px" }}>Rs. {totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-2.5">
                            <span className="text-muted fw-semibold" style={{ fontSize: "13px" }}>Estimated Shipping:</span>
                            <span className="fw-semibold text-success" style={{ fontSize: "13px" }}>
                                {totalAmount >= freeShippingThreshold ? "FREE" : "Rs. 200"}
                            </span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-3 pt-2 border-top" style={{ borderColor: "#e2e8f0" }}>
                            <span className="fw-bold text-dark fs-6">Grand Total:</span>
                            <span className="fw-extrabold fs-5" style={{ color: "#0d9488" }}>
                                Rs. {(totalAmount >= freeShippingThreshold ? totalAmount : totalAmount + 200).toLocaleString()}
                            </span>
                        </div>

                        <div className="d-flex gap-2">
                            <button
                                onClick={clearCart}
                                className="btn btn-outline-danger rounded-pill px-3 fw-semibold"
                                style={{ fontSize: "13px" }}
                            >
                                Clear
                            </button>
                            {isAuth ? (
                                <button
                                    onClick={() => setShowCheckout(true)}
                                    className="btn text-white rounded-pill flex-grow-1 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                                    style={{
                                        background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
                                        border: "none",
                                        fontSize: "14px",
                                        padding: "10px 16px",
                                    }}
                                >
                                    <span>Proceed to Checkout</span>
                                    <span>→</span>
                                </button>
                            ) : (
                                <button
                                    onClick={() => { onClose(); navigate("/auth/login"); }}
                                    className="btn text-white rounded-pill flex-grow-1 fw-bold d-flex align-items-center justify-content-center gap-1.5"
                                    style={{
                                        background: "linear-gradient(135deg, #f59e0b, #d97706)",
                                        border: "none",
                                        fontSize: "14px",
                                        padding: "10px 16px",
                                    }}
                                >
                                    <span>🔒 Login to Checkout</span>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Checkout Modal ── */}
            {showCheckout && (
                <div className="modal d-block" style={{ zIndex: 10000 }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" style={{ maxWidth: "480px" }}>
                        <div className="modal-content rounded-4 border-0 overflow-hidden shadow-2xl">
                            {/* Modal Header */}
                            <div
                                className="modal-header border-0 px-4 pt-4 pb-3 text-white"
                                style={{ background: "linear-gradient(135deg, #042f2e 0%, #0d9488 100%)" }}
                            >
                                <div>
                                    <h5 className="fw-bold mb-0 text-white">Shipping & Order</h5>
                                    <p className="small mb-0" style={{ color: "#5eead4" }}>Provide your address to confirm delivery</p>
                                </div>
                                <button
                                    onClick={() => { setShowCheckout(false); setError(""); setSuccess(false); }}
                                    className="btn btn-sm text-white rounded-circle p-0 d-flex align-items-center justify-content-center border-0 ms-auto"
                                    style={{ width: "30px", height: "30px", background: "rgba(255,255,255,0.2)" }}
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Summary strip */}
                            <div className="px-4 pt-3">
                                <div className="rounded-3 p-3" style={{ background: "linear-gradient(135deg, #f0fdfa, #ccfbf1)", border: "1px solid #99f6e4" }}>
                                    <div className="fw-bold text-dark small mb-2 d-flex justify-content-between align-items-center">
                                        <span>Order Summary ({cartItems.length} items)</span>
                                        <span style={{ color: "#0d9488" }}>Rs. {totalAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="text-muted small" style={{ maxHeight: "80px", overflowY: "auto" }}>
                                        {cartItems.map(i => (
                                            <div key={i.productId} className="d-flex justify-content-between py-0.5">
                                                <span className="text-truncate me-2">{i.name} × {i.quantity}</span>
                                                <span className="fw-semibold text-dark flex-shrink-0">Rs. {(i.price * i.quantity).toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="modal-body px-4 pb-4">
                                {success ? (
                                    <div className="text-center py-4">
                                        <div style={{ fontSize: "3.5rem" }}>🎉</div>
                                        <h5 className="fw-bold text-success mt-3">Order Placed Successfully!</h5>
                                        <p className="text-muted small">Redirecting to your orders dashboard...</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleOrder}>
                                        {error && <div className="alert alert-danger py-2 small rounded-3 mb-3">{error}</div>}
                                        <div className="mb-2.5">
                                            <label className="form-label fw-semibold small text-dark mb-1">Full Name</label>
                                            <input
                                                className="form-control rounded-3"
                                                style={{ fontSize: "14px" }}
                                                placeholder="Recipient full name"
                                                value={form.fullName}
                                                onChange={e => setForm({ ...form, fullName: e.target.value })}
                                            />
                                        </div>
                                        <div className="mb-2.5">
                                            <label className="form-label fw-semibold small text-dark mb-1">Phone Number</label>
                                            <input
                                                className="form-control rounded-3"
                                                style={{ fontSize: "14px" }}
                                                placeholder="03XX-XXXXXXX"
                                                value={form.phone}
                                                onChange={e => setForm({ ...form, phone: e.target.value })}
                                            />
                                        </div>
                                        <div className="mb-2.5">
                                            <label className="form-label fw-semibold small text-dark mb-1">Street Address</label>
                                            <textarea
                                                className="form-control rounded-3"
                                                rows={2}
                                                style={{ fontSize: "14px" }}
                                                placeholder="House/Apartment #, Street, Area"
                                                value={form.address}
                                                onChange={e => setForm({ ...form, address: e.target.value })}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold small text-dark mb-1">City</label>
                                            <input
                                                className="form-control rounded-3"
                                                style={{ fontSize: "14px" }}
                                                placeholder="City name (e.g., Karachi, Lahore)"
                                                value={form.city}
                                                onChange={e => setForm({ ...form, city: e.target.value })}
                                            />
                                        </div>

                                        <div
                                            className="d-flex align-items-center gap-2.5 p-2.5 rounded-3 mb-3"
                                            style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
                                        >
                                            <span style={{ fontSize: "18px" }}>💵</span>
                                            <div>
                                                <div className="fw-semibold small text-dark">Cash on Delivery (COD)</div>
                                                <div className="text-muted" style={{ fontSize: "11px" }}>Pay cash at your doorstep when parcel arrives</div>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="btn w-100 rounded-pill text-white fw-bold py-2.5 shadow-sm"
                                            style={{ background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)", border: "none" }}
                                        >
                                            {loading ? (
                                                <><span className="spinner-border spinner-border-sm me-2" />Processing Order...</>
                                            ) : (
                                                `Confirm Order • Rs. ${totalAmount.toLocaleString()}`
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop show" style={{ zIndex: -1 }} />
                </div>
            )}
        </>
    );
};

export default CartSidebar;
