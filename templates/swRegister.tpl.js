if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('<%=path %>')
    .then(function () {
      if (navigator.serviceWorker.controller) {
        console.log('Assets cached by the controlling service worker toolbox.')
      } else {
        console.log('Please reload this page to allow the service worker to handle network operations.')
      }
    })
    .catch(function (e) { console.error(e) });
} else {
  console.log('Service workers are not supported in the current browser.')
}
