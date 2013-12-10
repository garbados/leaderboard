# Leaderboard

A generic leaderboard. Use it to power your Hackernews clone, your personal Subreddit, your favorite game, etc. Only your imagination is the limit :O

## Installation

    git clone [this]
    cd leaderboard
    npm install
    ./todo.sh # set all the config values marked TODO
    grunt deploy

## Configuration

TODO

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