const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");

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

/* Connect to DB */
mongoose.connect(
  "mongodb+srv://dbUser:eCNQiUVJWcsnwBPj@cluster0.c3qxo.mongodb.net/blogDb",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

/* Create Collection Schema */
const postSchema = new mongoose.Schema({
  title: String,
  body: String,
});
const Post = mongoose.model("Post", postSchema);

// Output
app.get("/", function (req, res) {
  const truncatePost = (str, id) => {
    if (str.length > 100) {
      return str.slice(0, 100) + `<a href="/posts/${id}"> ...read more</a>`;
    } else return str;
  };

  Post.find(function (err, posts) {
    if (err) {
      console.log(err);
    } else {
      /* Show Output */
      const map = posts
        .map(
          (post) =>
            `<h2><a href=\"/posts/${post._id}\">${
              post.title
            }</a></h2><p>${truncatePost(post.body, post._id)}
    </p>`
        )
        .join("");

      res.render(__dirname + "/views/home.ejs", {
        homeContent,
        map,
      });
    }
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
  const post = new Post({
    title: req.body.title,
    body: req.body.body,
  });
  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:id", function (req, res) {
  const query = req.params.id;

  Post.findOne({ _id: query }, function (err, post) {
    res.render(__dirname + "/views/post.ejs", {
      post,
    });
  });
});

app.listen(3000, function () {
  console.log("Server started on http://localhost:3000");
});
