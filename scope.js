class Scope {
  constructor(options = {}) {
    this.parent = options.parent
    this.names = options.name || []
  }
  add(name) {
    this.names.push(name)
  }

  cantains(name) {
    return !!this.findDefiningScope(name)
  }

  findDefiningScope(name) {
    if (this.names.includes(name)) {
      return this
    }
    else if (this.parent) {
      return this.parent.findDefiningScope(name)
    } else {
      return null
    }
  }
}

module.exports = Scope
