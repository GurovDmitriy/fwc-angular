import { bootstrapApplication } from "@angular/platform-browser"
import { mirage } from "./app/__mock__/mirage"
import { AppComponent } from "./app/app.component"
import { appConfig } from "./app/app.config"
import { APP_CONFIG_TESTING_SERVICE } from "./app/configuration/config-testing"
import { environment } from "./app/configuration/env"

new Promise((resolve) => {
  if (["development", "testing"].includes(environment.mode)) {
    mirage(environment, APP_CONFIG_TESTING_SERVICE)
    resolve(true)
  }
}).then(() => {
  bootstrapApplication(AppComponent, appConfig).catch((err) =>
    console.error(err),
  )
})
