export default function decorator(delay) {
    return function(target, key, descriptor) {
        descriptor.value = throttle(descriptor.value, delay)
        return descriptor
    }
}

export function throttle(fn, delay = 250) {
    let last
    // let timer
    return function(...args) {
        const now = +new Date()
        if (last && now < last + delay) {
            // clearTimeout(timer)
            // timer = setTimeout(() => method.call(this), delay)
        } else {
            method.call(this)
        }
        function method() {
            last = now
            fn.apply(this, args)
        }
    }
}
