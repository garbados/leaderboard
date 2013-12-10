var nano = require('nano'),
    async = require('async'),
    names = require('./names'),
    // TODO configure db_url for your database's URL
    // if you want to test it with sample data
    db_url = 'http://localhost:5984/leaderboard';
    db = nano(db_url);

function makeItem () {
  // random title
  var firstname_choices = names.firstname,
      lastname_choices = names.lastname;

  var firstname = firstname_choices[Math.floor(Math.random() * firstname_choices.length)],
      lastname = lastname_choices[Math.floor(Math.random() * lastname_choices.length)],
      title = [firstname, lastname].join(' ');

  // random but recent starting date
  var now = new Date().getTime(),
      adjust = Math.random() * 1000000000,
      created_at = now - adjust;

  return {
    type: 'item',
    title: title,
    created_at: created_at
  };
}

function makeItems (n, done) {
  var items = [];
  for (var i = 0; i < n; i++) {
    items.push(makeItem());
  }

  db.bulk({
    docs: items
  }, done);
}

function makeVote (ids) {
  // associates votes with items randomly
  // votes have a value between [-1, 3]
  var id = ids[Math.floor(Math.random() * ids.length)],
      score = Math.floor(Math.random() * 4) - 1;

  return {
    type: 'vote',
    item_id: id,
    score: score
  };
}

function makeVotes (n, items, done) {
  var ids = items.map(function (item) {
        return item.id;
      }),
      vote = makeVote.bind(null, ids),
      votes = [];

  // generates items.length * n votes
  for (var i = 0; i < (n * items.length); i++) {
    votes.push(vote());
  }

  db.bulk({
    docs: votes
  }, done);
}

function populate (done) {
  async.waterfall([
    makeItems.bind(null, 100),
    makeVotes.bind(null, 100)
  ], done);
}

module.exports = function (grunt) {
  grunt.task.registerTask('populate', 'Populate your DB with sample data', function () {
    var done = this.async();
    populate(done);
  });
}