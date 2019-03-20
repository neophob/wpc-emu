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

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.1.1/workbox-sw.js");

importScripts(
  "precache-manifest.3e139e70cf6e0d45e8b45adfbfc12727.js"
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
