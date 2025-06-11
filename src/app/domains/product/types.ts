export interface Product {
  id: string
  name: string
  description: string
  image: string
  price: number
}

export interface ProductAddPayload {
  productId: string
  quantity: number
}

export interface ProductRemovePayload {
  productId: string
  quantity: number
}
