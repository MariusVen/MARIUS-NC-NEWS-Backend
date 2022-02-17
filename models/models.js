const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleById = (articleId) => {
  return db
    .query("SELECT * FROM articles WHERE article_id=$1", [articleId])
    .then((result) => {
      const articleArray = result.rows;
      if (articleArray.length === 0) {
        return Promise.reject({ status: 404, msg: "No article found" });
      }
      return articleArray[0];
    });
};

exports.updateArticleByID = (voteToAdd, article_id) => {
  const newVote = voteToAdd.inc_votes;
  if (newVote === undefined) {
    return Promise.reject({ status: 400, msg: "missing required fields" });
  } else if (typeof newVote != "number") {
    return Promise.reject({
      status: 400,
      msg: "input property is incorrect type",
    });
  }
  return db
    .query(
      "UPDATE articles SET votes = votes+ $1 WHERE article_id=$2 RETURNING *;",
      [newVote, article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};
