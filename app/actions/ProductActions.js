"use server"
import { objectQueryString } from "../components/lib/utils";

const ADMIN_URL = "http://127.0.0.1:3001"; // IP वापरणे सुरक्षित आहे

export async function getProducts(searchParams = {}) {
  try {
    // आपण सर्च पॅरामीटर्समधून फिल्टर बनवूया
    const queryString = objectQueryString(searchParams);
    const finalUrl = `${ADMIN_URL}/api/products?${queryString}`;
    
    console.log("📡 API Call:", finalUrl);

    const res = await fetch(finalUrl, { cache: "no-store" });
    const result = await res.json();
    return result.data || []; 
  } catch (error) {
    console.error("❌ getProducts Failed:", error.message);
    return [];
  }
}
export async function getProductById(productId) {
    try {
        const res = await fetch(`${ADMIN_URL}/api/products/${productId}`, { cache: "no-store" });
        const result = await res.json();
        return result.data || null;
    } catch (error) {
        return null;
    }
}

export async function getProductTypes() {
    try {
        const res = await fetch(`${ADMIN_URL}/api/products/product-type`, { cache: "no-store" });
        const result = await res.json();
        return result.data || [];
    } catch (error) {
        return [];
    }
}