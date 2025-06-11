import { bootstrapApplication } from "@angular/platform-browser"
import { AppComponent } from "./app/app.component"
import { appConfig } from "./app/app.config"
import { environment } from "./app/configuration/env"

async function enableMocking() {
  if (!["production", "development", "testing"].includes(environment.mode)) {
    return Promise.resolve(true)
  }
  const { worker, mockDB } = await import("./app/__mock__/msw/worker")

  mockDB.init()

  return worker.start({
    serviceWorker: {
      url: `${environment.appUrl}/mockServiceWorker.js`,
    },
  })
}

enableMocking().then(() => {
  bootstrapApplication(AppComponent, appConfig).catch((err) =>
    console.error(err),
  )
})
