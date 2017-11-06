document.documentElement.addEventListener('click', onClick);

function onClick(e) {
  var ele = e.target || e.srcElement;

  while (ele !== document.body) {
    if (!ele) {return;}

    if (ele.nodeType !== 1 || ele.tagName !== 'A') {
      ele = ele.parentNode;
      continue;
    }

    // the same domain url
    if (ele.protocol === location.protocol && ele.host === location.host) {
      // invoke the asyncLoadPage function in the top window
      window.top._lavasAsyncLoadPage(ele.getAttribute('href'));

      e.preventDefault();
      return;
    }

    ele = ele.parentNode;
  }
}

window._lavasMask;
window._lavasIframe = null;

/**
 * 异步加载页面内容
 *
 * @param {string} href 页面链接
 * @param {boolean} forward 页面是否是向前
 */
window._lavasAsyncLoadPage = function (href, forward) {
  debugger
  var iframe = document.createElement('iframe');
  iframe.setAttribute('style', 'position:absolute;top:0;right:0;bottom:0;left:0');
  iframe.onstatechange = function (readyState) {
    if (readyState === 'complete') {
      if (window._lavasIframe) {
        window._lavasIframe.remove();
      }

      window._lavasIframe = iframe;
    }
  };

  iframe.src = href;

  document.body.appendChild(iframe);
};
