import { produce } from 'immer'
import { Item } from '../../contexts/CartContext'
import { ActionTypes, Actions } from './actions'

interface CartState {
  cart: Item[]
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
  }
}
