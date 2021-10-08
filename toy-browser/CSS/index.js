/*
 * @Author: your name
 * @Date: 2021-09-27 14:50:20
 * @LastEditTime: 2021-09-29 11:52:34
 * @LastEditors: Please set LastEditors
 * @Description: 向DOM树添加CSS规则
 * @FilePath: /Note/toy-browser/CSS/index.js
 */
const css = require('css');
let rules = [];

// **** 添加CSS规则 **** //
function addCSSRules(text) {
    let ast = css.parse(text);
    // console.log(JSON.stringify(ast, null, "    "));
    rules.push(...ast.stylesheet.rules);
}

// *** 针对对象：元素 **** //
function computeCss(element, stack) {
    // console.log(JSON.stringify(rules, null, " "));
    // & 使用slice避免污染原始stack
    let elements = stack.slice().reverse();
    // console.log(elements)

    if(!element.computeStyle) 
        element.computeStyle = {};

    // 遍历所有规则
    for(let rule of rules) {
        // console.log(JSON.stringify(rule, null, " "));
        // 全部选择器
        let selectorParts = rule.selectors[0].split(" ").reverse();
        
        // ! 匹配当前元素
        if(!match(element, selectorParts[0]))
            continue;

        console.log('matched element: ' + element.tagName + ' and ' + selectorParts[0]);

        // ^ 已经匹配到当前“元素”

        let matched = false; // 每条规则的标识
        
        // & 双循环检查父元素是否匹配
        let j = 1;
        for(let i = 0; i < elements.length; i++) {
            if(match(elements[i], selectorParts[j])) {
                j++;
            }
        }
        if(j >= selectorParts.length) matched = true;

        if(matched) {
            // ^ 计算当前的选择器优先级
            let sp = specificity(rule.selectors[0]);
            // 如果匹配到，将规则加入element
            // console.log(`Element: ${element}, rule: ${rule}`);
            let computeStyle = element.computeStyle;
            for(let declaration of rule.declarations) {
                if(!computeStyle[declaration.property]) {
                    computeStyle[declaration.property] = {};
                }
                // ^ 可能会出现样式覆盖
                computeStyle[declaration.property].value = declaration.value;
                if(!computeStyle[declaration.property].specificity) {
                    computeStyle[declaration.property].specificity = sp;
                } else if(compare(computeStyle[declaration.property].specificity), sp) {
                    computeStyle[declaration.property].specificity = sp;
                }
                computeStyle[declaration.property].value = declaration.value;
            }
            element.computeStyle = computeStyle;
            // {color: {value: …}, font-size: {value: …}}
        }
    }
}

// *** 匹配元素 *** //
function match(element, selector) {
    if(!selector || !element.attributes) return false;

    // ^ 简单处理，仅判断id选择器，class选择器和标签选择器
    if(selector.charAt(0) === '#') {
        let attr = element.attributes.filter(attr => attr.name === "id");
        if(attr && attr.value === selector.replace("#", "")) {
            return true;
        }
    } else if(selector.charAt(0) === '.') {
        let attr = element.attributes.filter(attr => attr.name === "class");
        if(attr && attr.value === selector.replace(".", "")) {
            return true;
        }
        // ? class还可以使用空格，所以后续可以补充有空格的情况匹配
        // ? 难道不会被split嘛？
    } else if(element.tagName === selector) {
        return true;
    }
}

// *** 计算优先级 *** //
function specificity(selector) {
    // 从高到低
    // 0 表示行内样式，最高优先级
    let p = [0, 0, 0, 0]; // ! 表示当前的优先级
    let selectorParts = selector.split(" ");
    for(let part of selectorParts) {
        if(part.charAt(0) === "#") {
            p[1] += 1;
        } else if(part.charAt(0) === ".") {
            p[2] += 1;
        } else {
            p[3] += 1;
        }
    }
    return p;
}

// *** 比较优先级 *** //
function compare(sp1, sp2) {
    if(sp1[0] - sp2[0]) return sp1[0] - sp2[0];
    if(sp1[1] - sp2[1]) return sp1[1] - sp2[1];
    if(sp1[2] - sp2[2]) return sp1[2] - sp2[2];
    return sp1[3] - sp2[3];
}

module.exports = {
    rules,
    addCSSRules,
    computeCss
}