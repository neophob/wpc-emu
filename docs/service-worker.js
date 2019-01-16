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

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

importScripts(
  "precache-manifest.5dbe8e1076c19abdf5a96faf247525cd.js"
);

workbox.skipWaiting();
workbox.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/.*\/rom\/.*|.*\/foo-temp\/.*/, workbox.strategies.cacheFirst({ "cacheName":"assets", plugins: [new workbox.expiration.Plugin({"maxEntries":32,"maxAgeSeconds":5184000,"purgeOnQuotaError":false})] }), 'GET');
workbox.routing.registerRoute(/\//, workbox.strategies.networkFirst({ "cacheName":"application", plugins: [new workbox.expiration.Plugin({"maxEntries":16,"maxAgeSeconds":604800,"purgeOnQuotaError":false})] }), 'GET');
