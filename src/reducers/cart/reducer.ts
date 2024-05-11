import { produce } from 'immer'
import { Item, Order } from '../../contexts/CartContext'
import { ActionTypes, Actions } from './actions'

interface CartState {
  cart: Item[]
  orders: Order[]
}

export function cartReducer(state: CartState, action: Actions) {
  switch (action.type) {
    case ActionTypes.ADD_ITEM:
      return produce(state, (draft) => {
        const { id, quantity } = action.payload.item
        const itemExist = draft.cart.find((item) => item.id === id)

        itemExist
          ? (itemExist.quantity += quantity)
          : draft.cart.push({ id, quantity })
      })
    case ActionTypes.ITEM_INCREMENT:
      return produce(state, (draft) => {
        const { id } = action.payload
        const item = draft.cart.find((item) => item.id === id)

        item && (item.quantity += 1)
      })
    case ActionTypes.ITEM_DECREMENT:
      return produce(state, (draft) => {
        const { id } = action.payload
        const item = draft.cart.find((item) => item.id === id)

        item && item.quantity > 1 && (item.quantity -= 1)
      })
    case ActionTypes.REMOVE_ITEM:
      return produce(state, (draft) => {
        const { id } = action.payload
        const itemIndex = draft.cart.findIndex((item) => item.id === id)

        draft.cart.splice(itemIndex, 1)
      })
    case ActionTypes.CHECKOUT_CART:
      return produce(state, (draft) => {
        const newOrder: Order = {
          id: new Date().getTime(),
          items: state.cart,
          ...action.payload.order,
        }

        draft.orders.push(newOrder)
        draft.cart = []

        action.payload.callback(`/order/${newOrder.id}/success`)
      })
  }
}
