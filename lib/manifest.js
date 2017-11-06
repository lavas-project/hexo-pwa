/**
 * @file generate manifest
 * @author pengxing(pengxing@baidu.com)
 */

module.exports = function () {
  let config = this.config.pwa.manifest;

  if (!config.body) {
    return;
  }

  return {
    path: config.path,
    data: JSON.stringify(config.body)
  };
};
