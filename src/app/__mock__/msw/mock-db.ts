import { faker } from "@faker-js/faker/locale/en"
import { LowSync } from "lowdb"
import { LocalStorage } from "lowdb/browser"
import { nanoid } from "nanoid/non-secure"
import { CategoryItem, DB, ProductItem, TokenItem, UserItem } from "./types"

export class MockDB {
  private config = {
    imageCount: 24,
  }

  private _db: LowSync<DB> = null!

  constructor() {}

  init() {
    let defaultData
    const data = localStorage.getItem("app:lowdb")

    if (data) {
      defaultData = JSON.parse(data)
    } else {
      const { categories, products } = this._getMockData()

      defaultData = {
        categories,
        products,
        users: [],
        carts: [],
        tokens: [],
      } as DB
    }

    this._db = new LowSync(new LocalStorage<DB>("app:lowdb"), defaultData)
    this._db.write()
  }

  getCategoryList(): DB["categories"] {
    return this._db.data.categories
  }

  getProductListByCategory(categoryId: string): DB["products"] {
    return this._db.data.products.filter((p) => p.categoryId === categoryId)
  }

  getProductById(productId: string): DB["products"][number] | undefined {
    return this._db.data.products.find((p) => p.id === productId)
  }

  getCart(userId: string): DB["carts"][number] | undefined {
    return this._db.data.carts.find((c) => c.userId === userId)
  }

  createCart(userId: string): DB["carts"][number] {
    const cart = {
      id: nanoid(10),
      userId,
      list: [],
    }

    this._db.data.carts.push({
      ...cart,
    })

    this._db.write()
    return { ...cart }
  }

  updateCart(
    userId: string,
    payload: { productId: string; quantity: number },
  ): DB["carts"][number] | undefined {
    let cart = this._db.data.carts.find((c) => c.userId === userId)

    if (!cart) {
      cart = {
        id: nanoid(10),
        userId,
        list: [],
      }
      this._db.data.carts.push(cart)
    }

    const cartItem = cart.list.find((c) => c.product.id === payload.productId)

    if (cartItem) {
      cartItem.quantity += payload.quantity
    } else {
      const product = this._db.data.products.find(
        (p) => p.id === payload.productId,
      )

      if (product) {
        const newCartItem = {
          id: nanoid(10),
          product: { ...product },
          quantity: payload.quantity,
        }

        cart.list.push(newCartItem)
      }
    }

    this._db.write()
    return cart
  }

  removeCart(
    userId: string,
    payload: { productId: string; quantity: number },
  ): DB["carts"][number] | undefined {
    const cart = this._db.data.carts.find((c) => c.userId === userId)

    if (cart) {
      cart.list = cart.list
        .map((p) => {
          if (p.product.id === payload.productId) {
            return {
              ...p,
              quantity:
                payload.quantity >= p.quantity
                  ? 0
                  : p.quantity - payload.quantity,
            }
          } else {
            return p
          }
        })
        .filter((c) => c.quantity !== 0)
    }

    this._db.write()
    return cart
  }

  createUser(user: Omit<UserItem, "id">): UserItem {
    const userNew = {
      ...user,
      id: nanoid(10),
    }

    this._db.data.users.push(userNew)
    this._db.write()
    return { ...userNew }
  }

  updateUser(user: Pick<UserItem, "name">, userId: string) {
    const userExisting = this._db.data.users.find((u) => u.id === userId)

    if (userExisting) {
      Object.assign(userExisting, user)
    }

    this._db.write()
    return userExisting
  }

  getUserByEmail(email: string): DB["users"][number] | undefined {
    return this._db.data.users.find((u) => u.email === email)
  }

  getUserById(userId: string): DB["users"][number] | undefined {
    return this._db.data.users.find((u) => u.id === userId)
  }

  createToken(token: Omit<TokenItem, "id">): TokenItem {
    const tokenNew = {
      ...token,
      id: nanoid(10),
    }

    this._db.data.tokens.push(tokenNew)
    this._db.write()
    return tokenNew
  }

  getTokenByUserId(userId: string): DB["tokens"][number] | undefined {
    return this._db.data.tokens.find((t) => t.userId === userId)
  }

  updateToken(token: TokenItem): DB["tokens"][number] | undefined {
    const tokenExisting = this._db.data.tokens.find((t) => t.id === token.id)

    if (tokenExisting) {
      Object.assign(tokenExisting, token)
      this._db.write()

      return tokenExisting
    }

    return undefined
  }

  private _getMockData() {
    const categories: CategoryItem[] = Array.from({ length: 12 }, (_v, i) => {
      return {
        id: nanoid(10),
        name: `${faker.word.adjective()}`,
        image: `${(i % this.config.imageCount) + 1}.avif`,
      }
    })

    const products: ProductItem[] = categories.reduce((acc, next) => {
      for (let i = 0; i < 24; i++) {
        acc.push({
          id: nanoid(10),
          categoryId: next.id,
          name: `${faker.color.human()} ${faker.commerce.productName()}`,
          description: faker.commerce.productDescription(),
          image: `${(i % 24) + 1}.avif`,
          price: faker.commerce.price({
            min: 1,
            max: 5000,
          }),
        })
      }

      return acc
    }, [] as ProductItem[])

    return {
      categories,
      products,
    }
  }
}
