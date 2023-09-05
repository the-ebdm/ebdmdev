export const isHTMX = (headers: Headers) => {
  return headers.get('hx-request') && (Boolean(headers.get('hx-boosted')) === false || headers.get('hx-boosted') === null)
}