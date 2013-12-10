module.exports = function (app) {
  app.factory('Docs', [
    '$http', 'url_root', 'ddoc',
    function ($http, url_root, ddoc) {
      function getDoc (id) {
        return $http({
          url: [url_root, id].join('/'),
          method: 'GET'
        });
      }

      function getItems (opts) {
        opts = opts || {};
        opts.descending = true;

        return $http({
          url: [url_root, ddoc, '_view/items'].join('/'),
          method: 'GET',
          params: opts
        });
      }

      function getVotes (opts) {
        opts = opts || {};
        opts.group = true;

        return $http({
          url: [url_root, ddoc, '_view/votes'].join('/'),
          method: 'GET',
          params: opts
        });
      }

      function getHot (done) {
        // based on reddit's post ranking
        // culled from http://amix.dk/blog/post/19588
        function getHotness (created_at, score) {
          var age = created_at - 1134028003000,
              order = Math.log(Math.max(Math.abs(score), 1)) / Math.log(10),
              sign;

          if (score > 0) {
            sign = 1;
          } else if (score < 0) {
            sign = -1;
          } else {
            sign = 0;
          }

          var hotness = Math.round(order + ((sign * age) / 45000000), -7);
          return hotness;
        }

        var itemsPromise = getItems(),
            votesPromise = getVotes();

        votesPromise.success(function (res) {
          var votes = res.rows,
              now = new Date().getTime(),
              votes_json = {};

          votes.forEach(function (vote) {
            votes_json[vote.key] = vote.value;
          });

          itemsPromise.success(function (res) {
            var results = res.rows.map(function (row) {
              row.score = getHotness(row.key, votes_json[row.id]);
              return row;
            });

            done(results);
          });
        });
      }

      function getBest (done) {
        var votesPromise = getVotes();

        votesPromise.success(function (res) {
          var votes = res.rows.sort(function (a, b) {
                return b.value - a.value;
              });

          getItems().success(function (res) {
            var items_json = {};

            res.rows.forEach(function (row) {
              items_json[row.id] = row;
            });

            var results = votes.map(function (vote) {
              var doc = items_json[vote.key];
              if (doc) {
                doc.score = vote.value;
                return doc;
              }
            }).filter(function (doc) {
              return doc;
            });

            done(results);
          });
        });
      }

      function getConfidence (done) {
        // based on reddit's comment ranking
        // culled from http://amix.dk/blog/post/19588
        function _confidence (votes) {
          var n = votes.length,
              ups = votes.filter(function (vote) {
                return (vote.value > 0);
              });

          var z = 1.0;
          var phat = ups.length / n;
          return Math.sqrt(phat+z*z/(2*n)-z*((phat*(1-phat)+z*z/(4*n))/n))/(1+z*z/n);
        }

        var itemsPromise = getItems();

        $http({
          url: [url_root, ddoc, '_view/votes'].join('/'),
          method: 'GET',
          params: {
            reduce: false
          }
        }).success(function (res) {
          var votes = {};
          res.rows.forEach(function (row) {
            if (!(row.key in votes)) {
              votes[row.key] = [];
            }
            votes[row.key].push(row);
          });

          var results = [];
          Object.keys(votes).forEach(function (key) {
            votes[key] = _confidence(votes[key]);
          });

          itemsPromise.success(function (res) {
            var items = res.rows.map(function (item) {
              item.score = votes[item.id];
              return item;
            });

            done(items);
          });
        });
      }

      return {
        items: getItems,
        votes: getVotes,
        hot: getHot,
        best: getBest,
        confidence: getConfidence,
        get: getDoc
      };
    }
  ]);
};