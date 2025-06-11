import { Response } from "miragejs"
import { Server } from "miragejs/server"

export function mockPreview(self: Server<any>) {
  self.get("/preview", async function (schema: any) {
    return new Response(
      200,
      {},
      {
        data: schema.db.previews,
      },
    )
  })
}
