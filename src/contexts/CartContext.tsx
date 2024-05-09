import { ReactNode, createContext, useEffect, useReducer } from 'react'
import { cartReducer } from '../reducers/cart/reducer'
import { addItemAction } from '../reducers/cart/actions'

export interface Item {
  id: string
  quantity: number
}

interface CartContextType {
  cart: Item[]
  addItem: (item: Item) => void
}

export const CartContext = createContext({} as CartContextType)

interface CartContextProps {
  children: ReactNode
}

export function CartContextProvider({ children }: CartContextProps) {
  const [cartState, dispatch] = useReducer(
    cartReducer,
    {
      cart: [],
    },
    (cartState) => {
      const storedStateJSON = localStorage.getItem(
        '@coffee-delivery:cart-state-1.0.0',
      )

      return storedStateJSON ? JSON.parse(storedStateJSON) : cartState
    },
  )

  const { cart } = cartState
  console.log(cart)

  useEffect(() => {
    if (cartState) {
      const stateJSON = JSON.stringify(cartState)

      localStorage.setItem('@coffee-delivery:cart-state-1.0.0', stateJSON)
    }
  }, [cartState])

  function addItem(item: Item) {
    dispatch(addItemAction(item))
  }

  return (
    <CartContext.Provider value={{ cart, addItem }}>
      {children}
    </CartContext.Provider>
  )
}
