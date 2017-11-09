if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('<%=path %>')
    .then(function () {console.log('ServiceWorker Register Successfully.')})
    .catch(function (e) {console.error(e)});
}
