import { createContext, ReactNode } from "react";
import useLocalStorageState from "use-local-storage-state";

export type selectedProductContextType = {
    selectedProducts: String[];
    addProduct: (id: String) => void;
    removeProduct: (id: String) => void;
    emptyCart: () => void;
}

interface Props {
    children?: ReactNode
}

export const ProductsContext = createContext<selectedProductContextType | null>(null);

export function ProductsContextProvider({children}: Props) {
    const [selectedProducts, setSelectedProducts] = useLocalStorageState<String[]>('cart', {defaultValue: []})
    function addProduct(id: String) {
        setSelectedProducts(prev => [...prev, id])
    }

    function removeProduct(id: String) {
        const pos = selectedProducts.indexOf(id)
        if (pos != -1) {
            setSelectedProducts(prev => prev.filter((value, index) => index != pos))
        }
    }
    function emptyCart () {
        setSelectedProducts([])
    }
    return (
        <ProductsContext.Provider value={{selectedProducts, addProduct, removeProduct, emptyCart}}>{children}</ProductsContext.Provider>
    )
}