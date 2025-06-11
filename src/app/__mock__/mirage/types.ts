import { AnyFactories, ModelDefinition, Registry } from "miragejs/-types"

export interface MockUser {
  name: string
  email: string
}

export interface MockToken {
  token: string
}

export interface MockCartItem {
  product: MockProduct
  quantity: number
}

export interface MockProduct {
  id: string
  name: string
  description: string
  price: string
}

export type AppRegistry = Registry<
  {
    user: ModelDefinition<MockUser>
    token: ModelDefinition<MockToken>
  },
  AnyFactories
>
