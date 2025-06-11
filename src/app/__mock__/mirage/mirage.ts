import { faker } from "@faker-js/faker/locale/en"
import { belongsTo, createServer, Factory, hasMany, Model } from "miragejs"
import { ConfigTesting } from "../../configuration/config-testing"
import { Environment } from "../../configuration/env"
import { mockAuth } from "./internal/auth"
import { mockCart } from "./internal/cart"
import { mockProduct } from "./internal/product"

const modeMap = {
  development: "development",
  testing: "test",
  production: undefined,
  staging: undefined,
}

export function mirage(env: Environment, config: ConfigTesting) {
  return createServer({
    environment: modeMap[env.mode] || undefined,

    models: {
      user: Model.extend({
        token: belongsTo(),
      }),
      token: Model.extend({
        user: belongsTo(),
      }),

      cart: Model.extend({
        user: belongsTo(),
        list: Array,
      }),

      preview: Model.extend({
        product: hasMany(),
      }),
      product: Model.extend({
        preview: belongsTo(),
      }),
    },

    factories: {
      preview: Factory.extend({
        name() {
          return `${faker.word.adjective()}`
        },
        image(i: number) {
          return `${(i % 24) + 1}.avif`
        },
      }),
      product: Factory.extend({
        name() {
          return `${faker.color.human()} ${faker.commerce.productName()}`
        },
        description() {
          return faker.commerce.productDescription()
        },
        image(i: number) {
          return `${(i % 24) + 1}.avif`
        },
        price() {
          return faker.commerce.price({
            min: 1,
            max: 5000,
          })
        },
      }),
    },

    seeds(server) {
      const dbPersist = localStorage.getItem("mirage") || ""

      if (dbPersist) {
        server.db.loadData({
          ...JSON.parse(dbPersist),
        })
      } else {
        server.createList("preview", 16).forEach((preview) => {
          server.createList("product", 20, { preview })
        })

        const db = server.db as any

        localStorage.setItem(
          "mirage",
          JSON.stringify({
            users: db.users,
            tokens: db.tokens,
            carts: db.carts,
            previews: db.previews,
            products: db.products,
          }),
        )
      }
    },

    routes() {
      this.passthrough(`${env.appUrl}/**`)
      this.passthrough(`${env.apiUrl}/preview`)
      this.urlPrefix = `${env.apiUrl}`
      this.timing = 1000

      mockAuth(this, env, config)
      mockCart(this, env, config)

      // mockPreview(this)
      mockProduct(this)
    },
  })
}
