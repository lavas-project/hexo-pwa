if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('<%=path %>')
    .then(function() {
      if ('<%=console %>' !== 'none') {
        console.log('ServiceWorker Register Successfully.');
      }
    })
    .catch(function(e) {
      if (['error', 'none'].indexOf('<%=console %>') === -1) {
        console.error(e);
      }
    });
}
