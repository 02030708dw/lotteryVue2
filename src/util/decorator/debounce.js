export default function decorator(delay) {
    return function(target, key, descriptor) {
        descriptor.value = debounce(descriptor.value, delay)
        return descriptor
    }
}

export function debounce(fn, delay = 500) {
    let timer
    return function(...args) {
        clearTimeout(timer)
        timer = setTimeout(() => fn.apply(this, args), delay)
    }
}
