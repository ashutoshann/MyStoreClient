import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs){
       return  twMerge(clsx(inputs))
}

export function objectQueryString(obj) {
  const params = [];
  for (const [key, value] of Object.entries(obj)) {
    // 'all' किंवा रिकाम्या व्हॅल्यू गाळून टाका
    if (value !== null && value !== undefined && value !== "" && value !== "all") {
      params.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }
  }
  return params.length > 0 ? params.join("&") : "";
}