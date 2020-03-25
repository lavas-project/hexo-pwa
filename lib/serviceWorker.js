/**
 * @file generate serviceWorker
 * @author pengxing(pengxing@baidu.com)
 * @author Marco Franssen (marco.franssen@gmail.com)
 */

'use strict';

const fs = require('fs');
const path = require('path');

const tpl = require('lodash.template');

const compiledSWTpl = tpl(fs.readFileSync(path.resolve(__dirname, '../templates/sw.tpl.js')));

module.exports = function(locals) {
  let config = this.config.pwa.serviceWorker;

  let posts = locals.posts.sort('-date').toArray();

  // get precache urls
  let precacheUrls = (config.preload && config.preload.urls) || [];
  let cachePosts = posts.slice(0, config.preload.posts).map(p => `/${p.path}`);
  precacheUrls.push(...cachePosts);

  let data = {
    buildTime: Date.now(),
    precacheUrls,
    opts: config.opts || {},
    routes: config.routes
  };

  return {
    path: config.path,
    data: compiledSWTpl(data)
  };
};
