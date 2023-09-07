import Elysia from "elysia"

export const timing = () => {
  return (app: Elysia) => {
    app.derive(() => {
      return {
        requestTime: Date.now(),
      }
    }).onResponse(({ request, set, requestTime }) => {
      const url = new URL(request.url)
      const rs = Date.now() - requestTime
      console.log(`${url.pathname} - ${set.status} - ${rs}ms`)
    })

    return app;
  }
}