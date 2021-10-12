/*
 * @Author: httishere
 * @Date: 2021-09-24 11:06:02
 * @LastEditTime: 2021-10-11 20:54:33
 * @LastEditors: Please set LastEditors
 * @Description: 解析HTML
 * @FilePath: /Note/toy-browser/parse.js
 */

let cssComputer = require('../CSS');
let cssLayout = require('../CSS/layout');

const EOF = Symbol("EOF"); // EOF: End Of File

let currentToken = null,
  currentAttribute = null;

// 构造树结构
let stack = [{ type: "document", children: [] }];

// 报告当前状态
function emit(token) {
  let top = stack[stack.length - 1];
  if(token.type === 'startTag') {
      // console.log(token)
      let element = {
          type: 'element',
          children: [],
          attributes: []
      };
      element.tagName = token.tagName;
      for(let p in token) {
          if(p !== "type" || p !== "tagName") {
              element.attributes.push({
                  name: p,
                  value: token[p]
              })
          }
      }
      element.parent = top;

      // 尽可能的早计算
      cssComputer.computeCss(element, stack);
      cssLayout.layout(element); // & 对当前元素进行layout

      top.children.push(element);

      // 入栈
      if(!token.isSelfClosing) {
        stack.push(element);
      }

      currentTextNode = null;
  } else if (token.type == "endTag") {
    // console.log(token)
    if(top.tagName !== token.tagName) {
        throw new Error("Tag start doesn't macth the end");
    } else {
        //*** 遇到style标签，执行添加CSS规则的操作 ***//
        if(top.tagName === 'style') {
          cssComputer.addCSSRules(top.children[0].content);
        }
        stack.pop();
    }
    cssLayout.layout(top); // & 对当前元素进行layout
    currentTextNode = null;
  } else if(token.type === "text") {
      // 文本节点处理
      if(currentTextNode === null) {
          currentTextNode = {
              type: "text",
              content: ""
          }
          top.children.push(currentTextNode);
      }
      currentTextNode.content = token.content;
  }
}

function data(c) {
  if (c === "<") {
    return tagOpen;
  } else if (c === EOF) {
    emit({ type: "EOF" });
    return;
  } else {
    currentToken.content += c;
    // emit({ type: "text", content: c });
    return data;
  }
}

function tagOpen(c) {
  if (c === "/") {
    emit({ type: "text", content: currentToken.content });
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "startTag",
      tagName: "",
    };
    return tagName(c);
  }
  return;
}

function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "endTag",
      tagName: "",
    };
    return tagName(c);
  } else if (c === ">") {
  } else if (c === EOF) {
  }
  return;
}

function tagName(c) {
  // 空格，回车等
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === "/") {
    // 自封闭标签
    return selfClosingStartTag;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c; // 记录当前的标签名
    return tagName;
  } else if (c === ">") {
    emit(currentToken);
    return data;
  } else return tagName;
}

function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === ">" || c === "/" || c === EOF) {
    return afterAttributeName(c);
  } else if (c === "=") {
  } else {
    currentAttribute = {
      name: "",
      value: "",
    };
    return attributeName(c);
  }
}

function attributeName(c) {
  if (c.match(/^[\t\n\f ]$/) || c === ">" || c === "/" || c === EOF) {
    return afterAttributeName(c);
  } else if (c === "=") {
    return beforeAttributeValue;
  } else if (c === "\u0000") {
  } else if (c === '"' || c === "'" || c === "<") {
  } else {
    currentAttribute.name += c;
    return attributeName;
  }
}

function afterAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c === "=") {
    return beforeAttributeValue;
  } else if (c === ">") {
    emit(currentToken);
    return data;
  } else if (c === EOF) {
  } else {
    currentAttribute.name = "";
    currentAttribute.value = "";
    return attributeName(c);
  }
}

function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/) || c === ">" || c === "/" || c === EOF) {
    return beforeAttributeValue;
  } else if (c === '"') {
    return doubleQuoteAttributeValue;
  } else if (c === "'") {
    return singleQuoteAttributeValue;
  } else {
    return unquoteAttributeValue(c);
  }
}

function doubleQuoteAttributeValue(c) {
  if (c === '"') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuoteAttributeValue;
  } else if (c === "\u0000") {
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c;
    return doubleQuoteAttributeValue;
  }
}

function singleQuoteAttributeValue(c) {
  if (c === "'") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuoteAttributeValue;
  } else if (c === "\u0000") {
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c;
    return singleQuoteAttributeValue;
  }
}

function afterQuoteAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c;
    return doubleQuoteAttributeValue;
  }
}

function unquoteAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (c === "/") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === "\u0000") {
  } else if (c === '"' || c === "'" || c === "<" || c === "=" || c === "`") {
  } else if (c === EOF) {
  } else {
    // 普通字符
    currentAttribute.value += c;
    return unquoteAttributeValue;
  }
}

function selfClosingStartTag(c) {
  if (c === ">") {
    currentToken.isSelfClosing = true;
    return data;
  } else if (c === EOF) {
  } else {
  }
}

module.exports.parseHTML = function parseHTML(html) {
  let state = data;
  for (let c of html) {
    state = state(c);
  }
  state = state(EOF);
  // console.log(stack[0]);
  return stack[0];
};
