import { AnyFactories, ModelDefinition, Registry } from "miragejs/-types"

export interface User {
  name: string
  email: string
}

export interface Token {
  token: string
}

export type AppRegistry = Registry<
  {
    user: ModelDefinition<User>
    token: ModelDefinition<Token>
  },
  AnyFactories
>
