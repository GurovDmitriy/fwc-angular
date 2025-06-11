import { OrderedMap } from "immutable"

export interface Cart {
  id: string
  list: CartItem[]
}

export interface CartNormalized {
  id: string
  list: OrderedMap<string, CartItemNormalized>
}

export interface CartItemNormalized {
  productId: string
  product: CartProduct
  quantity: number
}

export interface CartItem {
  product: CartProduct
  quantity: number
}

export interface CartProduct {
  id: string
  name: string
  description: string
  image: string
  price: string
}

export interface CartProductAddPayload {
  productId: string
  quantity: number
}
