/* eslint-disable */
/**
 * 去除重複項
 */
Array.prototype.unique = function() {
    return Array.from(new Set(this))
}
/**
 * 陣列中找出最小值
 */
Array.prototype.min = function() {
    let min = +this[0]
    this.unique().forEach(num => (min = Math.min(min, +num)))
    return min
}
/**
 * 陣列中找出最大值
 */
Array.prototype.max = function() {
    let max = +this[0]
    this.unique().forEach(num => (max = Math.max(max, +num)))
    return max
}
/**
 * 數字經度處理
 */
Number.prototype.strip = function() {
    return +parseFloat(this.toPrecision(12))
}
/**
 * 陣列中找出最大值
 */
Math.randomNum = function(num) {
    return Math.floor((Math.random() * num + 1) % num)
}
// requestAnimationFrame polyfill
// ;(function() {
//     let lastTime = 0
//     const vendors = ['ms', 'moz', 'webkit', 'o']
//     for(let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
//         window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame']
//         window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
//                                    || window[vendors[x]+'CancelRequestAnimationFrame']
//     }

//     if (!window.requestAnimationFrame)
//         window.requestAnimationFrame = function(callback, element) {
//             const currTime = new Date().getTime()
//             const timeToCall = Math.max(0, 16 - (currTime - lastTime))
//             const id = window.setTimeout(() => callback(currTime + timeToCall), timeToCall)
//             lastTime = currTime + timeToCall
//             return id
//         }

//     if (!window.cancelAnimationFrame) {
//         window.cancelAnimationFrame = id => clearTimeout(id)
//     }
// }())

// //decorator 裝
// Function.prototype.before = function(fn) {
//     const _self = this
//     return function() {
//         fn.apply(this, arguments)
//         return _self.apply(this, arguments)
//     }
// }

// Function.prototype.after = function(fn) {
//     const _self = this
//     return function() {
//         const ret = _self.apply(this, arguments)
//         fn.apply(this, arguments)
//         return ret
//     }
// }

// Function.prototype.around = function(bFn, aFn) {
//     const _self = this
//     return function() {
//         bFn.apply(this, arguments)
//         const ret = _self.apply(this, arguments)
//         aFn.apply(this, arguments)
//         return ret
//     }
// }
