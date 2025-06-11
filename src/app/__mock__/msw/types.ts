export interface DB {
  categories: CategoryItem[]
  products: ProductItem[]
  users: UserItem[]
  carts: CartItem[]
  tokens: TokenItem[]
}

export interface CategoryItem {
  id: string
  name: string
  image: string
}

export interface ProductItem {
  id: string
  categoryId: string
  name: string
  description: string
  image: string
  price: string
}

export interface UserItem {
  id: string
  name: string
  email: string
  password: string
}

export interface CartItem {
  id: string
  userId: string
  list: CartListItem[]
}

export interface CartListItem {
  id: string
  product: ProductItem
  quantity: number
}

export interface UserUpdatePayload {
  name: string
}

export interface CartUpdatePayload {
  productId: string
  quantity: string
}

export interface EmailValidatePayload {
  email: string
}

export interface UserSignUpPayload {
  name: string
  email: string
  password: string
  passwordConfirm: string
}

export interface UserSignInPayload {
  email: string
  password: string
}

export interface TokenItem {
  id: string
  userId: string
  tokenAccess: string
  tokenRefresh: string
}
