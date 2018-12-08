/**
 * @file generate sw-toolbox.js
 * @author nekolr
 */

'use strict';

const fs = require('fs');
const path = require('path');

const swToolboxTpl = fs.readFileSync(path.resolve(__dirname, '../templates/sw-toolbox.tpl.js'));
module.exports = function () {
  return {
    path: '/lib/sw-toolbox/sw-toolbox.js',
    data: swToolboxTpl
  };
};