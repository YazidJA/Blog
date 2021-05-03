const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const date = require(__dirname + "/date.js");
global.year = date.year;

const homeContent =
  "This is the home page content. This is the home page content. This is the home page content. This is the home page content. This is the home page content. This is the home page content. This is the home page content. This is the home page content. This is the home page content.";
const aboutContent =
  "This is the about page content. This is the about page content. This is the about page content. This is the about page content. This is the about page content. This is the about page content. This is the about page content. This is the about page content. This is the about page content.";
const contactContent =
  "This is the contact page content. This is the contact page content. This is the contact page content. This is the contact page content. This is the contact page content. This is the contact page content. This is the contact page content. This is the contact page content. This is the contact page content.";

const posts = [
  {
    title: "Long Post",
    body:
      "This is a very long post. This is a very long post. This is a very long post. This is a very long post. This is a very long post. This is a very long post. This is a very long post. This is a very long post. This is a very long post. This is a very long post. This is a very long post.",
  },
  {
    title: "Short Post",
    body: "This is a very short post.",
  },
];

app.get("/", function (req, res) {
  const truncatePost = (str, title) => {
    if (str.length > 100) {
      return (
        str.slice(0, 100) +
        `<a href="/posts/${_.lowerCase(title)}"> ...read more</a>`
      );
    } else return str;
  };

  const map = posts
    .map(
      (post) =>
        `<h2><a href=\"/posts/${_.lowerCase(post.title)}\">${
          post.title
        }</a></h2><p>${truncatePost(post.body, post.title)}
        </p>`
    )
    .join("");

  res.render(__dirname + "/views/home.ejs", {
    homeContent,
    map,
  });
});

app.get("/about", function (req, res) {
  res.render(__dirname + "/views/about.ejs", {
    aboutContent,
  });
});

app.get("/contact", function (req, res) {
  res.render(__dirname + "/views/contact.ejs", {
    contactContent,
  });
});

app.get("/compose", function (req, res) {
  res.render(__dirname + "/views/compose.ejs", {});
});

app.post("/compose", function (req, res) {
  const post = {
    title: req.body.title,
    body: req.body.body,
  };
  posts.push(post);
  res.redirect("/");
});

app.get("/posts/:title", function (req, res) {
  const query = req.params.title;
  let post = {};
  for (let i = 0; i < posts.length; i++) {
    if (_.lowerCase(posts[i].title) === _.lowerCase(query)) {
      post = posts[i];
    }
  }

  res.render(__dirname + "/views/post.ejs", {
    post,
  });
});

app.listen(3000, function () {
  console.log("Server started on http://localhost:3000");
});
