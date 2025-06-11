import { setupWorker } from "msw/browser"
import { Handlers } from "./handlers"
import { MockDB } from "./mock-db"

const mockDB = new MockDB()
const handlers = new Handlers(mockDB)
const worker = setupWorker(...handlers.handlers())

export { mockDB, worker }
