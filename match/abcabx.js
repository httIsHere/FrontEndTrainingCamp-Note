/*
 * @Author: your name
 * @Date: 2021-09-18 09:53:36
 * @LastEditTime: 2021-09-18 10:22:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /Note/match/abcabx.js
 */

function match(str) {
    let state = start;
    let a_c = 0, b_c = 0;
    for(let c of str) {
        state === foundB && a_c++;
        state === foundC && b_c++;
        state = state(c);
        console.log(c, state);
        console.log(a_c, b_c);
        if(state === end) break;
    }
    return state === end
}

function start(c) {
    if(c === 'a') return foundA;
    else return start;
}

function foundA(c) {
    if(c === 'b') return foundB;
    else return start(c, 0);
}

function foundB(c) {
    if(c === 'c') return foundC;
    else if(c === 'x') return end;
    else return start;
}
function foundC() {
    return start
}
function end() {
    return end
}

console.log(match('abcabx'))