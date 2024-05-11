import { ReactNode, createContext, useEffect, useReducer } from 'react'
import { cartReducer } from '../reducers/cart/reducer'
import {
  itemDecrementAction,
  itemIncrementAction,
  addItemAction,
  removeItemAction,
  checkoutCartAction,
} from '../reducers/cart/actions'
import { OrderInfo } from '../pages/Cart'
import { NavigateFunction } from 'react-router-dom'

export interface Item {
  id: string
  quantity: number
}

export interface Order extends OrderInfo {
  id: number
  items: Item[]
}

interface CartContextType {
  cart: Item[]
  addItem: (item: Item) => void
  itemIncrement: (id: Item['id']) => void
  itemDecrement: (id: Item['id']) => void
  removeItem: (id: Item['id']) => void
  checkoutCart: (order: OrderInfo, callback: NavigateFunction) => void
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
      orders: [],
    },
    (cartState) => {
      const storedStateJSON = localStorage.getItem(
        '@coffee-delivery:cart-state-1.0.0',
      )

      return storedStateJSON ? JSON.parse(storedStateJSON) : cartState
    },
  )

  const { cart } = cartState

  useEffect(() => {
    if (cartState) {
      const stateJSON = JSON.stringify(cartState)

      localStorage.setItem('@coffee-delivery:cart-state-1.0.0', stateJSON)
    }
  }, [cartState])

  function addItem(item: Item) {
    dispatch(addItemAction(item))
  }

  function itemIncrement(id: Item['id']) {
    dispatch(itemIncrementAction(id))
  }

  function itemDecrement(id: Item['id']) {
    dispatch(itemDecrementAction(id))
  }

  function removeItem(id: Item['id']) {
    dispatch(removeItemAction(id))
  }

  function checkoutCart(order: OrderInfo, callback: NavigateFunction) {
    dispatch(checkoutCartAction(order, callback))
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        itemIncrement,
        itemDecrement,
        removeItem,
        checkoutCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
