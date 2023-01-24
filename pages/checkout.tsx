import Layout from "@/components/Layout";
import { ProductsContext, selectedProductContextType } from "@/components/ProductsContext";
import { IProduct } from "@/models/Product";
import { useContext, useEffect, useState } from "react";
import { json } from "stream/consumers";

export default function CheckoutPage() {
    const {selectedProducts, addProduct, removeProduct} = useContext(ProductsContext) as selectedProductContextType
    const [productsInfo, setProductsInfo] = useState<IProduct[]>([])
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')

    useEffect(() => {
        const uniqIds = [...new Set(selectedProducts)]
        fetch('/api/products?ids='+uniqIds.join(','))
            .then(res => res.json())
            .then(json => setProductsInfo(json))
    }, [selectedProducts])

    const deliveryPrice = 5
    let subtotal = 0
    if (selectedProducts?.length) {
        for (let id of selectedProducts) {
            const data = productsInfo.find(p => p._id.toString() === id)
            if (data) {
                subtotal += data.price
            }
        }
    }
    const total = subtotal + deliveryPrice

    return (
        <Layout>
            {!productsInfo.length && (
                <div>No products in your cart</div>
            )}
            {productsInfo.length && productsInfo.map(product => {
                const amount = selectedProducts.filter(id => id === product._id.toString()).length
                if (amount === 0) return

                return (
                    <div className="flex mb-5" key={product._id.toString()}>
                    <div className="bg-gray-100 p-3 rounded-xl shrink-0">
                        <img className="w-24" src={product.picture} alt={product.name} />
                    </div>
                    <div className="pl-4">
                        <h3 className="font-bold  text-lg">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.description}</p>
                        <div className="flex">
                            <div className="grow">{product.price}</div>
                            <button onClick={() => removeProduct(product._id.toString())} className="border border-emerald-500 px-2 rounded-lg text-emerald-500">-</button>
                            <span className="px-2">{selectedProducts.filter(id => id === product._id.toString()).length}</span>
                            <button onClick={() => addProduct(product._id.toString())} className="bg-emerald-500 px-2 rounded-lg text-white">+</button>
                        </div>
                    </div>
                </div>
                )                
            })}
            <form action="/api/checkout" method="POST">
                <div className="mt-4">
                    <input name='name' value={name} onChange={e => setName(e.target.value)} className="bg-gray-100 w-full rounded-xl px-4 py-2 mb-2" type="text" placeholder="your name"/>
                    <input name='address' value={address} onChange={e => setAddress(e.target.value)} className="bg-gray-100 w-full rounded-xl px-4 py-2 mb-2" type="text" placeholder="street/address, number" />
                    <input name='city' value={city} onChange={e => setCity(e.target.value)} className="bg-gray-100 w-full rounded-xl px-4 py-2 mb-2" type="text" placeholder="city, postal code"/>
                    <input name='email' value={email} onChange={e => setEmail(e.target.value)} className="bg-gray-100 w-full rounded-xl px-4 py-2 mb-2" type="email" placeholder="email address"/>
                </div>
                <div className="mt-4">
                    <div className="flex my-3">
                        <h3 className="grow font-bold text-gray-400">Subtotal:</h3>
                        <h3 className="font-bold">${subtotal}</h3>
                    </div>
                    <div className="flex my-3">
                        <h3 className="grow font-bold text-gray-400">Delivery:</h3>
                        <h3 className="font-bold">${deliveryPrice}</h3>
                    </div>
                    <div className="flex my-3 border-t pt-3 border-dashed border-emerald-500">
                        <h3 className="grow font-bold text-gray-400">Total:</h3>
                        <h3 className="font-bold">${total}</h3>
                    </div>
                </div>
                
                <input type="hidden" name="products" value={selectedProducts.join(',')} />
                <button className="bg-emerald-500 px-5 py-2 text-white w-full my-4 shadow-emerald-200 shadow-lg">Pay ${total}</button>
            </form>            
        </Layout>
    )
}