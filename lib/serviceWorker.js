/**
 * @file generate serviceWorker
 * @author pengxing(pengxing@baidu.com)
 */

'use strict';

const fs = require('fs');
const path = require('path');

const _ = require('lodash');
_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

const compiledSWTpl = _.template(fs.readFileSync(path.resolve(__dirname, '../templates/sw.js.tpl')));

module.exports = function (locals) {
  let config = this.config.pwa.serviceWorker;

  // get precache urls
  let precacheUrls = (config.preload && config.preload.urls) || [];

  let postsCount = config.preload.posts;
  let posts = this.locals.cache.posts.data;

  // sort posts
  posts.sort(function (a, b) {
    return a.date < b.date;
  });

  let post;
  for (let i = 0; i < posts.length && postsCount > 0; i++, postsCount--) {
    post = posts[i];
    precacheUrls.push('/' + post.path);
  }
  console.log(precacheUrls);

  let data = {
    buildTime: Date.now(),
    routes: config.routes,
    precacheUrls
  };

  return {
    path: config.path,
    data: compiledSWTpl(data)
  };
};
