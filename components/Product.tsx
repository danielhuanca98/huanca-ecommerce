import { IProduct } from "@/models/Product"
import { useContext } from "react"
import { ProductsContext, selectedProductContextType } from "./ProductsContext"

export default function Product({_id, name, price, description, picture}: IProduct) {
  const {addProduct} = useContext(ProductsContext) as selectedProductContextType
    return (
      <div className="w-64">
        <div className="bg-blue-100 p-5 rounded-xl">
          <img src={picture} alt={name}/>
        </div>
        <div className='mt-2'>
          <h3 className='font-bold text-lg'>{name}</h3>
        </div>
        <p className='text-sm mt-1 leading-4 text-gray-500'>{description}</p>
        <div className='flex mt-2'>
          <div className='text-2xl font-bold grow'>{price}</div>
          <button onClick={() => addProduct(_id.toString())} className='bg-emerald-400 text-white py-1 px-3 rounded-xl'>+</button>
        </div>
      </div>
    )
}