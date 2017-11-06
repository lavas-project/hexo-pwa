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

// get sw register code and compile
const swTpl = fs.readFileSync(path.resolve(__dirname, './templates/swRegister.js.tpl'));
const swReg = tpl(swTpl)({path: hexo.config.pwa.serviceWorker.path + '?t=' + Date.now()});

// get async load page js tpl
const asyncLoadPageJSTpl = fs.readFileSync(path.resolve(__dirname, './templates/asyncLoadPage.js.tpl'));

// generate manifest json file
hexo.extend.generator.register('manifest', manifestGenerator);
// generate service worker file
hexo.extend.generator.register('serviceWorker', serviceWorkerGenerator);

// inject manifest into html files
hexo.extend.filter.register('after_render:html', data => {
  if (!data) {
    return;
  }

  // inject code into pages
  data = injectManifest(data);
  data = injectSWRegister(data);
  if (hexo.config.pwa.asyncLoadPage !== false) {
    data = injectAsyncLoadPageJS(data);
  }

  return data;
});


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
  let swHtml = `<script>${swReg}</script></body>`;

  if (data.indexOf(swReg) === -1) {
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
