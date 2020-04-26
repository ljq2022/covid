const router = require('express').Router();
let Post = require('../models/post.model');
const csv = require('csvtojson')

router.route('/').get((req, res) => {
  Post.find()
    .then(posts => res.json(posts))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const username = req.body.username;
  const description = req.body.description;
  const date = Date.parse(req.body.date);
  var file = req.body.file;
  const complete = req.body.complete
  const positive = null;
  const data = req.body.data;
  var height = 0;
  var width = 0;
  if(data == 'Image') {
    height = req.body.height;
    width = req.body.width;
  }

  const filePromise = data  === "PCR" ? csv().fromFile(__dirname + "/" + file) : Promise.resolve(file)

  filePromise.then(function(finalFile){
    file = data === "PCR" ? JSON.stringify(finalFile) : finalFile

    const newPost = new Post({
      username,
      description,
      date,
      file,
      complete,
      positive,
      data,
      height,
      width
    });
    newPost.save()
    .then(() => res.json(newPost))
    .catch(err => res.status(400).json('Error: ' + err));
  })
});
router.route('/tasksAlreadyCompleted').get((req, res) => {
  Post.find({ complete: true })
    .then(posts => res.json(posts))
    .catch(err => res.status(400).json('Error: ' + err));
});
router.route('/tasksNotCompleted').get((req, res) => {
  Post.find({ complete: false })
    .then(posts => res.json(posts))
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
      post.file = req.body.file;
      post.complete = req.body.complete;
      post.positive = req.body.positive;
      post.boxes = req.body.boxes;
      post.save()
        .then(() => res.json(post))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
