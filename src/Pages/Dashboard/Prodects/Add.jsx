import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/Auth';
import { useNavigate } from 'react-router-dom';

const categories = ["Electronics", "Clothing", "Footwear", "Books", "Home & Kitchen", "Sports", "Toys", "Beauty", "Grocery", "Other", "Fast Food"];

const initialState = { name: "", price: "", stock: "", category: "", description: "" };

const Add = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const fileInputRef = useRef(null);

    const [state, setState] = useState(initialState);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }));

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, price, stock, category, description } = state;

        if (name.trim().length < 3) return window.toastify("Please enter a valid product name (min 3 chars)", "warning");
        if (!price || Number(price) <= 0) return window.toastify("Please enter a valid price", "warning");
        if (!stock || Number(stock) < 0) return window.toastify("Please enter a valid stock quantity", "warning");
        if (!category) return window.toastify("Please select a category", "warning");
        if (description.trim().length < 10) return window.toastify("Description must be at least 10 characters", "warning");
        if (!imageFile) return window.toastify("Please upload a product image", "warning");

        const formData = new FormData();
        formData.append("name", name.trim());
        formData.append("price", price);
        formData.append("stock", stock);
        formData.append("category", category);
        formData.append("description", description.trim());
        formData.append("image", imageFile);

        try {
            setIsProcessing(true);
            const jwt = localStorage.getItem("jwt");

            const { status, data } = await axios.post(
                window.api + "/api/products/create",
                formData,
                { headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "multipart/form-data" } }
            );

            if (status === 201) {
                window.toastify(data.message || "A new Product has been successfully created", "success");
                setState(initialState);
                handleRemoveImage();
                navigate("/dashboard/products");
            }
        } catch (err) {
            console.error("err", err);
            if (err?.response) {
                const { status, data } = err.response;
                if (status === 400) window.toastify(data?.message || "Invalid input", "error");
                else window.toastify(data?.message || "Something went wrong", "error");
            } else {
                window.toastify("Network error or server unreachable", "error");
            }
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <main className="p-3 p-md-4 p-lg-5 flex-grow-1" style={{ background: '#f8fafc' }}>
            <style>{`
                .add-card {
                    background: #ffffff;
                    border-radius: 20px;
                    border: none;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                    padding: 30px;
                }
                .form-control-custom, .form-select-custom {
                    border-radius: 12px;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    padding: 14px 16px;
                    font-size: 15px;
                }
                .form-control-custom:focus, .form-select-custom:focus {
                    background: white;
                    border-color: #0d9488;
                    box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.15);
                }
                .upload-box {
                    border: 2px dashed #cbd5e1;
                    border-radius: 16px;
                    padding: 40px 20px;
                    text-align: center;
                    cursor: pointer;
                    background: #f8fafc;
                    transition: all 0.3s;
                }
                .upload-box:hover {
                    border-color: #0d9488;
                    background: #f0fdfa;
                }
                .upload-icon {
                    font-size: 40px;
                    color: #94a3b8;
                    margin-bottom: 12px;
                }
                .upload-box:hover .upload-icon {
                    color: #0d9488;
                }
                .image-preview-container {
                    position: relative;
                    width: 100%;
                    max-width: 300px;
                    margin: 0 auto;
                    border-radius: 16px;
                    overflow: hidden;
                    border: 1px solid #e2e8f0;
                }
                .image-preview {
                    width: 100%;
                    height: 250px;
                    object-fit: cover;
                }
                .remove-image-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: rgba(239, 68, 68, 0.9);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: 18px;
                    transition: transform 0.2s;
                }
                .remove-image-btn:hover {
                    transform: scale(1.1);
                    background: #ef4444;
                }
                .submit-btn {
                    background: linear-gradient(135deg, #0d9488, #042f2e);
                    border: none;
                    border-radius: 12px;
                    padding: 14px;
                    font-weight: 700;
                    font-size: 16px;
                    color: #ffffff;
                    transition: all 0.3s;
                }
                .submit-btn:hover {
                    background: linear-gradient(135deg, #0f766e, #032221);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(13, 148, 136, 0.35);
                    color: #ffffff;
                }
            `}</style>

            <div className="add-card mx-auto" style={{ maxWidth: 900 }}>
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h3 className="fw-bold mb-1">Add New Product 📦</h3>
                        <p className="text-muted mb-0 small">Fill in the details below to add a product to your store.</p>
                    </div>
                    <button className="btn btn-outline-secondary rounded-pill px-4 fw-semibold" onClick={() => navigate("/dashboard/products")}>
                        ← Back to Products
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold text-muted small ms-1">Product Name <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className="form-control form-control-custom"
                                placeholder="Enter product name"
                                name="name"
                                value={state.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold text-muted small ms-1">Category <span className="text-danger">*</span></label>
                            <select
                                className="form-select form-select-custom"
                                name="category"
                                value={state.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Select a category</option>
                                {categories.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold text-muted small ms-1">Price (PKR) <span className="text-danger">*</span></label>
                            <input
                                type="number"
                                className="form-control form-control-custom"
                                placeholder="Enter price"
                                name="price"
                                min={0}
                                value={state.price}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold text-muted small ms-1">Stock Quantity <span className="text-danger">*</span></label>
                            <input
                                type="number"
                                className="form-control form-control-custom"
                                placeholder="Enter stock quantity"
                                name="stock"
                                min={0}
                                value={state.stock}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-12">
                            <label className="form-label fw-semibold text-muted small ms-1">Description <span className="text-danger">*</span></label>
                            <textarea
                                className="form-control form-control-custom"
                                placeholder="Enter product description"
                                name="description"
                                rows={4}
                                value={state.description}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-12">
                            <label className="form-label fw-semibold text-muted small ms-1">Product Image <span className="text-danger">*</span></label>

                            {!imagePreview ? (
                                <div className="upload-box" onClick={() => fileInputRef.current?.click()}>
                                    <div className="upload-icon">📸</div>
                                    <h6 className="fw-bold mb-1 text-dark">Click to upload image</h6>
                                    <p className="text-muted small mb-0">SVG, PNG, JPG or GIF (max. 5MB)</p>
                                </div>
                            ) : (
                                <div className="image-preview-container">
                                    <img src={imagePreview} alt="Preview" className="image-preview" />
                                    <button type="button" className="remove-image-btn" onClick={handleRemoveImage} title="Remove image">×</button>
                                </div>
                            )}

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="d-none"
                            />
                        </div>

                        <div className="col-12 mt-5">
                            <button
                                type="submit"
                                className="btn btn-primary submit-btn w-100"
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <><span className="spinner-border spinner-border-sm me-2" /> Uploading Product & Image...</>
                                ) : 'Add Product'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default Add;