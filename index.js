/**
 * @file hexo-pwa entry
 * @author pengxing(pengxing@baidu.com)
 */

'use strict';

/* globals hexo */
const fs = require('fs');
const path = require('path');
const tpl = require('lodash.template');

const manifestGenerator = require('./lib/manifest');
const serviceWorkerGenerator = require('./lib/serviceWorker');

let compiledSWRegTpl;
let asyncLoadPageJSTpl;


if (hexo.config.pwa.manifest) {
  // generate manifest json file
  hexo.extend.generator.register('manifest', manifestGenerator);
}

if (hexo.config.pwa.serviceWorker) {
  // get sw register code and compile
  let swTpl = fs.readFileSync(path.resolve(__dirname, './templates/swRegister.tpl.js'));
  compiledSWRegTpl = tpl(swTpl)({path: hexo.config.pwa.serviceWorker.path + '?t=' + Date.now()});
  // generate service worker file
  hexo.extend.generator.register('serviceWorker', serviceWorkerGenerator);
}

if (hexo.config.pwa.asyncLoadPage) {
  // get async load page js tpl
  asyncLoadPageJSTpl = fs.readFileSync(path.resolve(__dirname, './templates/asyncLoadPage.tpl.js'));
}


// inject manifest into html files
hexo.extend.filter.register('after_render:html', data => {
  if (!data) {
    return;
  }

  // inject code into pages
  if (hexo.config.pwa.manifest) {
    data = injectManifest(data);
  }

  if (hexo.config.pwa.serviceWorker) {
    data = injectSWRegister(data);
  }

  if (hexo.config.pwa.asyncLoadPage) {
    data = injectAsyncLoadPageJS(data);
  }

  return data;
}, hexo.config.pwa.priority || 10);


/**
 * inject manifest html fragment into page code
 *
 * @param {string} data html
 * @return {string}
 */
function injectManifest(data) {
  let manifestHtml = `<head><link rel=manifest href=${hexo.config.pwa.manifest.path}>`;

  if (data.indexOf(manifestHtml) === -1) {
    data = data.replace('<head>', manifestHtml);
  }

  return data;
}

/**
 * inject service worker registion fragment into page code
 *
 * @param {string} data html
 * @return {string}
 */
function injectSWRegister(data) {
  let swHtml = `<script>${compiledSWRegTpl}</script></body>`;

  if (data.indexOf(compiledSWRegTpl) === -1) {
    data = data.replace('</body>', swHtml);
  }

  return data;
}

/**
 * inject async load page js fragment
 *
 * @param {string} data html
 * @return {string}
 */
function injectAsyncLoadPageJS(data) {
  let injectHtml = `<script>${asyncLoadPageJSTpl}</script>`;

  if (data.indexOf(injectHtml) === -1) {
    data = data.replace('</head>', injectHtml);
  }

  return data;
}
