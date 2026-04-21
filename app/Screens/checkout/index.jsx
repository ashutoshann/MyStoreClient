"use client";
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { createCheckoutSession } from '../../actions/stripAction'; 
// १. हा Import विसरू नकोस:
 import { useProductContext } from '@/components/layout/ProductContext';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
    const [clientSecret, setClientSecret] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // २. Context मधून डेटा घेणे
    const { cartItems, customerData } = useProductContext();

    useEffect(() => {
        const getSecret = async () => {
            if (!cartItems || cartItems.length === 0) {
                setError("तुमची कार्ट रिकामी आहे!");
                setLoading(false);
                return;
            }

            try {
                // ३. बॅकएंडला cartItems पाठवणे (Standard Practice)
                const data = await createCheckoutSession(cartItems,customerData); 
                console.log("Client Secret Received ✅");
                setClientSecret(data.clientSecret);
            } catch (err) {
                console.error("Frontend Error:", err);
                setError(err.message || "पेमेंट गेटवे लोड करताना अडचण आली.");
            } finally {
                setLoading(false);
            }
        };
        getSecret();
    }, [cartItems]); // cartItems बदलले की पुन्हा रन होईल

    const options = { clientSecret };

    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen text-black font-sans">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <h1 className="text-3xl font-extrabold mb-2 text-gray-900">Secure Checkout</h1>
                <p className="text-blue-600 mb-8 font-bold tracking-tight">Jain E-Store: Standard Payment Gateway (INR)</p>
                
                {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 font-bold">❌ {error}</div>}

                {loading ? (
                    <div className="flex flex-col justify-center items-center py-24 space-y-4">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-500 font-bold animate-pulse">तुमची सुरक्षित तिजोरी तयार होत आहे...</p>
                    </div>
                ) : (
                    clientSecret && (
                        <div className="rounded-2xl overflow-hidden border border-gray-50 shadow-inner">
                            <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
                                <EmbeddedCheckout />
                            </EmbeddedCheckoutProvider>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Checkout;