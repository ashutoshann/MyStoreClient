import React from 'react'
import { cn } from '../../components/lib/utils'

const Input = ({ type = "text", className, ...props }) => {
    return (
        <div className="w-full">
            <input 
                type={type}
                placeholder='Search Product....'
                className={cn('custom_input w-full p-2 border rounded', className)}
                {...props} // हे सर्व value आणि onChange ला सांभाळेल
            />
        </div>
    )
}

export default Input