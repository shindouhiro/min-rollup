const walk = require('../walk')

describe('单节点', () => {
  it('', () => {
    const ast = {
      a: 1
    }
    const enter = jest.fn()
    const leave = jest.fn()
    walk(ast, { enter, leave })
    let calls = enter.mock.calls
    console.log({
      calls
    })
    expect(calls.length).toBe(1)
    expect(calls[0][0]).toEqual({ a: 1 })
    calls = leave.mock.calls
    expect(calls.length).toBe(1)
    expect(calls[0][0]).toEqual({ a: 1 })
  })
})

describe('多节点', () => {
  it('', () => {
    const ast = {
      a: {
        b: 1
      },
      c: {
        d: 2
      }
    }

    const enter = jest.fn()
    const leave = jest.fn()
    walk(ast, { enter, leave })
    let calls = enter.mock.calls
    expect(calls.length).toBe(3)
    expect(calls[0][0]).toEqual({ a: { b: 1 }, c: { d: 2 } })
    expect(calls[1][0]).toEqual({ b: 1 })
    expect(calls[2][0]).toEqual({ d: 2 })

    calls = leave.mock.calls
    expect(calls.length).toBe(3)
    expect(calls[0][0]).toEqual({ b: 1 })
    expect(calls[1][0]).toEqual({ d: 2 })
    expect(calls[2][0]).toEqual({ a: { b: 1 }, c: { d: 2 } })
  })
})
