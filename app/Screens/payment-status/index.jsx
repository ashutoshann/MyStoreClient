"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getSessionStatus } from '../../actions/stripAction.js'; 
import Link from 'next/link';

const PaymentStatusContent = () => {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("🖥️ [Client] Session ID शोधत आहे:", sessionId);

        if (!sessionId) {
            setLoading(false);
            setError("Session ID सापडला नाही.");
            return;
        }

        // 🚨 EMERGENCY EXIT: जर १० सेकंदात काहीच झालं नाही तर लोडर थांबवा
        const timer = setTimeout(() => {
            if (loading) {
                setLoading(false);
                setError("सर्व्हर प्रतिसाद देत नाहीये (Timeout).");
            }
        }, 10000);

        getSessionStatus(sessionId)
            .then((data) => {
                clearTimeout(timer);
                console.log("✅ [Client] डेटा मिळाला:", data);
                if (data) {
                    setOrderData(data);
                } else {
                    setError("डेटा रिकामा आहे (Null Data).");
                }
                setLoading(false);
            })
            .catch((err) => {
                clearTimeout(timer);
                console.error("❌ [Client] एरर आला:", err.message);
                setError(err.message);
                setLoading(false);
            });

        return () => clearTimeout(timer);
    }, [sessionId]);

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-white">
                <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-600 mb-4 shadow-lg"></div>
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-400 animate-pulse">
                    Standard Security Engine v2.0
                </h2>
                <p className="text-[10px] text-gray-300 mt-2">Checking Transaction Integrity...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
                <div className="bg-red-50 p-8 rounded-[2rem] border border-red-100 max-w-sm">
                    <h1 className="text-2xl font-black text-red-600 mb-2 uppercase">System Halt</h1>
                    <p className="text-gray-500 text-sm mb-6">{error}</p>
                    <button onClick={() => window.location.reload()} className="w-full bg-black text-white py-3 rounded-xl font-bold">
                        Retry Engine
                    </button>
                </div>
            </div>
        );
    }

    // पेमेंट सक्सेस लॉजिक
    const isSuccess = orderData?.payment_status === 'paid' || orderData?.status === 'complete';

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] p-4">
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-md w-full text-center border border-gray-50">
                {isSuccess ? (
                    <>
                        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 mb-2">SUCCESS!</h1>
                        <p className="text-gray-400 text-sm mb-8 font-medium italic">Verification Complete</p>
                    </>
                ) : (
                    <>
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase">Declined</h1>
                        <p className="text-gray-500 text-sm mb-8">Payment verification failed.</p>
                    </>
                )}
                <Link href="/" className="block w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl hover:-translate-y-1">
                    Return to Store
                </Link>
                <p className="mt-10 text-[9px] text-gray-300 uppercase tracking-[0.4em] font-black">
                    Engineered By Ashutosh Jain
                </p>
            </div>
        </div>
    );
};

export default function PaymentStatusPage() {
    return (
        <Suspense fallback={<div>Initializing...</div>}>
            <PaymentStatusContent />
        </Suspense>
    );
}