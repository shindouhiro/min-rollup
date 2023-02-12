const acron = require('acorn')
const MagicString = require('magic-string');
const code = `
const a = function() {}
const b = function() {}
const c = function() {}
a()
b()
`
const ast = acron.parse(code, {
  ecmaVersion: 2020
})
console.log({ ast })





const m = new MagicString(code)
// ast.body.map((node,i) =>  {
//     console.log(`${i}: ${m.snip(node.start, node.end).toString()}`)
// })

//```
//const a= function() {}
//a()
//```
const obj = ast.body.filter(node => node.type == "VariableDeclaration").reduce((pre, cur) => {
  pre[cur.declarations[0].id.name] = {
    start: cur.start,
    end: cur.end
  }
  return pre

}, {})
console.log('!!!!!!!')
console.log(obj)

const arr = ast.body.filter(node => node.type == "ExpressionStatement").map(node => {
  let key = node.expression.callee.name
  let val = obj[key]
  console.log(m.snip(val.start, val.end).toString())
  console.log(m.snip(node.start, m.snip(node.end)).toString())
})
