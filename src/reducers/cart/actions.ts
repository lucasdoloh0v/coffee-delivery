import { NavigateFunction } from 'react-router-dom'
import { Item } from '../../contexts/CartContext'
import { OrderInfo } from '../../pages/Cart'

export enum ActionTypes {
  ADD_ITEM = 'ADD_ITEM',
  ITEM_INCREMENT = 'ITEM_INCREMENT',
  ITEM_DECREMENT = 'ITEM_DECREMENT',
  REMOVE_ITEM = 'REMOVE_ITEM',
  CHECKOUT_CART = 'CHECKOUT_CART',
}

export type Actions =
  | {
      type: ActionTypes.ADD_ITEM
      payload: {
        item: Item
      }
    }
  | {
      type:
        | ActionTypes.ITEM_INCREMENT
        | ActionTypes.ITEM_DECREMENT
        | ActionTypes.REMOVE_ITEM
      payload: {
        id: Item['id']
      }
    }
  | {
      type: ActionTypes.CHECKOUT_CART
      payload: {
        order: OrderInfo
        callback: NavigateFunction
      }
    }

export function addItemAction(item: Item) {
  return {
    type: ActionTypes.ADD_ITEM,
    payload: { item },
  } satisfies Actions
}

export function itemIncrementAction(id: Item['id']) {
  return {
    type: ActionTypes.ITEM_INCREMENT,
    payload: {
      id,
    },
  } satisfies Actions
}

export function itemDecrementAction(id: Item['id']) {
  return {
    type: ActionTypes.ITEM_DECREMENT,
    payload: {
      id,
    },
  } satisfies Actions
}

export function removeItemAction(id: Item['id']) {
  return {
    type: ActionTypes.REMOVE_ITEM,
    payload: {
      id,
    },
  } satisfies Actions
}

export function checkoutCartAction(
  order: OrderInfo,
  callback: NavigateFunction,
) {
  return {
    type: ActionTypes.CHECKOUT_CART,
    payload: {
      order,
      callback,
    },
  } satisfies Actions
}
