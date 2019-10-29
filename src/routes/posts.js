import { Router } from 'express';
import Post from '../models/post';

const router = Router();

router.get('/', async (req, res, next) => {
  const posts = await Post.find();
  res.json(posts);
});

router.get('/:id', async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  res.json(post);
});

router.post('/', async (req, res, next) => {
  const username = req.body.username;
  const title = req.body.title;
  const body = req.body.body;
  const newPost = new Post({ username, title, body });
  await newPost.save();
  res.json('Post added!')
});

router.put('/:id', async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  post.title = req.body.title;
  post.body = req.body.body;
  await post.save();
  res.json('Post updated!')
});

router.delete('/:id', async (req, res, next) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json('Post deleted!')
});

export default router;
