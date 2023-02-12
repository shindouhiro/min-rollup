const Scope = require("./scope");
const walk = require("./walk");

/**
 * 当前模块使用哪些变量
 * 哪些变量是当前模块声明
 *
 * @param {*} ast
 * @param {*} magicString
 * @param {*} module
 */
function analyse(ast, magicString, module) {
  // 职责

  // 创建全局作用域
  let scope = new Scope();
  // 遍历当前语法树
  ast.body.forEach((statement) => {

    /**
     * 给作用域内添加变量
     * @param {*} declaration
     */
    function addToScope(declaration) {
      // console.log('addToScope', declaration.id.name)
      var name = declaration.id.name; // 获取声明的变量
      scope.add(name);
      if (!scope.parent) {
        // 如果此变量不是全局作用域
        // 如果当前是全局作用域的话
        // 在全局作用域下声明全局变量
        statement._defines[name] = true;
      }
    }

    Object.defineProperties(statement, {
      _module: { value: module },

      // 变量定义
      _defines: { value: {} }, //当前的节点声明的变量 home

      // _modifies: { value: {} },//修改的语句
      // 依赖外部变量
      _dependsOn: { value: {} }, //当前模块没有定义的变量 当前节点依赖了哪些外部变量 name

      _included: { value: false, writable: true }, //此语句是已经包含到输出语句里了

      // 变量语句
      _source: { value: magicString.snip(statement.start, statement.end) },
    });

    // 作用域链遍历
    // 分析变量定义的
    // 构造作用域链
    walk(statement, {
      enter(node) {
        let newScope;
        // 防止空节点和空数组
        if (node === null || node.length === 0) return;
        switch (node.type) {
          // 方法声明
          case "FunctionDeclaration":
            addToScope(node);
            const params = node.params.map((v) => v.name);
            // 新作用域
            newScope = new Scope({
              parent: scope,
              params,
            });
            break;
          // 变量声明
          case "VariableDeclaration":
            node.declarations.forEach(addToScope);
            break;
          default:
            break;
        }
        if (newScope) {
          // console.log("newScope", newScope);
          // 当前节点声明的新作用域
          // 如果此节点生成一个新作用域
          Object.defineProperties(node, { _scope: { value: newScope } });
          scope = newScope;
        }
      },
      leave(node) {
        if (node._scope) {
          // 如果此节点离开退回父作用域
          scope = scope.parent;
        }
      },
    });
  });
  ast._scope = scope;

  // 找出哪些变量需要外依赖
  ast.body.forEach((statement) => {
    walk(statement, {
      enter(node) {
        if (node._scope) {
          scope = node._scope;
        }
        // 遇到变量节点
        if (node.type === "Identifier") {
          // 遇到 exports const a => node.name = 'a'
          // console.log("Identifier:", node);
          // 向上递归
          // TODO
          // const definingScope = scope.findDefiningScope(node.name);
          // // console.log('definingScope ', node.name, definingScope)
          // if (!definingScope) {
          //   statement._dependsOn[node.name] = true; // 表示属于外部依赖变量
          // }
          statement._dependsOn[node.name] = true;
        }
      },

      leave(node) {
        if (node._scope) scope = scope.parent;
      },
    });
  });

  // 全量的代码
  // ast.body.forEach((statement) => {
  //   console.log('statement',statement)
  //   Object.defineProperties(statement, {
  //     // start在节点中的起始索引 和结束索引
  //     _source: { value: magicStirng.snip(statement.start, statement.end) },
  //   });
  // });
}

module.exports = analyse;

