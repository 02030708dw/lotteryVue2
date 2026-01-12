// function before (...args) {
//     return function (target, key, descriptor) {
//         descriptor.value = descriptor.value.before(() => console.log(...args))
//     }
// }

// function after (...args) {
//      return function (target, key, descriptor) {
//          descriptor.value = descriptor.value.after(() => console.log(...args))
//      }
// }

// function around (target, key, descriptor) {
//     descriptor.value = descriptor.value.around(() => console.time(), () => console.timeEnd())
// }

// 函數執行時間
const consoleTimer = function(target, key, descriptor) {
    try {
        console.log(`${key}() 執行時間計算`)
        descriptor.value = descriptor.value.around(() => console.time(), () => console.timeEnd())
    } catch (err) {
        console.error(err)
    }
}
export default consoleTimer