"use client";

import React, { createContext, useContext, useState } from "react";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // १. कार्टमध्ये प्रॉडक्ट ॲड करणे
    const addProductToCart = (newProduct) => {
        setCartItems((prevProducts) => [...prevProducts, newProduct]);
    };

    // २. कार्टमधून प्रॉडक्ट काढणे
    const removeProductFromCart = (productId) => {
        setCartItems((prevProducts) => 
            prevProducts.filter((product) => product.id !== productId)
        );
    };

    // ३. संख्या वाढवणे (Increase Quantity) - इथे चूक होती
    const increaseQuantity = (productId) => {
        setCartItems((prevProducts) => 
            prevProducts.map((product) => 
                product.id === productId 
                ? { ...product, quantity: (product.quantity || 1) + 1 } 
                : product
            )
        );
    };

    // ४. संख्या कमी करणे (Decrease Quantity) - हे पण ॲड करून ठेव
    const decreaseQuantity = (productId) => {
        setCartItems((prevProducts) => 
            prevProducts.map((product) => 
                product.id === productId && product.quantity > 1
                ? { ...product, quantity: product.quantity - 1 } 
                : product
            )
        );
    };

    return (
        <ProductContext.Provider value={{ 
            cartItems, 
            addProductToCart, 
            removeProductFromCart, 
            increaseQuantity, 
            decreaseQuantity,
            setCartItems 
        }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProductContext = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error("useProductContext must be used within a ProductProvider");
    }
    return context;
};