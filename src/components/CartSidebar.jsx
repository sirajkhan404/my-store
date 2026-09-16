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

    const handleOrder = async (e) => {
        e.preventDefault();
        if (!form.fullName || !form.phone || !form.address || !form.city) {
            setError("Tamam fields fill karo."); return;
        }
        setLoading(true); setError("");
        try {
            const jwt = localStorage.getItem("jwt");
            const products = cartItems.map(i => ({
                productId: i.productId, name: i.name, price: i.price,
                quantity: i.quantity, imageURL: i.imageURL,
            }));
            await axios.post(
                `${window.api}/api/orders/create`,
                { products, totalAmount, shippingAddress: form },
                { headers: { Authorization: `Bearer ${jwt}` } }
            );
            setSuccess(true);
            clearCart();
            setTimeout(() => { setSuccess(false); setShowCheckout(false); onClose(); navigate("/dashboard"); }, 2500);
        } catch (err) {
            setError(err?.response?.data?.message || "Order place nahi hua. Dobara try karo.");
        } finally { setLoading(false); }
    };

    return (
        <>
            {isOpen && (
                <div onClick={onClose} style={{
                    position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
                    zIndex: 1040, backdropFilter: "blur(2px)",
                }} />
            )}
            <div style={{
                position: "fixed", top: 0, right: 0, height: "100vh",
                width: "100%", maxWidth: "420px", background: "#fff",
                boxShadow: "-8px 0 40px rgba(0,0,0,0.15)", zIndex: 1050,
                transform: isOpen ? "translateX(0)" : "translateX(100%)",
                transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
                display: "flex", flexDirection: "column",
            }}>
                <div className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom"
                    style={{ background: "linear-gradient(135deg, #042f2e, #0d9488)" }}>
                    <div className="d-flex align-items-center gap-2 text-white">
                        <span style={{ fontSize: "22px" }}>??</span>
                        <div>
                            <div className="fw-bold fs-6">My Cart</div>
                            <div style={{ fontSize: "12px", opacity: 0.8 }}>{cartItems.length} item(s)</div>
                        </div>
                    </div>
                    <button onClick={onClose} className="btn btn-sm text-white border-0"
                        style={{ background: "rgba(255,255,255,0.15)", borderRadius: "50%", width: "34px", height: "34px", padding: 0 }}>?</button>
                </div>

                <div className="flex-grow-1 overflow-auto px-3 py-3">
                    {cartItems.length === 0 ? (
                        <div className="text-center py-5 mt-4">
                            <div style={{ fontSize: "4rem" }}>???</div>
                            <h5 className="text-muted mt-3 fw-semibold">Cart empty hai</h5>
                            <p className="text-muted small">Koi product add karo!</p>
                        </div>
                    ) : (
                        <div className="d-flex flex-column gap-3">
                            {cartItems.map(item => (
                                <div key={item.productId} className="d-flex align-items-center gap-3 p-3 rounded-4 border"
                                    style={{ background: "#f8fafc", borderColor: "rgba(0,0,0,0.07)" }}>
                                    <img src={item.imageURL || "https://via.placeholder.com/60"} alt={item.name}
                                        style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "10px", flexShrink: 0 }}
                                        onError={e => { e.target.src = "https://via.placeholder.com/60?text=No+Image"; }} />
                                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                        <div className="fw-semibold text-dark text-truncate small">{item.name}</div>
                                        <div className="text-dark fw-bold" style={{ fontSize: "13px" }}>Rs. {Number(item.price).toLocaleString()}</div>
                                        <div className="d-flex align-items-center gap-2 mt-2">
                                            <button className="btn btn-sm border rounded-circle d-flex align-items-center justify-content-center"
                                                style={{ width: "26px", height: "26px", padding: 0 }}
                                                onClick={() => updateQty(item.productId, item.quantity - 1)}>-</button>
                                            <span className="fw-bold small">{item.quantity}</span>
                                            <button className="btn btn-sm border rounded-circle d-flex align-items-center justify-content-center"
                                                style={{ width: "26px", height: "26px", padding: 0 }}
                                                disabled={item.quantity >= item.stock}
                                                onClick={() => updateQty(item.productId, item.quantity + 1)}>+</button>
                                        </div>
                                    </div>
                                    <div className="text-end flex-shrink-0">
                                        <div className="fw-bold text-dark small mb-2">Rs. {(item.price * item.quantity).toLocaleString()}</div>
                                        <button onClick={() => removeFromCart(item.productId)} className="btn btn-sm"
                                            style={{ color: "#ef4444", fontSize: "16px", padding: "2px 6px" }}>??</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="px-4 py-3 border-top" style={{ background: "#f8fafc" }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="fw-semibold text-muted">Total:</span>
                            <span className="fw-bold fs-5 text-dark">Rs. {totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="d-flex gap-2">
                            <button onClick={clearCart} className="btn btn-outline-danger rounded-pill flex-shrink-0 fw-semibold" style={{ fontSize: "13px" }}>Clear</button>
                            {isAuth && user?.role === "customer" ? (
                                <button onClick={() => setShowCheckout(true)}
                                    className="btn text-dark rounded-pill flex-grow-1 fw-bold shadow"
                                    style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", border: "none" }}>
                                    Checkout 🛒
                                </button>
                            ) : (
                                <button onClick={() => { onClose(); navigate("/login"); }}
                                    className="btn text-white rounded-pill flex-grow-1 fw-bold"
                                    style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)", border: "none" }}>
                                    Login to Order
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {showCheckout && (
                <div className="modal d-block" style={{ zIndex: 1060 }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" style={{ maxWidth: "480px" }}>
                        <div className="modal-content rounded-4 border-0 overflow-hidden shadow-lg">
                            <div className="modal-header border-0 px-4 pt-4 pb-0">
                                <div>
                                    <h5 className="fw-bold text-dark mb-0">Shipping Details</h5>
                                    <p className="text-muted small mb-0">Apna address enter karo</p>
                                </div>
                                <button onClick={() => { setShowCheckout(false); setError(""); setSuccess(false); }} className="btn-close ms-auto" />
                            </div>
                            <div className="px-4 pt-3">
                                <div className="rounded-3 p-3 mb-1" style={{ background: "linear-gradient(135deg, #f0fdfa, #ccfbf1)" }}>
                                    <div className="fw-semibold text-dark small mb-2">Order Summary</div>
                                    {cartItems.map(i => (
                                        <div key={i.productId} className="d-flex justify-content-between small text-muted">
                                            <span className="text-truncate me-2">{i.name} x{i.quantity}</span>
                                            <span className="fw-semibold text-dark flex-shrink-0">Rs. {(i.price * i.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                    <hr className="my-2" />
                                    <div className="d-flex justify-content-between fw-bold">
                                        <span>Total</span>
                                        <span style={{ color: '#0d9488' }}>Rs. {totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-body px-4 pb-4">
                                {success ? (
                                    <div className="text-center py-4">
                                        <div style={{ fontSize: "3rem" }}>??</div>
                                        <h5 className="fw-bold text-success mt-3">Order Place Ho Gaya!</h5>
                                        <p className="text-muted small">Dashboard mein dekho apna order.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleOrder}>
                                        {error && <div className="alert alert-danger py-2 small rounded-3 mb-3">{error}</div>}
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold small text-dark">Full Name</label>
                                            <input className="form-control rounded-3" style={{ fontSize: "14px" }} placeholder="Apna pura naam"
                                                value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold small text-dark">Phone Number</label>
                                            <input className="form-control rounded-3" style={{ fontSize: "14px" }} placeholder="03XX-XXXXXXX"
                                                value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold small text-dark">Address</label>
                                            <textarea className="form-control rounded-3" rows={2} style={{ fontSize: "14px" }} placeholder="Ghar ka address"
                                                value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label fw-semibold small text-dark">City</label>
                                            <input className="form-control rounded-3" style={{ fontSize: "14px" }} placeholder="Apna shehar"
                                                value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                                        </div>
                                        <div className="d-flex align-items-center gap-2 p-3 rounded-3 mb-4"
                                            style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                                            <span>??</span>
                                            <div>
                                                <div className="fw-semibold small text-dark">Cash on Delivery</div>
                                                <div className="text-muted" style={{ fontSize: "11px" }}>Delivery par payment hogi</div>
                                            </div>
                                        </div>
                                        <button type="submit" disabled={loading}
                                            className="btn w-100 rounded-pill text-dark fw-bold py-2 shadow"
                                            style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", border: "none" }}>
                                            {loading ? (<><span className="spinner-border spinner-border-sm me-2" />Placing Order...</>) : "Place Order 🛒"}
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
