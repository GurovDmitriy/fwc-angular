import { belongsTo, createServer, Model } from "miragejs"
import { ConfigTesting } from "../configuration/config-testing"
import { Environment } from "../configuration/env"
import { mockAuth } from "./auth"

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
    },

    seeds(server) {
      const dbPersist = localStorage.getItem("mirage") || ""

      if (dbPersist) {
        server.db.loadData({
          ...JSON.parse(dbPersist),
        })
      }
    },

    routes() {
      this.passthrough(`${env.appUrl}/**`)
      this.urlPrefix = `${env.apiUrl}`
      this.timing = 1000

      mockAuth(this, env, config)
    },
  })
}
