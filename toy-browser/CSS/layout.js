/*
 * @Author: httishere
 * @Date: 2021-09-29 11:53:07
 * @LastEditTime: 2021-09-29 12:03:24
 * @LastEditors: Please set LastEditors
 * @Description: 元素排版
 * @FilePath: /Note/toy-browser/CSS/layout.js
 */

function getStyle(element) {
    if(!element.style) element.style = {};

    for(let prop in element.computeStyle) {
        let p = element.computeStyle.value;
        // copy
        element.style[prop] = element.computeStyle[prop].value;

        if(element.style[prop].toString().match(/px$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }
        if(element.style[prop].toString().match(/^[0-9\.]+$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }
    }
    return element.style;
}

function layout(element) {
    if(!element.computeStyle) return;
    let elementStyle = getStyle(element);

    if(elementStyle.display !== 'flex') return;

    let items = element.children.filter(e => e.type === 'element');

    items.sort(function(a, b) {
        return (a.order || 0) - (b.order || 0);
    });
    
    let style = elementStyle;

    ['width', 'height'].forEach()
}

module.exports = {
    layout
}