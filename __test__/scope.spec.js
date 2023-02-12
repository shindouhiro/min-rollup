const Scope = require('../scope')
describe('scoe', () => {
  it('', () => {
    /*
      *   let a  = 1
*   
*   function f1() {
*   
*      let b = 2
*   }
      * 
      */

    const root = new Scope({})
    root.add('a')
    const child = new Scope({ parent: root })
    child.add('b')
    expect(child.cantains('b')).toBe(true)
    expect(root.cantains('a')).toBe(true)

    expect(root.cantains('b')).toBe(true)
    expect(child.findDefiningScope('a')).toBe(root)
    expect(child.findDefiningScope('b')).toBe(child)
  })
})
