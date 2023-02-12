function walk(ast, { enter, leave }) {
  // enter(ast)
  // leave(ast)
  visit(ast, null, enter, leave)
}

function visit(node, parent, enter, leave) {
  if (!node) return
  if (enter) {
    // enter(node)
    enter.call(null, node, parent)
  }
  let childKeys = Object.keys(node).filter(item => typeof node[item] === 'object')
  childKeys.forEach(childkey => {
    let value = node[childkey]
    visit(value, node, enter, leave)
  })
  if (leave) {
    leave(node, parent)
  }


}

module.exports = walk
