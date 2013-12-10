module.exports = function (app) {
  // list hottest items
  app.controller('HotCtrl', [
    '$scope', 'Docs',
    function ($scope, Docs) {
      Docs.hot(function (posts) {
        $scope.posts = posts;
      });
    }
  ]);
  // list best items
  app.controller('BestCtrl', [
    '$scope', 'Docs',
    function ($scope, Docs) {
      Docs.best(function (posts) {
        $scope.posts = posts;
      });
    }
  ]);
  // list items by Wilson Score Interval
  // like reddit does for comments :D
  app.controller('ConfidenceCtrl', [
    '$scope', 'Docs',
    function ($scope, Docs) {
      Docs.confidence(function (posts) {
        $scope.posts = posts;
      });
    }
  ]);
  // list most recent items
  app.controller('RecentCtrl', [
    '$scope', 'Docs',
    function ($scope, Docs) {
      Docs.items().success(function (res) {
        $scope.posts = res.rows.map(function (row) {
          row.score = row.key;
          return row;
        });
      });
    }
  ]);
  app.controller('PaginationCtrl', [
    '$scope',
    function ($scope) {
      $scope.limit = 10;
      $scope.next = function () {
        $scope.limit += 10;
      };
    }
  ]);
  // retrieve a specific item
  app.controller('ItemCtrl', [
    '$scope', 'Docs',
    function ($scope, Docs) {
      $scope.get = function (id) {
        Docs.get(id).success(function (res) {
          $scope.item = res;
        });
      };
    }
  ]);
  // get the vote score for a specific item
  app.controller('VoteCtrl', [
    '$scope', 'Docs',
    function ($scope, Docs) {
      $scope.get = function (id) {
        Docs.votes({
          key: JSON.stringify(id)
        }).success(function (res) {
          $scope.score = res.rows[0].value;
        });
      };
    }
  ]);
  // nav lists available views, marks them as active
  app.controller('NavCtrl', [
    '$scope', '$location',
    function ($scope, $location) {
      $scope.links = ['hot', 'best', 'confidence', 'new'];
      $scope.isActive = function (viewLocation) {
        return '/' + viewLocation === $location.path();
      };
    }
  ]);
};