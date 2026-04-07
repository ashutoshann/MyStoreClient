"use server";
import Stripe from "stripe";

// १. पेमेंट सेशन तयार करणे (Create)
export async function createCheckoutSession(products, customerData) {
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    try {
        const checkoutSession = await stripeInstance.checkout.sessions.create({
            ui_mode: "embedded_page", 
            invoice_creation: { enabled: true },
            customer_email: customerData?.email,
            submit_type: "pay",
            billing_address_collection: "auto",
            shipping_address_collection: { allowed_countries: ["IN"] },
            line_items: products?.map((product) => ({
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: `${product.name} (Size: ${product.size})`
                    },
                    unit_amount: Math.round(parseFloat(product.sellPrice) * 100),
                },
                quantity: product.quantity,
            })),
            mode: "payment",
            metadata: { customerId: customerData?.id },
            return_url: `${process.env.BASE_URL}/payment-status?session_id={CHECKOUT_SESSION_ID}`,
        });
        return { clientSecret: checkoutSession.client_secret };
    } catch (error) {
        console.error("🚨 [3000] Stripe Create Error:", error.message);
        throw new Error(error.message);
    }
}

// २. पेमेंट स्टेटस मिळवणे (Retrieve) - हेच तुझं पेज "Spinning" करत होतं
export async function getSessionStatus(sessionId) {
    console.log("🚀 [3000] 'getSessionStatus' सुरु झाले... ID:", sessionId);
    
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    try {
        // अ. स्ट्राईपकडून डेटा ओढणे
        const session = await stripeInstance.checkout.sessions.retrieve(sessionId);

        // ब. तुझ्या ३००१ बॅकएंड (Admin) कडून डेटा ओढणे
        const backendUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/client/order/${sessionId}`;
        console.log(`🔗 [3000] बॅकएंडला हाक मारत आहे: ${backendUrl}`);

        const response = await fetch(backendUrl, { 
            cache: 'no-store',
            next: { revalidate: 0 } 
        });

        let orderData = {};
        if (response.ok) {
            orderData = await response.json();
            console.log("✅ [3000] बॅकएंड डेटा मिळाला!");
        } else {
            console.warn("⚠️ [3000] बॅकएंडला डेटा सापडला नाही, स्ट्राईप डेटा वापरत आहे.");
        }

        // क. डेटा मॅपिंग (Mapping) - तुझ्या UI नुसार
        const finalData = {
            status: session.status,
            paymentStatus: session.payment_status,
            id: orderData.id || session.id.slice(-8),
            customerName: orderData.buyer?.custtomerName || session.customer_details?.name || "Customer",
            customerEmail: orderData.buyer?.email || session.customer_details?.email,
            orderTime: orderData.createdAt || new Date().toISOString(),
            totalAmount: orderData.totalAmount || (session.amount_total / 100),
            currency: session.currency?.toUpperCase() || "INR",
            products: orderData.transactions || [], 
            paymentMode: "Stripe Online"
        };

        // 🔥 महत्त्वाचे: Plain Object मध्ये कन्व्हर्ट करणे जेणेकरून 'Spinning' थांबेल
        return JSON.parse(JSON.stringify(finalData));

    } catch (error) {
        console.error("🚨 [3000] Critical Fetch Error:", error.message);
        throw new Error("पेमेंटची माहिती लोड होऊ शकली नाही.");
    }
}