import { useContext, useEffect, useState, ReactNode } from "react";
import Footer from "./Footer";
import { ProductsContext, selectedProductContextType } from "./ProductsContext";

interface Props {
    children?: ReactNode
}

export default function Layout({ children }: Props) {
    const {emptyCart} = useContext(ProductsContext) as selectedProductContextType
    const [success, setSuccess] = useState(false)
    useEffect(() => {
        if (window.location.href.includes('success')) {
            emptyCart()
            setSuccess(true)
        }
    }, [])
    return (
        <div>
            <div className="p-5">
                {success && (
                    <div className="mb-5 bg-green-400 text-white text-lg p-5 rounded-xl">
                        Thanks for your Order!
                    </div>
                )}
                {children}
            </div>            
            <Footer />
        </div>
    )        
}