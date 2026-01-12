importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js')
try {
    workbox.setConfig({
        debug: false
    })
    workbox.core.clientsClaim()
    workbox.core.skipWaiting()
    const cacheableResponse = new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
    })
    const externalsJSHandler = new workbox.strategies.CacheFirst({
        cacheName: 'externalsJS-cache',
        plugins: [cacheableResponse]
    })
    workbox.routing.registerRoute(/.*\/js\/externals\/.+.js/, externalsJSHandler)

    const jsHandler = new workbox.strategies.CacheFirst({
        cacheName: 'js-cache',
        plugins: [
            cacheableResponse,
            new workbox.expiration.Plugin({
                maxEntries: 100
            })
        ]
    })
    workbox.routing.registerRoute(/.*.js/, jsHandler)

    const jsonHandler = new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'json-cache'
    })
    workbox.routing.registerRoute(/.*.json/, jsonHandler)

    const cssHandler = new workbox.strategies.CacheFirst({
        cacheName: 'css-cache',
        plugins: [
            cacheableResponse,
            new workbox.expiration.Plugin({
                maxEntries: 100
            })
        ]
    })
    workbox.routing.registerRoute(/.*.css/, cssHandler)

    const imgHandler = new workbox.strategies.CacheFirst({
        cacheName: 'image-cache',
        plugins: [
            cacheableResponse,
            new workbox.expiration.Plugin({
                maxAgeSeconds: 24 * 60 * 60
            })
        ]
    })
    workbox.routing.registerRoute(/.*.(?:png|jpg|jpeg|svg|gif|ico)/, imgHandler)

    // const mediaHandler = new workbox.strategies.CacheFirst({
    //     cacheName: 'media-cache',
    // })
    // workbox.routing.registerRoute(/.*.(?:mp3|mp4)/, mediaHandler)
} catch (err) {
    console.error(err)
}
