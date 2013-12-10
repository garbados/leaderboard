var app = angular.module('app', [
      'ngRoute',
      'angularMoment'
    ]),
    plugins = [
      require('./services'),
      require('./controllers'),
      require('./config')
    ];

plugins
  .forEach(function (plugin) {
    plugin(app);
  });