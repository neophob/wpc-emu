/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("workbox-v4.1.1/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "workbox-v4.1.1"});

importScripts(
  "precache-manifest.4ef9b4f472bc942d4d65a98c49a10e71.js"
);

workbox.core.skipWaiting();

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/.*\/rom\/.*|.*\/sound\/.*|.*\/foo-temp\/.*/, new workbox.strategies.CacheFirst({ "cacheName":"assets", plugins: [new workbox.expiration.Plugin({ maxEntries: 48, maxAgeSeconds: 7776000, purgeOnQuotaError: false })] }), 'GET');
workbox.routing.registerRoute(/\//, new workbox.strategies.NetworkFirst({ "cacheName":"application", plugins: [new workbox.expiration.Plugin({ maxEntries: 32, maxAgeSeconds: 604800, purgeOnQuotaError: false })] }), 'GET');
