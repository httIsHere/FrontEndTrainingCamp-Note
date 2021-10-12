/*
 * @Author: httishere
 * @Date: 2021-10-12 14:13:01
 * @LastEditTime: 2021-10-12 14:50:14
 * @LastEditors: Please set LastEditors
 * @Description: 元素渲染
 * @FilePath: /Note/toy-browser/render.js
 */

const images = require('images');

function render(viewport, element) {
    console.log(element)
    if(element.style) {
        let img = images(element.style.width, element.style.height);
        if(element.style['background-color']) {
            let color = element.style['background-color'] || "rgb(255, 255, 255)";
            color.match(/rgb\((\d+),(\d+),(\d+)\)/); // 暂时仅支持rgb格式
            console.log(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3))
            img.fill(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3), 1);
            // 绘制
            viewport.draw(img, element.style.left || 0, element.style.top || 0)
        }
    }

    if(element.children) {
        for(let child of element.children) {
            render(viewport, child)
        }
    }
}

module.exports = render;