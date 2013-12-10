module.exports = function (app) {
  // TODO configure url_root to point to your db url
  app.constant('url_root', 'http://localhost:5984/leaderboard');
  // TODO configure ddoc to your design document's _id
  app.constant('ddoc', '_design/app');
  app.config([
    '$routeProvider',
    function ($routeProvider) {
      $routeProvider
      .when('/hot', {
        templateUrl: 'list.html',
        controller: 'HotCtrl'
      })
      .when('/best', {
        templateUrl: 'list.html',
        controller: 'BestCtrl'
      })
      .when('/new', {
        templateUrl: 'list.html',
        controller: 'RecentCtrl'
      })
      .when('/confidence', {
        templateUrl: 'list.html',
        controller: 'ConfidenceCtrl'
      })
      .otherwise({
        redirectTo: '/hot'
      });
    }
  ]);
};