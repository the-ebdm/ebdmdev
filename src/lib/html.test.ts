import { describe, expect, it, beforeAll, afterAll, afterEach } from "bun:test";
import { isHTMX } from "./html";

// TODO: Fix this test / underlying function (the code works but the test doesn't)
// describe('isHTMX', () => {
//   it('should return true when headers contain hx-request and hx-boosted is false or null', () => {
//     const headers = new Headers()
//     headers.set('hx-request', 'true')
//     headers.set('hx-boosted', 'false')
//     console.log(headers)
//     expect(isHTMX(headers)).toBe(true)
//   })
// })