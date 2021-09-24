
var objects = [
    eval,
    isFinite,
    isNaN,
    parseFloat,
    parseInt,
    decodeURI,
    decodeURIComponent,
    encodeURI,
    encodeURIComponent,
    Array,
    Date,
    RegExp,
    Promise,
    Proxy,
    Map,
    WeakMap,
    Set,
    WeakSet,
    Function,
    Boolean,
    String,
    Number,
    Symbol,
    Object,
    Error,
    EvalError,
    RangeError,
    ReferenceError,
    SyntaxError,
    TypeError,
    URIError,
    ArrayBuffer,
    // SharedArrayBuffer, // 所有主流浏览器均默认于2018年1月5日禁用SharedArrayBuffer
    DataView,
    Float32Array,
    Float64Array,
    Int8Array,
    Int16Array,
    Int32Array,
    Uint8Array,
    Uint16Array,
    Uint32Array,
    Uint8ClampedArray,
    Atomics,
    JSON,
    Math,
    Reflect
];

var queue = [];
var set = new Set();


while(objects.length) {
    let current = objects.shift();
    if(set.has(current)) continue;
    set.add(current), queue.push(current);

    for( let p of Object.getOwnPropertyNames(current)) {
        let property = Object.getOwnPropertyDescriptor(current, p);
        if(property.hasOwnProperty("value")
            && ((property.value != null) && typeof property.value === 'object' || typeof property.value === 'object')
            && property.value instanceof Object) {
                set.add(property.value), queue.push(property.value);
            }
        
        if(property.hasOwnProperty("get") && typeof property.get === 'function') {
            set.add(property.get), queue.push(property.get);
        }

        if(property.hasOwnProperty("set") && typeof property.set === 'function') {
            set.add(property.set), queue.push(property.set);
        }
    }
}