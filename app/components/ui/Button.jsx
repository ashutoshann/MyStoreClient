// app/components/ui/Button.jsx
import React from 'react'
import { cn } from '../lib/utils' // पाथ चेक कर

function Button({ type = "button", onClick, className, children, ...props }) {
    return (
        <button 
            className={cn("custom-btn", className)} // हा क्लास आता डायरेक्ट फ्लेक्स आयटमवर असेल
            onClick={onClick}
            type={type}
            {...props}
        > 
            {children}
        </button>
    )
}

export default Button