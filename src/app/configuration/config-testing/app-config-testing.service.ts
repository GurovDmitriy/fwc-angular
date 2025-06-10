import { ConfigTesting } from "./types"

/**
 * Compile-time
 * Hardcode values for tests
 */
export const APP_CONFIG_TESTING_SERVICE: ConfigTesting = {
  jwtSecret: "8m6fyXIWIII7279keyGq431PYS/qWQps9WLKN9M0e7A=",
  tokenExpires: "2h",
  tokenRefreshExpires: "4h",
}
