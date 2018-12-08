self.importScripts("lib/sw-toolbox/sw-toolbox.js");
self.addEventListener('install', function () {
  return self.skipWaiting();
});
self.addEventListener('active', function () {
  return self.clients.claim();
});

var precacheUrls = [];
<%
precacheUrls.forEach(function (url) {
%>
  precacheUrls.push('{{ url }}');
<%
});
%>
toolbox.precache(precacheUrls);
toolbox.options = {{ JSON.stringify(opts) }};

<%
routes.forEach(function (route) {
  var pattern = '"' + route.pattern + '"';
  if (route.pattern instanceof RegExp) {
    pattern = route.pattern.toString();
  }
%>
toolbox.router.any({{ pattern }}, toolbox.{{ route.strategy }});
<%
});
%>
