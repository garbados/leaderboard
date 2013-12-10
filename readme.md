# Leaderboard

A generic leaderboard. Use it to power your Hackernews clone, your personal Subreddit, your favorite game, etc. Only your imagination is the limit :O

## Installation

    git clone git@github.com:garbados/leaderboard.git
    cd leaderboard
    npm install
    ./todo.sh # set all the config values marked TODO
    grunt deploy

## Usage

Leaderboard uses views to format the data in your database, so regardless of the shape of your data, you can write views to emit the proper data. tl;dr **anything can be a leaderboard.**

To find out what to configure to make it work for your data, run `./todo.sh` and edit the files it points out. Then, `grunt deploy`, and you're good to go!

## Item Sorting

Leaderboard's frontend code handles four kinds of sorting of content:

* "hot", based on the same popularity algorithm as Reddit. Useful for HackerNews-like leaderboards.
* "confidence", based on the algorithm Reddit uses to sort comments. Useful for game leaderboards by intelligently favoring well-performing items, regardless of how old those items are.
* "best", which sorts content by the sum of all votes for or against them.
* "new", which sorts content by age.

Big props to [Amir Salihefendic](http://amix.dk/) and their [How Reddit ranking algorithms work](http://amix.dk/blog/post/19588) article, which I used in generating the "hot" and "confidence" algorithms.

## Types

Leaderboard uses two views to map the contents of the database into Items and Votes.

Items are things that folks vote on. They can be posts, characters in a game, locations, anything. They're *things*. Whatever they are, the `items` view will need to transform them to emit rows like this:

    {
      key: created_at,
      value: {
        title: String,
        text: String
      }
    }

`created_at` is a timestamp, specifically the result of `new Date(...).getTime()`, and represents when the object was created. This can be used for Reddit-style ranking, where older content drifts down, or can be safely ignored for "best of all time" rankings.

Votes represent interactions with Items, such as upvotes, downvotes, views, visits, victories, defeats, scores, etc. The `votes` view's map step will need to emit rows like this:

    {
      key: item_id,
      value: Number
    }

`item_id` refers to the Item being voted on. The Number in `value` represents the weight of the vote, which gets summed across all votes for the same object.