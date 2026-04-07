"use client";
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { createCheckoutSession } from '../../../app/actions/stripAction.js'; // पाथ तपासा
import { useProductContext } from '../../../app/components/layout/ProductContext.jsx'; 

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage = () => {
    const [clientSecret, setClientSecret] = useState(null);
    const [error, setError] = useState(null);
    const { cartItems, customerData } = useProductContext(); 

    useEffect(() => {
        const fetchSecret = async () => {
            if (!cartItems || cartItems.length === 0) return;

            try {
                // सर्व व्हॅल्यूज डायनॅमिक पाठवणे
                const dynamicConfig = {
                    customerEmail: customerData?.email,
                    currency: "inr",
                    allowedCountries: ["IN"],
                    originUrl: window.location.origin
                };

                const data = await createCheckoutSession(cartItems, dynamicConfig);
                setClientSecret(data.clientSecret);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchSecret();
    }, [cartItems, customerData]);

    return (
        <div className="p-8 bg-[#f3f4f6] min-h-screen font-sans text-black">
            <div className="max-w-5xl mx-auto bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
                <header className="mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900">Secure Checkout</h1>
                    <p className="text-blue-600 font-bold uppercase tracking-widest text-xs mt-2">
                        Jain E-Store: Standard Payment Gateway
                    </p>
                </header>

                {error && (
                    <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-2xl font-bold border border-red-100 italic">
                        ⚠️ {error}
                    </div>
                )}

                {clientSecret ? (
                    <div className="rounded-2xl overflow-hidden shadow-inner border border-gray-50">
                        <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
                            <EmbeddedCheckout />
                        </EmbeddedCheckoutProvider>
                    </div>
                ) : (
                    <div className="py-32 text-center space-y-4">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-gray-400 font-bold animate-pulse text-lg">
                            तुमची सुरक्षित तिजोरी तयार होत आहे...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckoutPage;