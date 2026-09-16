import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const saved = localStorage.getItem('mystore_cart');
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });

    useEffect(() => {
        localStorage.setItem('mystore_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems(prev => {
            const existing = prev.find(i => i.productId === product.id);
            if (existing) {
                return prev.map(i =>
                    i.productId === product.id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [...prev, {
                productId: product.id,
                name: product.name,
                price: Number(product.price),
                imageURL: product.imageURL || '',
                quantity: 1,
                stock: product.stock,
            }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(i => i.productId !== productId));
    };

    const updateQty = (productId, qty) => {
        if (qty < 1) { removeFromCart(productId); return; }
        setCartItems(prev =>
            prev.map(i => i.productId === productId ? { ...i, quantity: qty } : i)
        );
    };

    const clearCart = () => setCartItems([]);

    const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0);
    const totalAmount = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalAmount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
export default CartProvider;
