if (!self.define) {
  let e,
    s = {}
  const a = (a, n) => (
    (a = new URL(a + '.js', n).href),
    s[a] ||
      new Promise((s) => {
        if ('document' in self) {
          const e = document.createElement('script')
          ;(e.src = a), (e.onload = s), document.head.appendChild(e)
        } else (e = a), importScripts(a), s()
      }).then(() => {
        let e = s[a]
        if (!e) throw new Error(`Module ${a} didn’t register its module`)
        return e
      })
  )
  self.define = (n, i) => {
    const t =
      e ||
      ('document' in self ? document.currentScript.src : '') ||
      location.href
    if (s[t]) return
    let c = {}
    const r = (e) => a(e, t),
      o = { module: { uri: t }, exports: c, require: r }
    s[t] = Promise.all(n.map((e) => o[e] || r(e))).then((e) => (i(...e), c))
  }
}
define(['./workbox-646c0e27'], function (e) {
  'use strict'
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: '/Gull_portrait_ca_usa.jpeg',
          revision: 'fa5abf4a135ae134edbd7cca09e0321a',
        },
        {
          url: '/_next/static/chunks/112.d04f42169f998449.js',
          revision: 'd04f42169f998449',
        },
        {
          url: '/_next/static/chunks/11b0334a-7d487b694d9fa2b4.js',
          revision: '7d487b694d9fa2b4',
        },
        {
          url: '/_next/static/chunks/1a82b8e5-48f4918969003f40.js',
          revision: '48f4918969003f40',
        },
        {
          url: '/_next/static/chunks/368-3373b90c260aa23e.js',
          revision: '3373b90c260aa23e',
        },
        {
          url: '/_next/static/chunks/772-cb1221499f0cb110.js',
          revision: 'cb1221499f0cb110',
        },
        {
          url: '/_next/static/chunks/993.486191145933e738.js',
          revision: '486191145933e738',
        },
        {
          url: '/_next/static/chunks/framework-766d5a89a7a716ac.js',
          revision: '766d5a89a7a716ac',
        },
        {
          url: '/_next/static/chunks/main-891e570d9fea2524.js',
          revision: '891e570d9fea2524',
        },
        {
          url: '/_next/static/chunks/pages/_app-a77f5fa8462e3191.js',
          revision: 'a77f5fa8462e3191',
        },
        {
          url: '/_next/static/chunks/pages/_error-1d0cd775dcbe33b7.js',
          revision: '1d0cd775dcbe33b7',
        },
        {
          url: '/_next/static/chunks/pages/home-006ce2c638a906c3.js',
          revision: '006ce2c638a906c3',
        },
        {
          url: '/_next/static/chunks/pages/index-0e96e4a7088b7ec7.js',
          revision: '0e96e4a7088b7ec7',
        },
        {
          url: '/_next/static/chunks/polyfills-5cd94c89d3acac5f.js',
          revision: '99442aec5788bccac9b2f0ead2afdd6b',
        },
        {
          url: '/_next/static/chunks/webpack-6018aa6def604bbb.js',
          revision: '6018aa6def604bbb',
        },
        {
          url: '/_next/static/css/8a233b5df237aa85.css',
          revision: '8a233b5df237aa85',
        },
        {
          url: '/_next/static/css/900e052604dbb7ff.css',
          revision: '900e052604dbb7ff',
        },
        {
          url: '/_next/static/css/d446c15d81e23298.css',
          revision: 'd446c15d81e23298',
        },
        {
          url: '/_next/static/css/fe549007dd3ea321.css',
          revision: 'fe549007dd3ea321',
        },
        {
          url: '/_next/static/tK2JwzVxaJiFl8sDVbRDd/_buildManifest.js',
          revision: 'f4147fb167f745b2dda6f645bcdf21ee',
        },
        {
          url: '/_next/static/tK2JwzVxaJiFl8sDVbRDd/_middlewareManifest.js',
          revision: '468e9a0ecca0c65bcb0ee673b762445d',
        },
        {
          url: '/_next/static/tK2JwzVxaJiFl8sDVbRDd/_ssgManifest.js',
          revision: '5352cb582146311d1540f6075d1f265e',
        },
        {
          url: '/android-chrome-192x192.png',
          revision: 'ec033e1b5b775da43790a09a34f43278',
        },
        {
          url: '/android-chrome-512x512.png',
          revision: 'f30ddd05b814bce6028610a928a1568a',
        },
        {
          url: '/apple-touch-icon.png',
          revision: '341af53f94257f47d8589e591043f9b4',
        },
        { url: '/damier.jpeg', revision: '7be67eb171e92f0b8faa099a3d1ff182' },
        { url: '/damier.png', revision: 'cdfb86e4449f49fe1847c90ff3effd4d' },
        {
          url: '/favicon-16x16.png',
          revision: 'c74a131737938caa21720c07f731b08d',
        },
        {
          url: '/favicon-32x32.png',
          revision: '763611e9088074fe59b7bd8c1ff22752',
        },
        { url: '/favicon.ico', revision: '2f3cf1385f616e11c488c34579459116' },
        { url: '/flower.jpeg', revision: '618d8809261b6d024fb1be6870dc5560' },
        { url: '/manifest.json', revision: 'b25ab16f5d8b37263ee0070aed1dc7f6' },
        {
          url: '/mstile-150x150.png',
          revision: 'bb18012a13596459a921563805ad1368',
        },
        {
          url: '/safari-pinned-tab.svg',
          revision: 'c57399513e529cad8cfadf6538f2b376',
        },
        {
          url: '/site.webmanifest',
          revision: '8edabb281c2a9ef2cea4a726ee1df74a',
        },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: s,
              event: a,
              state: n,
            }) =>
              s && 'opaqueredirect' === s.type
                ? new Response(s.body, {
                    status: 200,
                    statusText: 'OK',
                    headers: s.headers,
                  })
                : s,
          },
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-image',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: 'static-audio-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: 'static-video-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-data',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1
        const s = e.pathname
        return !s.startsWith('/api/auth/') && !!s.startsWith('/api/')
      },
      new e.NetworkFirst({
        cacheName: 'apis',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1
        return !e.pathname.startsWith('/api/')
      },
      new e.NetworkFirst({
        cacheName: 'others',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: 'cross-origin',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      'GET'
    )
})
