/*
 * @Author: your name
 * @Date: 2021-09-17 16:55:58
 * @LastEditTime: 2021-09-18 09:55:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /Note/match/index.js
 */
function findA(str) {
    for(let i = 0; i < str.length; i++) {
        if(str[i] === 'a') {
            return true;
        }
    }
    return false;
}
function findAb(str) {
    let findAFlag = false;
    for(let i = 0; i < str.length; i++) {
        if(str[i] === 'a') {
            findAFlag = true;
        } else if(findAFlag === true && str[i] === 'b') {
            return true
        } else {
            findAFlag = false;
        }
    }
    return false;
}

// console.log(findAb('hello I am httishere ab'))

function match(str) {
    let state = start;
    for(let c of str) {
        console.log(c, state);
        state = state(c);
    }
    return state === end;
}
function start(c) {
    if(c === 'a') return foundA;
    return start;
}
// trap状态，一般用这种来表示一个最终状态
function end(c) {
    return end;
}

function foundA(c) {
    if(c === 'b') return foundB;
    return start(c);
}

function foundB(c) {
    if(c === 'c') return foundC;
    return start(c);
} 
function foundC(c) {
    if(c === 'd') return foundD;
    return start(c);
}
function foundD(c) {
    if(c === 'e') return foundE;
    return start(c);
}
function foundE(c) {
    if(c === 'f') return end;
    return start(c);
}

console.log(match('abcccccdef'))