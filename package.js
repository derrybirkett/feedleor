Package.describe({
  name: "d2tstudio:feedleor",
  summary: "Feedly OAuth flow",
  version: "1.0.0",
  git: "https://github.com/d2tstudio/feedleor"
});

Package.onUse(function(api) {
  api.use('oauth2@1.1.2', ['client', 'server']);
  api.use('oauth@1.1.3', ['client', 'server']);
  api.use('http@1.0.9', ['server']);
  api.use('underscore@1.0.2', 'client');
  api.use('templating@1.0.10', 'client');
  api.use('random@1.0.2', 'client');
  api.use('service-configuration@1.0.3', ['client', 'server']);

  api.export('Feedly');

  api.addFiles(
    ['feedly_configure.html', 'feedly_configure.js'],
    'client');

  api.addFiles('feedly_server.js', 'server');
  api.addFiles('feedly_client.js', 'client');
});
