/**
 * @file generate serviceWorker
 * @author pengxing(pengxing@baidu.com)
 */

'use strict';

const fs = require('fs');
const path = require('path');

const _ = require('lodash');
_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

const compiledSWTpl = _.template(fs.readFileSync(path.resolve(__dirname, '../templates/sw.tpl.js')));

module.exports = function (locals) {
  let config = this.config.pwa.serviceWorker;

  // get precache urls
  let precacheUrls = (config.preload && config.preload.urls) || [];

  let postsCount = config.preload.posts;
  let posts = this.locals.cache.posts.data;

  // sort posts by publishing date
  posts.sort(function (a, b) {
    return a.date < b.date;
  });

  let post;
  for (let i = 0; i < posts.length && postsCount > 0; i++, postsCount--) {
    post = posts[i];
    precacheUrls.push('/' + post.path);
  }

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
