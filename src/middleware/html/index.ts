import Elysia from "elysia"

export const html = () => {
  return (app: Elysia) => {
    app.derive((context) => ({
      html(value: any) {
        return new Response(value, {
          headers: {
            ...context.set.headers,
            'content-type': 'text/html'
          } as HeadersInit
        });
      }
    })).onAfterHandle((context, response) => {
      if (typeof response === 'string' &&
        response
          .trimStart()
          .slice(0, 9)
          .toLowerCase()
          .startsWith('<!doctype'))
        return context.html(response);
    })

    return app;
  }
}