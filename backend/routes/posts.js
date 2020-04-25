const router = require('express').Router();
let Post = require('../models/post.model');

router.route('/').get((req, res) => {
  Post.find()
    .then(posts => res.json(posts))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const username = req.body.username;
  const description = req.body.description;
  const date = Date.parse(req.body.date);
  const file = req.body.file;
  const complete = req.body.complete
  const positive = null;
  const data = req.body.data;
  console.log(data);
  const newPost = new Post({
    username,
    description,
    date,
    file,
    complete,
    positive,
    data
  });
  newPost.save()
  .then(() => res.json(newPost))
  .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Post.findByIdAndDelete(req.params.id)
    .then(() => res.json('Post deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      post.username = req.body.username;
      post.description = req.body.description;
      post.date = Date.parse(req.body.date);
      post.file = req.body.file
      post.complete = req.body.complete
      post.positive = req.body.positive
      post.save()
        .then(() => res.json(post))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
